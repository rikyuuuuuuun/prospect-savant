import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  MEMBER_DELTA_DEFINITION,
  applyMemberMonthlyDelta,
  assertMemberMonthlyState,
  buildMemberMonthlyComparison,
  previousMonthEnd,
  selectMemberMonthlyComparison,
  selectSourceConfirmedMemberMonthlyComparison,
} from '../scripts/member-monthly-change.mjs';

const TEAM_IDS = ['A', 'B', 'C', 'D'];

function monthlySource(asOf, counts) {
  const serial = (Date.parse(`${asOf}T00:00:00Z`) - Date.UTC(1899, 11, 30)) / 86_400_000;
  return [[], [], [], [], ...TEAM_IDS.map((id) => {
    const row = [];
    row[1] = id;
    row[3] = counts[id];
    row[21] = serial;
    return row;
  })];
}

function snapshot(asOf, counts, extra = {}) {
  return {
    asOf,
    asOfLabel: asOf,
    scoreVersion: 'v7-operational-member-denominator',
    memberDefinition: { id: 'operational-person-v1', label: 'operational' },
    headline: {
      members: Object.values(counts).reduce((sum, value) => sum + value, 0),
      monthlyDelta: null,
    },
    teams: TEAM_IDS.map((id, index) => ({
      id,
      rank: index + 1,
      members: counts[id],
      monthlyDelta: null,
      overall: 50,
      metrics: {},
    })),
    ...extra,
  };
}

test('previousMonthEnd resolves the exact prior calendar month end', () => {
  assert.equal(previousMonthEnd('2026-09-03'), '2026-08-31');
  assert.equal(previousMonthEnd('2026-03-01'), '2026-02-28');
  assert.equal(previousMonthEnd('2028-03-01'), '2028-02-29');
});

test('month boundary captures month-end members and preserves that baseline through the month', () => {
  const august = snapshot('2026-08-31', { A: 333, B: 309, C: 224, D: 192 });
  const baseline = selectMemberMonthlyComparison(august, '2026-09-01', 'operational-person-v1');
  assert.equal(baseline.previousAsOf, '2026-08-31');

  const septemberFirst = snapshot('2026-09-01', { A: 333, B: 309, C: 224, D: 192 }, {
    memberMonthlyComparison: baseline,
  });
  const preserved = selectMemberMonthlyComparison(septemberFirst, '2026-09-03', 'operational-person-v1');
  assert.deepEqual(preserved, baseline);
});

test('source confirmation accepts all four matching integer counts, including zero, in any team order', () => {
  const counts = { A: 0, B: 10, C: 20, D: 30 };
  const baseline = snapshot('2028-02-29', counts);
  const rows = monthlySource('2028-03-01', counts);
  rows.splice(4, 4, ...rows.slice(4).reverse());
  rows[4][21] = '2028/3/1';
  assert.deepEqual(
    selectSourceConfirmedMemberMonthlyComparison(baseline, '2028-03-01', 'operational-person-v1', rows),
    buildMemberMonthlyComparison(baseline),
  );
});

