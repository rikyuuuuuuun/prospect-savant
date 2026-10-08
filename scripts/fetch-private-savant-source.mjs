import { unavailableDailyTrial, isDailyTrialSourceFailure } from './daily-trial-availability.mjs';
import { captureTrialDispositionSource, aggregateDispositionTrials } from './trial-analytics-disposition.mjs';
import { fetchWithdrawalHistory } from './withdrawal-history.mjs';
import { fetchAdmissionHistory } from './admission-history.mjs';
import { ANNUAL_CONVERSION_RANGE, assertAnnualConversionSource } from './annual-conversion-source.mjs';
import { REFERRAL_RANGE } from './referral-evidence.mjs';
import { MEMBER_READBACK_RANGE, MEMBER_GATE_RANGE, readMemberReceipt, assertMemberSourceReadback, validateSourceQuality } from './source-member-readback.mjs';
import { createSign } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { discoverDailyTrialSchema, fiscalYearFor, normalise, parseSheetIds, serialToIsoDate, TEAM_IDS, tokyoDate } from './private-trial-aggregate.mjs';

const RANGES = [
  "'00_ダッシュボード'!A1:H23",
  "'01_チーム比較'!A1:P12",
  "'03_月次集計'!A1:V12",
  "'04_イベント力'!A1:S100",
  "'05_定着力'!A1:R10",
  "'06_入会力（年度）'!A1:H12",
  "'07_成長力'!P4:W9",
  "'08_家庭継続力'!A1:O31",
  "'09_学齢継続'!A1:J12",
  "'10_定着曲線'!A1:K17",
  "'90_配点設定'!A1:J50",
  "'98_会員マスター連携'!A4:AE9",
  "'99_データ品質'!A1:F20",
  MEMBER_READBACK_RANGE,
  MEMBER_GATE_RANGE,
  REFERRAL_RANGE,
  ANNUAL_CONVERSION_RANGE,
];

const GOOGLE_SHEETS_MAX_ATTEMPTS = 4;
const GOOGLE_SHEETS_TIMEOUT_MS = 15_000;
const GOOGLE_SHEETS_MAX_RETRY_DELAY_MS = 30_000;
const GOOGLE_SHEETS_RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const MONTHLY_AS_OF_RANGE_INDEX = 2;
const MONTHLY_AS_OF_COLUMN_INDEX = 21;

const wait = (milliseconds) => new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function parseServiceAccount(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON');
  }
  for (const key of ['client_email', 'private_key', 'token_uri']) {
    if (!parsed[key]) throw new Error(`service account JSON is missing ${key}`);
  }
  return parsed;
}

export async function getAccessToken(serviceAccount, options = {}) {
  try { return await exchangeAccessToken(serviceAccount, options); }
  catch (error) {
    const code = String(error?.message || '');
    throw new Error(/^GOOGLE_OAUTH_(?:\d{3}|TIMEOUT|NETWORK|RESPONSE_INVALID)$/.test(code) ? code : 'GOOGLE_OAUTH_CREDENTIALS_INVALID');
  }
}

async function exchangeAccessToken(serviceAccount, options) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: serviceAccount.token_uri,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(serviceAccount.private_key, 'base64url');
  const assertion = `${unsigned}.${signature}`;

  const body = await requestOAuthToken(serviceAccount.token_uri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  }, options);
  if (typeof body?.access_token !== 'string' || !body.access_token) throw new Error('GOOGLE_OAUTH_RESPONSE_INVALID');
  return body.access_token;
}

export async function requestOAuthToken(url, requestOptions, { fetchImpl = fetch, timeoutMs = GOOGLE_SHEETS_TIMEOUT_MS, sleep = wait, random = Math.random, logger = console.warn } = {}) {
  try {
    return await createRetriableGoogleJson({
      requestJson: () => googleJson(url, null, { fetchImpl, timeoutMs, requestOptions }),
      sleep, random,
      logger: message => logger(message.replaceAll('Google Sheets', 'Google OAuth').replaceAll('GOOGLE_SHEETS_', 'GOOGLE_OAUTH_')),
    })(url, null);
  } catch (error) {
    throw new Error(String(error.message).replace('GOOGLE_SHEETS_', 'GOOGLE_OAUTH_'));
  }
}

function retryAfterMilliseconds(headers, now = Date.now()) {
  const raw = headers?.get?.('retry-after');
  if (!raw) return null;
  const seconds = Number(raw);
  const milliseconds = Number.isFinite(seconds) ? seconds * 1_000 : Date.parse(raw) - now;
  if (!Number.isFinite(milliseconds)) return null;
  return Math.min(GOOGLE_SHEETS_MAX_RETRY_DELAY_MS, Math.max(0, milliseconds));
}

