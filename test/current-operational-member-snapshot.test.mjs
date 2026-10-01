import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { applyMemberMonthlyDelta, assertMemberMonthlyState, buildMemberMonthlyComparison, previousMonthEnd } from '../scripts/member-monthly-change.mjs';

function parseFrozenJson(source) {
  const marker = 'Object.freeze(';
  const start = source.indexOf(marker);
  const end = source.lastIndexOf(');');
  return JSON.parse(source.slice(start + marker.length, end));
}

test('publishes a self-consistent v7 operational-event-denominator snapshot', async () => {
  const source = await readFile(resolve(process.cwd(), 'data.js'), 'utf8');
  const data = parseFrozenJson(source);
  const counts = Object.fromEntries(data.teams.map((team) => [team.id, team.members]));

  assert.equal(data.memberDefinition.id, 'operational-person-v1');
  assert.equal(data.scoreVersion, 'v7-operational-member-denominator');
  assert.deepEqual(Object.keys(counts).sort(), ['A', 'B', 'C', 'D']);
  assert.equal(data.headline.members, Object.values(counts).reduce((sum, members) => sum + members, 0));
  assert.equal(data.comparison.scoreVersion, 'v7-operational-member-denominator');
  assert.equal(data.comparison.memberDefinition.id, data.memberDefinition.id);
  assert.ok(data.comparison.previousAsOf <= data.asOf);
  assertMemberMonthlyState(data);
  if (data.memberMonthlyComparison != null) assert.ok(Number.isSafeInteger(data.headline.monthlyDelta));
  for (const team of data.teams) {
    const previous = data.comparison.teams.find((candidate) => candidate.id === team.id);
    assert.ok(previous, `missing previous team ${team.id}`);
    if (data.memberMonthlyComparison != null) assert.ok(Number.isSafeInteger(team.monthlyDelta));
  }
});

test('current-snapshot gate strictly accepts certified and unavailable monthly states', async () => {
  const data = parseFrozenJson(await readFile(resolve(import.meta.dirname, '..', 'data.js'), 'utf8'));
  const baseline = {
    asOf: previousMonthEnd(data.asOf), asOfLabel: 'Synthetic baseline',
    memberDefinition: data.memberDefinition, headline: { members: 60 },
    teams: ['A', 'B', 'C', 'D'].map((id, index) => ({ id, members: index * 10 })),
  };
  data.memberMonthlyComparison = buildMemberMonthlyComparison(baseline);
  applyMemberMonthlyDelta(data);
  const dir = await mkdtemp(join(tmpdir(), 'savant-current-monthly-contract-'));
  const childEnvironment = { ...process.env };
  delete childEnvironment.NODE_TEST_CONTEXT;
  const checkGate = async (candidate, valid) => {
    await writeFile(join(dir, 'data.js'), `window.PROSPECT_SAVANT_DATA = Object.freeze(${JSON.stringify(candidate)});\n`);
    // Exercise the actual current-snapshot gate, without recursively running this regression test.
    const result = spawnSync(process.execPath, ['--test', '--test-name-pattern=^publishes a self-consistent v7 operational-event-denominator snapshot$', import.meta.filename], {
      cwd: dir, encoding: 'utf8', env: childEnvironment,
    });
    assert.ifError(result.error);
    assert.equal(result.status, valid ? 0 : 1, result.stdout + result.stderr);
  };
  try {
    assert.equal(data.headline.monthlyDelta, data.headline.members - baseline.headline.members);
    for (const team of data.teams) {
      assert.equal(team.monthlyDelta, team.members - baseline.teams.find((previous) => previous.id === team.id).members);
    }
    await checkGate(data, true);
    for (const change of [
      (candidate) => { candidate.headline.monthlyDelta += 1; },
      (candidate) => { candidate.teams[0].monthlyDelta = null; },
      (candidate) => { candidate.teams[0].monthlyDelta += 0.5; },
    ]) {
      const invalid = structuredClone(data);
      change(invalid);
      await checkGate(invalid, false);
    }

    data.memberMonthlyComparison = null;
    applyMemberMonthlyDelta(data);
    assert.equal(data.memberMonthlyComparison, null);
    assert.equal(data.headline.monthlyDelta, null);
    assert(data.teams.every((team) => team.monthlyDelta === null));
    await checkGate(data, true);
    for (const change of [
      (candidate) => { candidate.headline.monthlyDelta = 0; },
      (candidate) => { candidate.teams[0].monthlyDelta = 0; },
      (candidate) => { delete candidate.headline.monthlyDelta; },
      (candidate) => { delete candidate.teams[0].monthlyDelta; },
    ]) {
      const invalid = structuredClone(data);
      change(invalid);
      await checkGate(invalid, false);
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});
