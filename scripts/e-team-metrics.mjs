import { buildRetentionEvidenceFromSource, RETENTION_PERIODS } from './metric-retention-evidence.mjs';
import { conversionRate } from './annual-conversion-source.mjs';
import { serialToIsoDate } from './private-trial-aggregate.mjs';
import { validateAdmissionHistory } from './admission-history.mjs';
import { validateTrialConversionHistory } from './trial-conversion-history.mjs';
import { validateMemberComposition } from './member-composition.mjs';
import { applyWithdrawalBaseline, validateWithdrawalHistory } from './withdrawal-history.mjs';

export const E_METRIC_RANGE = "'98_会員マスター連携'!A35:AE96";
export const E_EVALUATION_START = '2026-11-09';
const check = (ok, code) => { if (!ok) throw new Error(`E_METRIC_${code}`); };
const count = value => Number.isSafeInteger(value) && value >= 0;
const empty = value => value == null || value === '';
const rate = value => empty(value) ? null : value * 100;
const TEAM_IDS = ['A', 'B', 'C', 'D', 'E'];
const exact = (value, keys) => check(value && Object.keys(value).sort().join() === [...keys].sort().join(), 'FIELDS_INVALID');

export function readETeamMetrics(rows, team) {
  if (!rows?.length) return undefined;
  const member = rows[0], growth = rows[3], referral = rows[5], event = rows[7];
  check([member, growth, referral, event].every(row => row?.[0] === 'E'), 'TEAM_MISSING');
  check(member[1] === team.members && count(member[8]), 'MEMBER_MISMATCH');
  const retentionRow = ['E', ...RETENTION_PERIODS.flatMap((_, index) => [member[15 + index * 2], member[14 + index * 2]])];
  check(RETENTION_PERIODS.every((_, index) => count(member[14 + index * 2])
    && (empty(member[15 + index * 2]) || Number.isFinite(member[15 + index * 2]) && member[15 + index * 2] >= 0 && member[15 + index * 2] <= 1)), 'RETENTION_INVALID');
  check(/^\d+件実移動確認／\d+件過去基準維持／\d+件課金停止確認／\d+件名簿退会日確認／\d+件退会日不明$/.test(member[30]), 'WITHDRAWAL_RECEIPT_INVALID');
  const unknown = Number(member[30].match(/(\d+)件退会日不明$/)[1]);
  check(!unknown || RETENTION_PERIODS.every((_, index) => empty(member[15 + index * 2])), 'UNKNOWN_RETENTION_PRESENT');
  const retention = buildRetentionEvidenceFromSource([['チーム', '3か月\n継続率'], retentionRow], 20, ['E']).E;
  for (const period of retention.periods) period.scored = period.sample >= 20 && Number.isFinite(period.rate);
  check([growth[1], growth[2], growth[3], growth[5], growth[6]].every(count), 'GROWTH_INVALID');
  check(referral[5] === 'referral-volume-rate-v2' && referral[6] === team.members
    && referral.slice(1, 4).every(count) && referral[1] + referral[2] === referral[3]
    && referral[10] === 0.7 && referral[11] === 0.3, 'REFERRAL_INVALID');
  check(team.members > 0 ? Number.isFinite(referral[7]) && Math.abs(referral[7] - referral[3] / team.members) < 1e-10 : empty(referral[7]), 'REFERRAL_RATE_INVALID');
  check([event[1], event[5], event[6]].every(count) && event[6] <= event[5], 'EVENT_COUNTS_INVALID');
  check((event[1] === 0 ? empty(event[2]) : Number.isFinite(event[2]) && event[2] >= 0 && event[2] <= 1)
    && (empty(event[7]) || Number.isFinite(event[7]) && event[7] >= 0 && event[7] <= 1), 'EVENT_RATE_INVALID');
  const events = rows.slice(10).filter(row => Number.isFinite(row[0]) && row[0] > 0).map(row => {
    const startDate = serialToIsoDate(row[0]), endDate = serialToIsoDate(row[1]);
    check(startDate && endDate && startDate <= endDate, 'EVENT_DATE_INVALID');
    if (startDate < E_EVALUATION_START) {
      check(row.slice(2, 5).every(empty), 'PRE_FOUNDATION_EVENT_PRESENT');
      return { startDate, endDate, participants: null, members: null, rate: null, eligible: false };
    }
    check(count(row[2]) && count(row[3]) && row[3] > 0 && row[2] <= row[3]
      && Number.isFinite(row[4]) && Math.abs(row[4] - row[2] / row[3]) < 1e-10, 'EVENT_DENOMINATOR_INVALID');
    return { startDate, endDate, participants: row[2], members: row[3], rate: rate(row[4]) };
  });
  check(new Set(events.map(item => item.startDate + '|' + item.endDate)).size === events.length, 'EVENT_DUPLICATE');
  const curve = rows.slice(10, 21).map(row => ({ months: row[6], rate: rate(row[7]), sample: row[8] }));
  check(JSON.stringify(curve.map(item => item.months)) === JSON.stringify([1, 3, 6, 9, 12, 18, 24, 36, 48, 60, 72]), 'CURVE_MONTHS_INVALID');
  check(curve.every(item => count(item.sample) && (item.rate === null || Number.isFinite(item.rate) && item.rate >= 0 && item.rate <= 100 && item.sample >= 20)), 'CURVE_INVALID');
  const school = rows[8];
  check(school?.[0] === 'E' && [1, 3, 5, 7].every(index => count(school[index]) && (empty(school[index + 1]) || Number.isFinite(school[index + 1]) && school[index + 1] >= 0 && school[index + 1] <= 1)), 'SCHOOL_AGE_INVALID');
  return {
    definition: 'common-team-metrics-v1', asOf: team.asOf, admissions: member[8],
    retention, unknownWithdrawals: unknown,
    growth: { top10: growth[1], top10to20: growth[2], top20to30: growth[3], top30Children: growth[5], weightedPoints: growth[6], status: String(growth[7]) },
    family: { definition: referral[5], trialPoints: referral[1], siblingPoints: referral[2], points: referral[3], members: team.members, rate: rate(referral[7]), weights: { points: 70, rate: 30 }, denominatorBasis: 'operational-members-at-asof' },
    event: { eventCount: event[1], averageRate: rate(event[2]), participants: event[5], repeated: event[6], repeatRate: rate(event[7]), participationWeight: 70, repeatWeight: 30 },
    events, curve, schoolAge: { samples: [1, 3, 5, 7].map(index => school[index]), rates: [2, 4, 6, 8].map(index => rate(school[index])) },
  };
}

