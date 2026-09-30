import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PULSE_TRIGGER_PATH, isPulseBranchRef, validatePulseBranch } from '../scripts/recovery-watchdog.mjs';

const ref = 'refs/heads/automation/savant-recovery-2026-09-30-0857';

test('pulse branch refs are narrowly matched', () => {
  assert.equal(isPulseBranchRef(ref), true);
  for (const bad of ['refs/heads/main', 'refs/heads/automation/savant-recovery-', 'refs/tags/automation/savant-recovery-x', 'refs/heads/automation/savant-recovery-a/b', 'refs/heads/automation/savant-recovery-a b', undefined]) {
    assert.equal(isPulseBranchRef(bad), false, String(bad));
  }
});

test('a pulse branch may change only the trigger file', () => {
  assert.equal(validatePulseBranch({ ref, changedFiles: [PULSE_TRIGGER_PATH] }), true);
  assert.throws(() => validatePulseBranch({ ref, changedFiles: [] }), /PULSE_BRANCH_DIFF_NOT_TRIGGER_ONLY/);
  assert.throws(() => validatePulseBranch({ ref, changedFiles: [PULSE_TRIGGER_PATH, 'data.js'] }), /PULSE_BRANCH_DIFF_NOT_TRIGGER_ONLY/);
  assert.throws(() => validatePulseBranch({ ref, changedFiles: ['.github/workflows/daily-savant-recovery.yml'] }), /PULSE_BRANCH_DIFF_NOT_TRIGGER_ONLY/);
  assert.throws(() => validatePulseBranch({ ref: 'refs/heads/main', changedFiles: [PULSE_TRIGGER_PATH] }), /PULSE_BRANCH_REF_INVALID/);
});

test('recovery workflow listens to pulse branches and never forces from a push', () => {
  const workflow = readFileSync('.github/workflows/daily-savant-recovery.yml', 'utf8');
  assert.ok(workflow.includes("- 'automation/savant-recovery-*'"));
  assert.ok(workflow.includes('validatePulseBranch'));
  assert.ok(workflow.includes("FORCE_RECOVERY: ${{ inputs.force == true }}"));
  assert.ok(workflow.includes("ref: 'main'"), 'publisher must be dispatched on main');
});
