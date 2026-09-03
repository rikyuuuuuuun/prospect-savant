import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { publishOperationalMemberSnapshot } from '../scripts/publish-operational-member-snapshot.mjs';

const PUBLIC_FILES = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js'];
const TEAM_IDS = ['A', 'B', 'C', 'D'];

function publicTeams(counts, monthlyDelta = null) {
  return TEAM_IDS.map((id, index) => ({ id, rank: index + 1, members: counts[id], monthlyDelta, overall: 50, metrics: {} }));
}

function publicSnapshot({ asOf = '2026-08-19', definition = 'legacy-record-count-v0', counts = { A: 1, B: 1, C: 1, D: 1 }, comparison }) {
  return {
    snapshotId: 'old', scoreVersion: 'v6-event-eligibility-70-30', asOf, asOfLabel: 'old',
    memberDefinition: { id: definition, label: definition },
    headline: { members: Object.values(counts).reduce((sum, value) => sum + value, 0), monthlyDelta: null },
    comparison: comparison || {
      scoreVersion: 'v6-event-eligibility-70-30', previousAsOf: '2026-08-18', previousAsOfLabel: 'previous',
      memberDefinition: { id: definition, label: definition },
      headline: { members: Object.values(counts).reduce((sum, value) => sum + value, 0), monthlyDelta: null },
      teams: publicTeams(counts),
    },
    teams: publicTeams(counts),
  };
}

async function fixture(data = publicSnapshot({})) {
  const root = await mkdtemp(join(tmpdir(), 'prospect-operational-snapshot-'));
  await writeFile(join(root, 'data.js'), `window.PROSPECT_SAVANT_DATA = Object.freeze(${JSON.stringify(data, null, 2)});\n`, 'utf8');
  await writeFile(join(root, 'event-data.js'), 'window.PROSPECT_EVENT_HISTORY = Object.freeze({"snapshotId":"old"});\n', 'utf8');
  await writeFile(join(root, 'retention-data.js'), 'window.PROSPECT_RETENTION_CURVE = Object.freeze({snapshotId:"old"});\n', 'utf8');
  await writeFile(join(root, 'school-age-data.js'), 'window.PROSPECT_SCHOOL_AGE_RETENTION = Object.freeze({snapshotId:"old"});\n', 'utf8');
  await writeFile(join(root, 'snapshot-manifest.json'), JSON.stringify({ files: {} }), 'utf8');
  return root;
}

function inputForCounts(asOf, counts, extra = {}) {
  return {
    snapshot: { id: `${asOf}-v1-001-operational-members`, asOf },
    records: TEAM_IDS.flatMap((team) => Array.from({ length: counts[team] }, (_, index) => ({ personKey: `${team}-${index}`, team, status: '在籍' }))),
    teamOverrides: [], exceptions: [], approvalReceipt: { teamOverrides: [], exceptions: [] }, ...extra,
  };
}

function parseFrozenJson(source) {
  const marker = 'Object.freeze(';
  return JSON.parse(source.slice(source.indexOf(marker) + marker.length, source.lastIndexOf(');')));
}