function sheetsError(code, { retryAfterMs } = {}) {
  const error = new Error(code);
  if (Number.isFinite(retryAfterMs)) error.retryAfterMs = retryAfterMs;
  return error;
}

function transientSheetsFailure(error) {
  const code = String(error?.message || '');
  const status = Number(code.match(/^GOOGLE_SHEETS_(\d{3})$/)?.[1]);
  if (GOOGLE_SHEETS_RETRYABLE_STATUS_CODES.has(status)) return { code, status, retryAfterMs: error.retryAfterMs };
  if (code === 'GOOGLE_SHEETS_TIMEOUT' || code === 'GOOGLE_SHEETS_NETWORK') return { code, status: null, retryAfterMs: null };
  return null;
}

function retryDelayMilliseconds(failure, attempt, random) {
  const initialDelay = failure.status === 429 ? 2_000 : 1_000;
  const exponentialDelay = initialDelay * (2 ** (attempt - 1));
  const jitter = Math.floor(random() * 1_001);
  return Math.min(
    GOOGLE_SHEETS_MAX_RETRY_DELAY_MS,
    Math.max(exponentialDelay + jitter, failure.retryAfterMs || 0),
  );
}

export async function googleJson(url, token, { fetchImpl = fetch, timeoutMs = GOOGLE_SHEETS_TIMEOUT_MS, requestOptions } = {}) {
  const signal = AbortSignal.timeout(timeoutMs);
  try {
    // AbortSignalはattemptごとに生成する。retry後のreadを最初のtimeoutで中断させない。
    const response = await fetchImpl(url, { ...(requestOptions || { headers: { authorization: `Bearer ${token}` } }), signal });
    if (!response.ok) {
      throw sheetsError(`GOOGLE_SHEETS_${response.status}`, { retryAfterMs: retryAfterMilliseconds(response.headers) });
    }
    return await response.json();
  } catch (error) {
    if (String(error?.message || '').startsWith('GOOGLE_SHEETS_')) throw error;
    if (signal.aborted || error?.name === 'TimeoutError' || error?.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') throw sheetsError('GOOGLE_SHEETS_TIMEOUT');
    if (error instanceof TypeError || error?.name === 'TypeError') throw sheetsError('GOOGLE_SHEETS_NETWORK');
    // JSON本文の破損は、URLや本文断片を出さず非retryで停止する。
    throw sheetsError('GOOGLE_SHEETS_RESPONSE_INVALID');
  }
}

export function createRetriableGoogleJson({ requestJson = googleJson, sleep = wait, random = Math.random, logger = console.warn, maxAttempts = GOOGLE_SHEETS_MAX_ATTEMPTS } = {}) {
  return async (url, token) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await requestJson(url, token);
      } catch (error) {
        const failure = transientSheetsFailure(error);
        if (!failure || attempt === maxAttempts) throw error;
        const diagnostic = failure.status === null ? `code=${failure.code}` : `status=${failure.status}`;
        logger(`Google Sheets transient read failure: ${diagnostic} attempt=${attempt}/${maxAttempts}; retrying`);
        await sleep(retryDelayMilliseconds(failure, attempt, random));
      }
    }
    throw new Error('GOOGLE_SHEETS_RETRY_EXHAUSTED');
  };
}

function quotedRange(title, column, endRow) {
  return `'${String(title).replaceAll("'", "''")}'!${column}1:${column}${endRow}`;
}

function sourceAsOf(valueRanges) {
  const monthly = valueRanges[MONTHLY_AS_OF_RANGE_INDEX]?.values || [];
  const rows = monthly.slice(4).filter((row) => TEAM_IDS.includes(row?.[1]));
  const dates = new Set(rows.map((row) => serialToIsoDate(row[MONTHLY_AS_OF_COLUMN_INDEX])));
  if (rows.length !== TEAM_IDS.length || dates.size !== 1 || dates.has(null)) throw new Error('SOURCE_ASOF_INVALID');
  return [...dates][0];
}

function safeTrialFailureCode(error) {
  const message = String(error?.message || '');
  const match = message.match(/^(GOOGLE_SHEETS_\d+|GOOGLE_SHEETS_TIMEOUT|GOOGLE_SHEETS_NETWORK|GOOGLE_SHEETS_RESPONSE_INVALID|GOOGLE_SHEETS_INCOMPLETE|SOURCE_SCHEMA_INVALID|TRIAL_DISPOSITION_[A-Z_]+)$/);
  return match ? match[1] : 'UNKNOWN';
}

