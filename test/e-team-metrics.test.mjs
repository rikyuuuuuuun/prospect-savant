import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseFrozenJson } from '../scripts/trial-publication.mjs';
import { RETENTION_PERIODS } from '../scripts/metric-retention-evidence.mjs';
import { readETeamMetrics, validateETeamDetails, E_EVALUATION_START, selectETeamMemberMonthlyComparison } from '../scripts/e-team-metrics.mjs';
import { projectContinuousScores, continuousScore } from '../scripts/continuous-scores.mjs';
import { aggregateDispositionTrials, buildTrialAnalyticsQuality } from '../scripts/trial-analytics-disposition.mjs';
import { eMetricSourceRows } from './support/e-team.mjs';

const read = async file => parseFrozenJson(await readFile(new URL('../' + file, import.meta.url), 'utf8'), file);

async function fixture() {
  const [data, events, curve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(read));
  trial.today = { status: 'ok', date: data.asOf, total: 0, teams: Object.fromEntries(data.teams.map(team => [team.id, 0])) };
  const e = { asOf: data.asOf, definition: data.admissionConversion.definition, members: 4, allMembers: data.headline.members + 4,
    annual: { trials: 5, admissions: 0, previousTrials: 0, previousAdmissions: 0 } };
  const eligible = events.events.filter(event => event.startDate >= E_EVALUATION_START);
  e.metrics = { definition: 'common-team-metrics-v1', asOf: data.asOf, admissions: 4, unknownWithdrawals: 0,
    retention: { weightedIndex: null, periods: RETENTION_PERIODS.map(spec => ({ key: spec.key, label: spec.label, months: spec.months, weight: spec.weight, sample: 0, rate: null, retained: null, exited: null, scored: false, relativeScore: null })) },
    growth: { top10: 0, top10to20: 0, top20to30: 0, top30Children: 0, weightedPoints: 0, status: '履歴待ち' },
    family: { definition: 'referral-volume-rate-v2', trialPoints: 0, siblingPoints: 0, points: 0, members: 4, rate: 0, weights: { points: 70, rate: 30 }, denominatorBasis: 'operational-members-at-asof' },
    event: { eventCount: eligible.length, averageRate: eligible.length ? 0 : null, participants: 0, repeated: 0, repeatRate: null, participationWeight: 70, repeatWeight: 30 },
    events: events.events.map(event => ({ startDate: event.startDate, endDate: event.endDate, ...(event.startDate < E_EVALUATION_START ? { participants: null, members: null, rate: null, eligible: false } : { participants: 0, members: 4, rate: 0 }) })),
    curve: [1, 3, 6, 9, 12, 18, 24, 36, 48, 60, 72].map(months => ({ months, rate: null, sample: 0 })),
    schoolAge: { samples: [0, 0, 0, 0], rates: [null, null, null, null] },
  };
  const month = data.admissionHistory.months.indexOf(data.asOf.slice(0, 7));
  const zero = data.admissionHistory.total.map(value => value === null ? null : 0);
  const admissions = structuredClone(data.admissionHistory);
  admissions.teams.E = [...zero]; admissions.teams.E[month] = 4; admissions.total[month] += 4;
  const conversion = structuredClone(data.admissionConversionHistory);
  conversion.teams.E = { trials: [...zero], admissions: [...zero] };
  conversion.teams.E.trials[month] = 5; conversion.total.trials[month] += 5;
  const withdrawal = structuredClone(data.withdrawalHistory);
  withdrawal.teams.E = { unknownMonth: 0, months: withdrawal.teams.A.months.map(row => row === null ? null : Object.fromEntries(Object.entries(row).map(([key, value]) => [key, key === 'month' ? value : ['denominator', 'rate'].includes(key) ? null : 0]))) };
  const composition = structuredClone(data.memberComposition);
  const eComposition = structuredClone(composition.teams.A);
  eComposition.members = 4;
  for (const key of ['grade', 'gender', 'tenure', 'age', 'status', 'entryYear']) {
    eComposition[key] = Object.fromEntries(Object.keys(eComposition[key]).map(bucket => [bucket, 0]));
    eComposition[key].unknown = 4;
    composition.overall[key].unknown = (composition.overall[key].unknown || 0) + 4;
  }
  eComposition.summary = { knownTenure: 0, tenureMonthsTotal: 0, meanTenureMonths: null, medianTenureMonths: null };
  composition.teams.E = eComposition; composition.overall.members += 4;
  e.analysis = { admissionHistory: admissions, admissionConversionHistory: conversion, withdrawalHistory: withdrawal, memberComposition: composition, today: { asOf: data.asOf, status: 'ok', count: 0 } };
  data.eTeam = e;
  return { data, events, curve, schoolAge, trial };
}

