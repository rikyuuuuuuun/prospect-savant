import { createSign } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { aggregateTeam, discoverTrialSchema, fiscalYearFor, parseSheetIds, TEAM_IDS, tokyoDate } from './private-trial-aggregate.mjs';

const RANGES = [
  "'00_ダッシュボード'!A1:H23",
  "'01_チーム比較'!A1:P12",
  "'03_月次集計'!A1:V12",
  "'04_イベント力'!A1:S100",
  "'05_定着力'!A1:R10",
  "'06_入会力（年度）'!A1:H12",
  "'08_家庭継続力'!A1:O31",
  "'09_学齢継続'!A1:J12",
  "'10_定着曲線'!A1:K17",
  "'90_配点設定'!A1:J50",
  "'99_データ品質'!A1:F20",
];

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

async function googleJson(url, token) {
  const response = await fetch(url, { headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`GOOGLE_SHEETS_${response.status}`);
  return response.json();
}

function quotedRange(title, column, endRow) {
  return `'${String(title).replaceAll("'", "''")}'!${column}1:${column}${endRow}`;
}

function firstColumn(values) {
  return Array.isArray(values?.[0]) ? values[0] : [];
}

async function fetchTeamAggregate(team, spreadsheetId, token, targetDate, fiscalYear) {
  const metadata = await googleJson(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets(properties(title,gridProperties(rowCount)))`, token);
  const sheets = metadata.sheets || [];
  if (!sheets.length) throw new Error('SOURCE_SCHEMA_INVALID');
  const headerRanges = sheets.flatMap((sheet) => {
    const title = sheet.properties?.title;
    return [quotedRange(title, 'A', 5), `'${String(title).replaceAll("'", "''")}'!E1:H5`];
  });
  const headerUrl = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchGet`);
  headerUrl.searchParams.set('majorDimension', 'ROWS');
  for (const range of headerRanges) headerUrl.searchParams.append('ranges', range);
  const headers = (await googleJson(headerUrl, token)).valueRanges || [];
  if (headers.length !== headerRanges.length) throw new Error('GOOGLE_SHEETS_INCOMPLETE');
  const schemas = sheets.map((_, index) => discoverTrialSchema(headers[index * 2]?.values, headers[index * 2 + 1]?.values));
  const ranges = sheets.flatMap((sheet, index) => {
    const title = sheet.properties?.title;
    const rowCount = Math.max(1, Number(sheet.properties?.gridProperties?.rowCount) || 1);
    const schema = schemas[index];
    return ['A', schema.attendanceColumn, schema.admissionColumn].map((column) => quotedRange(title, column, rowCount));
  });
  const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchGet`);
  url.searchParams.set('majorDimension', 'COLUMNS');
  url.searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE');
  url.searchParams.set('dateTimeRenderOption', 'SERIAL_NUMBER');
  for (const range of ranges) url.searchParams.append('ranges', range);
  const values = (await googleJson(url, token)).valueRanges || [];
  if (values.length !== ranges.length) throw new Error('GOOGLE_SHEETS_INCOMPLETE');
  const privateColumns = sheets.map((_, index) => ({
    dateColumn: firstColumn(values[index * 3]?.values),
    attendanceColumn: firstColumn(values[index * 3 + 1]?.values),
    admissionColumn: firstColumn(values[index * 3 + 2]?.values),
  }));
  return [team, aggregateTeam({ sheets: privateColumns, targetDate, fiscalYear })];
}

export async function fetchPrivateTrialAggregate({ serviceAccountJson, trialSheetIdsJson, targetDate = tokyoDate() }) {
  const serviceAccount = parseServiceAccount(serviceAccountJson);
  const ids = parseSheetIds(trialSheetIdsJson);
  const fiscalYear = fiscalYearFor(targetDate);
  const token = await getAccessToken(serviceAccount);
  const settled = await Promise.allSettled(TEAM_IDS.map((team) => fetchTeamAggregate(team, ids[team], token, targetDate, fiscalYear)));
  if (settled.some((result) => result.status !== 'fulfilled')) throw new Error('TRIAL_SOURCE_UNAVAILABLE');
  const aggregates = Object.fromEntries(settled.map((result) => result.value));
  return { targetDate, fiscalYear, aggregates };
}

export async function fetchPrivateSavantSource({ spreadsheetId, serviceAccountJson, trialSheetIdsJson, outputPath }) {
  if (!spreadsheetId) throw new Error('SAVANT_SPREADSHEET_ID is required');
  if (!serviceAccountJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is required');
  const serviceAccount = parseServiceAccount(serviceAccountJson);
  const token = await getAccessToken(serviceAccount);
  const params = new URLSearchParams({ majorDimension: 'ROWS', valueRenderOption: 'UNFORMATTED_VALUE' });
  for (const range of RANGES) params.append('ranges', range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchGet?${params}`;
  const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Google Sheets batchGet failed: HTTP ${response.status}`);
  const payload = await response.json();
  const valueRanges = Array.isArray(payload.valueRanges) ? payload.valueRanges : [];
  if (valueRanges.length !== RANGES.length) {
    throw new Error(`expected ${RANGES.length} ranges, received ${valueRanges.length}`);
  }
  if (!trialSheetIdsJson) throw new Error('PROSPECT_TRIAL_SHEET_IDS_JSON is required');
  const trialAggregate = await fetchPrivateTrialAggregate({ serviceAccountJson, trialSheetIdsJson });
  const privateSnapshot = {
    fetchedAt: new Date().toISOString(),
    ranges: Object.fromEntries(valueRanges.map((entry, index) => [RANGES[index], entry.values || []])),
    trialAggregate,
  };
  const absoluteOutput = resolve(outputPath);
  await mkdir(dirname(absoluteOutput), { recursive: true });
  await writeFile(absoluteOutput, `${JSON.stringify(privateSnapshot)}\n`, { mode: 0o600 });
  console.log(`Fetched ${RANGES.length} private Savant ranges successfully.`);
  return { rangeCount: RANGES.length, outputPath: absoluteOutput };
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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
