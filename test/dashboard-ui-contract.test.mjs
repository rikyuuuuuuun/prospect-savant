import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

test('team overview is the landing view and every analysis is reachable from it', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.match(source, /data-view="overview" aria-pressed="true"/);
  assert.match(source, /selectView\(hash\.slice\(5\) \|\| 'overview'\)/);
  assert.match(source, /overview: \[guide, document\.getElementById\('movement-section'\)/);
  for (const view of ['overview', 'standings', 'composition', 'admissions', 'retention', 'events', 'reference']) {
    assert.match(source, new RegExp(`data-view="${view}"`));
    assert.match(source, new RegExp(`\\{ key: '${view}', label: `));
  }
  assert.match(source, /id="nav-more"/);
  assert.match(source, /id="view-pager"/);
});

test('standings view keeps the Savant percentile scale', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.match(source, /<section class="section" id="standings-section"/);
  // Same stops as .metric-track: blue-deep → neutral → red-deep.
  assert.match(source, /\[0, \[36, 91, 134\]\], \[50, \[217, 225, 232\]\], \[100, \[168, 47, 43\]\]/);
});

test('standings view compares with the previous publication only under the same score version and definitions', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.match(source, /comparison\.scoreVersion === data\.scoreVersion\s*&& JSON\.stringify\(comparison\.metricDefinitions/);
  assert.match(source, /data\.admissions\.fiscalYear === comparison\.admissions\.fiscalYear/);
});

test('standings view keeps viewer preferences local and tolerant of blocked storage', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  const uses = source.match(/window\.localStorage\.(getItem|setItem)/g) || [];
  assert.equal(uses.length, 2);
  assert.match(source, /try \{ return JSON\.parse\(window\.localStorage\.getItem\(key\)\); \} catch/);
});

test('standings view uses formal wording without celebratory effects', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  for (const word of ['バトル', '勝ち越し', '並走', 'ビハインド', '連続チェック', 'confetti']) {
    assert.ok(!source.includes(word), `unexpected wording: ${word}`);
  }
});
