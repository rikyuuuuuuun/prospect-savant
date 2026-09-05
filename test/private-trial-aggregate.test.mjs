import { syntheticMemberReadback, syntheticMemberGate } from './support/member-readback.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { aggregateTeam, discoverDailyTrialSchema, discoverTrialSchema, fiscalYearFor, parseSheetIds, serialToIsoDate, trialPublicInput } from '../scripts/private-trial-aggregate.mjs';
import { createRetriableGoogleJson, fetchPrivateSavantSource, fetchPrivateTrialAggregate, googleJson } from '../scripts/fetch-private-savant-source.mjs';

const serial = (iso) => Math.floor((Date.parse(`${iso}T00:00:00Z`) - Date.UTC(1899, 11, 30)) / 86_400_000);

function sheet(rows) {
  return {
    headerRow: 1,
    dateColumn: ['体験予約日', ...rows.map((row) => row.date)],
    attendanceColumn: ['出席確認', ...rows.map((row) => row.attendance)],
    admissionColumn: ['入会', ...rows.map((row) => row.admission)],
  };
}

function successfulTrialRequest(rawUrl) {
  const url = new URL(rawUrl);
  if (url.pathname.includes('/spreadsheets/savant/values:batchGet')) {
    const receipt = syntheticMemberReadback();
    if (url.searchParams.getAll('ranges').length === 2) return { valueRanges: [{ values: receipt }, { values: syntheticMemberGate() }] };
    const valueRanges = Array.from({ length: 16 }, () => ({ values: [] }));
    valueRanges[14] = { values: syntheticMemberGate() };
    valueRanges[13] = { values: receipt };
    valueRanges[12] = { values: [[], [], [], [], ['', '', '', '', '', '正常']] };
    valueRanges[11] = { values: [[], ...['A','B','C','D'].map((id, i) => [id, i + 1]), ['合計', 10]] };
    valueRanges[1] = { values: [[], [], [], [], ...['A','B','C','D'].map((id, i) => [id, i + 1])] };
    valueRanges[0] = { values: [[], [], [], [], [10]] };
    valueRanges[2] = { values: [[], [], [], [], ...['A', 'B', 'C', 'D'].map((team) => {
      const row = [];
      row[1] = team;
      row[2] = 'ABCD'.indexOf(team) + 1;
      row[21] = serial('2026-08-21');
      return row;
    })] };
    return { valueRanges };
  }
  if (!url.pathname.endsWith('/values:batchGet')) return { sheets: [
    { properties: { title: '予約', gridProperties: { rowCount: 4 } } },
    { properties: { title: '補助', gridProperties: { rowCount: 4 } } },
  ] };
  const ranges = url.searchParams.getAll('ranges');
  if (ranges.every((range) => range.endsWith('A1:A4'))) {
    return { valueRanges: ranges.map((_, index) => ({ values: index === 0 ? [['体験予約日', serial('2026-08-22'), serial('2026-08-21')]] : [[]] })) };
  }
  if (ranges.every((range) => range.endsWith('E1:H1'))) return { valueRanges: [{ values: [['出席確認', '入会']] }] };
  return { valueRanges: [{ values: [['体験予約日', serial('2026-08-22'), serial('2026-08-21')]] }] };
}

