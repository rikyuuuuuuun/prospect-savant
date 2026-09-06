import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildSavantBundle, staffRedirectHtml, STAFF_SAVANT_URL } from '../scripts/build-staff-pages.mjs';

test('staff publication keeps one validated data snapshot and removes direct dashboard rendering from Pages', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const bundle = await buildSavantBundle(root);
  assert.equal(bundle.schemaVersion, 1);
  assert.equal(createHash('sha256').update(bundle.html).digest('hex'), bundle.sha256);
  assert.ok(!/<script\b[^>]*\bsrc\s*=/i.test(bundle.html));
  const inline = [...bundle.html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(inline.length >= 6);
  for (const script of inline) new vm.Script(script[1]);
  const redirect = staffRedirectHtml();
  assert.ok(!redirect.includes('team-grid'));
  assert.ok(!redirect.includes('SAVANT_DATA'));
  let destination = '';
  const context = { location: { hash: '#view-retention', replace: value => { destination = value; } } };
  new vm.Script(redirect.match(/<script>([\s\S]*?)<\/script>/)[1]).runInNewContext(context);
  assert.equal(destination, STAFF_SAVANT_URL + '#view-retention');
});