test('E enters the same five-team formulas, monthly histories, composition and denominator rules', async () => {
  const { data, events, curve, schoolAge, trial } = await fixture();
  const native = readETeamMetrics(eMetricSourceRows(data.eTeam), data.eTeam);
  assert.deepEqual(native, data.eTeam.metrics);
  validateETeamDetails(data);
  const result = projectContinuousScores(data, events, 20, { curve, schoolAge, trial });
  const e = result.data.teams.find(team => team.id === 'E');
  assert.deepEqual(result.data.teams.map(team => team.id), ['A', 'B', 'C', 'D', 'E']);
  assert.equal(result.data.headline.members, data.headline.members + 4);
  assert.equal(e.metrics.admission, Math.round(continuousScore(0, data.teams.map(team => team.metricEvidence.admission.admissions / team.metricEvidence.admission.trials * 100))));
  assert.equal(e.metrics.growth, Math.round(continuousScore(0, data.teams.map(team => team.metricEvidence.growth.weightedPoints))));
  assert.equal(e.metrics.retention, null);
  assert.equal(e.overall, null);
  assert.equal(result.data.admissions.teams.E.cumulative, 4);
  assert.equal(result.data.memberComposition.overall.members, result.data.headline.members);
  assert.ok(result.curve.teams.E.rates.every(value => value === null));
  assert.ok(result.events.events.filter(event => event.startDate < E_EVALUATION_START).every(event => event.teams.E.eligible === false));
  assert.equal(result.trial.today.teams.E, 0);
  assert.equal(result.trial.annual.teams.E.trials, 5);
  assert.equal(data.teams.length, 4);
  assert.equal(events.teams.E, undefined);
});

test('E source errors, anonymous field additions and five-team reconciliation differences block publication', async () => {
  const { data } = await fixture();
  const rows = eMetricSourceRows(data.eTeam);
  rows[5][6]++;
  assert.throws(() => readETeamMetrics(rows, data.eTeam), /REFERRAL_INVALID/);
  data.eTeam.metrics.growth.privateField = 'unexpected';
  assert.throws(() => validateETeamDetails(data), /FIELDS_INVALID/);
  delete data.eTeam.metrics.growth.privateField;
  data.eTeam.analysis.admissionConversionHistory.teams.E.trials[0]++;
  assert.throws(() => validateETeamDetails(data), /TOTAL_MISMATCH|ANNUAL/);
});

test('whole membership compares A–E with the saved month-end total across E launch', async () => {
  const { data, events } = await fixture();
  const before = structuredClone(data);
  const result = projectContinuousScores(data, events).data;
  const baseline = data.memberMonthlyComparison.headline.members;
  assert.equal(result.headline.monthlyDelta, data.headline.members + 4 - baseline);
  assert.equal(result.memberMonthlyComparison.headline.members, baseline);
  assert.equal(result.memberMonthlyComparison.teams.find(team => team.id === 'E').members, 0);
  assert.equal(result.teams.find(team => team.id === 'E').monthlyDelta, 4);
  assert.equal(result.teams.reduce((sum, team) => sum + team.monthlyDelta, 0), result.headline.monthlyDelta);
  assert.deepEqual(data, before);
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const expression = html.match(/const headlineMemberDeltaComparable = ([\s\S]*?);/)[1];
  const renderable = new Function('data', 'memberDeltaComparable', 'eTeam', `return ${expression}`);
  assert.equal(renderable(result, true, result.eTeam), true);
  assert.equal(renderable(data, true, data.eTeam), false);
});

