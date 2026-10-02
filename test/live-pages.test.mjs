import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildSavantBundle, staffRedirectHtml } from '../scripts/build-staff-pages.mjs';
import { verifyLivePages, SNAPSHOT_FILES } from '../scripts/verify-live-pages.mjs';
import { waitForPrivateSource } from '../scripts/wait-private-savant-source.mjs';

async function responses(transform = (file, bytes) => bytes) {
  const bundle = await buildSavantBundle('.');
  return async url => {
    const file = new URL(url).pathname.split('/').at(-1);
    const bytes = file === 'index.html' ? staffRedirectHtml() : file === 'savant-bundle.json' ? JSON.stringify(bundle) : await readFile(file);
    return new Response(transform(file, bytes));
  };
}
test('HTTP verification matches all seven files, entry and inlined UI bundle', async () => {
  const result = await verifyLivePages({ fetchImpl: await responses(), attempts: 1 });
  assert.equal(result.publicFilesMatched, 7);
  assert.equal(result.bundleMatched, true);
});
test('every partial publication and stale UI bundle fails', async () => {
  for (const file of [...SNAPSHOT_FILES, 'index.html', 'savant-bundle.json']) {
    await assert.rejects(verifyLivePages({ fetchImpl: await responses((name, bytes) => name === file ? 'stale' : bytes), attempts: 1 }), /LIVE_HASH_MISMATCH/);
  }
});
test('HTTP outage retries boundedly, emits no raw response', async () => {
  let sleeps = 0;
  await assert.rejects(verifyLivePages({ fetchImpl: async () => new Response('sensitive body', { status: 503 }), attempts: 2, sleep: async () => sleeps++ }), /LIVE_HTTP_503/);
  assert.equal(sleeps, 1);
});
test('wrong expected date fails before HTTP access', async () => {
  await assert.rejects(verifyLivePages({ expectedAsOf: '2000-01-01', fetchImpl: () => { throw Error('must not fetch'); } }), /LIVE_EXPECTED_ASOF_MISMATCH/);
});
test('R5 blocking can clear within the wait window, only a newly validated capture is accepted', async () => {
  let captures = 0, clock = 0;
  const result = await waitForPrivateSource({ capture: async () => { if (++captures === 1) throw Error('SOURCE_QUALITY_BLOCKED_R5'); return { ready: true }; }, probe: s => s, waitMinutes: 5, now: () => clock, sleep: async ms => clock += ms, logger: () => {} });
  assert.deepEqual(result, { attempts: 2, ready: true });
});
test('persistent R5 block expires without accepting the source', async () => {
  let captures = 0, clock = 0;
  await assert.rejects(waitForPrivateSource({ capture: async () => { captures++; throw Error('SOURCE_QUALITY_BLOCKED_R5'); }, probe: s => s, waitMinutes: 5, now: () => clock, sleep: async ms => clock += ms, logger: () => {} }), /SOURCE_QUALITY_BLOCKED_R5/);
  assert.equal(captures, 2);
});
test('diagnostic with zero wait never retries a quality block', async () => {
  await assert.rejects(waitForPrivateSource({ capture: async () => { throw Error('SOURCE_QUALITY_BLOCKED_R5'); }, probe: s => s, sleep: () => { throw Error('must not sleep'); } }), /SOURCE_QUALITY_BLOCKED_R5/);
});
test('unrelated quality and schema errors fail immediately', async () => {
  for (const code of ['SOURCE_QUALITY_BLOCKED_R6', 'SOURCE_QUALITY_STATUS_MISSING_R5', 'MEMBER_SOURCE_BLOCKED', 'SOURCE_SCHEMA_INVALID']) {
    await assert.rejects(waitForPrivateSource({ capture: async () => { throw Error(code); }, probe: s => s, waitMinutes: 60, sleep: () => { throw Error('must not sleep'); } }), new RegExp(code));
  }
});
test('source probe errors cannot be retried or converted to readiness', async () => {
  await assert.rejects(waitForPrivateSource({ capture: async () => ({}), probe: () => { throw Error('SOURCE_ASOF_FUTURE'); }, waitMinutes: 60 }), /SOURCE_ASOF_FUTURE/);
});
test('pending source remains pending when the bounded wait expires', async () => {
  let clock = 0;
  assert.deepEqual(await waitForPrivateSource({ capture: async () => ({}), probe: () => ({ ready: false }), waitMinutes: 5, now: () => clock, sleep: async ms => clock += ms, logger: () => {} }), { attempts: 2, ready: false });
});