const testSourceOptions = (requestJson, retryOptions = {}) => ({
  serviceAccountJson: '{"client_email":"service@example.invalid","private_key":"unused","token_uri":"https://token.invalid"}',
  trialSheetIdsJson: '{"A":"a","B":"b","C":"c","D":"d"}',
  targetDate: '2026-08-22',
  getToken: async () => 'test-token',
  requestJson,
  retryOptions: { sleep: async () => {}, random: () => 0, logger: () => {}, ...retryOptions },
});

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

  const multipleTables = await fetchPrivateTrialAggregate({ ...options, requestJson: async (url, token) => {
    const text = String(url);
    if (text.includes('/spreadsheets/a?')) return { sheets: [{ properties: { title: '予約', gridProperties: { rowCount: 40 } } }] };
    if (text.includes('/spreadsheets/a/') && text.includes('values:batchGet') && text.includes('A1%3AA40')) {
      const values = [['体験予約日'], ['2026-08-22'], ...Array.from({ length: 28 }, () => []), ['体験予約日'], ['2026-08-22']];
      return { valueRanges: [{ values: new URL(url).searchParams.get('majorDimension') === 'ROWS' ? values : [[...values.map((row) => row[0])]] }] };
    }
    if (text.includes('/spreadsheets/a/') && text.includes('values:batchGet') && text.includes('E1%3AH1') && text.includes('E31%3AH31')) {
      return { valueRanges: [{ values: [['出席確認']] }, { values: [['出席確認']] }] };
    }
    return requestJson(url, token);
  } });
  assert.deepEqual(multipleTables.aggregates, { A: { today: 2 }, B: { today: 1 }, C: { today: 1 }, D: { today: 1 } });
});

test('recovers all four trial aggregates after one B-team Sheets 503 without real waiting', async () => {
  let bAttempts = 0;
  const delays = [];
  const logs = [];
  const result = await fetchPrivateTrialAggregate(testSourceOptions(async (url) => {
    if (String(url).includes('/spreadsheets/b?') && bAttempts++ === 0) throw new Error('GOOGLE_SHEETS_503');
    return successfulTrialRequest(url);
  }, { sleep: async (delay) => delays.push(delay), logger: (message) => logs.push(message) }));

  assert.deepEqual(result.aggregates, { A: { today: 1 }, B: { today: 1 }, C: { today: 1 }, D: { today: 1 } });
  assert.equal(bAttempts, 2);
  assert.deepEqual(delays, [1_000]);
  assert.deepEqual(logs, ['Google Sheets transient read failure: status=503 attempt=1/4; retrying']);
});

