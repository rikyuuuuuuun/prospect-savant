import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { validateSnapshot } from '../scripts/validate-snapshot.mjs';

const DATA = `window.PROSPECT_SAVANT_DATA = Object.freeze({
  "snapshotId":"fixture-1",
  "scoreVersion":"v7-operational-member-denominator",
  "asOf":"2026-08-12",
  "headline":{"members":100},
  "teams":[
    {"id":"A","members":25,"metrics":{"event":70}},
    {"id":"B","members":25,"metrics":{"event":60}},
    {"id":"C","members":25,"metrics":{"event":50}},
    {"id":"D","members":25,"metrics":{"event":40}}
  ]
});`;

function event(id, values) {
  const eligibleValues = values.filter((value) => value !== null);
  const members = eligibleValues.length * 25;
  const participants = eligibleValues.reduce((a, b) => a + b, 0);
  return {
    id,
    name: id === 'EV-2024-SUMMER' ? '2024夏合同練習会' : '合同練習会',
    total: { participants, members, rate: Number((participants / members * 100).toFixed(1)) },
    teams: Object.fromEntries(['A', 'B', 'C', 'D'].map((key, index) => [key, {
      participants: values[index], members: values[index] === null ? null : 25,
      rate: values[index] === null ? null : values[index] * 4,
      ...(id === 'EV-2024-SUMMER' && key === 'D' ? { eligible: false } : {}),
    }]))
  };
}

const EVENTS = `window.PROSPECT_EVENT_HISTORY = Object.freeze(${JSON.stringify({
  snapshotId: 'fixture-1', scoringVersion: 'v7-operational-member-denominator',
  teams: { A: { score: 70 }, B: { score: 60 }, C: { score: 50 }, D: { score: 40 } },
  upcomingEvents: [{ id: 'UPCOMING-1', status: 'provisional', aggregate: false }],
  events: [
    event('EV-1', [1, 1, 1, 1]), event('EV-2', [1, 1, 1, 1]),
    event('EV-3', [1, 1, 1, 1]), event('EV-4', [1, 1, 1, 1]),
    event('EV-5', [1, 1, 1, 1]), event('EV-2024-SUMMER', [1, 1, 1, null])
  ]
})});`;

function blobSha(content) {
  const bytes = Buffer.from(content.replace(/\r\n/g, '\n'), 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'prospect-snapshot-'));
  const files = {
    'data.js': DATA,
    'event-data.js': EVENTS,
    'retention-data.js': 'window.PROSPECT_RETENTION_CURVE = Object.freeze({snapshotId:"fixture-1"});',
    'school-age-data.js': 'window.PROSPECT_SCHOOL_AGE_RETENTION = Object.freeze({snapshotId:"fixture-1"});',
  };
  for (const [name, content] of Object.entries(files)) await writeFile(join(root, name), content);
  const manifest = {
    schemaVersion: 1,
    snapshotId: 'fixture-1',
    asOf: '2026-08-12',
    scoreVersion: 'v7-operational-member-denominator',
    files: Object.fromEntries(Object.entries(files).map(([name, content]) => [name, blobSha(content)])),
    invariants: { expectedEligibleEventCount: 6, excludedEventNamePattern: '大会.*練習' }
  };
  await writeFile(join(root, 'snapshot-manifest.json'), JSON.stringify(manifest));
  return root;
}

test('accepts one internally consistent public snapshot', async () => {
  const root = await fixture();
  try {
    const result = await validateSnapshot(root);
    assert.equal(result.ok, true, result.errors.join('\n'));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects a partial file update when manifest is unchanged', async () => {
  const root = await fixture();
  try {
    await writeFile(join(root, 'retention-data.js'), 'window.PROSPECT_RETENTION_CURVE = Object.freeze({snapshotId:"fixture-1",changed:true});');
    const result = await validateSnapshot(root);
    assert.equal(result.ok, false);
    assert(result.errors.some((message) => message.includes('retention-data.js: manifest blob hash mismatch')));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('accepts CRLF worktree files when the manifest records Git-normalized blobs', async () => {
  const root = await fixture();
  try {
    const path = join(root, 'event-data.js');
    const content = (await readFile(path, 'utf8')).replace(/\n/g, '\r\n');
    await writeFile(path, content);
    const manifestPath = join(root, 'snapshot-manifest.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    manifest.files['event-data.js'] = blobSha(content);
    await writeFile(manifestPath, JSON.stringify(manifest));
    const result = await validateSnapshot(root);
    assert.equal(result.ok, true, result.errors.join('\n'));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects a headline member total that differs from the team sum', async () => {
  const root = await fixture();
  try {
    const path = join(root, 'data.js');
    const content = (await readFile(path, 'utf8')).replace('"members":100', '"members":101');
    await writeFile(path, content);
    const manifestPath = join(root, 'snapshot-manifest.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    manifest.files['data.js'] = blobSha(content);
    await writeFile(manifestPath, JSON.stringify(manifest));
    const result = await validateSnapshot(root);
    assert.equal(result.ok, false);
    assert(result.errors.some((message) => message.includes('headline members must equal the sum of team members')));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects a privacy-sensitive URL even when its hash is refreshed', async () => {
  const root = await fixture();
  try {
    const path = join(root, 'school-age-data.js');
    const content = `${await readFile(path, 'utf8')}\n// https://docs.google.com/spreadsheets/d/private`;
    await writeFile(path, content);
    const manifestPath = join(root, 'snapshot-manifest.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    manifest.files['school-age-data.js'] = blobSha(content);
    await writeFile(manifestPath, JSON.stringify(manifest));
    const result = await validateSnapshot(root);
    assert.equal(result.ok, false);
    assert(result.errors.some((message) => message.includes('prohibited Google Workspace URL')));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects an internal person identifier even when its hash is refreshed', async () => {
  const root = await fixture();
  try {
    const path = join(root, 'school-age-data.js');
    const content = `${await readFile(path, 'utf8')}\n// PERS-0000001`;
    await writeFile(path, content);
    const manifestPath = join(root, 'snapshot-manifest.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    manifest.files['school-age-data.js'] = blobSha(content);
    await writeFile(manifestPath, JSON.stringify(manifest));
    const result = await validateSnapshot(root);
    assert.equal(result.ok, false);
    assert(result.errors.some((message) => message.includes('internal person identifier')));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects an event rate or denominator that does not reconcile', async () => {
  const root = await fixture();
  try {
    const path = join(root, 'event-data.js');
    const content = (await readFile(path, 'utf8')).replace('"participants":1,"members":25', '"participants":26,"members":25');
    await writeFile(path, content);
    const manifestPath = join(root, 'snapshot-manifest.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    manifest.files['event-data.js'] = blobSha(content);
    await writeFile(manifestPath, JSON.stringify(manifest));
    const result = await validateSnapshot(root);
    assert.equal(result.ok, false);
    assert(result.errors.some((message) => message.includes('participants exceed denominator')));
  } finally { await rm(root, { recursive: true, force: true }); }
});

