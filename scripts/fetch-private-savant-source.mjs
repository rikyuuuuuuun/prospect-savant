import { createSign } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

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

async function getAccessToken(serviceAccount) {
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

export async function fetchPrivateSavantSource({ spreadsheetId, serviceAccountJson, outputPath }) {
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
  const privateSnapshot = {
    fetchedAt: new Date().toISOString(),
    ranges: Object.fromEntries(valueRanges.map((entry, index) => [RANGES[index], entry.values || []])),
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
    outputPath,
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
