import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

test('battle view is the default landing view and keeps the Savant percentile scale', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.match(source, /<section class="section" id="battle-section"/);
  assert.match(source, /data-view="battle" aria-pressed="true"/);
  assert.match(source, /selectView\(hash\.slice\(5\) \|\| 'battle'\)/);
  // Same stops as .metric-track: blue-deep → neutral → red-deep.
  assert.match(source, /\[0, \[36, 91, 134\]\], \[50, \[217, 225, 232\]\], \[100, \[168, 47, 43\]\]/);
});

test('battle view compares with the previous publication only under the same score version and definitions', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.match(source, /comparison\.scoreVersion === data\.scoreVersion\s*&& JSON\.stringify\(comparison\.metricDefinitions/);
  assert.match(source, /data\.admissions\.fiscalYear === comparison\.admissions\.fiscalYear/);
});

test('battle view keeps viewer preferences local and tolerant of blocked storage', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  const uses = source.match(/window\.localStorage\.(getItem|setItem)/g) || [];
  assert.equal(uses.length, 2);
  assert.match(source, /try \{ return JSON\.parse\(window\.localStorage\.getItem\(key\)\); \} catch/);
});
