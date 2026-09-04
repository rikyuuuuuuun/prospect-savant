import { appendFile, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { tokyoDate } from './daily-publication-gate.mjs';

export function evaluateSourceFreshness(source, { targetDate = tokyoDate(), now = new Date() } = {}) {
  const clock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now);
  const asOf = source?.trialAggregate?.targetDate || '';
  if (asOf && !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) throw new Error('SOURCE_ASOF_INVALID');
  if (asOf > targetDate) throw new Error('SOURCE_ASOF_FUTURE');
  const ready = asOf === targetDate && source?.readiness?.ready !== false;
  const waiting = source?.readiness?.reason === 'MEMBER_SYNC_PENDING' || (asOf && asOf < targetDate);
  if (!ready && !waiting) throw new Error('SOURCE_READINESS_INVALID');
  return { sourceAsOf: asOf, targetDate, ready, action: ready ? 'generate-candidate' : 'waiting-for-source', errorCode: !ready && clock >= '09:30' ? 'DAILY_SOURCE_DEADLINE_MISSED' : null };
}

async function main() {
  const source = JSON.parse(await readFile(process.argv[2] || '.private/savant-source.json', 'utf8'));
  const result = evaluateSourceFreshness(source, { targetDate: process.env.TARGET_DATE });
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `source_as_of=${result.sourceAsOf}\nsource_is_current=${result.ready}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `## Source readiness\nTarget: ${result.targetDate}\nSource: ${result.sourceAsOf || 'pending'}\nAction: ${result.action}\n${result.errorCode || ''}\n`);
  if (result.errorCode) throw new Error(result.errorCode);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(e => { console.error(e.message); process.exitCode = 1; });
