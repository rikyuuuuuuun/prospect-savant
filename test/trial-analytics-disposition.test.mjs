import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateDispositionTrials, assertTrialAnalyticsQuality, buildTrialAnalyticsQuality, buildTrialIntakeIndex, captureTrialDispositionSource, trialAnalyticsDisposition, trialReceiptFromNote } from '../scripts/trial-analytics-disposition.mjs';
import { fetchPrivateTrialAggregate } from '../scripts/fetch-private-savant-source.mjs';
import { centralTrialValueRanges, experienceRow, gridTrialResponse, intakeRow, serial } from './support/trial-disposition.mjs';
const TARGET = '2026-08-22';
const sourceSheet = (rows, { owner = 'A', book = 'a', title = '予約' } = {}) => ({
  owner, spreadsheetId: book, title, headerRow: 1,
  dateColumn: ['体験予約日', ...rows.map(row => row.date ?? serial(TARGET))],
  noteColumn: ['', ...rows.map(row => row.receipt ? `LINE受付ID=${row.receipt}` : row.note || '')],
});
const read = (rows, sheets) => aggregateDispositionTrials({ intakeRows: rows, sheets, targetDate: TARGET });
const disposition = (reason, options = {}) => intakeRow(`FORM-synthetic-${reason.replaceAll("_", "-")}`, { disposition: reason, ...options });

function cohort() {
  const eligible = Array.from({ length: 50 }, (_, n) => intakeRow(`FORM-synthetic-eligible-${n}`));
  const excluded = [...Array.from({ length: 10 }, (_, n) => intakeRow(`FORM-synthetic-test-${n}`, { disposition: 'EXCLUDE_TEST' })),
    ...Array.from({ length: 18 }, (_, n) => intakeRow(`FORM-synthetic-owner-${n}`, { disposition: 'EXCLUDE_OWNER' }))];
  return { intakeRows: [...eligible, ...excluded, disposition('HOLD_UNDATED', { date: '' })], experienceRows: eligible.map(experienceRow) };
}

test('fresh anonymous receipt proves the entire cohort without a production ID allowlist', () => {
  const { intakeRows, experienceRows } = cohort();
  const quality = assertTrialAnalyticsQuality(buildTrialAnalyticsQuality(intakeRows, experienceRows));
  assert.deepEqual(quality, { definition: 'reflected-trial-receipt-disposition-v1', total: 79, pendingWorkflow: 0,
    excludedTest: 10, excludedOwner: 18, pendingDate: 1, eligible: 50, receiptColumnUniqueMatched: 50, receiptNoteConflicts: 0, legacyEvidenceRows: 0, exactUniqueMatched: 50,
    unresolvedEligible: 0, invalidEligibleDate: 0, ambiguousMatches: 0, archivedMatchRows: 0, status: 'READY' });
  assert(!/FORM-|EXP-LINE|予約|spreadsheet|https:|氏名/.test(JSON.stringify(quality)));
});

test('manual rows preserve physical ownership; exact exclusions and still-held valid dates never count', () => {
  const rows = [intakeRow(), disposition('EXCLUDE_TEST'), disposition('EXCLUDE_OWNER', { status: '未処理' }), disposition('HOLD_UNDATED')];
  const result = read(rows, [sourceSheet([{ }, { date: serial('2026-08-21') }, ...rows.map(row => ({ receipt: row[0] }))])]);
  assert.deepEqual(result.aggregates, { A: { today: 2 }, B: { today: 0 }, C: { today: 0 }, D: { today: 0 } });
  assert.deepEqual(result.dailyReceipt, { receiptRows: 4, eligibleRows: 1, excludedRows: 2, pendingRows: 1, manualRows: 2, crossOwnerRows: 0, supersededRows: 0 });
  // Merely adding a date cannot clear the authoritative hold. Only the GAS flow may remove it.
  rows[3][34] = '';
  assert.equal(read(rows, [sourceSheet(rows.map(row => ({ receipt: row[0] })))]).aggregates.A.today, 2);
});

