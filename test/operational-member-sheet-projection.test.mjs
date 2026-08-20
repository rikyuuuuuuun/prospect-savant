import assert from 'node:assert/strict';
import test from 'node:test';
import { projectOperationalMembersForSheets, proposed12CurrentMemberFormula } from '../scripts/operational-member-sheet-projection.mjs';

test('projects the same canonical aggregate to 05 and 12 equivalents without target constants', () => {
  const input = {
    snapshot: { id: '2026-08-20-v1-001-operational-members', asOf: '2026-08-20' },
    records: [
      { personKey: 'a', team: 'A', status: '在籍' },
      { personKey: 'bc', team: 'B', status: '在籍' },
      { personKey: 'bc', team: 'C', status: '休会' },
      { personKey: 'c', team: 'C', status: '退会予定' },
      { personKey: 'd', team: 'D', status: '在籍' },
      { personKey: 'd', team: 'D', status: '休会' },
      { personKey: 'retired', team: 'A', status: '退会' },
    ],
    teamOverrides: [{ personKey: 'bc', effectiveTeam: 'B', approved: true, active: true }],
    exceptions: [{ personKey: 'b-extra', team: 'B', approved: true, active: true }],
    approvalReceipt: {
      teamOverrides: [{ sourceTeams: ['B', 'C'], effectiveTeam: 'B', count: 1 }],
      exceptions: [{ team: 'B', count: 1 }],
    },
  };
  const projection = projectOperationalMembersForSheets(input);
  assert.deepEqual(projection.canonical.finalCounts, { A: 1, B: 2, C: 1, D: 1 });
  assert.deepEqual(Object.fromEntries(projection.aggregateArtifact.rows.map((row) => [row.team, row.operationalMembers])), projection.canonical.finalCounts);
  assert.deepEqual(projection.aggregateArtifact.rows.find((row) => row.team === 'B'), {
    team: 'B', operationalMembers: 2, effectiveSourcePersons: 1, approvedExceptions: 1, conflictExclusions: 0,
  });
  assert.deepEqual(Object.fromEntries(projection.sheet05.rows.map((row) => [row.team, row.operationalMembers])), projection.canonical.finalCounts);
  assert.deepEqual(Object.fromEntries(projection.sheet12.rows.map((row) => [row.team, row.currentMembers])), projection.canonical.finalCounts);
  assert.equal(projection.sheet05.rows.find((row) => row.team === 'B').conflictExclusions, 0);
  assert.equal(projection.sheet05.rows.find((row) => row.team === 'C').conflictExclusions, 1);
  assert.equal(projection.sheet05.rows.find((row) => row.team === 'B').approvedExceptions, 1);
  assert.deepEqual(projection.sheet12.rows.map((row) => row.proposedCurrentMemberFormula), [
    "='05_会員数集計'!B14", "='05_会員数集計'!B15", "='05_会員数集計'!B16", "='05_会員数集計'!B17",
  ]);
  assert.equal(projection.sheet05Layout.firstTeamRow, 14);
  assert.equal(projection.sheet05Layout.totalRow, 18);
  assert.deepEqual(projection.sheet05Layout.metadata, { labelColumn: 'G', valueColumn: 'H', firstRow: 12, lastRow: 16 });
  assert.throws(() => proposed12CurrentMemberFormula(9), /5 through 8/);
  const reordered = {
    ...input,
    records: [...input.records].reverse(),
    teamOverrides: [...input.teamOverrides].reverse(),
    exceptions: [...input.exceptions].reverse(),
  };
  const reorderedProjection = projectOperationalMembersForSheets(reordered);
  assert.equal(reorderedProjection.canonical.sourceDigest, projection.canonical.sourceDigest);
  assert.equal(reorderedProjection.canonical.overlayDigest, projection.canonical.overlayDigest);
  assert.deepEqual(reorderedProjection.canonical.finalCounts, projection.canonical.finalCounts);
});