export function eTeamForScoring(e) {
  const raw = e.metrics;
  const currentRate = conversionRate(e.annual.admissions, e.annual.trials);
  const previousRate = conversionRate(e.annual.previousAdmissions, e.annual.previousTrials);
  const retention12 = raw.retention.periods.find(period => period.months === 12);
  return {
    id: 'E', members: e.members, monthlyDelta: null, rank: null, overall: 0, status: '算出済',
    metrics: { retention: raw.retention.periods.some(period => period.scored) ? 0 : null, admission: currentRate, growth: raw.growth.weightedPoints, event: raw.event.score, family: raw.family.rate },
    benchmark: { retention12mRate: retention12.rate, retention12mSample: retention12.sample,
      admissionRate: currentRate, admissionPreviousRate: previousRate, admissionYoYDelta: currentRate !== null && previousRate !== null ? currentRate - previousRate : null,
      eventRate: raw.event.averageRate, repeatRate: raw.event.repeatRate,
      referralPoints: raw.family.points, referralRate: raw.family.rate, referralMembers: e.members },
    metricEvidence: { version: 'metric-evidence-v1', asOf: e.asOf, retention: structuredClone(raw.retention),
      admission: { ...e.annual, rate: currentRate, previousRate, relativeScore: currentRate },
      growth: structuredClone(raw.growth), family: structuredClone(raw.family), event: structuredClone(raw.event) },
    note: '共通の対象人数・期間を満たした指標から算出します。定着率は対象20名以上。対象イベントの開催前はイベント力を保留します。',
  };
}