test('receipt-bound effective C/D ownership is symmetric without moving manual rows', () => {
  const rows = [intakeRow('FORM-synthetic-c-in-d', { team: 'C', book: 'd' }), intakeRow('FORM-synthetic-d-in-c', { team: 'D', book: 'c' })];
  const result = read(rows, [sourceSheet([{ receipt: rows[0][0] }, {}], { owner: 'D', book: 'd' }), sourceSheet([{ receipt: rows[1][0] }, {}], { owner: 'C', book: 'c' })]);
  assert.deepEqual(result.aggregates, { A: { today: 0 }, B: { today: 0 }, C: { today: 2 }, D: { today: 2 } });
  assert.equal(result.dailyReceipt.crossOwnerRows, 2);
  rows[0][7] = ' 予約　';
  assert.equal(read(rows, [sourceSheet([{ receipt: rows[0][0] }], { owner: 'D', book: 'd' })]).aggregates.C.today, 1);
});

test('invalid, unsupported, duplicated and copied private markers block instead of disappearing', () => {
  for (const reason of ['EXCLUDE_TEST', 'EXCLUDE_OWNER', 'HOLD_UNDATED']) assert.equal(trialAnalyticsDisposition(disposition(reason)), reason);
  const bad = [
    row => { row[34] = row[34].replace('V1', 'V2'); },
    row => { row[34] = row[34].replace('EXCLUDE_TEST', 'FUTURE_POLICY'); },
    row => { row[34] += row[34]; },
    row => { row[34] += ' PROSPECT_ANALYTICS_DISPOSITION_broken'; },
    row => { row[34] = row[34].slice(0, -1); },
    row => { row[0] = 'FORM-copied-other'; },
    row => { row[11] = '別種別'; },
    row => { row[12] = '別経路'; },
  ];
  for (const mutate of bad) { const row = disposition('EXCLUDE_TEST'); mutate(row); assert.throws(() => buildTrialIntakeIndex([row]), /TRIAL_DISPOSITION_(MARKER_INVALID|RECEIPT_MISMATCH)/); }
  const row = intakeRow();
  assert.throws(() => buildTrialIntakeIndex([row, row]), /RECEIPT_NOT_UNIQUE/);
  assert.equal(trialAnalyticsDisposition(intakeRow('FORM-synthetic-unmarked', { status: '対象外' })), '');
});

test('notes require one complete receipt, and source duplicate, missing receipt, route, team and date conflicts block', () => {
  assert.equal(trialReceiptFromNote('manual note'), '');
  assert.equal(trialReceiptFromNote('LINE受付ID： FORM-synthetic-1'), 'FORM-synthetic-1');
  for (const note of ['LINE受付ID=bad', 'LINE受付ID=FORM-a LINE受付ID=FORM-a', 'LINE受付ID=FORM-a LINE受付ID=broken', 'LINE受付ID=FORM-a_bad']) assert.throws(() => trialReceiptFromNote(note), /NOTE_INVALID/);
  const row = intakeRow();
  assert.throws(() => read([row], [sourceSheet([{ receipt: row[0] }, { receipt: row[0] }])]), /SOURCE_RECEIPT_NOT_UNIQUE/);
  assert.throws(() => read([], [sourceSheet([{ receipt: row[0] }])]), /SOURCE_RECEIPT_UNRESOLVED/);
  for (const [column, value, pattern] of [[4,'Z',/TEAM_INVALID/],[6,'different-book',/ROUTE_MISMATCH/],[7,'different-tab',/ROUTE_MISMATCH/],[14,serial('2026-08-21'),/SOURCE_DATE_MISMATCH/],[23,'未処理',/WORKFLOW_UNRESOLVED/]]) {
    const changed = row.slice(); changed[column] = value;
    assert.throws(() => read([changed], [sourceSheet([{ receipt: row[0] }])]), pattern);
  }
  const excluded = disposition('EXCLUDE_OWNER'); excluded[7] = 'wrong-tab';
  assert.throws(() => read([excluded], [sourceSheet([{ receipt: excluded[0] }])]), /ROUTE_MISMATCH/);
});

