import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function run(source, env) {
  const dir = mkdtempSync(join(tmpdir(), 'probe-'));
  const file = join(dir, 'source.json');
  writeFileSync(file, JSON.stringify(source));
  return execFileSync(process.execPath, ['scripts/source-freshness-gate.mjs', file], {
    env: { PATH: process.env.PATH, TARGET_DATE: '2026-09-29', ...env }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

test('probe mode reports readiness without enforcing the deadline', () => {
  assert.equal(run({ trialAggregate: { targetDate: '2026-09-29' } }, { SOURCE_FRESHNESS_MODE: 'probe' }), 'true');
  // Pending member sync after 09:30 JST: probe answers false instead of failing, so the loop can wait.
  assert.equal(run({ trialAggregate: { targetDate: '2026-09-28' }, readiness: { ready: false, reason: 'MEMBER_SYNC_PENDING' } }, { SOURCE_FRESHNESS_MODE: 'probe' }), 'false');
});

test('probe mode still fails closed on a future source date', () => {
  assert.throws(() => run({ trialAggregate: { targetDate: '2026-09-30' } }, { SOURCE_FRESHNESS_MODE: 'probe' }));
});