// The legacy public files retain their source layout. All five staff-facing teams
// enter the existing scoreTeams function together after source reconciliation.
export function includeETeam(data, events, auxiliary = {}) {
  const e = data.eTeam;
  if (!e?.metrics) return;
  check(e.metrics.asOf === data.asOf && e.metrics.definition === 'common-team-metrics-v1', 'DATE_OR_DEFINITION_INVALID');
  check(!data.teams.some(team => team.id === 'E'), 'DUPLICATE_TEAM');
  const evidence = e.metrics;
  Object.assign(evidence.growth, { competitionCount: data.quality.competitionCount, competitionRows: data.quality.competitionRows });
  Object.assign(evidence.family, { fiscalYear: data.admissionConversion.fiscalYear, asOf: data.asOf });
  const details = new Map(evidence.events.map(item => [item.startDate + '|' + item.endDate, item]));
  check(details.size === events.events.length, 'EVENT_MAPPING_INVALID');
  for (const event of events.events) {
    const row = details.get(event.startDate + '|' + event.endDate);
    check(row, 'EVENT_MAPPING_INVALID');
    const { startDate, endDate, ...entry } = row;
    event.teams.E = entry;
    if (entry.eligible !== false) {
      event.total.participants += entry.participants;
      event.total.members += entry.members;
      event.total.rate = Number((event.total.participants / event.total.members * 100).toFixed(1));
    }
  }
  const maxParticipation = Math.max(events.historicalMaxRate, ...evidence.events.map(item => item.rate ?? 0));
  const maxRepeat = Math.max(events.repeatMaxRate, evidence.event.repeatRate ?? 0);
  evidence.event.participationScore = evidence.event.averageRate === null || !maxParticipation ? null : Math.min(100, evidence.event.averageRate / maxParticipation * 100);
  evidence.event.repeatScore = evidence.event.repeatRate === null || !maxRepeat ? null : Math.min(100, evidence.event.repeatRate / maxRepeat * 100);
  const components = [[evidence.event.participationScore, 70], [evidence.event.repeatScore, 30]].filter(([score]) => Number.isFinite(score));
  evidence.event.score = components.length ? components.reduce((n, [score, weight]) => n + score * weight, 0) / components.reduce((n, [, weight]) => n + weight, 0) : null;
  for (const team of data.teams) {
    const event = team.metricEvidence?.event;
    if (!event) continue;
    event.participationScore = event.averageRate / maxParticipation * 100;
    event.repeatScore = event.repeatRate / maxRepeat * 100;
  }
  events.historicalMaxRate = maxParticipation;
  events.repeatMaxRate = maxRepeat;
  events.teams.E = structuredClone(evidence.event);
  data.teams.push(eTeamForScoring(e));
  data.headline.members = e.allMembers;
  data.admissions.teams.E = { cumulative: evidence.admissions };
  data.admissionConversion.teams.E = structuredClone(e.annual);
  data.headline.admissionRate = conversionRate(Object.values(data.admissionConversion.teams).reduce((n, value) => n + value.admissions, 0), Object.values(data.admissionConversion.teams).reduce((n, value) => n + value.trials, 0));
  if (e.analysis) {
    for (const key of ['admissionHistory', 'admissionConversionHistory', 'memberComposition']) data[key] = structuredClone(e.analysis[key]);
    data.withdrawalHistory = applyWithdrawalBaseline(e.analysis.withdrawalHistory, data, TEAM_IDS);
  }
  if (auxiliary.curve) auxiliary.curve.teams.E = {
    samples: auxiliary.curve.months.map(month => evidence.curve.find(item => item.months === month)?.sample),
    rates: auxiliary.curve.months.map(month => evidence.curve.find(item => item.months === month)?.rate),
  };
  if (auxiliary.schoolAge) auxiliary.schoolAge.teams.E = {
    samples: evidence.schoolAge.samples,
    rates: evidence.schoolAge.rates.map((value, index) => evidence.schoolAge.samples[index] >= auxiliary.schoolAge.minimumSample ? value : null),
  };
  if (auxiliary.trial) {
    auxiliary.trial.annual.teams.E = { trials: e.annual.trials, admissions: e.annual.admissions };
    auxiliary.trial.annual.total = Object.values(auxiliary.trial.annual.teams).reduce((sum, item) => ({ trials: sum.trials + item.trials, admissions: sum.admissions + item.admissions }), { trials: 0, admissions: 0 });
    const daily = e.analysis?.today;
    if (auxiliary.trial.today.status === 'ok' && daily?.status === 'ok') {
      auxiliary.trial.today.teams.E = daily.count;
      auxiliary.trial.today.total += daily.count;
    } else auxiliary.trial.today = { status: 'unavailable', date: data.asOf, teams: null, total: null };
  }
  if (data.comparison) data.comparison.scoreVersion = `incomparable-team-cohort:${data.comparison.scoreVersion}`;
}

