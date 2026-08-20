import assert from 'node:assert/strict';
import test from 'node:test';
import { buildOperationalEventDenominators, operationalMembersAt, scoreOperationalEvents } from '../scripts/operational-event-denominator.mjs';

const intervals = [
  { personKey: 'a', team: 'A', status: '在籍', startDate: '2024-01-01' },
  { personKey: 'bc', team: 'B', status: '在籍', startDate: '2024-01-01' },
  { personKey: 'bc', team: 'C', status: '休会', startDate: '2024-01-01' },
  { personKey: 'c', team: 'C', status: '退会予定', startDate: '2024-01-01', endDate: '2026-12-31' },
  { personKey: 'd', team: 'D', status: '在籍', startDate: '2025-04-01' },
];
const overrides = [{ personKey: 'bc', effectiveTeam: 'B', approved: true, active: true, startDate: '2024-01-01' }];
const exceptions = [{ personKey: 'free-b', team: 'B', approved: true, active: true, startDate: '2026-01-01' }];

test('reconstructs each event as-of roster, resolves B/C once, and time-bounds exceptions', () => {
  assert.deepEqual(operationalMembersAt({ asOf: '2025-08-03', intervals, teamOverrides: overrides, exceptions }).counts, { A: 1, B: 1, C: 1, D: 1 });
  assert.deepEqual(operationalMembersAt({ asOf: '2026-08-09', intervals, teamOverrides: overrides, exceptions }).counts, { A: 1, B: 2, C: 1, D: 1 });
});

test('excludes D before launch and rejects participants above a reconstructed denominator', () => {
  const result = buildOperationalEventDenominators({ events: [{ id: 'old', startDate: '2024-08-03', participants: { A: 1, B: 1, C: 1, D: 0 } }], intervals, teamOverrides: overrides, exceptions });
  assert.equal(result[0].teams.D.members, null);
  assert.throws(() => buildOperationalEventDenominators({ events: [{ id: 'bad', startDate: '2026-08-09', participants: { A: 2, B: 1, C: 1, D: 1 } }], intervals, teamOverrides: overrides, exceptions }), /participants must not exceed denominator/);
});

test('recalculates all-team relative event scores from the rebuilt rates', () => {
  const result = scoreOperationalEvents({ events: [{ teams: { A: { rate: 20 }, B: { rate: 10 }, C: { rate: 5 }, D: { rate: 4 } } }], repeatRates: { A: 20, B: 40, C: 30, D: 10 } });
  assert.deepEqual(result.teams.A, { averageRate: 20, participationScore: 100, repeatRate: 20, repeatScore: 50, score: 85 });
  assert.equal(result.teams.B.score, 65);
});