test('E month-end membership rolls over, survives same-day retries and never assumes post-launch zero', () => {
  const monthEnd = { asOf: '2026-11-30', members: 7 };
  const saved = selectETeamMemberMonthlyComparison(monthEnd, '2026-12-01');
  assert.deepEqual(saved, { asOf: '2026-11-30', members: 7 });
  assert.deepEqual(selectETeamMemberMonthlyComparison({ asOf: '2026-12-01', members: 8, memberMonthlyComparison: saved }, '2026-12-01'), saved);
  assert.deepEqual(selectETeamMemberMonthlyComparison({ asOf: '2026-12-15', members: 9, memberMonthlyComparison: saved }, '2026-12-16'), saved);
  assert.equal(selectETeamMemberMonthlyComparison({ asOf: '2026-11-29', members: 7 }, '2026-12-01'), undefined);
  assert.deepEqual(selectETeamMemberMonthlyComparison(undefined, '2026-11-11'), { asOf: '2026-10-31', members: 0 });
});

test('E automatically scores eligible retention and events with an unavailable prior-year conversion', async () => {
  const { data, events } = await fixture();
  const m = data.eTeam.metrics;
  Object.assign(m.retention.periods[0], { sample: 20, rate: 100, retained: 20, exited: 0, scored: true });
  Object.assign(events.events[0], { startDate: '2026-11-10', endDate: '2026-11-10' });
  m.events[0] = { startDate: '2026-11-10', endDate: '2026-11-10', participants: 1, members: 4, rate: 25 };
  Object.assign(m.event, { eventCount: 1, averageRate: 25, participants: 1 });
  const result = projectContinuousScores(data, events);
  const e = result.data.teams.find(team => team.id === 'E');
  assert.ok(Object.values(e.metrics).every(Number.isInteger));
  assert.ok(Number.isInteger(e.overall));
  assert.ok(!/undefined|NaN|A〜D/.test(e.note));
  assert.match(e.note, /前年同期間対象不足/);
});

test('a saved five-team prior publication enables like-for-like comparisons after launch', async () => {
  const { data, events } = await fixture();
  const prior = structuredClone(projectContinuousScores(data, events).data.teams.find(team => team.id === 'E'));
  const asOf = data.comparison.previousAsOf;
  prior.metricEvidence.asOf = asOf;
  data.eTeam.previous = { asOf, team: prior, admissions: 4 };
  data.comparison.teams = structuredClone(data.teams);
  data.comparison.teams.forEach(team => { team.metricEvidence.asOf = asOf; });
  validateETeamDetails(data);
  const result = projectContinuousScores(data, events).data;
  assert.equal(result.comparison.teams.length, 5);
  assert.equal(result.comparison.scoreVersion, result.scoreVersion);
  assert.equal(result.comparison.admissions.teams.E.cumulative, 4);
});

test('formally launched E receipts use the common exclusion and daily reconciliation rules', () => {
  const row = [];
  row[0] = 'FORM-test'; row[4] = 'E'; row[6] = 'private-fixture'; row[7] = 'fixture'; row[11] = '体験申込'; row[12] = 'フォーム'; row[14] = '2026-11-11'; row[23] = '反映済';
  row[34] = '[PROSPECT_ANALYTICS_DISPOSITION_V1:EXCLUDE_TEST:FORM-test]';
  const ids = ['A', 'B', 'C', 'D', 'E'];
  const quality = buildTrialAnalyticsQuality([row], [], ids);
  assert.equal(quality.excludedTest, 1);
  const result = aggregateDispositionTrials({ intakeRows: [row], targetDate: '2026-11-11', teamIds: ids,
    sheets: [{ owner: 'E', spreadsheetId: 'private-fixture', title: 'fixture', headerRow: 1, dateColumn: ['date', '2026-11-11'], noteColumn: ['', 'LINE受付ID:FORM-test'] }] });
  assert.equal(result.aggregates.E.today, 0);
});