test('one canonical date reconciles older receipt copies once, regardless of row order', () => {
  const row = intakeRow();
  const old = { receipt: row[0], date: serial('2026-08-15') };
  const current = { receipt: row[0], date: serial(TARGET) + 0.5 };
  for (const physical of [[current, old, old], [old, current, old], [old, old, current]]) {
    const result = read([row], [sourceSheet([...physical, {}])]);
    assert.equal(result.aggregates.A.today, 2); // one receipt, one unmarked manual row
    assert.equal(result.dailyReceipt.receiptRows, 3);
    assert.equal(result.dailyReceipt.eligibleRows, 1);
    assert.equal(result.dailyReceipt.supersededRows, 2);
    assert(!/FORM-|予約|spreadsheet|https:/.test(JSON.stringify(result)));
    const oldDay = aggregateDispositionTrials({ intakeRows: [row], sheets: [sourceSheet(physical)], targetDate: '2026-08-15' });
    assert.equal(oldDay.aggregates.A.today, 0);
  }
});

test('receipt reconciliation cannot select a latest row, resolve same-day ambiguity or cross routes', () => {
  const row = intakeRow();
  const current = { receipt: row[0] };
  for (const copies of [[current, current], [{ receipt: row[0], date: serial(TARGET) + 0.5 }, current]])
    assert.throws(() => read([row], [sourceSheet(copies)]), /SOURCE_RECEIPT_NOT_UNIQUE/);
  for (const other of [{ receipt: row[0], date: serial('2026-08-23') }, { receipt: row[0], date: '' }, { receipt: row[0], date: '2026-02-30' }])
    assert.throws(() => read([row], [sourceSheet([current, other])]), /SOURCE_DATE_MISMATCH/);
  assert.throws(() => read([row], [sourceSheet([{ receipt: row[0], date: serial('2026-08-15') }])]), /SOURCE_DATE_MISMATCH/);
  assert.throws(() => read([row], [sourceSheet([current]), sourceSheet([{ receipt: row[0], date: serial('2026-08-15') }], { book: 'other' })]), /ROUTE_MISMATCH/);
  for (const reason of ['EXCLUDE_TEST', 'EXCLUDE_OWNER', 'HOLD_UNDATED']) {
    const held = disposition(reason);
    assert.throws(() => read([held], [sourceSheet([{ receipt: held[0] }, { receipt: held[0], date: serial('2026-08-15') }])]), /SOURCE_RECEIPT_NOT_UNIQUE/);
  }
});

test('eligible matching is exact and unique and cannot be overridden with normal quality text', () => {
  const row = intakeRow();
  const exact = experienceRow(row);
  const cases = [[], [exact, exact], [{ ...exact, 3: 'B' }], [{ ...exact, 1: serial('2026-08-21') }], [{ ...exact, 18: 'FORM-synthetic-other' }]];
  for (const matches of cases) assert.throws(() => assertTrialAnalyticsQuality(buildTrialAnalyticsQuality([row], matches)), /QUALITY_BLOCKED/);
  // Auxiliary note/generated keys never admit a manual row without authoritative S.
  const legacy = exact.slice(); legacy[17] = ''; legacy[18] = '';
  assert.throws(() => assertTrialAnalyticsQuality(buildTrialAnalyticsQuality([row], [legacy])), /QUALITY_BLOCKED/);
  const staleNote = exact.slice(); staleNote[17] = 'LINE受付ID=FORM-synthetic-other';
  const warn = assertTrialAnalyticsQuality(buildTrialAnalyticsQuality([row], [staleNote]));
  assert.equal(warn.exactUniqueMatched, 1); assert.equal(warn.receiptNoteConflicts, 1);
  const badDate = row.slice(); badDate[14] = '2026-02-30';
  assert.throws(() => assertTrialAnalyticsQuality(buildTrialAnalyticsQuality([badDate], [exact])), /QUALITY_BLOCKED/);
  for (const reason of ['EXCLUDE_TEST', 'EXCLUDE_OWNER', 'HOLD_UNDATED']) {
    const held = disposition(reason);
    const q = buildTrialAnalyticsQuality([held], [experienceRow(held)]);
    assert.equal(q.archivedMatchRows, 1); assert.throws(() => assertTrialAnalyticsQuality(q), /QUALITY_BLOCKED/);
  }
  const q = buildTrialAnalyticsQuality([row], []); q.status = 'READY';
  assert.throws(() => assertTrialAnalyticsQuality(q), /QUALITY_BLOCKED/);
});

