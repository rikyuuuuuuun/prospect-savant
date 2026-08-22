import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateTeam, discoverDailyTrialSchema, discoverTrialSchema, fiscalYearFor, parseSheetIds, serialToIsoDate, trialPublicInput } from '../scripts/private-trial-aggregate.mjs';
import { fetchPrivateTrialAggregate } from '../scripts/fetch-private-savant-source.mjs';

const serial = (iso) => Math.floor((Date.parse(`${iso}T00:00:00Z`) - Date.UTC(1899, 11, 30)) / 86_400_000);

function sheet(rows) {
  return {
    headerRow: 1,
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
  assert.deepEqual(result, { today: 0 });
});

test('counts today from the date column only', () => {
  const result = aggregateTeam({
    targetDate: '2026-08-22', fiscalYear: '2026',
    sheets: [sheet([
      { date: serial('2026-08-22'), attendance: true, admission: true },
      { date: serial('2026-08-22'), attendance: false, admission: false },
      { date: serial('2026-08-21'), attendance: true, admission: false },
      { date: serial('2025-03-31'), attendance: true, admission: true },
    ])],
  });
  assert.deepEqual(result, { today: 2 });
});

test('rejects an unrecognised source schema instead of publishing zero', () => {
  assert.throws(() => aggregateTeam({
    targetDate: '2026-08-22',
    sheets: [{}],
  }), /SOURCE_SCHEMA_INVALID/);
});

test('ignores values before the discovered header row', () => {
  const result = aggregateTeam({
    targetDate: '2026-08-22',
    sheets: [{ headerRow: 2, dateColumn: [serial('2026-08-22'), '体験予約日', serial('2026-08-21')] }],
  });
  assert.deepEqual(result, { today: 0 });
});

test('accepts the known shifted C/D attendance header and keeps IDs private', () => {
  assert.deepEqual(discoverTrialSchema(
    [[''], [''], [''], [''], ['体験予約日']],
    [[], [], [], [], ['備考', '出席、フォーム確認', '入会']],
  ), { headerRow: 5, attendanceColumn: 'F', admissionColumn: 'G' });
  assert.deepEqual(discoverDailyTrialSchema(
    [['体験予約日']],
    [['出席確認']],
  ), { headerRow: 1, attendanceColumn: 'E' });
  assert.deepEqual(parseSheetIds('{"A":"a","B":"b","C":"c","D":"d"}'), { A: 'a', B: 'b', C: 'c', D: 'd' });
  assert.throws(() => parseSheetIds('{"A":"a"}'), /TRIAL_SHEET_IDS_SECRET_INVALID/);
});

test('uses the Google serial date convention and public input contains only aggregates', () => {
  assert.equal(serialToIsoDate(serial('2026-08-22')), '2026-08-22');
  assert.equal(fiscalYearFor('2026-03-31'), '2025');
  assert.equal(fiscalYearFor('2026-04-01'), '2026');
  const input = trialPublicInput({
    targetDate: '2026-08-22', fiscalYear: '2026',
    aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])),
    annualTeams: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { trials: 2, admissions: 1 }])),
  });
  assert.deepEqual(input.today.teams, { A: 0, B: 0, C: 0, D: 0 });
  assert.deepEqual(input.annual.teams.C, { admissions: 1, trials: 2 });

  const canonicalInput = trialPublicInput({
    targetDate: '2026-08-22', fiscalYear: '2026',
    aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])),
    annualTeams: { A: { trials: 1, admissions: 0 }, B: { trials: 1, admissions: 0 }, C: { trials: 81, admissions: 51 }, D: { trials: 1, admissions: 0 } },
  });
  assert.deepEqual(canonicalInput.annual.teams.C, { admissions: 51, trials: 81 });
});

test('reads only date columns and fails closed when any of four team sources fails', async () => {
  const requests = [];
  const requestJson = async (rawUrl) => {
    const url = new URL(rawUrl);
    requests.push(url);
    if (!url.pathname.endsWith('/values:batchGet')) return { sheets: [
      { properties: { title: '予約', gridProperties: { rowCount: 4 } } },
      { properties: { title: '補助', gridProperties: { rowCount: 4 } } },
    ] };
    const ranges = url.searchParams.getAll('ranges');
    if (ranges.every((range) => range.endsWith('A1:A4'))) return { valueRanges: ranges.map((_, index) => ({ values: index === 0 ? [['体験予約日', serial('2026-08-22'), serial('2026-08-21')]] : [[]] })) };
    if (ranges.every((range) => range.endsWith('E1:H1'))) return { valueRanges: [{ values: [['出席確認', '入会']] }] };
    return { valueRanges: [{ values: [['体験予約日', serial('2026-08-22'), serial('2026-08-21')]] }] };
  };
  const options = {
    serviceAccountJson: '{"client_email":"service@example.invalid","private_key":"unused","token_uri":"https://token.invalid"}',
    trialSheetIdsJson: '{"A":"a","B":"b","C":"c","D":"d"}', targetDate: '2026-08-22',
    getToken: async () => 'test-token', requestJson,
  };
  const result = await fetchPrivateTrialAggregate(options);
  assert.deepEqual(result.aggregates, { A: { today: 1 }, B: { today: 1 }, C: { today: 1 }, D: { today: 1 } });
  const dataReads = requests.filter((url) => url.pathname.endsWith('/values:batchGet') && url.searchParams.getAll('ranges')[0] === "'予約'!A1:A4");
  assert.equal(dataReads.length, 8);
  assert(dataReads.every((url) => url.searchParams.getAll('ranges')[0] === "'予約'!A1:A4"));

  await assert.rejects(() => fetchPrivateTrialAggregate({ ...options, requestJson: async (url, token) => {
    if (String(url).includes('/spreadsheets/c?')) throw new Error('GOOGLE_SHEETS_403');
    return requestJson(url, token);
  } }), /TRIAL_SOURCE_UNAVAILABLE_C_GOOGLE_SHEETS_403/);

  await assert.rejects(() => fetchPrivateTrialAggregate({ ...options, requestJson: async (url, token) => {
    const text = String(url);
    if (text.includes('/spreadsheets/a?')) return { sheets: [{ properties: { title: '予約', gridProperties: { rowCount: 40 } } }] };
    if (text.includes('/spreadsheets/a/') && text.includes('values:batchGet') && text.includes('A1%3AA40')) {
      return { valueRanges: [{ values: [['体験予約日'], ...Array.from({ length: 29 }, () => []), ['体験予約日']] }] };
    }
    return requestJson(url, token);
  } }), /TRIAL_SOURCE_UNAVAILABLE_A_SOURCE_SCHEMA_INVALID/);
});
