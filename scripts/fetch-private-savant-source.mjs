import { MEMBER_READBACK_RANGE, MEMBER_GATE_RANGE, readMemberReceipt, assertMemberSourceReadback, validateSourceQuality } from './source-member-readback.mjs';
import { createSign } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { aggregateTeam, discoverDailyTrialSchema, fiscalYearFor, normalise, parseSheetIds, serialToIsoDate, TEAM_IDS, tokyoDate } from './private-trial-aggregate.mjs';

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

export async function getAccessToken(serviceAccount) {
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

  const response = await fetch(serviceAccount.token_uri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!response.ok) throw new Error(`Google OAuth token exchange failed: HTTP ${response.status}`);
  const body = await response.json();
  if (!body.access_token) throw new Error('Google OAuth response did not contain access_token');
  return body.access_token;
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

export async function googleJson(url, token, { fetchImpl = fetch, timeoutMs = GOOGLE_SHEETS_TIMEOUT_MS } = {}) {
  const signal = AbortSignal.timeout(timeoutMs);
  try {
    // AbortSignalはattemptごとに生成する。retry後のreadを最初のtimeoutで中断させない。
    const response = await fetchImpl(url, { headers: { authorization: `Bearer ${token}` }, signal });
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

function firstColumn(values) {
  return Array.isArray(values?.[0]) ? values[0] : [];
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
  const match = message.match(/^(GOOGLE_SHEETS_\d+|GOOGLE_SHEETS_TIMEOUT|GOOGLE_SHEETS_NETWORK|GOOGLE_SHEETS_RESPONSE_INVALID|GOOGLE_SHEETS_INCOMPLETE|SOURCE_SCHEMA_INVALID)$/);
  return match ? match[1] : 'UNKNOWN';
}

function dateHeaderRows(values) {
  return (values || []).flatMap((row, index) => ['体験予約日', '体験日'].includes(normalise(row?.[0])) ? [index + 1] : []);
}

async function fetchTeamAggregate(team, spreadsheetId, token, targetDate, requestJson) {
  const metadata = await requestJson(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets(properties(title,gridProperties(rowCount)))`, token);
  const sheets = metadata.sheets || [];
  if (!sheets.length) throw new Error('SOURCE_SCHEMA_INVALID');
  // A列は予約日だけで、後段の当日集計でも全行を読む。全体を検査して重複見出しをfail-closedにする。
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
  const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchGet`);
  url.searchParams.set('majorDimension', 'COLUMNS');
  url.searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE');
  url.searchParams.set('dateTimeRenderOption', 'SERIAL_NUMBER');
  for (const range of ranges) url.searchParams.append('ranges', range);
  const values = (await requestJson(url, token)).valueRanges || [];
  if (values.length !== ranges.length) throw new Error('GOOGLE_SHEETS_INCOMPLETE');
  const privateColumns = schemas.map((schema, index) => ({
    dateColumn: firstColumn(values[index]?.values),
    headerRow: schema.headerRow,
  }));
  return [team, aggregateTeam({ sheets: privateColumns, targetDate })];
}

export async function fetchPrivateTrialAggregate({ serviceAccountJson, trialSheetIdsJson, targetDate = tokyoDate(), getToken = getAccessToken, requestJson = googleJson, retryOptions }) {
  const serviceAccount = parseServiceAccount(serviceAccountJson);
  const ids = parseSheetIds(trialSheetIdsJson);
  const fiscalYear = fiscalYearFor(targetDate);
  const token = await getToken(serviceAccount);
  const retriableRequestJson = createRetriableGoogleJson({ requestJson, ...retryOptions });
  const settled = await Promise.allSettled(TEAM_IDS.map((team) => fetchTeamAggregate(team, ids[team], token, targetDate, retriableRequestJson)));
  const failures = settled.flatMap((result, index) => result.status === 'rejected' ? [`${TEAM_IDS[index]}_${safeTrialFailureCode(result.reason)}`] : []);
  if (failures.length) throw new Error(`TRIAL_SOURCE_UNAVAILABLE_${failures.join('_')}`);
  const aggregates = Object.fromEntries(settled.map((result) => result.value));
  return { targetDate, fiscalYear, aggregates };
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
  const trialAggregate = await fetchPrivateTrialAggregate({ serviceAccountJson, trialSheetIdsJson, targetDate: asOf, getToken, requestJson, retryOptions });
  const privateSnapshot = {
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
  return { rangeCount: RANGES.length, outputPath: absoluteOutput };
}

export async function fetchPrivateSavantSource(options) {
  const sleep = options.retryOptions?.sleep || wait;
  const retryable = new Set(['MEMBER_SOURCE_CHANGED_DURING_READ', 'MEMBER_SOURCE_DATE_MISMATCH', 'MEMBER_GATE_DATE_CONFLICT', 'MEMBER_GATE_COUNT_CONFLICT']);
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
