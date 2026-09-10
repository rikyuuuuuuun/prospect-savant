import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { ANNUAL_CONVERSION_RANGE, readAnnualConversion, assertAnnualConversionSource, validateAnnualConversion } from '../scripts/annual-conversion-source.mjs';
import { conversionRows } from './support/annual-conversion.mjs';
const asOf = '2026-09-10';
const teams = {
  A: { trials:117, admissions:100, previousTrials:60, previousAdmissions:51 },
  B: { trials:114, admissions:90, previousTrials:66, previousAdmissions:54 },
  C: { trials:81, admissions:51, previousTrials:78, previousAdmissions:47 },
  D: { trials:79, admissions:46, previousTrials:165, previousAdmissions:107 },
};
const ids = Object.keys(teams);
function fixture() {
  return { ranges: {
    [ANNUAL_CONVERSION_RANGE]: conversionRows(asOf, teams),
    "'06_入会力（年度）'!A1:H12": [[], [], [], [], ...ids.map(id => { const t = teams[id]; const rate = t.admissions/t.trials, previous = t.previousAdmissions/t.previousTrials; return [id, t.trials, t.admissions, rate, previous, rate-previous]; })],
    "'98_会員マスター連携'!A4:AE9": [[], ...ids.map(id => [id, 191, '', '', '', 200, teams[id].trials, teams[id].admissions, 56])],
  } };
}
test('accepts dated conversion counts while admission-date totals remain independent', () => {
  const c = assertAnnualConversionSource(fixture(), asOf);
  assert.equal(c.teams.D.admissions, 46);
  assert.equal(c.teams.D.previousAdmissions, 107);
  assert.deepEqual(Object.keys(c).sort(), ['asOf','definition','fiscalYear','teams']);
});
test('rejects the reported stale 45/78 cohort despite a fresh member timestamp', () => {
  const source = fixture();
  source.ranges["'06_入会力（年度）'!A1:H12"][7] = ['D',78,45,45/78,98/154,45/78-98/154];
  assert.throws(() => assertAnnualConversionSource(source, asOf), /STALE_DASHBOARD_D/);
});
test('rejects stale dates, fiscal rollover, totals, missing data and stale previous rates', () => {
  const rows = conversionRows(asOf, teams);
  assert.throws(() => readAnnualConversion(rows, '2026-09-11'), /DATE_MISMATCH/);
  assert.throws(() => readAnnualConversion(rows, '2027-04-01'), /DATE_MISMATCH/);
  assert.throws(() => readAnnualConversion(undefined, asOf), /READBACK_MISSING/);
  rows[5][2]++;
  assert.throws(() => readAnnualConversion(rows, asOf), /TOTAL_MISMATCH/);
  const source = fixture(); source.ranges["'06_入会力（年度）'!A1:H12"][7][4] = 98/154;
  assert.throws(() => assertAnnualConversionSource(source, asOf), /RATE_MISMATCH_D_4/);
});
test('public validation rejects changed counts even when the rounded percentage is unchanged', () => {
  const round = n => Math.round(n*10)/10;
  const data = {asOf, admissionConversion: readAnnualConversion(conversionRows(asOf, teams), asOf),
    headline: {admissionRate:round(287/391*100),admissionPreviousRate:round(259/369*100),admissionYoYDelta:round(287/391*100-259/369*100)},
    teams: ids.map(id => {const t=teams[id];return {id,benchmark:{admissionRate:round(t.admissions/t.trials*100),admissionPreviousRate:round(t.previousAdmissions/t.previousTrials*100),admissionYoYDelta:round(t.admissions/t.trials*100-t.previousAdmissions/t.previousTrials*100)}};})};
  const annual = {status:'ok',fiscalYear:'2026',teams:Object.fromEntries(ids.map(id=>[id,{admissions:teams[id].admissions,trials:teams[id].trials}]))};
  validateAnnualConversion(data, annual);
  annual.teams.D = {admissions:92,trials:158};
  assert.throws(() => validateAnnualConversion(data, annual), /PUBLIC_TRIAL_COUNT_MISMATCH_D/);
});
test('the card displays conversion 46/79 and admission-date 56 without conflating them', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const source = html.slice(html.indexOf('const annualAdmissionSample'), html.indexOf('const renderTrialSummary'));
  const context = { data:{asOf,admissions:{asOf,definition:'member-master-admission-date-annual-v1',teams:{D:{cumulative:56}}}},trialData:{annual:{status:'ok',teams:{D:{trials:79,admissions:46}}}},formatNumber:new Intl.NumberFormat('ja-JP') };
  const result = vm.runInNewContext(`${source}; [annualAdmissionSample({id:'D',benchmark:{admissionRate:58.2}}),annualRealAdmissionSample({id:'D'})]`,context);
  assert.deepEqual(Array.from(result),['体験79人 → 入会46人','年度実入会 56人（入会日基準）']);
});
