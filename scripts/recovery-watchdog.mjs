export function needsRecovery({ currentAsOf, targetDate, force = false }) {
  const valid = v => /^\d{4}-\d{2}-\d{2}$/.test(v || '') && !Number.isNaN(Date.parse(`${v}T00:00:00Z`)) && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;
  if (!valid(currentAsOf) || !valid(targetDate)) throw new Error('RECOVERY_DATE_INVALID');
  if (currentAsOf > targetDate) throw new Error('PUBLIC_SNAPSHOT_FUTURE_ASOF');
  return force || currentAsOf < targetDate;
}

// Poll the uniquely named child, not the latest unrelated successful workflow.
export async function waitForRecovery({ listRuns, sleep, requestId, attempts = 220 }) {
  for (let i = 0; i < attempts; i++) {
    const runs = await listRuns();
    const run = runs.find(r => r.display_title === `Savant recovery ${requestId}` && r.event === 'workflow_dispatch' && r.head_branch === 'main');
    if (run?.status === 'completed') {
      if (run.conclusion !== 'success') throw new Error('RECOVERY_PUBLISHER_FAILED');
      return run;
    }
    if (i + 1 < attempts) await sleep(15000);
  }
  throw new Error('RECOVERY_PUBLISHER_TIMEOUT');
}
