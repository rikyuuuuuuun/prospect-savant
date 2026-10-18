import test from 'node:test';
import assert from 'node:assert/strict';
import { profileTrialColumns, trialConversionDiagnostic, buildTrialConversionHistory, validateTrialConversionHistory, fetchTrialConversionHistory, unavailableTrialConversionHistory, trialConversionFailureReason } from '../scripts/trial-conversion-history.mjs';

const serial = date => (Date.parse(date) - Date.UTC(1899, 11, 30)) / 86400000;
const rows = list => ({
  dates: ['体験日', ...list.map(r => r[0])], teams: ['チーム', ...list.map(r => r[1])],
  attended: ['出席', ...list.map(r => r[2])], admitted: ['入会', ...list.map(r => r[3])],
});
const SAMPLE = [
  [serial('2026-04-05'), 'A', true, true],
  [serial('2026-04-20'), 'A', true, false],
  [serial('2026-05-31') + 0.6, 'B', true, true],
  [serial('2026-09-06') + 0.5, 'C', true, true], // timestamp on asOf counts
  [serial('2026-09-07'), 'D', true, true], // after asOf
  [serial('2026-03-31'), 'D', true, true], // previous fiscal year
  [serial('2026-06-10'), 'D', false, true], // admitted without attendance is not a trial
  [serial('2026-06-11'), 'D', '', ''],
  [serial('2026-06-12'), '会場', true, true], // not a team
];
const build = (list = SAMPLE) => buildTrialConversionHistory({ ...rows(list), asOf: '2026-09-06' });
const annual = h => ({ asOf: h.asOf, fiscalYear: h.fiscalYear, teams: Object.fromEntries(['A', 'B', 'C', 'D'].map(id => [id, {
  trials: h.teams[id].trials.reduce((n, v) => n + (v ?? 0), 0), admissions: h.teams[id].admissions.reduce((n, v) => n + (v ?? 0), 0),
}])) });

test('buckets attended trials by trial month with the annual cutoff and future nulls', () => {
  const h = build();
  assert.deepEqual(h.teams.A.trials.slice(0, 6), [2, 0, 0, 0, 0, 0]);
  assert.deepEqual(h.teams.A.admissions.slice(0, 6), [1, 0, 0, 0, 0, 0]);
  assert.equal(h.teams.B.trials[1], 1);
  assert.equal(h.teams.C.trials[5], 1);
  assert.deepEqual(h.teams.D.trials.slice(0, 6), [0, 0, 0, 0, 0, 0]);
  assert.deepEqual(h.total.trials, [2, 1, 0, 0, 0, 1, null, null, null, null, null, null]);
  assert.deepEqual(h.total.admissions, [1, 1, 0, 0, 0, 1, null, null, null, null, null, null]);
  assert.equal(JSON.stringify(h).includes('会場'), false);
});

test('monthly sums must equal the published fiscal-year counts exactly', () => {
  const h = build();
  const conversion = annual(h);
  assert.equal(validateTrialConversionHistory(h, { asOf: h.asOf, admissionConversion: conversion }), h);
  for (const key of ['trials', 'admissions']) {
    const off = structuredClone(conversion);
    off.teams.B[key] += 1;
    assert.throws(() => validateTrialConversionHistory(h, { asOf: h.asOf, admissionConversion: off }), new RegExp(`ANNUAL_MISMATCH_B_${key}`));
  }
  assert.throws(() => validateTrialConversionHistory(h, { asOf: h.asOf, admissionConversion: { ...conversion, fiscalYear: '2025' } }), /ANNUAL_DATE_MISMATCH/);
});

test('rejects tampered series, schema changes and unknown flag values', () => {
  const tamper = fn => { const h = build(); fn(h); return () => validateTrialConversionHistory(h, { asOf: h.asOf }); };
  assert.throws(tamper(h => { h.teams.A.admissions[0] = 3; h.total.admissions[0] = 3; }), /ADMISSIONS_EXCEED_TRIALS/);
  assert.throws(tamper(h => { h.total.trials[0] = 9; }), /TOTAL_MISMATCH/);
  assert.throws(tamper(h => { h.teams.A.trials[7] = 0; }), /COUNT_INVALID/);
  assert.throws(tamper(h => { h.extra = 1; }), /FIELDS_INVALID/);
  assert.throws(() => validateTrialConversionHistory(build(), { asOf: '2026-09-07' }), /DATE_MISMATCH/);
  assert.throws(() => buildTrialConversionHistory({ ...rows([]), dates: ['日付'], asOf: '2026-09-06' }), /HEADER_INVALID/);
  assert.throws(() => build([[serial('2026-05-01'), 'A', '済', true]]), /ATTENDANCE_VALUE_INVALID/);
  assert.throws(() => build([[serial('2026-05-01'), 'A', true, 'はい']]), /ADMISSION_VALUE_INVALID/);
  assert.throws(() => build([['invalid', 'A', true, true]]), /TRIAL_DATE_INVALID/);
});

test('fiscal year resets in April', () => {
  const h = buildTrialConversionHistory({ ...rows([[serial('2027-03-31'), 'A', true, true], [serial('2027-04-01'), 'B', true, false]]), asOf: '2027-04-02' });
  assert.equal(h.fiscalYear, '2027');
  assert.equal(h.teams.A.trials[0], 0);
  assert.equal(h.teams.B.trials[0], 1);
  assert.equal(h.total.trials[1], null);
});

