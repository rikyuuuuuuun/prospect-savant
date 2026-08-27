import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { FALLBACK_SCHEDULE, PRIMARY_SCHEDULE, evaluateDailyPublicationGate, publicationTrigger, tokyoDate, validateScheduledCandidateAsOf } from '../scripts/daily-publication-gate.mjs';

const scheduledGate = (schedule, currentPublishedAsOf) => evaluateDailyPublicationGate({
  eventName: 'schedule', schedule, currentPublishedAsOf, targetDate: '2026-08-27',
});

test('Tokyo date does not depend on the runner timezone', () => {
  assert.equal(tokyoDate(new Date('2026-08-26T15:31:00.000Z')), '2026-08-27');
});

test('scheduled primary skips before source reads when the public snapshot is current', () => {
  assert.deepEqual(scheduledGate(PRIMARY_SCHEDULE, '2026-08-27'), {
    trigger: 'schedule-primary', targetDate: '2026-08-27', currentPublishedAsOf: '2026-08-27',
    action: 'skipped-already-current', shouldFetchSource: false,
  });
});

test('scheduled stale snapshot requires the normal publish pipeline', () => {
  const result = scheduledGate(PRIMARY_SCHEDULE, '2026-08-26');
  assert.equal(result.action, 'publish-required');
  assert.equal(result.shouldFetchSource, true);
});

test('scheduled future snapshot fails closed before source reads', () => {
  assert.deepEqual(scheduledGate(PRIMARY_SCHEDULE, '2026-08-28'), {
    trigger: 'schedule-primary', targetDate: '2026-08-27', currentPublishedAsOf: '2026-08-28',
    action: 'failed-future-snapshot', shouldFetchSource: false, errorCode: 'PUBLIC_SNAPSHOT_FUTURE_ASOF',
  });
});

test('manual dispatch remains a full dry-run path even with a current snapshot', () => {
  const result = evaluateDailyPublicationGate({
    eventName: 'workflow_dispatch', currentPublishedAsOf: '2026-08-27', targetDate: '2026-08-27',
  });
  assert.equal(result.trigger, 'workflow-dispatch');
  assert.equal(result.action, 'publish-required');
  assert.equal(result.shouldFetchSource, true);
});

test('both fallback after primary and delayed primary after fallback are safe no-ops', () => {
  for (const schedule of [PRIMARY_SCHEDULE, FALLBACK_SCHEDULE]) {
    const result = scheduledGate(schedule, '2026-08-27');
    assert.equal(result.action, 'skipped-already-current');
    assert.equal(result.shouldFetchSource, false);
  }
  assert.equal(publicationTrigger({ eventName: 'schedule', schedule: FALLBACK_SCHEDULE }), 'schedule-fallback');
});

test('scheduled candidates must match the Tokyo target date, while manual diagnostics remain allowed', () => {
  assert.throws(() => validateScheduledCandidateAsOf({ eventName: 'schedule', candidateAsOf: '2026-08-26', targetDate: '2026-08-27' }), /CANDIDATE_ASOF_TARGET_DATE_MISMATCH/);
  assert.doesNotThrow(() => validateScheduledCandidateAsOf({ eventName: 'workflow_dispatch', candidateAsOf: '2026-08-26', targetDate: '2026-08-27' }));
});

test('can import the gate from stdin-style ESM without invoking its CLI entry point', () => {
  const moduleUrl = pathToFileURL(resolve('scripts/daily-publication-gate.mjs')).href;
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', `import ${JSON.stringify(moduleUrl)};`], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});
