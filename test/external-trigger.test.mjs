import test from 'node:test';
import assert from 'node:assert/strict';
import { dispatchRecovery, TARGET } from '../ops/external-trigger/worker.js';

test('external trigger dispatches only the recovery workflow on main without force', async () => {
  const calls = [];
  await dispatchRecovery({ GITHUB_DISPATCH_TOKEN: 'fixture' }, async (url, init) => { calls.push({ url, init }); return { status: 204 }; });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `https://api.github.com/repos/${TARGET.owner}/${TARGET.repo}/actions/workflows/daily-savant-recovery.yml/dispatches`);
  assert.deepEqual(JSON.parse(calls[0].init.body), { ref: 'main' });
});

test('external trigger fails loudly on a missing token or non-204 response', async () => {
  await assert.rejects(() => dispatchRecovery({}, async () => ({ status: 204 })), /dispatch_token_missing/);
  await assert.rejects(() => dispatchRecovery({ GITHUB_DISPATCH_TOKEN: 'x' }, async () => ({ status: 403 })), /dispatch_failed_403/);
});
