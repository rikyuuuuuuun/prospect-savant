import { createCanonicalOperationalMemberOutput } from './operational-member-canonical.mjs';

const TEAM_IDS = ['A', 'B', 'C', 'D'];
export const OPERATIONAL_MEMBER_SHEET05_LAYOUT = Object.freeze({
  titleRow: 12,
  headerRow: 13,
  firstTeamRow: 14,
  totalRow: 18,
  columns: Object.freeze({ team: 'A', operationalMembers: 'B', effectiveSourcePersons: 'C', approvedExceptions: 'D', conflictExclusions: 'E' }),
  metadata: Object.freeze({ labelColumn: 'G', valueColumn: 'H', firstRow: 12, lastRow: 16 }),
});

export function proposed12CurrentMemberFormula(rowNumber) {
  if (!Number.isInteger(rowNumber) || rowNumber < 5 || rowNumber > 8) throw new Error('12 current-member row must be 5 through 8');
  const sourceRow = OPERATIONAL_MEMBER_SHEET05_LAYOUT.firstTeamRow + (rowNumber - 5);
  return `='05_会員数集計'!${OPERATIONAL_MEMBER_SHEET05_LAYOUT.columns.operationalMembers}${sourceRow}`;
}

/**
 * Shadow-only contract for the future Sheet wiring. It intentionally projects
 * one canonical aggregate instead of re-implementing person resolution in
 * either 05 or 12.
 */
export function projectOperationalMembersForSheets(input) {
  const canonical = createCanonicalOperationalMemberOutput(input);
  const rows = TEAM_IDS.map((team) => ({
    team,
    recordStatusCounts: canonical.sourceStatusCounts[team],
    legacyCurrentMembers: canonical.sourceStatusCounts[team]['在籍'] + canonical.sourceStatusCounts[team]['退会予定'],
    operationalMembers: canonical.finalCounts[team],
    effectiveSourcePersons: canonical.effectiveSourcePersonCounts[team],
    approvedExceptions: canonical.approvedExceptionCounts[team],
    conflictExclusions: canonical.conflictExclusionCounts[team],
  }));
  const common = {
    definitionId: canonical.definitionId,
    snapshotId: canonical.snapshot.id,
    asOf: canonical.snapshot.asOf,
    sourceDigest: canonical.sourceDigest,
    overlayDigest: canonical.overlayDigest,
    total: canonical.total,
  };
  return {
    canonical,
    aggregateArtifact: {
      ...common,
      rows: rows.map((row) => ({
        team: row.team,
        operationalMembers: row.operationalMembers,
        effectiveSourcePersons: row.effectiveSourcePersons,
        approvedExceptions: row.approvedExceptions,
        conflictExclusions: row.conflictExclusions,
      })),
    },
    sheet05: { ...common, rows },
    sheet05Layout: OPERATIONAL_MEMBER_SHEET05_LAYOUT,
    sheet12: {
      ...common,
      rows: rows.map((row, index) => ({
        team: row.team,
        currentMembers: row.operationalMembers,
        proposedCurrentMemberFormula: proposed12CurrentMemberFormula(index + 5),
        activeRecords: row.recordStatusCounts['在籍'],
        scheduledRetirementRecords: row.recordStatusCounts['退会予定'],
        leaveRecords: row.recordStatusCounts['休会'],
      })),
    },
  };
}
