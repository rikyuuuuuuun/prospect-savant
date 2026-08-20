import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { publishTrialData, validatePublishedTrialData } from '../scripts/trial-publication.mjs';

const rates = { A: 86.9, B: 76.6, C: 63.8, D: 57.9 };
const annual = {
  A: { admissions: 93, trials: 107 },
  B: { admissions: 82, trials: 107 },
  C: { admissions: 51, trials: 80 },
  D: { admissions: 44, trials: 76 },
};

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'prospect-trial-publication-'));
  const teams = Object.entries(rates).map(([id, admissionRate]) => ({ id, benchmark: { admissionRate } }));
  await writeFile(join(root, 'data.js'), `window.PROSPECT_SAVANT_DATA = Object.freeze(${JSON.stringify({ teams })});\n`, 'utf8');
  return root;
}

function input(overrides = {}) {
  return {
    snapshot: { id: '2026-08-21-trial-001', asOf: '2026-08-21' },
    timezone: 'Asia/Tokyo',
    today: { date: '2026-08-21', status: 'ok', teams: { A: 1, B: 0, C: 0, D: 0 } },
    annual: { fiscalYear: '2026', status: 'ok', teams: annual },
    ...overrides,
  };
}

test('publishes only anonymous aggregate counts and validates current rates', async () => {
  const root = await fixture();
  try {
    await publishTrialData({ rootDir: root, input: input() });
    const source = await readFile(join(root, 'trial-data.js'), 'utf8');
    assert.match(source, /"total": 1/);
    assert.match(source, /"A": 1/);
    assert.doesNotMatch(source, /https?:\/\//i);
    const result = await validatePublishedTrialData(root);
    assert.equal(result.ok, true, result.errors.join('\n'));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('keeps an unavailable acquisition distinct from a valid zero', async () => {
  const root = await fixture();
  try {
    await publishTrialData({ rootDir: root, input: input({ today: { date: '2026-08-21', status: 'unavailable', teams: null } }) });
    const source = await readFile(join(root, 'trial-data.js'), 'utf8');
    assert.match(source, /"status": "unavailable"/);
    assert.match(source, /"total": null/);
    const result = await validatePublishedTrialData(root);
    assert.equal(result.ok, true, result.errors.join('\n'));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects a rate mismatch before writing public output', async () => {
  const root = await fixture();
  try {
    const invalidAnnual = { ...annual, A: { admissions: 92, trials: 107 } };
    await assert.rejects(publishTrialData({ rootDir: root, input: input({ annual: { fiscalYear: '2026', status: 'ok', teams: invalidAnnual } }) }), /admission rate does not match/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects public data contaminated with a URL even when its manifest is refreshed', async () => {
  const root = await fixture();
  try {
    await publishTrialData({ rootDir: root, input: input() });
    const path = join(root, 'trial-data.js');
    await writeFile(path, `${await readFile(path, 'utf8')}\n// https://example.invalid/private`, 'utf8');
    const result = await validatePublishedTrialData(root);
    assert.equal(result.ok, false);
    assert(result.errors.some((error) => error.includes('prohibited URL')));
  } finally { await rm(root, { recursive: true, force: true }); }
});
