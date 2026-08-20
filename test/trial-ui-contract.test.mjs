import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

test('renders the trial summary and annual admission samples without a new section', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.match(source, /<script src="\.\/trial-data\.js"><\/script>/);
  assert.match(source, /id="trial-summary"/);
  assert.match(source, /本日の体験/);
  assert.match(source, /trial-summary-breakdown/);
  assert.match(source, /\["A", "B", "C", "D"\]/);
  assert.match(source, /benchmark-sample/);
  assert.match(source, /人入会 \/ .*人体験/);
});

test('keeps unavailable or stale daily data distinct from zero on the public UI', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.match(source, /today\?\.status === "ok" && today\.date === tokyoDate\(\)/);
  assert.match(source, /取得失敗/);
  assert.match(source, /人数は表示していません/);
});

test('includes responsive rules for the upper trial summary', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.match(source, /\.trial-summary \{ display: grid; grid-template-columns: auto minmax\(0, 1fr\)/);
  assert.match(source, /\.trial-summary \{ grid-template-columns: 1fr; gap: 10px/);
  assert.match(source, /\.trial-summary-breakdown \{ gap: 5px/);
});
