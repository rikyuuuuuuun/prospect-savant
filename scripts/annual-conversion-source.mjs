import { fiscalYearFor } from './private-trial-aggregate.mjs';

export const ANNUAL_CONVERSION_RANGE = "'98_会員マスター連携'!A23:H28";
export const ANNUAL_CONVERSION_DEFINITION = 'trial-attendance-fiscal-ytd-v1';
const IDS = ['A', 'B', 'C', 'D'];
const FIELDS = ['trials', 'admissions', 'previousTrials', 'previousAdmissions'];
const HEADER = ['チーム', '年度', '年度実体験', '体験→入会', '前年同期間実体験', '前年同期間体験→入会', '集計基準日', '集計定義'];
const check = (ok, code) => { if (!ok) throw new Error(`ANNUAL_CONVERSION_${code}`); };
const exact = (value, keys) => value && Object.keys(value).sort().join() === [...keys].sort().join();
const round = value => Math.round(value * 10) / 10;
const rate = (admissions, trials) => trials > 0 ? admissions / trials * 100 : null;

function validateCounts(value, label) {
  check(exact(value, FIELDS), `FIELDS_INVALID_${label}`);
  for (const key of FIELDS) check(Number.isSafeInteger(value[key]) && value[key] >= 0, `COUNT_INVALID_${label}_${key}`);
  check(value.admissions <= value.trials && value.previousAdmissions <= value.previousTrials, `COUNTS_INVALID_${label}`);
}

export function readAnnualConversion(rows, asOf) {
  check(Array.isArray(rows) && rows.length === 6, 'READBACK_MISSING');
  check(JSON.stringify(rows[0]) === JSON.stringify(HEADER), 'HEADER_INVALID');
  const fiscalYear = fiscalYearFor(asOf);
  const teams = {};
  for (let i = 0; i < 5; i++) {
    const row = rows[i + 1], id = i < 4 ? IDS[i] : '合計';
    check(row?.length === 8 && row[0] === id, 'TEAM_ORDER_INVALID');
    check(String(row[1]) === fiscalYear && row[6] === asOf, `DATE_MISMATCH_${id}`);
    check(row[7] === ANNUAL_CONVERSION_DEFINITION, 'DEFINITION_INVALID');
    const counts = Object.fromEntries(FIELDS.map((key, j) => [key, row[j + 2]]));
    validateCounts(counts, id);
    if (i < 4) teams[id] = counts;
    else for (const key of FIELDS) check(counts[key] === IDS.reduce((n, team) => n + teams[team][key], 0), `TOTAL_MISMATCH_${key}`);
  }
  return { definition: ANNUAL_CONVERSION_DEFINITION, asOf, fiscalYear, teams };
}

// A fresh member timestamp does not make a saved monthly conversion count fresh.
// Reconcile the dated, anonymous trial cohort against both downstream sources.
export function assertAnnualConversionSource(snapshot, asOf) {
  const ranges = snapshot.ranges || {};
  const conversion = readAnnualConversion(ranges[ANNUAL_CONVERSION_RANGE], asOf);
  const annualRows = ranges["'06_入会力（年度）'!A1:H12"]?.slice(4, 8);
  const memberRows = ranges["'98_会員マスター連携'!A4:AE9"]?.slice(1, 5);
  for (const id of IDS) {
    const annual = annualRows?.filter(row => row[0] === id) || [];
    const member = memberRows?.filter(row => row[0] === id) || [];
    check(annual.length === 1 && member.length === 1, `TEAM_MISSING_${id}`);
    const value = conversion.teams[id];
    check(annual[0][1] === value.trials && annual[0][2] === value.admissions, `STALE_DASHBOARD_${id}`);
    check(member[0][6] === value.trials && member[0][7] === value.admissions, `MEMBER_MISMATCH_${id}`);
    const current = rate(value.admissions, value.trials);
    const previous = rate(value.previousAdmissions, value.previousTrials);
    check(current !== null && previous !== null, `RATE_UNAVAILABLE_${id}`);
    for (const [column, expected] of [[3, current], [4, previous], [5, current - previous]]) {
      check(typeof annual[0][column] === 'number' && round(annual[0][column] * 100) === round(expected), `RATE_MISMATCH_${id}_${column}`);
    }
  }
  return conversion;
}

export function validateAnnualConversion(data, annual) {
  const conversion = data.admissionConversion;
  check(exact(conversion, ['definition', 'asOf', 'fiscalYear', 'teams']), 'FIELDS_INVALID');
  check(conversion.definition === ANNUAL_CONVERSION_DEFINITION, 'DEFINITION_INVALID');
  check(conversion.asOf === data.asOf && conversion.fiscalYear === fiscalYearFor(data.asOf), 'DATE_MISMATCH');
  check(exact(conversion.teams, IDS), 'TEAMS_INVALID');
  let admissions = 0, trials = 0, previousAdmissions = 0, previousTrials = 0;
  for (const id of IDS) {
    const value = conversion.teams[id];
    validateCounts(value, id);
    const current = rate(value.admissions, value.trials), previous = rate(value.previousAdmissions, value.previousTrials);
    check(current !== null && previous !== null, `RATE_UNAVAILABLE_${id}`);
    const team = data.teams.find(item => item.id === id);
    check(team?.benchmark?.admissionRate === round(current), `PUBLIC_RATE_MISMATCH_${id}`);
    check(team.benchmark.admissionPreviousRate === round(previous) && team.benchmark.admissionYoYDelta === round(current - previous), `PUBLIC_PREVIOUS_MISMATCH_${id}`);
    if (annual) {
      check(annual.status === 'ok' && annual.fiscalYear === conversion.fiscalYear, 'PUBLIC_TRIAL_PERIOD_MISMATCH');
      check(annual.teams?.[id]?.trials === value.trials && annual.teams?.[id]?.admissions === value.admissions, `PUBLIC_TRIAL_COUNT_MISMATCH_${id}`);
    }
    admissions += value.admissions;
    trials += value.trials;
    previousAdmissions += value.previousAdmissions;
    previousTrials += value.previousTrials;
  }
  check(data.headline.admissionRate === round(admissions / trials * 100), 'PUBLIC_HEADLINE_MISMATCH');
  check(data.headline.admissionPreviousRate === round(previousAdmissions / previousTrials * 100)
    && data.headline.admissionYoYDelta === round(admissions / trials * 100 - previousAdmissions / previousTrials * 100), 'PUBLIC_PREVIOUS_HEADLINE_MISMATCH');
  return conversion;
}