function dateHeaderRows(values) {
  return (values || []).flatMap((row, index) => ['体験予約日', '体験日'].includes(normalise(row?.[0])) ? [index + 1] : []);
}

async function fetchTeamTrialSheets(team, spreadsheetId, token, requestJson) {
  const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets(properties(title,gridProperties(rowCount)))`;
  const metadata = await requestJson(metadataUrl, token);
  const sheets = metadata.sheets || [];
  if (!sheets.length || sheets.some(sheet => !sheet.properties?.title || !Number.isSafeInteger(sheet.properties?.gridProperties?.rowCount) || sheet.properties.gridProperties.rowCount < 1 || sheet.properties.gridProperties.rowCount > 50_000)) throw new Error('SOURCE_SCHEMA_INVALID');
  // Discover headers with date-only reads. Later read only A values/notes, never names.
  const headerRanges = sheets.map((sheet) => quotedRange(sheet.properties?.title, 'A', Math.max(1, Number(sheet.properties?.gridProperties?.rowCount) || 1)));
  const headerUrl = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchGet`);
  headerUrl.searchParams.set('majorDimension', 'ROWS');
  for (const range of headerRanges) headerUrl.searchParams.append('ranges', range);
  const headerColumns = (await requestJson(headerUrl, token)).valueRanges || [];
  if (headerColumns.length !== headerRanges.length) throw new Error('GOOGLE_SHEETS_INCOMPLETE');
  const candidates = sheets.flatMap((sheet, index) => dateHeaderRows(headerColumns[index]?.values).map((headerRow) => ({ sheet, headerRow })));
  if (!candidates.length) throw new Error('SOURCE_SCHEMA_INVALID');
  const candidateRanges = candidates.map(({ sheet, headerRow }) => `'${String(sheet.properties?.title).replaceAll("'", "''")}'!E${headerRow}:H${headerRow}`);
  const candidateUrl = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchGet`);
  candidateUrl.searchParams.set('majorDimension', 'ROWS');
  for (const range of candidateRanges) candidateUrl.searchParams.append('ranges', range);
  const candidateHeaders = (await requestJson(candidateUrl, token)).valueRanges || [];
  if (candidateHeaders.length !== candidateRanges.length) throw new Error('GOOGLE_SHEETS_INCOMPLETE');
  const verifiedCandidates = candidates.map((candidate, index) => ({
    ...discoverDailyTrialSchema([['体験予約日']], [candidateHeaders[index]?.values?.[0] || []]),
    ...candidate,
  }));
  const seenSheets = new Set();
  const schemas = verifiedCandidates.filter((candidate) => {
    const key = candidate.sheet.properties?.sheetId ?? candidate.sheet.properties?.title;
    if (seenSheets.has(key)) return false;
    seenSheets.add(key);
    return true;
  });
  const ranges = schemas.map(({ sheet }) => {
    const title = sheet.properties?.title;
    const rowCount = Math.max(1, Number(sheet.properties?.gridProperties?.rowCount) || 1);
    return quotedRange(title, 'A', rowCount);
  });
  const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}`);
  url.searchParams.set('includeGridData', 'true');
  url.searchParams.set('fields', 'sheets(properties(title),data(startRow,startColumn,rowData(values(effectiveValue,note))))');
  for (const range of ranges) url.searchParams.append('ranges', range);
  const capture = async () => {
    const response = await requestJson(url, token);
    if (!Array.isArray(response.sheets) || response.sheets.length !== schemas.length) throw new Error('GOOGLE_SHEETS_INCOMPLETE');
    return schemas.map(schema => {
      const title = schema.sheet.properties.title;
      const matches = response.sheets.filter(sheet => sheet.properties?.title === title);
      if (matches.length !== 1 || !Array.isArray(matches[0].data) || matches[0].data.length !== 1) throw new Error('GOOGLE_SHEETS_INCOMPLETE');
      const grid = matches[0].data[0];
      if ((grid.startRow || 0) !== 0 || (grid.startColumn || 0) !== 0) throw new Error('SOURCE_SCHEMA_INVALID');
      const rows = grid.rowData || [];
      if (!Array.isArray(rows) || rows.length > schema.sheet.properties.gridProperties.rowCount) throw new Error('SOURCE_SCHEMA_INVALID');
      const dateColumn = rows.map(row => {
        const cell = row.values?.[0]?.effectiveValue;
        if (cell?.errorValue || (cell && 'boolValue' in cell)) throw new Error('SOURCE_SCHEMA_INVALID');
        return cell?.numberValue ?? cell?.stringValue ?? '';
      });
      if (!['体験予約日', '体験日'].includes(normalise(dateColumn[schema.headerRow - 1]))) throw new Error('SOURCE_SCHEMA_INVALID');
      return { owner: team, spreadsheetId, title, headerRow: schema.headerRow,
        dateColumn, noteColumn: rows.map(row => row.values?.[0]?.note || '') };
    });
  };
  const sheetsData = await capture();
  return { sheets: sheetsData, readback: async () => {
    if (JSON.stringify(await capture()) !== JSON.stringify(sheetsData) ||
        JSON.stringify(await requestJson(metadataUrl, token)) !== JSON.stringify(metadata) ||
        JSON.stringify((await requestJson(candidateUrl, token)).valueRanges || []) !== JSON.stringify(candidateHeaders)) {
      throw new Error('TRIAL_DISPOSITION_SOURCE_CHANGED_DURING_READ');
    }
  } };
}

