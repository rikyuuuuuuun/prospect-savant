import test from 'node:test';
import assert from 'node:assert/strict';
import { admissionNoticeItems } from '../scripts/admission-notices.mjs';

const aggregate = ({ asOf = '2026-08-24', fiscalYear = '2026', counts = { A: 10, B: 20, C: 30, D: 40 }, futureAdmissionCount = 0, reEnrollmentPolicy = 'initial-only' } = {}) => ({
  asOf,
  definition: 'member-master-admission-date-annual-v1',
  fiscalYear,
  futureAdmissionCount,
  reEnrollmentPolicy,
  teams: Object.fromEntries(['A', 'B', 'C', 'D'].map((id) => [id, { cumulative: counts[id] }])),
});

test('detects only team-level admission-date cumulative increases', () => {
  const previous = aggregate({ asOf: '2026-08-23' });
  const current = aggregate({ counts: { A: 11, B: 22, C: 30, D: 40 } });
  assert.deepEqual(admissionNoticeItems(current, previous), [{ id: 'A', count: 1 }, { id: 'B', count: 2 }]);
});

test('supports multiple teams and suppresses an all-zero change', () => {
  const previous = aggregate({ asOf: '2026-08-23' });
  assert.deepEqual(admissionNoticeItems(aggregate({ counts: { A: 10, B: 22, C: 31, D: 40 } }), previous), [{ id: 'B', count: 2 }, { id: 'C', count: 1 }]);
  assert.deepEqual(admissionNoticeItems(aggregate(), previous), []);
});

test('keeps a fiscal-year cumulative comparison valid across a month boundary', () => {
  const previous = aggregate({ asOf: '2026-08-31', counts: { A: 10, B: 20, C: 30, D: 40 } });
  const current = aggregate({ asOf: '2026-09-01', counts: { A: 10, B: 20, C: 31, D: 40 } });
  assert.deepEqual(admissionNoticeItems(current, previous), [{ id: 'C', count: 1 }]);
});

test('fails closed for unconfirmed re-enrollment, future admissions, counter rollback, malformed teams, old snapshots, and self-comparison', () => {
  const previous = aggregate({ asOf: '2026-08-23' });
  assert.deepEqual(admissionNoticeItems(aggregate({ reEnrollmentPolicy: 'unconfirmed' }), previous), []);
  assert.deepEqual(admissionNoticeItems(aggregate({ futureAdmissionCount: 1 }), previous), []);
  assert.deepEqual(admissionNoticeItems(aggregate({ counts: { A: 9, B: 20, C: 30, D: 40 } }), previous), []);
  const malformed = aggregate(); delete malformed.teams.D;
  assert.deepEqual(admissionNoticeItems(malformed, previous), []);
  assert.deepEqual(admissionNoticeItems(aggregate({ asOf: '2026-08-22' }), previous), []);
  assert.deepEqual(admissionNoticeItems(aggregate({ asOf: '2026-08-23' }), previous), []);
});

test('does not depend on membership or monthlyDelta values', () => {
  const previous = aggregate({ asOf: '2026-08-23' });
  const current = aggregate();
  current.monthlyDelta = 99;
  current.members = { A: 999, B: 999, C: 999, D: 999 };
  assert.deepEqual(admissionNoticeItems(current, previous), []);
});