export function validateETeamDetails(data) {
  const e = data.eTeam;
  if (!e?.metrics) return;
  const m = e.metrics;
  exact(m, ['definition', 'asOf', 'admissions', 'retention', 'unknownWithdrawals', 'growth', 'family', 'event', 'events', 'curve', 'schoolAge']);
  check(m.definition === 'common-team-metrics-v1' && m.asOf === data.asOf && count(m.admissions) && count(m.unknownWithdrawals), 'METADATA_INVALID');
  exact(m.growth, ['top10', 'top10to20', 'top20to30', 'top30Children', 'weightedPoints', 'status']);
  exact(m.family, ['definition', 'trialPoints', 'siblingPoints', 'points', 'members', 'rate', 'weights', 'denominatorBasis']);
  exact(m.event, ['eventCount', 'averageRate', 'participants', 'repeated', 'repeatRate', 'participationWeight', 'repeatWeight']);
  exact(m.retention, ['periods', 'weightedIndex']);
  check(m.retention.periods.length === RETENTION_PERIODS.length, 'RETENTION_PERIODS_INVALID');
  m.retention.periods.forEach((period, index) => {
    exact(period, ['key', 'label', 'months', 'weight', 'sample', 'retained', 'exited', 'rate', 'relativeScore', 'scored']);
    const spec = RETENTION_PERIODS[index];
    check(period.key === spec.key && period.months === spec.months && period.weight === spec.weight && count(period.sample)
      && period.scored === (period.sample >= 20 && Number.isFinite(period.rate)), 'RETENTION_PERIOD_INVALID');
  });
  for (const row of m.events) exact(row, ['startDate', 'endDate', 'participants', 'members', 'rate', ...(row.eligible === false ? ['eligible'] : [])]);
  for (const row of m.curve) exact(row, ['months', 'rate', 'sample']);
  exact(m.schoolAge, ['samples', 'rates']);
  exact(m.family.weights, ['points', 'rate']);
  check(m.family.members === e.members && m.family.points === m.family.trialPoints + m.family.siblingPoints
    && m.family.weights.points === 70 && m.family.weights.rate === 30 && m.family.definition === 'referral-volume-rate-v2', 'REFERRAL_MISMATCH');
  const analysis = e.analysis;
  exact(analysis, ['admissionHistory', 'admissionConversionHistory', 'withdrawalHistory', 'memberComposition', 'today']);
  const model = { ...data, headline: { ...data.headline, members: e.allMembers }, teams: [...data.teams, { id: 'E', members: e.members }],
    admissions: { ...data.admissions, teams: { ...data.admissions.teams, E: { cumulative: m.admissions } } },
    admissionConversion: { ...data.admissionConversion, teams: { ...data.admissionConversion.teams, E: e.annual } } };
  validateAdmissionHistory(analysis.admissionHistory, model, TEAM_IDS);
  validateTrialConversionHistory(analysis.admissionConversionHistory, model, TEAM_IDS);
  validateWithdrawalHistory(analysis.withdrawalHistory, model, TEAM_IDS);
  validateMemberComposition(analysis.memberComposition, model, TEAM_IDS);
  const withdrawals = applyWithdrawalBaseline(analysis.withdrawalHistory, model, TEAM_IDS);
  for (const id of TEAM_IDS.filter(id => id !== 'E')) {
    for (const key of ['admissionHistory', 'admissionConversionHistory']) check(JSON.stringify(analysis[key].teams[id]) === JSON.stringify(data[key]?.teams[id]), 'BASE_HISTORY_MISMATCH');
    if (data.memberComposition?.status === 'ok' && analysis.memberComposition.status === 'ok') check(JSON.stringify(analysis.memberComposition.teams[id]) === JSON.stringify(data.memberComposition.teams[id]), 'BASE_COMPOSITION_MISMATCH');
    check(JSON.stringify(withdrawals.teams[id]) === JSON.stringify(data.withdrawalHistory?.teams[id]), 'BASE_WITHDRAWAL_MISMATCH');
  }
  exact(analysis.today, ['asOf', 'status', 'count']);
  check(analysis.today.asOf === data.asOf && (analysis.today.status === 'ok' ? count(analysis.today.count) : analysis.today.status === 'unavailable' && analysis.today.count === null), 'TODAY_INVALID');
}
