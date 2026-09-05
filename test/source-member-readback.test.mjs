import test from 'node:test';
import assert from 'node:assert/strict';
import { readMemberReceipt, validateSourceQuality } from '../scripts/source-member-readback.mjs';
import { evaluateSourceFreshness } from '../scripts/source-freshness-gate.mjs';
import { needsRecovery, waitForRecovery } from '../scripts/recovery-watchdog.mjs';
import { verifyOperationalMemberCrossSystem } from '../scripts/verify-operational-member-cross-system.mjs';
import { syntheticMemberReadback, syntheticMemberGate } from './support/member-readback.mjs';

test('live readback preserves legitimate zero and rejects partial blank, total, or missing receipt', () => {
  const rows = syntheticMemberReadback('2026-08-21', { A: 0, B: 2, C: 3, D: 4 }), gate = syntheticMemberGate();
  assert.equal(readMemberReceipt(rows, gate).counts.A, 0);
  const broken = structuredClone(rows); broken[2][1] = '';
  assert.throws(() => readMemberReceipt(broken, gate), /MEMBER_COUNT_INVALID_A/);
  broken[2][1] = 0; broken[6][1] = 0;
  assert.throws(() => readMemberReceipt(broken, gate), /MEMBER_TOTAL_MISMATCH/);
  assert.throws(() => readMemberReceipt(undefined, gate), /MEMBER_READBACK_MISSING/);
  rows[3][7] = '';
  assert.throws(() => readMemberReceipt(rows, gate), /MEMBER_PROVENANCE_MISSING/);
});

test('only incomplete daily sync is pending; data defects are not relabelled as pending', () => {
  const rows = syntheticMemberReadback(), gate = syntheticMemberGate();
  for (let i = 2; i < 6; i++) rows[i][1] = '';
  rows[2][7] = '';
  gate[8][1] = 'BLOCKED_SYNC_NOT_COMPLETE';
  assert.deepEqual(readMemberReceipt(rows, gate), { ready: false, reason: 'MEMBER_SYNC_PENDING' });
  gate[8][1] = 'BLOCKED_UNKNOWN_CONFLICT';
  assert.throws(() => readMemberReceipt(rows, gate), /MEMBER_SOURCE_BLOCKED/);
});

test('quality diagnostics identify a row without logging its private contents', () => {
  const rows = [[], [], [], [], ['private person', '', '', '', '', '要確認']];
  assert.throws(() => validateSourceQuality(rows), /^Error: SOURCE_QUALITY_BLOCKED_R5$/);
});

test('sync wait retains prior publication before deadline and fails after deadline', () => {
  const source = { readiness: { ready: false, reason: 'MEMBER_SYNC_PENDING' } };
  assert.equal(evaluateSourceFreshness(source, { targetDate: '2026-09-05', now: new Date('2026-09-04T22:30Z') }).errorCode, null);
  assert.equal(evaluateSourceFreshness(source, { targetDate: '2026-09-05', now: new Date('2026-09-05T00:30Z') }).errorCode, 'DAILY_SOURCE_DEADLINE_MISSED');
  assert.throws(() => evaluateSourceFreshness({ trialAggregate: { targetDate: '2026-09-06' } }, {targetDate: '2026-09-05'}), /FUTURE/);
});

test('local projections alone cannot pass cross-system verification', async () => {
  await assert.rejects(() => verifyOperationalMemberCrossSystem({ input: {}, rootDir: '.' }), /live Sheets readback is required/);
});

test('ordinary recovery pulses are idempotent; force requires explicit input', () => {
  const args = {currentAsOf:'2026-09-05',targetDate:'2026-09-05'};
  assert.equal(needsRecovery(args), false);
  assert.equal(needsRecovery({...args,force:true}), true);
  assert.throws(() => needsRecovery({...args,currentAsOf:'2026-09-06'}), /FUTURE/);
});

test('watchdog verifies its own publisher and propagates failure or timeout', async () => {
  const run = { display_title:'Savant recovery test',event:'workflow_dispatch',head_branch:'main',status:'completed',conclusion:'success' };
  const opts = {requestId:'test',listRuns:async()=>[run],sleep:async()=>{},attempts:2};
  assert.equal((await waitForRecovery(opts)).conclusion, 'success');
  await assert.rejects(() => waitForRecovery({...opts,listRuns:async()=>[{...run,conclusion:'failure'}]}), /PUBLISHER_FAILED/);
  await assert.rejects(() => waitForRecovery({...opts,listRuns:async()=>[{...run,display_title:'unrelated'}]}), /TIMEOUT/);
});