test('definition change keeps member delta unavailable', async () => {
  const root = await fixture();
  try {
    const input = inputForCounts('2026-08-20', { A: 1, B: 2, C: 1, D: 1 });
    const result = await publishOperationalMemberSnapshot({ rootDir: root, input });
    assert.deepEqual(result.counts, { A: 1, B: 2, C: 1, D: 1 });
    assert.equal(result.total, 5);
    const data = parseFrozenJson(await readFile(join(root, 'data.js'), 'utf8'));
    assert.equal(data.memberDefinition.id, 'operational-person-v1');
    assert.equal(data.headline.monthlyDelta, null);
    assert(data.teams.every((team) => team.monthlyDelta === null));
    assert.equal(data.comparison.memberDefinition.id, 'legacy-record-count-v0');
    for (const file of PUBLIC_FILES) assert.match(await readFile(join(root, file), 'utf8'), /2026-08-20-v1-001-operational-members/);
    const manifest = JSON.parse(await readFile(join(root, 'snapshot-manifest.json'), 'utf8'));
    assert.equal(manifest.operationalMemberDefinition, 'operational-person-v1');
    assert.match(manifest.sourceCommit, /^private-roster-sha256:[0-9a-f]{64}$/);
    assert.equal(manifest.sourceKind, 'private-canonical-operational-roster');
    assert.deepEqual(Object.keys(manifest.files), PUBLIC_FILES);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('same-definition next snapshot rolls current into publication comparison and fails closed without a month-end baseline', async () => {
  const previous = { A: 333, B: 309, C: 224, D: 192 };
  const root = await fixture(publicSnapshot({
    asOf: '2026-08-20', definition: 'operational-person-v1', counts: previous,
    comparison: {
      scoreVersion: 'v6-event-eligibility-70-30', previousAsOf: '2026-08-17', previousAsOfLabel: 'legacy',
      memberDefinition: { id: 'legacy-record-count-v0', label: 'legacy' },
      headline: { members: 1030, monthlyDelta: null }, teams: publicTeams({ A: 326, B: 308, C: 208, D: 188 }),
    },
  }));
  try {
    const next = { A: 335, B: 307, C: 226, D: 193 };
    await publishOperationalMemberSnapshot({ rootDir: root, input: inputForCounts('2026-08-21', next) });
    const data = parseFrozenJson(await readFile(join(root, 'data.js'), 'utf8'));
    assert.equal(data.headline.members, 1061);
    assert.equal(data.memberDeltaDefinition, 'previous-month-end-v1');
    assert.equal(data.memberMonthlyComparison, null);
    assert.equal(data.headline.monthlyDelta, null);
    assert(data.teams.every((team) => team.monthlyDelta === null));
    assert.equal(data.comparison.scoreVersion, 'v6-event-eligibility-70-30');
    assert.equal(data.comparison.previousAsOf, '2026-08-20');
    assert.equal(data.comparison.previousAsOfLabel, 'old');
    assert.equal(data.comparison.memberDefinition.id, 'operational-person-v1');
    assert.equal(data.comparison.headline.members, 1058);
    assert.deepEqual(Object.fromEntries(data.comparison.teams.map((team) => [team.id, team.members])), previous);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('same asOf rerun preserves comparison and never self-compares', async () => {
  const previous = { A: 333, B: 309, C: 224, D: 192 };
  const root = await fixture(publicSnapshot({ asOf: '2026-08-20', definition: 'operational-person-v1', counts: previous }));
  try {
    const input = inputForCounts('2026-08-21', { A: 335, B: 307, C: 226, D: 193 });
    await publishOperationalMemberSnapshot({ rootDir: root, input });
    const first = await readFile(join(root, 'data.js'), 'utf8');
    await publishOperationalMemberSnapshot({ rootDir: root, input });
    const second = await readFile(join(root, 'data.js'), 'utf8');
    const data = parseFrozenJson(second);
    assert.equal(second, first);
    assert.equal(data.comparison.previousAsOf, '2026-08-20');
    assert.notEqual(data.comparison.previousAsOf, data.asOf);
    assert.equal(data.memberMonthlyComparison, null);
    assert.equal(data.headline.monthlyDelta, null);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('previous month-end baseline stays fixed while publication comparison rolls daily', async () => {
  const augustEnd = { A: 333, B: 309, C: 224, D: 192 };
  const root = await fixture(publicSnapshot({ asOf: '2026-08-31', definition: 'operational-person-v1', counts: augustEnd }));
  try {
    await publishOperationalMemberSnapshot({
      rootDir: root,
      input: inputForCounts('2026-09-01', { A: 333, B: 308, C: 224, D: 191 }),
    });
    await publishOperationalMemberSnapshot({
      rootDir: root,
      input: inputForCounts('2026-09-02', { A: 332, B: 307, C: 223, D: 190 }),
    });
    const data = parseFrozenJson(await readFile(join(root, 'data.js'), 'utf8'));
    assert.equal(data.comparison.previousAsOf, '2026-09-01');
    assert.equal(data.memberMonthlyComparison.previousAsOf, '2026-08-31');
    assert.equal(data.headline.monthlyDelta, -6);
    assert.deepEqual(Object.fromEntries(data.teams.map((team) => [team.id, team.monthlyDelta])), { A: -1, B: -2, C: -1, D: -2 });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects an older asOf before changing public files', async () => {
  const root = await fixture(publicSnapshot({ asOf: '2026-08-20', definition: 'operational-person-v1' }));
  try {
    const before = await readFile(join(root, 'data.js'), 'utf8');
    await assert.rejects(
      publishOperationalMemberSnapshot({ rootDir: root, input: inputForCounts('2026-08-19', { A: 1, B: 1, C: 1, D: 1 }) }),
      /older than current/,
    );
    assert.equal(await readFile(join(root, 'data.js'), 'utf8'), before);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects missing or unknown team composition before changing public files', async () => {
  const invalid = publicSnapshot({});
  invalid.teams[3].id = 'X';
  const root = await fixture(invalid);
  try {
    await assert.rejects(
      publishOperationalMemberSnapshot({ rootDir: root, input: inputForCounts('2026-08-20', { A: 1, B: 1, C: 1, D: 1 }) }),
      /team composition is invalid/,
    );
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects invalid current dates and future comparisons before changing public files', async () => {
  const invalidDate = publicSnapshot({ asOf: '2026-02-30' });
  const futureComparison = publicSnapshot({ asOf: '2026-08-20' });
  futureComparison.comparison.previousAsOf = '2026-08-21';
  for (const [data, expected] of [[invalidDate, /current asOf is invalid/], [futureComparison, /comparison must be older than current/]]) {
    const root = await fixture(data);
    try {
      const before = await readFile(join(root, 'data.js'), 'utf8');
      await assert.rejects(
        publishOperationalMemberSnapshot({ rootDir: root, input: inputForCounts('2026-08-21', { A: 1, B: 1, C: 1, D: 1 }) }),
        expected,
      );
      assert.equal(await readFile(join(root, 'data.js'), 'utf8'), before);
    } finally { await rm(root, { recursive: true, force: true }); }
  }
});

test('rejects unsupported private input fields', async () => {
  const root = await fixture();
  try {
    const input = inputForCounts('2026-08-20', { A: 1, B: 1, C: 1, D: 1 });
    await assert.rejects(
      publishOperationalMemberSnapshot({ rootDir: root, input: { ...input, records: input.records.map((record, index) => index === 0 ? { ...record, email: 'must-not-pass@example.invalid' } : record) } }),
      /contains unsupported field email/,
    );
  } finally { await rm(root, { recursive: true, force: true }); }
});