export async function fetchPrivateTrialAggregate({ spreadsheetId, serviceAccountJson, trialSheetIdsJson, targetDate = tokyoDate(), getToken = getAccessToken, requestJson = googleJson, retryOptions, allowUnavailable = false }) {
  const serviceAccount = parseServiceAccount(serviceAccountJson);
  const ids = parseSheetIds(trialSheetIdsJson);
  const fiscalYear = fiscalYearFor(targetDate);
  const token = await getToken(serviceAccount);
  const retriableRequestJson = createRetriableGoogleJson({ requestJson, ...retryOptions });
  const disposition = await captureTrialDispositionSource({
    spreadsheetId, token, requestJson: retriableRequestJson, targetDate, allowPending: allowUnavailable,
  });
  if (disposition.pending && !disposition.futurePendingOnly) {
    await disposition.readback();
    return unavailableDailyTrial({ targetDate, fiscalYear, reason: 'TRIAL_SYNC_PENDING' });
  }
  let result;
  try {
    const settled = await Promise.allSettled(TEAM_IDS.map(team => fetchTeamTrialSheets(team, ids[team], token, retriableRequestJson)));
    const failures = settled.flatMap((entry, index) => entry.status === 'rejected' ? [`${TEAM_IDS[index]}_${safeTrialFailureCode(entry.reason)}`] : []);
    if (failures.length) throw new Error(`TRIAL_SOURCE_UNAVAILABLE_${failures.join('_')}`);
    const sources = settled.map(entry => entry.value);
    const aggregate = aggregateDispositionTrials({ sheets: sources.flatMap(source => source.sheets), intakeRows: disposition.intakeRows, targetDate });
    await Promise.all(sources.map(source => source.readback()));
    result = { targetDate, fiscalYear, ...aggregate, quality: disposition.quality };
    if (disposition.futurePendingOnly) {
      result.reservationReadiness = { definition: 'future-reconciliation-pending-v1',
        targetDate, pendingReceipts: disposition.quality.unresolvedEligible };
    }
  } catch (error) {
    if (!allowUnavailable || !isDailyTrialSourceFailure(error)) throw error;
    result = unavailableDailyTrial({ targetDate, fiscalYear, reason: 'TRIAL_DAILY_SOURCE_UNAVAILABLE' });
  }
  // Even a partial publication must prove the canonical cohort stayed unchanged.
  await disposition.readback();
  return result;
}