for (const [label, change] of [
  ['blank count', (rows) => { rows[4][3] = ''; }],
  ['whitespace count', (rows) => { rows[4][3] = ' '; }],
  ['null count', (rows) => { rows[4][3] = null; }],
  ['missing count', (rows) => { delete rows[4][3]; }],
  ['mismatching count', (rows) => { rows[4][3] += 1; }],
  ['negative count', (rows) => { rows[4][3] = -1; }],
  ['fractional count', (rows) => { rows[4][3] = 0.5; }],
  ['unsafe count', (rows) => { rows[4][3] = Number.MAX_SAFE_INTEGER + 1; }],
  ['boolean count', (rows) => { rows[4][3] = false; }],
  ['numeric string count', (rows) => { rows[4][3] = '0'; }],
  ['missing team', (rows) => { rows.pop(); }],
  ['duplicate team', (rows) => { rows[7][1] = 'A'; }],
  ['extra duplicate team', (rows) => { rows.push([...rows[4]]); }],
  ['stale asOf', (rows) => { rows[4][21] = '2028-02-29'; }],
  ['missing asOf', (rows) => { delete rows[4][21]; }],
]) {
  test(`source ${label} withholds both fresh and carried month-end comparisons and deltas`, () => {
    const counts = { A: 0, B: 10, C: 20, D: 30 };
    const baseline = snapshot('2028-02-29', counts);
    const carried = snapshot('2028-03-01', counts, {
      memberMonthlyComparison: buildMemberMonthlyComparison(baseline),
    });
    const rows = monthlySource('2028-03-02', counts);
    change(rows);
    for (const previous of [baseline, carried]) {
      const current = snapshot('2028-03-02', counts, {
        memberMonthlyComparison: selectSourceConfirmedMemberMonthlyComparison(previous, '2028-03-02', 'operational-person-v1', rows),
      });
      assert.equal(current.memberMonthlyComparison, null);
      assert.equal(applyMemberMonthlyDelta(current), false);
      assert.equal(current.headline.monthlyDelta, null);
      assert(current.teams.every((team) => team.monthlyDelta === null));
    }
  });
}

test('a missing monthly source cannot certify a month-end snapshot', () => {
  const baseline = snapshot('2028-02-29', { A: 0, B: 10, C: 20, D: 30 });
  for (const rows of [undefined, null, []]) {
    assert.equal(selectSourceConfirmedMemberMonthlyComparison(baseline, '2028-03-01', 'operational-person-v1', rows), null);
  }
});

test('pure member change is current members minus the previous month-end snapshot', () => {
  const august = snapshot('2026-08-31', { A: 333, B: 309, C: 224, D: 192 });
  const current = snapshot('2026-09-03', { A: 332, B: 307, C: 223, D: 190 }, {
    memberMonthlyComparison: buildMemberMonthlyComparison(august),
  });

  assert.equal(applyMemberMonthlyDelta(current), true);
  assert.equal(current.memberDeltaDefinition, MEMBER_DELTA_DEFINITION);
  assert.equal(current.headline.monthlyDelta, -6);
  assert.deepEqual(
    Object.fromEntries(current.teams.map((team) => [team.id, team.monthlyDelta])),
    { A: -1, B: -2, C: -1, D: -2 },
  );
  assert.doesNotThrow(() => assertMemberMonthlyState(current));
});

test('a same-month or mismatched baseline fails closed instead of publishing a false delta', () => {
  const current = snapshot('2026-09-03', { A: 332, B: 307, C: 223, D: 190 }, {
    memberMonthlyComparison: buildMemberMonthlyComparison(
      snapshot('2026-09-01', { A: 333, B: 309, C: 224, D: 192 }),
    ),
  });

  assert.equal(applyMemberMonthlyDelta(current), false);
  assert.equal(current.memberMonthlyComparison, null);
  assert.equal(current.headline.monthlyDelta, null);
  assert(current.teams.every((team) => team.monthlyDelta === null));
  assert.doesNotThrow(() => assertMemberMonthlyState(current));
});

test('validation rejects a delta that no longer reconciles to the month-end baseline', () => {
  const august = snapshot('2026-08-31', { A: 333, B: 309, C: 224, D: 192 });
  const current = snapshot('2026-09-03', { A: 332, B: 307, C: 223, D: 190 }, {
    memberMonthlyComparison: buildMemberMonthlyComparison(august),
  });
  applyMemberMonthlyDelta(current);
  current.headline.monthlyDelta = 31;
  assert.throws(() => assertMemberMonthlyState(current), /current minus previous-month-end/);
});

test('UI names the KPI as previous-month-end pure change', async () => {
  const source = await readFile(resolve(import.meta.dirname, '..', 'index.html'), 'utf8');
  assert.match(source, /前月末比 純増減/);
  assert.doesNotMatch(source, /前月差（参考）/);
});
