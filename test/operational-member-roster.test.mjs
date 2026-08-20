import assert from 'node:assert/strict';
import test from 'node:test';
import { buildOperationalRoster } from '../scripts/operational-member-roster.mjs';

test('deduplicates eligible records, applies an approved team override, and adds only an approved exception', () => {
  const result = buildOperationalRoster({
    records: [
      { personKey: 'a-1', team: 'A', status: '在籍' },
      { personKey: 'a-1', team: 'A', status: '休会' },
      { personKey: 'b-1', team: 'B', status: '在籍' },
      { personKey: 'bc-1', team: 'B', status: '在籍' },
      { personKey: 'bc-1', team: 'C', status: '休会' },
      { personKey: 'c-1', team: 'C', status: '退会予定' },
      { personKey: 'd-1', team: 'D', status: '在籍' },
      { personKey: 'd-1', team: 'D', status: '休会' },
      { personKey: 'retired', team: 'A', status: '退会' },
      { personKey: 'deleted', team: 'A', status: '削除' },
    ],
    teamOverrides: [{ personKey: 'bc-1', effectiveTeam: 'B', approved: true, active: true }],
    exceptions: [{ personKey: 'b-exception', team: 'B', approved: true, active: true }],
  });

  assert.deepEqual(result.counts, { A: 1, B: 3, C: 1, D: 1 });
  assert.equal(result.total, 6);
  assert.equal(result.roster.filter((member) => member.personKey === 'd-1').length, 1);
  assert.equal(result.roster.find((member) => member.personKey === 'b-exception').source, 'approved-exception');
});

test('fails closed on an unapproved cross-team conflict', () => {
  assert.throws(() => buildOperationalRoster({
    records: [
      { personKey: 'conflict', team: 'B', status: '在籍' },
      { personKey: 'conflict', team: 'C', status: '休会' },
    ],
  }), /ambiguous effective team/);
});

test('fails closed on unknown states and unapproved exceptions', () => {
  assert.throws(() => buildOperationalRoster({
    records: [{ personKey: 'unknown', team: 'A', status: '保留' }],
  }), /unknown status/);
  assert.throws(() => buildOperationalRoster({
    records: [{ personKey: 'private', team: 'A', status: '在籍', name: 'must-not-pass' }],
  }), /contains unsupported field name/);
  assert.throws(() => buildOperationalRoster({
    records: [{ personKey: 101, team: 'A', status: '在籍' }],
  }), /personKey must be a string/);
  assert.throws(() => buildOperationalRoster({
    records: [{ personKey: 101, team: 'A', status: '退会' }],
  }), /personKey must be a string/);
  assert.throws(() => buildOperationalRoster({
    records: [{ personKey: 'retired', team: 'X', status: '退会' }],
  }), /invalid team/);
  assert.throws(() => buildOperationalRoster({
    records: [],
    exceptions: [{ personKey: 'exception', team: 'B', approved: false, active: true }],
  }), /must be approved and active/);
  assert.throws(() => buildOperationalRoster({
    records: [{ personKey: 'source', team: 'A', status: '在籍' }],
    teamOverrides: [{ personKey: 'missing', effectiveTeam: 'B', approved: true, active: true }],
  }), /has no eligible source person/);
  assert.throws(() => buildOperationalRoster({
    records: [{ personKey: 'single-team', team: 'A', status: '在籍' }],
    teamOverrides: [{ personKey: 'single-team', effectiveTeam: 'A', approved: true, active: true }],
  }), /does not resolve a source conflict/);
  assert.throws(() => buildOperationalRoster({
    records: [
      { personKey: 'conflict', team: 'B', status: '在籍' },
      { personKey: 'conflict', team: 'C', status: '休会' },
    ],
    teamOverrides: [{ personKey: 'conflict', effectiveTeam: 'D', approved: true, active: true }],
  }), /selects a team absent from source records/);
});