function requestFixture({ intakeRows = [], experienceRows = [], changeReadback = false, changeLink = false } = {}) {
  let centralReads = 0, linkReads = 0;
  return async raw => {
    const url = new URL(raw);
    if (url.searchParams.get('valueRenderOption') === 'FORMULA') {
      linkReads++;
      return { valueRanges: [{ values: [[`=IMPORTRANGE("https://docs.google.com/spreadsheets/d/${changeLink && linkReads > 1 ? 'other' : 'master'}/edit","'12_Savant連携'!A4:AE9")`]] }] };
    }
    if (url.pathname.endsWith('/spreadsheets/master')) return { sheets: ['14_LINE体験受付', '09_体験入会突合'].map(title => ({ properties: { title, gridProperties: { rowCount: 100, columnCount: 36 } } })) };
    if (url.pathname.includes('/spreadsheets/master/')) {
      centralReads++;
      const rows = intakeRows.map(row => row.slice());
      if (changeReadback && centralReads > 1 && rows.length) rows[0][7] = 'changed-private-tab';
      return { valueRanges: centralTrialValueRanges(rows, experienceRows) };
    }
    const team = url.pathname.split('/spreadsheets/')[1].split('/')[0];
    if (url.searchParams.get('includeGridData') === 'true') return team === 'a'
      ? gridTrialResponse(['体験予約日', serial(TARGET), ...intakeRows.map(row => row[14] || '')], ['', '', ...intakeRows.map(row => `LINE受付ID=${row[0]}`)])
      : gridTrialResponse(['体験予約日']);
    if (!url.pathname.endsWith('/values:batchGet')) return { sheets: [{ properties: { title: '予約', gridProperties: { rowCount: 100 } } }] };
    const ranges = url.searchParams.getAll('ranges');
    return { valueRanges: ranges.map(range => ({ values: [[range.includes('E1:H1') ? '出席確認' : '体験予約日']] })) };
  };
}