test('uses all retry attempts for a repeated B-team 503, then fails closed before writing a snapshot', async () => {
  let bAttempts = 0;
  const delays = [];
  const tempDir = await mkdtemp(join(tmpdir(), 'prospect-savant-retry-'));
  const outputPath = join(tempDir, 'savant-source.json');
  try {
    await assert.rejects(
      () => fetchPrivateSavantSource({
        spreadsheetId: 'savant', outputPath,
        ...testSourceOptions(async (url) => {
          if (String(url).includes('/spreadsheets/b?')) {
            bAttempts += 1;
            throw new Error('GOOGLE_SHEETS_503');
          }
          return successfulTrialRequest(url);
        }, { sleep: async (delay) => delays.push(delay) }),
      }),
      /^Error: TRIAL_SOURCE_UNAVAILABLE_B_GOOGLE_SHEETS_503$/,
    );
    assert.equal(bAttempts, 4);
    assert.deepEqual(delays, [1_000, 2_000, 4_000]);
    await assert.rejects(() => access(outputPath));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('uses the central Savant cutoff for the anonymous trial aggregate', async () => {
  const requests = [];
  const tempDir = await mkdtemp(join(tmpdir(), 'prospect-savant-source-date-'));
  try {
    await fetchPrivateSavantSource({
      spreadsheetId: 'savant', outputPath: join(tempDir, 'savant-source.json'),
      ...testSourceOptions(async (url) => {
        requests.push(new URL(url));
        return successfulTrialRequest(url);
      }),
    });
    const privateSource = JSON.parse(await readFile(join(tempDir, 'savant-source.json'), 'utf8'));
    assert.equal(privateSource.trialAggregate.targetDate, '2026-08-21');
    const dateReads = requests.filter((url) => url.pathname.endsWith('/values:batchGet') && url.searchParams.getAll('ranges')[0] === "'予約'!A1:A4");
    assert.equal(dateReads.length, 8);
    assert.equal(dateReads.filter((url) => url.searchParams.get('majorDimension') === 'COLUMNS').length, 4);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('does not retry a B-team 403', async () => {
  let bAttempts = 0;
  const delays = [];
  await assert.rejects(
    () => fetchPrivateTrialAggregate(testSourceOptions(async (url) => {
      if (String(url).includes('/spreadsheets/b?')) {
        bAttempts += 1;
        throw new Error('GOOGLE_SHEETS_403');
      }
      return successfulTrialRequest(url);
    }, { sleep: async (delay) => delays.push(delay) })),
    /^Error: TRIAL_SOURCE_UNAVAILABLE_B_GOOGLE_SHEETS_403$/,
  );
  assert.equal(bAttempts, 1);
  assert.deepEqual(delays, []);
});

test('retries attempt-local timeout and network failures without exposing a request URL', async () => {
  const signals = [];
  let attempts = 0;
  const requestJson = (url, token) => googleJson(url, token, {
    fetchImpl: async (_url, options) => {
      signals.push(options.signal);
      attempts += 1;
      if (attempts === 1) {
        const error = new Error('timed out');
        error.name = 'TimeoutError';
        throw error;
      }
      if (attempts === 2) return { ok: true, json: async () => { throw new TypeError('body connection lost'); }, headers: new Headers() };
      return { ok: true, json: async () => ({ ok: true }), headers: new Headers() };
    },
  });
  const delays = [];
  const result = await createRetriableGoogleJson({ requestJson, sleep: async (delay) => delays.push(delay), random: () => 0, logger: () => {} })('https://sheets.invalid/private-id', 'token');
  assert.deepEqual(result, { ok: true });
  assert.equal(attempts, 3);
  assert.deepEqual(delays, [1_000, 2_000]);
  assert.notEqual(signals[0], signals[1]);

  let quotaAttempts = 0;
  const quotaDelays = [];
  await createRetriableGoogleJson({
    requestJson: (url, token) => googleJson(url, token, {
      fetchImpl: async () => {
        quotaAttempts += 1;
        if (quotaAttempts === 1) return { ok: false, status: 429, headers: new Headers({ 'retry-after': '4' }) };
        return { ok: true, json: async () => ({ ok: true }), headers: new Headers() };
      },
    }),
    sleep: async (delay) => quotaDelays.push(delay), random: () => 0, logger: () => {},
  })('https://sheets.invalid/private-id', 'token');
  assert.equal(quotaAttempts, 2);
  assert.deepEqual(quotaDelays, [4_000]);

  await assert.rejects(
    () => googleJson('https://sheets.invalid/private-id', 'token', {
      fetchImpl: async () => ({ ok: true, json: async () => { throw new SyntaxError('private response fragment'); }, headers: new Headers() }),
    }),
    (error) => error.message === 'GOOGLE_SHEETS_RESPONSE_INVALID' && !error.message.includes('private'),
  );

  await assert.rejects(
    () => fetchPrivateTrialAggregate(testSourceOptions(async (url) => {
      if (String(url).includes('/spreadsheets/b?')) throw new Error('GOOGLE_SHEETS_NETWORK');
      return successfulTrialRequest(url);
    })),
    (error) => error.message === 'TRIAL_SOURCE_UNAVAILABLE_B_GOOGLE_SHEETS_NETWORK' && !error.message.includes('private-id'),
  );
});


test('a changing anonymous source is reread at most three times and never written', async () => {
  const dir=await mkdtemp(join(tmpdir(),'savant-changing-'));let fullReads=0;
  try {
    await assert.rejects(()=>fetchPrivateSavantSource({spreadsheetId:'savant',outputPath:join(dir,'source.json'),...testSourceOptions(async url=>{
      const result=successfulTrialRequest(url);
      if(new URL(url).pathname.includes('/spreadsheets/savant/values:batchGet')) {
        fullReads++;
        if(fullReads%2===0) result.valueRanges[0].values[4][0]++;
      }
      return result;
    })}),/MEMBER_SOURCE_CHANGED_DURING_READ/);
    assert.equal(fullReads,6);await assert.rejects(()=>access(join(dir,'source.json')));
  } finally {await rm(dir,{recursive:true,force:true})}
});