async function capturePrivateSavantSource({ spreadsheetId, serviceAccountJson, trialSheetIdsJson, outputPath, getToken = getAccessToken, requestJson = googleJson, retryOptions }) {
  if (!spreadsheetId) throw new Error('SAVANT_SPREADSHEET_ID is required');
  if (!serviceAccountJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is required');
  const serviceAccount = parseServiceAccount(serviceAccountJson);
  const token = await getToken(serviceAccount);
  const params = new URLSearchParams({ majorDimension: 'ROWS', valueRenderOption: 'UNFORMATTED_VALUE' });
  for (const range of RANGES) params.append('ranges', range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchGet?${params}`;
  const payload = await createRetriableGoogleJson({ requestJson, ...retryOptions })(url, token);
  const valueRanges = Array.isArray(payload.valueRanges) ? payload.valueRanges : [];
  if (valueRanges.length !== RANGES.length) {
    throw new Error(`expected ${RANGES.length} ranges, received ${valueRanges.length}`);
  }
  if (!trialSheetIdsJson) throw new Error('PROSPECT_TRIAL_SHEET_IDS_JSON is required');
  // 公開する主スナップショットと当日体験値の基準日を混在させない。
  // 中央Savantがまだ更新されていない日は、中央の確定基準日に合わせて取得する。
  const ranges = Object.fromEntries(valueRanges.map((entry, index) => [RANGES[index], entry.values || []]));
  const memberReceipt = readMemberReceipt(ranges[MEMBER_READBACK_RANGE], ranges[MEMBER_GATE_RANGE]);
  if (!memberReceipt.ready) {
    const absoluteOutput = resolve(outputPath);
    await mkdir(dirname(absoluteOutput), { recursive: true });
    await writeFile(absoluteOutput, JSON.stringify({ fetchedAt: new Date().toISOString(), readiness: memberReceipt }), { mode: 0o600 });
    return { rangeCount: RANGES.length, outputPath: absoluteOutput, ready: false };
  }
  validateSourceQuality(ranges["'99_データ品質'!A1:F20"]);
  const asOf = sourceAsOf(valueRanges);
  if (asOf !== memberReceipt.asOf) throw new Error('MEMBER_SOURCE_DATE_MISMATCH');
  assertAnnualConversionSource({ ranges }, asOf);
  const trialAggregate = await fetchPrivateTrialAggregate({ spreadsheetId, serviceAccountJson, trialSheetIdsJson, targetDate: asOf, getToken, requestJson, retryOptions, allowUnavailable: true });
  const admissionHistory = await fetchAdmissionHistory({ spreadsheetId, token, asOf, requestJson: createRetriableGoogleJson({ requestJson, ...retryOptions }) });
  const withdrawalHistory = await fetchWithdrawalHistory({ spreadsheetId, token, asOf, requestJson: createRetriableGoogleJson({ requestJson, ...retryOptions }) });
  const privateSnapshot = {
    withdrawalHistory,
    admissionHistory,
    fetchedAt: new Date().toISOString(),
    ranges,
    trialAggregate,
  };
  assertMemberSourceReadback(privateSnapshot);
  // Re-read the complete anonymous source, not only its date, after the
  // per-team trial requests. A calculation change invalidates the candidate.
  const readback = await createRetriableGoogleJson({ requestJson, ...retryOptions })(url, token);
  const afterRanges = Object.fromEntries((readback.valueRanges || []).map((entry, index) => [RANGES[index], entry.values || []]));
  if (JSON.stringify(afterRanges) !== JSON.stringify(ranges)) throw new Error('MEMBER_SOURCE_CHANGED_DURING_READ');
  const absoluteOutput = resolve(outputPath);
  await mkdir(dirname(absoluteOutput), { recursive: true });
  await writeFile(absoluteOutput, `${JSON.stringify(privateSnapshot)}\n`, { mode: 0o600 });
  console.log(`Fetched ${RANGES.length} private Savant ranges successfully.`);
  if (trialAggregate.status === 'unavailable') console.warn(`TRIAL_DAILY_DEFERRED reason=${trialAggregate.reason}`);
  if (trialAggregate.dailyReceipt?.supersededRows) console.log(`TRIAL_RECEIPT_COPIES_RECONCILED supersededRows=${trialAggregate.dailyReceipt.supersededRows}`);
  return { rangeCount: RANGES.length, outputPath: absoluteOutput };
}

export async function fetchPrivateSavantSource(options) {
  const sleep = options.retryOptions?.sleep || wait;
  const retryable = new Set(['MEMBER_SOURCE_CHANGED_DURING_READ', 'MEMBER_SOURCE_DATE_MISMATCH', 'MEMBER_GATE_DATE_CONFLICT', 'MEMBER_GATE_COUNT_CONFLICT', 'TRIAL_DISPOSITION_SOURCE_CHANGED_DURING_READ', 'TRIAL_DISPOSITION_SOURCE_LINK_CHANGED_DURING_READ']);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try { return await capturePrivateSavantSource(options); }
    catch (error) {
      if (!retryable.has(error.message) || attempt === 3) throw error;
      await sleep(5000);
    }
  }
}

async function main() {
  const outputPath = process.argv[2] || '.private/savant-source.json';
  await fetchPrivateSavantSource({
    spreadsheetId: process.env.SAVANT_SPREADSHEET_ID,
    serviceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    trialSheetIdsJson: process.env.PROSPECT_TRIAL_SHEET_IDS_JSON,
    outputPath,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
