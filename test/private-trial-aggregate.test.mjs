import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateTeam, discoverTrialSchema, parseSheetIds, serialToIsoDate, trialPublicInput } from '../scripts/private-trial-aggregate.mjs';

const serial = (iso) => Math.floor((Date.parse(`${iso}T00:00:00Z`) - Date.UTC(1899, 11, 30)) / 86_400_000);

function sheet(rows) {
  return {
    dateColumn: ['体験予約日', ...rows.map((row) => row.date)],
    attendanceColumn: ['出席確認', ...rows.map((row) => row.attendance)],
    admissionColumn: ['入会', ...rows.map((row) => row.admission)],
  };
}

test('valid zero remains ok rather than unavailable', () => {
  const result = aggregateTeam({
    targetDate: '2026-08-22', fiscalYear: '2026',
    sheets: [sheet([{ date: serial('2026-08-21'), attendance: false, admission: false }])],
  });
  assert.deepEqual(result, { today: 0, trials: 0, admissions: 0 });
});

test('counts today separately from fiscal-year attended trials and admissions', () => {
  const result = aggregateTeam({
    targetDate: '2026-08-22', fiscalYear: '2026',
    sheets: [sheet([
      { date: serial('2026-08-22'), attendance: true, admission: true },
      { date: serial('2026-08-22'), attendance: false, admission: false },
      { date: serial('2026-08-21'), attendance: true, admission: false },
      { date: serial('2025-03-31'), attendance: true, admission: true },
    ])],
  });
  assert.deepEqual(result, { today: 2, trials: 2, admissions: 1 });
});

test('rejects an unrecognised source schema instead of publishing zero', () => {
  assert.throws(() => aggregateTeam({
    targetDate: '2026-08-22', fiscalYear: '2026',
    sheets: [{ dateColumn: ['体験予約日'], attendanceColumn: ['unknown'], admissionColumn: ['入会'] }],
  }), /SOURCE_SCHEMA_INVALID/);
});

test('accepts the known shifted C/D attendance header and keeps IDs private', () => {
  assert.deepEqual(discoverTrialSchema(
    [[''], [''], [''], [''], ['体験予約日']],
    [[], [], [], [], ['備考', '出席、フォーム確認', '入会']],
  ), { headerRow: 5, attendanceColumn: 'F', admissionColumn: 'G' });
  assert.deepEqual(parseSheetIds('{"A":"a","B":"b","C":"c","D":"d"}'), { A: 'a', B: 'b', C: 'c', D: 'd' });
  assert.throws(() => parseSheetIds('{"A":"a"}'), /TRIAL_SHEET_IDS_SECRET_INVALID/);
});

test('uses the Google serial date convention and public input contains only aggregates', () => {
  assert.equal(serialToIsoDate(serial('2026-08-22')), '2026-08-22');
  const input = trialPublicInput({
    targetDate: '2026-08-22', fiscalYear: '2026',
    aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0, trials: 2, admissions: 1 }])),
  });
  assert.deepEqual(input.today.teams, { A: 0, B: 0, C: 0, D: 0 });
  assert.deepEqual(input.annual.teams.C, { admissions: 1, trials: 2 });
});
