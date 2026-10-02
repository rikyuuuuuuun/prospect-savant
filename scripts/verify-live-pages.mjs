import { readFile, appendFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { buildSavantBundle, staffRedirectHtml } from './build-staff-pages.mjs';

export const PAGES_URL = 'https://rikyuuuuuuun.github.io/prospect-savant/';
export const SNAPSHOT_FILES = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'snapshot-manifest.json', 'trial-data.js', 'trial-manifest.json'];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

// Compare actual HTTP bytes with one locally validated deployment, including the UI bundle.
export async function verifyLivePages({ root = '.', baseUrl = PAGES_URL, fetchImpl = fetch, expectedAsOf, attempts = 12, sleep = ms => new Promise(r => setTimeout(r, ms)) } = {}) {
  const bundle = await buildSavantBundle(root);
  if (expectedAsOf && bundle.asOf !== expectedAsOf) throw Error('LIVE_EXPECTED_ASOF_MISMATCH');
  const expected = new Map(await Promise.all(SNAPSHOT_FILES.map(async file => [file, await readFile(join(root, file))])));
  expected.set('index.html', Buffer.from(staffRedirectHtml()));
  expected.set('savant-bundle.json', Buffer.from(JSON.stringify(bundle)));
  let failure;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await Promise.all([...expected].map(async ([file, bytes]) => {
        const url = new URL(file, baseUrl);
        url.searchParams.set('verify', `${bundle.snapshotId}-${attempt}-${Date.now()}`);
        let response;
        try { response = await fetchImpl(url, { signal: AbortSignal.timeout(15000), cache: 'no-store' }); }
        catch { throw Error(`LIVE_HTTP_UNAVAILABLE:${file}`); }
        if (!response.ok) throw Error(`LIVE_HTTP_${response.status}:${file}`);
        let actual;
        try { actual = Buffer.from(await response.arrayBuffer()); }
        catch { throw Error(`LIVE_HTTP_BODY_FAILED:${file}`); }
        if (digest(actual) !== digest(bytes)) throw Error(`LIVE_HASH_MISMATCH:${file}`);
      }));
      return { asOf: bundle.asOf, snapshotId: bundle.snapshotId, publicFilesMatched: 7, bundleMatched: true, entryMatched: true, attempts: attempt };
    } catch (error) {
      failure = error;
      if (attempt < attempts) await sleep(10000);
    }
  }
  throw failure;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  verifyLivePages({ root: resolve(process.argv[2] || '.'), expectedAsOf: process.env.EXPECTED_AS_OF })
    .then(async result => {
      const summary = `CURRENT_DAY_VERIFIED asOf=${result.asOf} files=${result.publicFilesMatched}/7 bundle=true entry=true attempts=${result.attempts}`;
      console.log(summary);
      if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
    }).catch(error => { console.error(error.message); process.exitCode = 1; });
}
