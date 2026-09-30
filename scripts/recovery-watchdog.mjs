export function needsRecovery({ currentAsOf, targetDate, force = false }) {
  const valid = v => /^\d{4}-\d{2}-\d{2}$/.test(v || '') && !Number.isNaN(Date.parse(`${v}T00:00:00Z`)) && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;
  if (!valid(currentAsOf) || !valid(targetDate)) throw new Error('RECOVERY_DATE_INVALID');
  if (currentAsOf > targetDate) throw new Error('PUBLIC_SNAPSHOT_FUTURE_ASOF');
  return force || currentAsOf < targetDate;
}

// Poll the uniquely named child, not the latest unrelated successful workflow.
// 360 x 15s = 90 min: the publisher may wait up to 60 min for upstream readiness.
export async function waitForRecovery({ listRuns, sleep, requestId, attempts = 360 }) {
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

// GPT watchdog pulse without PR/merge: a branch named like this, differing from main only
// in the trigger file, starts the recovery workflow. Publishing still runs on main.
export const PULSE_BRANCH_PREFIX = 'refs/heads/automation/savant-recovery-';
export const PULSE_TRIGGER_PATH = '.github/savant-recovery-trigger';
const PULSE_REF = /^refs\/heads\/automation\/savant-recovery-[0-9A-Za-z._-]{1,80}$/;

export function isPulseBranchRef(ref) {
  return typeof ref === 'string' && PULSE_REF.test(ref);
}

// Fail closed: any file other than the trigger (or an empty diff) means this is not a pulse.
export function validatePulseBranch({ ref, changedFiles }) {
  if (!isPulseBranchRef(ref)) throw new Error('PULSE_BRANCH_REF_INVALID');
  if (!Array.isArray(changedFiles) || changedFiles.length !== 1 || changedFiles[0] !== PULSE_TRIGGER_PATH) {
    throw new Error('PULSE_BRANCH_DIFF_NOT_TRIGGER_ONLY');
  }
  return true;
}