test('unavailable records carry only a fixed reason', () => {
  const u = unavailableTrialConversionHistory('2026-09-06', 'whatever leaked text');
  assert.deepEqual(u, { status: 'unavailable', definition: 'trial-attendance-fiscal-monthly-v1', asOf: '2026-09-06', fiscalYear: '2026', reason: 'SOURCE_UNAVAILABLE' });
  assert.equal(validateTrialConversionHistory(u, { asOf: '2026-09-06' }), u);
  assert.equal(trialConversionFailureReason(new Error('TRIAL_CONVERSION_HISTORY_ANNUAL_MISMATCH_A_trials')), 'ANNUAL_MISMATCH');
  assert.equal(trialConversionFailureReason(new Error('TRIAL_CONVERSION_HISTORY_SOURCE_CHANGED_DURING_READ')), 'SOURCE_CHANGED');
  assert.equal(trialConversionFailureReason(new Error('TRIAL_CONVERSION_HISTORY_SCHEMA_INVALID')), 'SCHEMA_INVALID');
  assert.equal(trialConversionFailureReason(new Error('GOOGLE_SHEETS_503')), 'SOURCE_UNAVAILABLE');
});

const source = ({ header = ['突合ID', '体験日', '氏名', 'チーム', '出席', '入会'], change = false } = {}) => {
  let reads = 0;
  const requested = [];
  const requestJson = async raw => {
    const u = new URL(raw);
    if (u.searchParams.get('valueRenderOption') === 'FORMULA') return { valueRanges: [{ values: [['=IMPORTRANGE("https://docs.google.com/spreadsheets/d/master/edit","\'12_Savant連携\'!A4:AE9")']] }] };
    if (!u.pathname.endsWith('values:batchGet')) return { sheets: [{ properties: { title: '09_体験入会突合', gridProperties: { rowCount: 50, columnCount: 6 } } }] };
    const ranges = u.searchParams.getAll('ranges');
    requested.push(...ranges);
    if (ranges.length === 1) return { valueRanges: [{ values: [header] }] };
    reads++;
    const team = change && reads > 1 ? 'B' : 'A';
    return { valueRanges: [{ values: [['体験日', serial('2026-05-01')]] }, { values: [['チーム', team]] }, { values: [['出席', true]] }, { values: [['入会', true]] }] };
  };
  return { requestJson, requested };
};
const expected = { asOf: '2026-09-06', fiscalYear: '2026', teams: { A: { trials: 1, admissions: 1 }, B: { trials: 0, admissions: 0 }, C: { trials: 0, admissions: 0 }, D: { trials: 0, admissions: 0 } } };

test('private fetch discovers columns by header, skips other columns and gates on the annual counts', async () => {
  const { requestJson, requested } = source();
  const h = await fetchTrialConversionHistory({ spreadsheetId: 'savant', token: 'unused', asOf: '2026-09-06', conversion: expected, requestJson });
  assert.equal(h.teams.A.admissions[1], 1);
  // Name column C is never requested.
  assert.deepEqual([...new Set(requested.filter(r => !r.endsWith('4:F4')))].sort(), ["'09_体験入会突合'!B4:B50", "'09_体験入会突合'!D4:D50", "'09_体験入会突合'!E4:E50", "'09_体験入会突合'!F4:F50"]);
  const off = structuredClone(expected); off.teams.A.trials = 2;
  await assert.rejects(() => fetchTrialConversionHistory({ spreadsheetId: 'savant', token: 'unused', asOf: '2026-09-06', conversion: off, requestJson: source().requestJson }), /ANNUAL_MISMATCH_A_trials/);
});

test('private fetch rejects missing or duplicated headers and concurrent changes', async () => {
  const run = options => fetchTrialConversionHistory({ spreadsheetId: 'savant', token: 'unused', asOf: '2026-09-06', conversion: expected, requestJson: source(options).requestJson });
  await assert.rejects(() => run({ header: ['突合ID', '体験日', 'チーム', '出席'] }), /HEADER_MISSING_ADMITTED/);
  await assert.rejects(() => run({ header: ['体験日', 'チーム', '出席', '入会', '入会'] }), /HEADER_DUPLICATE_ADMITTED/);
  await assert.rejects(() => run({ change: true }), /SOURCE_CHANGED_DURING_READ/);
});

test('diagnostics report a fixed code and value-type counts, never cell text', () => {
  const columns = rows([[serial('2026-05-01'), 'A', '済', true], ['', 'B', true, false], ['2026/05/02', 'C', true, '山田'], [serial('2026-05-03'), '会場', '鈴木', true]]);
  const profile = profileTrialColumns(columns);
  assert.deepEqual(profile, { teamRows: 3, attended: { string: 1, true: 2 }, admitted: { true: 1, false: 1, string: 1 }, attendedDates: { empty: 1, dateString: 1 } });
  const error = new Error('TRIAL_CONVERSION_HISTORY_ATTENDANCE_VALUE_INVALID'); error.profile = profile;
  const line = trialConversionDiagnostic(error);
  assert.match(line, /^detail=ATTENDANCE_VALUE_INVALID profile=/);
  for (const text of ['済', '山田', '鈴木', '会場']) assert.equal(line.includes(text), false);
  assert.equal(trialConversionDiagnostic(new Error('unexpected 山田')), 'detail=OTHER');
  assert.equal(trialConversionFailureReason(new Error('TRIAL_CONVERSION_HISTORY_HEADER_MISSING_ATTENDED')), 'SCHEMA_INVALID');
});
