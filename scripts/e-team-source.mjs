import { ANNUAL_CONVERSION_DEFINITION, conversionRate, readAnnualConversionTeam, validateConversionCounts } from './annual-conversion-source.mjs';
import { validateETeamDetails } from './e-team-metrics.mjs';

export const E_TEAM_RANGE = "'98_会員マスター連携'!A31:N32";
const TEAM_ID = 'E';
const count = value => Number.isSafeInteger(value) && value >= 0;

function check(ok, code) {
  if (!ok) throw new Error(`E_TEAM_${code}`);
}

export function readETeamSource(rows, asOf, aToDMembers) {
  if (!rows?.length) return undefined;
  const [team, total] = rows;
  check(rows.length === 2 && team?.length === 14 && total?.length === 5, 'READBACK_INVALID');
  check(team[0] === TEAM_ID && total[0] === '合計（A〜E）', 'LABEL_INVALID');
  check(team.slice(1, 5).every(count) && total.slice(1).every(count), 'MEMBER_COUNT_INVALID');
  check(team[1] === team[2] + team[3] && total[1] === aToDMembers + team[1], 'MEMBER_TOTAL_MISMATCH');
  const annual = readAnnualConversionTeam(team.slice(6), TEAM_ID, asOf);
  return { asOf, members: team[1], allMembers: total[1], definition: ANNUAL_CONVERSION_DEFINITION, annual };
}

export function validatePublishedETeam(data) {
  const team = data.eTeam;
  if (team === undefined) return;
  check(team && Object.keys(team).sort().join() === ['allMembers', 'annual', 'asOf', 'definition', 'members', ...(team.metrics ? ['metrics'] : []), ...(team.analysis ? ['analysis'] : [])].sort().join(), 'FIELDS_INVALID');
  check(team.asOf === data.asOf && team.definition === data.admissionConversion?.definition, 'DATE_OR_DEFINITION_MISMATCH');
  check(count(team.members) && count(team.allMembers) && team.allMembers === data.headline.members + team.members, 'MEMBER_TOTAL_MISMATCH');
  validateConversionCounts(team.annual, TEAM_ID);
  validateETeamDetails(data);
}

export function combinedConversion(data) {
  const counts = [...Object.values(data.admissionConversion.teams), data.eTeam.annual];
  const sum = field => counts.reduce((total, team) => total + team[field], 0);
  const current = conversionRate(sum('admissions'), sum('trials'));
  const previous = conversionRate(sum('previousAdmissions'), sum('previousTrials'));
  return { current, previous, delta: current - previous };
}
