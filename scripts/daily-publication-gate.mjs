import { appendFile, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const PRIMARY_SCHEDULE = '30 7 * * *';
export const FALLBACK_SCHEDULE = '45 8 * * *';

function assert(condition, code) {
  if (!condition) throw new Error(code);
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

export function tokyoDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function publicationTrigger({ eventName, schedule }) {
  if (eventName === 'workflow_dispatch') return 'workflow-dispatch';
  if (eventName !== 'schedule') return eventName || 'unknown';
  if (schedule === PRIMARY_SCHEDULE) return 'schedule-primary';
  if (schedule === FALLBACK_SCHEDULE) return 'schedule-fallback';
  return 'schedule-other';
}

export function evaluateDailyPublicationGate({ eventName, schedule, currentPublishedAsOf, targetDate = tokyoDate() }) {
  assert(isIsoDate(currentPublishedAsOf), 'PUBLIC_SNAPSHOT_ASOF_INVALID');
  assert(isIsoDate(targetDate), 'DAILY_PUBLICATION_TARGET_DATE_INVALID');
  const trigger = publicationTrigger({ eventName, schedule });
  if (eventName !== 'schedule') {
    return { trigger, targetDate, currentPublishedAsOf, action: 'publish-required', shouldFetchSource: true };
  }
  if (currentPublishedAsOf === targetDate) {
    return { trigger, targetDate, currentPublishedAsOf, action: 'skipped-already-current', shouldFetchSource: false };
  }
  if (currentPublishedAsOf > targetDate) {
    return { trigger, targetDate, currentPublishedAsOf, action: 'failed-future-snapshot', shouldFetchSource: false, errorCode: 'PUBLIC_SNAPSHOT_FUTURE_ASOF' };
  }
  return { trigger, targetDate, currentPublishedAsOf, action: 'publish-required', shouldFetchSource: true };
}

export function validateScheduledCandidateAsOf({ eventName, candidateAsOf, targetDate }) {
  assert(isIsoDate(candidateAsOf), 'CANDIDATE_ASOF_INVALID');
  if (eventName === 'schedule') assert(candidateAsOf === targetDate, 'CANDIDATE_ASOF_TARGET_DATE_MISMATCH');
}

export async function readDailyPublicationGate({ manifestPath, eventName, schedule, now }) {
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch {
    throw new Error('PUBLIC_SNAPSHOT_MANIFEST_INVALID');
  }
  return evaluateDailyPublicationGate({ eventName, schedule, currentPublishedAsOf: manifest?.asOf, targetDate: tokyoDate(now) });
}

export function gateSummary(result) {
  return [
    '## Daily Savant publication gate',
    `trigger: ${result.trigger}`,
    `targetDate: ${result.targetDate}`,
    `currentPublishedAsOf: ${result.currentPublishedAsOf}`,
    `action: ${result.action}`,
    '',
  ].join('\n');
}

async function writeGitHubOutputs(result) {
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, [
      `should_fetch_source=${result.shouldFetchSource}`,
      `target_date=${result.targetDate}`,
      `current_published_as_of=${result.currentPublishedAsOf}`,
      `trigger=${result.trigger}`,
      `action=${result.action}`,
      '',
    ].join('\n'));
  }
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, gateSummary(result));
}

async function main() {
  const result = await readDailyPublicationGate({
    manifestPath: process.argv[2] || 'snapshot-manifest.json',
    eventName: process.env.GITHUB_EVENT_NAME,
    schedule: process.env.GITHUB_EVENT_SCHEDULE,
  });
  await writeGitHubOutputs(result);
  if (result.errorCode) throw new Error(result.errorCode);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
