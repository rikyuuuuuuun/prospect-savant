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
} from '../scripts/member-monthly-change.mjs';

const TEAM_IDS = ['A', 'B', 'C', 'D'];

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
