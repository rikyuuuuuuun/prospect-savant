import { appendFile, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { fetchPrivateSavantSource } from './fetch-private-savant-source.mjs';
import { evaluateSourceFreshness } from './source-freshness-gate.mjs';

const TRANSIENT_SOURCE_ERROR = /^GOOGLE_SHEETS_(?:429|5\d\d|TIMEOUT|NETWORK)$/;

// Waiting never accepts a blocked source: the full capture and freshness checks must pass.
export async function waitForPrivateSource({ capture, probe, waitMinutes = 0, now = Date.now, sleep = ms => new Promise(r => setTimeout(r, ms)), logger = console.log }) {
  if (!Number.isFinite(waitMinutes) || waitMinutes < 0 || waitMinutes > 60) throw Error('SOURCE_WAIT_WINDOW_INVALID');
  const deadline = now() + waitMinutes * 60000;
  let attempts = 0;
  for (;;) {
    attempts++;
    let blocked;
    let detail = '';
    try {
      const source = await capture();
      const result = probe(source);
      if (result.ready) return { attempts, ready: true };
      // Anonymous diagnostics only: the source date and the upstream pending reason code.
      detail = `; sourceAsOf=${result.sourceAsOf || 'pending'} reason=${result.pendingReason || 'unknown'}`;
    } catch (error) {
      // R5 can lag the daily source refresh, and an exhausted transient Sheets read (quota 429,
      // 5xx, timeout) is retried on the next cycle. All other quality/schema errors stop immediately.
      if (error.message !== 'SOURCE_QUALITY_BLOCKED_R5' && !TRANSIENT_SOURCE_ERROR.test(error.message)) throw error;
      blocked = error;
      detail = `; reason=${error.message}`;
    }
    if (now() + 300000 > deadline) {
      if (blocked) throw blocked;
      logger(`Source not ready (attempt ${attempts}${detail}); wait window exhausted`);
      return { attempts, ready: false };
    }
    logger(`Source not ready (attempt ${attempts}${detail}); retrying in 5 minutes`);
    await sleep(300000);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  waitForPrivateSource({
    waitMinutes: Number(process.env.SOURCE_WAIT_MINUTES || '0'),
    capture: async () => { await fetchPrivateSavantSource({ spreadsheetId: process.env.SAVANT_SPREADSHEET_ID, serviceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON, trialSheetIdsJson: process.env.PROSPECT_TRIAL_SHEET_IDS_JSON, outputPath: process.argv[2] || '.private/savant-source.json' }); return JSON.parse(await readFile(process.argv[2] || '.private/savant-source.json', 'utf8')); },
    probe: source => evaluateSourceFreshness(source, { targetDate: process.env.TARGET_DATE }),
  }).then(async result => {
    if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `sourceAttempts: ${result.attempts}\n`);
  }).catch(error => { console.error(error.message); process.exitCode = 1; });
}