test('private central reads are column-bounded and detect content/route or canonical-link changes', async () => {
  const row = intakeRow();
  for (const change of [{ changeReadback: true }, { changeLink: true }]) {
    const source = await captureTrialDispositionSource({ spreadsheetId: 'savant', token: 'unused', requestJson: requestFixture({ intakeRows: [row], experienceRows: [experienceRow(row)], ...change }) });
    await assert.rejects(source.readback, /SOURCE_(?:LINK_)?CHANGED_DURING_READ/);
  }
  const requests = [];
  const fixture = requestFixture({ intakeRows: [row], experienceRows: [experienceRow(row)] });
  const source = await captureTrialDispositionSource({ spreadsheetId: 'savant', token: 'unused', requestJson: async url => { requests.push(new URL(url)); return fixture(url); } });
  await source.readback();
  const ranges = requests.filter(url => url.pathname.includes('/spreadsheets/master/')).flatMap(url => url.searchParams.getAll('ranges'));
  assert(ranges.every(range => /!'?(?:A|E|G|H|L|M|O|X|AI|B|D|R|S)4:(?:A|E|G|H|L|M|O|X|AI|B|D|R|S)100$/.test(range)));
  assert(!ranges.some(range => /![CQ]4:/.test(range)));
});

test('full daily fetch applies exclusion policy, validates fresh matches and outputs anonymous receipt only', async () => {
  const intakeRows = [intakeRow(), disposition('EXCLUDE_TEST'), disposition('EXCLUDE_OWNER'), disposition('HOLD_UNDATED')];
  const requests = [];
  const fixture = requestFixture({ intakeRows, experienceRows: [experienceRow(intakeRows[0])] });
  const result = await fetchPrivateTrialAggregate({ spreadsheetId: 'savant', serviceAccountJson: '{"client_email":"service@example.invalid","private_key":"unused","token_uri":"https://token.invalid"}',
    trialSheetIdsJson: '{"A":"a","B":"b","C":"c","D":"d"}', targetDate: TARGET, getToken: async () => 'unused',
    requestJson: async url => { requests.push(new URL(url)); return fixture(url); } });
  assert.deepEqual(result.aggregates, { A: { today: 2 }, B: { today: 0 }, C: { today: 0 }, D: { today: 0 } });
  assert.equal(result.quality.total, 4); assert.equal(result.quality.exactUniqueMatched, 1);
  assert.equal(requests.filter(url => url.searchParams.get('includeGridData') === 'true').length, 8);
  assert(!/FORM-|EXP-LINE|予約|master|savant|spreadsheet|https:/.test(JSON.stringify(result)));
});

test('full daily fetch reconciles historical copies only after fresh 14/09 quality and source readback', async () => {
  const row = intakeRow();
  const options = { spreadsheetId: 'savant', serviceAccountJson: '{"client_email":"service@example.invalid","private_key":"unused","token_uri":"https://token.invalid"}',
    trialSheetIdsJson: '{"A":"a","B":"b","C":"c","D":"d"}', targetDate: TARGET, getToken: async () => 'unused' };
  for (const mismatch of [false, true]) {
    const match = experienceRow(row);
    if (mismatch) match[1] = serial('2026-08-15');
    const fixture = requestFixture({ intakeRows: [row], experienceRows: [match] });
    let teamReads = 0;
    const requestJson = async raw => {
      const url = new URL(raw);
      if (url.pathname.endsWith('/spreadsheets/a') && url.searchParams.get('includeGridData') === 'true') {
        teamReads++;
        return gridTrialResponse(['体験予約日', serial(TARGET), serial('2026-08-15'), serial('2026-08-15')], ['', ...Array(3).fill(`LINE受付ID=${row[0]}`)]);
      }
      return fixture(raw);
    };
    if (mismatch) {
      await assert.rejects(fetchPrivateTrialAggregate({ ...options, requestJson }), /QUALITY_BLOCKED/);
      assert.equal(teamReads, 0);
    } else {
      const result = await fetchPrivateTrialAggregate({ ...options, requestJson });
      assert.equal(result.aggregates.A.today, 1);
      assert.equal(result.dailyReceipt.supersededRows, 2);
      assert.equal(teamReads, 2);
    }
  }
});

test('a source note or date changed during final readback blocks the aggregate', async () => {
  let reads = 0;
  const fixture = requestFixture();
  await assert.rejects(() => fetchPrivateTrialAggregate({ spreadsheetId: 'savant', serviceAccountJson: '{"client_email":"service@example.invalid","private_key":"unused","token_uri":"https://token.invalid"}',
    trialSheetIdsJson: '{"A":"a","B":"b","C":"c","D":"d"}', targetDate: TARGET, getToken: async () => 'unused',
    requestJson: async raw => {
      const url = new URL(raw);
      if (url.pathname.endsWith('/spreadsheets/a') && url.searchParams.get('includeGridData') === 'true' && ++reads > 1) return gridTrialResponse(['体験予約日', serial('2026-08-21')]);
      return fixture(raw);
    } }), /SOURCE_CHANGED_DURING_READ/);
});

test('header drift, missing bounded ranges and oversized grids fail without private diagnostics', async () => {
  for (const change of ['header', 'incomplete', 'grid']) {
    const fixture = requestFixture();
    await assert.rejects(() => captureTrialDispositionSource({ spreadsheetId: 'savant', token: 'unused', requestJson: async raw => {
      const url = new URL(raw); const result = await fixture(raw);
      if (url.pathname.includes('/spreadsheets/master/')) {
        if (change === 'header') result.valueRanges[5].values[0][0] = 'private-changed-header';
        if (change === 'incomplete') result.valueRanges.pop();
      }
      if (url.pathname.endsWith('/spreadsheets/master') && change === 'grid') result.sheets[0].properties.gridProperties.rowCount = 50_001;
      return result;
    } }), error => /^TRIAL_DISPOSITION_(HEADER_INVALID|SOURCE_INCOMPLETE|SOURCE_GRID_INVALID)$/.test(error.message));
  }
});

test('a metadata expansion after the private capture is rejected even if prior rows are unchanged', async () => {
  const fixture = requestFixture(); let metadataReads = 0;
  const source = await captureTrialDispositionSource({ spreadsheetId: 'savant', token: 'unused', requestJson: async raw => {
    const result = await fixture(raw);
    if (new URL(raw).pathname.endsWith('/spreadsheets/master') && ++metadataReads > 1) result.sheets[0].properties.gridProperties.rowCount++;
    return result;
  } });
  await assert.rejects(source.readback, /SOURCE_CHANGED_DURING_READ/);
});

test('pending current and future receipts yield unavailable daily counts without blocking verified history', async () => {
  const options = { spreadsheetId: 'savant', serviceAccountJson: '{"client_email":"service@example.invalid","private_key":"unused","token_uri":"https://token.invalid"}',
    trialSheetIdsJson: '{"A":"a","B":"b","C":"c","D":"d"}', targetDate: TARGET, getToken: async () => 'unused', allowUnavailable: true };
  for (const date of [TARGET, '2026-08-23']) {
    const row = intakeRow('FORM-synthetic-pending', {date});
    const result = await fetchPrivateTrialAggregate({ ...options, requestJson: requestFixture({ intakeRows: [row], experienceRows: [] }) });
    assert.deepEqual(result, { targetDate: TARGET, fiscalYear: '2026', status: 'unavailable', reason: 'TRIAL_SYNC_PENDING', aggregates: null });
    assert(!/FORM-|EXP-LINE|予約|master|savant|https:/.test(JSON.stringify(result)));
    const repaired = await fetchPrivateTrialAggregate({ ...options, requestJson: requestFixture({ intakeRows: [row], experienceRows: [experienceRow(row)] }) });
    assert.equal(repaired.quality.status, 'READY');
    assert.equal(repaired.aggregates.A.today, date === TARGET ? 2 : 1);
  }
  // A second unresolved historical receipt must not be hidden by a newer one.
  const pending = intakeRow('FORM-synthetic-new', {date: TARGET});
  const historical = intakeRow('FORM-synthetic-old', {date: '2026-08-21'});
  const excluded = intakeRow('FORM-synthetic-excluded', {disposition: 'EXCLUDE_TEST'});
  for (const [intakeRows, experienceRows] of [
    [[historical], []],
    [[pending, historical], []],
    [[pending, excluded], [experienceRow(excluded)]],
    [[pending], [experienceRow(pending), experienceRow(pending)]],
    [[pending], [{...experienceRow(pending), 3: 'B'}]],
    [[intakeRow('FORM-synthetic-invalid', {date: ''})], []],
  ]) await assert.rejects(fetchPrivateTrialAggregate({ ...options, requestJson: requestFixture({intakeRows, experienceRows}) }), /QUALITY_BLOCKED/);
  await assert.rejects(fetchPrivateTrialAggregate({ ...options, requestJson: requestFixture({intakeRows: [pending], changeReadback: true}) }), /SOURCE_CHANGED_DURING_READ/);
});

test('verified canonical history permits isolating a daily sheet failure, but never unknown errors', async () => {
  const options = { spreadsheetId: 'savant', serviceAccountJson: '{"client_email":"service@example.invalid","private_key":"unused","token_uri":"https://token.invalid"}',
    trialSheetIdsJson: '{"A":"a","B":"b","C":"c","D":"d"}', targetDate: TARGET, getToken: async () => 'unused',
    allowUnavailable: true, retryOptions: {sleep: async () => {}, logger: () => {}} };
  for (const code of ['GOOGLE_SHEETS_503', 'SOURCE_SCHEMA_INVALID', 'unexpected-private-detail']) {
    const fixture = requestFixture();
    const requestJson = async raw => {
      if (new URL(raw).pathname.endsWith('/spreadsheets/a')) throw new Error(code);
      return fixture(raw);
    };
    if (code === 'unexpected-private-detail') {
      await assert.rejects(fetchPrivateTrialAggregate({...options, requestJson}), /TRIAL_SOURCE_UNAVAILABLE_A_UNKNOWN/);
    } else {
      const result = await fetchPrivateTrialAggregate({...options, requestJson});
      assert.equal(result.status, 'unavailable'); assert.equal(result.aggregates, null);
      assert.equal(result.reason, 'TRIAL_DAILY_SOURCE_UNAVAILABLE');
    }
  }
});
