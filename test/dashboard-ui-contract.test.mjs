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

test('member composition opens in side-by-side team comparison and keeps the single-team detail', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.match(source, /let selected = 'ALL', mode = 'ratio', layout = 'compare';/);
  assert.match(source, /data-composition-layout="compare"/);
  assert.match(source, /data-composition-layout="detail"/);
  assert.match(source, /id="composition-filters"/);
  for (const title of ['チームの特徴', '主要指標の比較', '構成比の比較']) assert.ok(source.includes(`<h3>${title}</h3>`));
});

test('every analysis except the overview offers a side-by-side team comparison', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  for (const title of ['年度の入会者数', '体験と入会率', '累計の推移', '月別の入会者数', '月別の退会', '経過月ごとの継続率の比較', '節目ごとの継続率の比較', '参加率の比較', '開催回ごとの参加率', '総合点の内訳', '指標スコアと総合への寄与を表で見る']) {
    assert.ok(source.includes(`'${title}'`), `missing comparison: ${title}`);
  }
  // Withdrawal comparison reuses the per-team card rule: month-start denominator only when complete.
  assert.match(source, /const monthly = Number\.isSafeInteger\(row\.denominator\) && row\.denominator > 0 && row\.missingEntry === 0;\n\s*const denominator = monthly \? row\.denominator : members;/);
  // D team events before its start stay out of the comparison.
  assert.match(source, /const evaluated = \(event, id\) => !\(id === 'D' && String\(event\.startDate\) < String\(data\.quality\?\.dEvaluationStart/);
});

test('team card filter only hides team cards, not other team-tagged elements', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.ok(source.includes('document.querySelectorAll("#team-grid [data-team]").forEach((card) => { card.hidden'));
  assert.ok(!source.includes('document.querySelectorAll("[data-team]").forEach((card) => { card.hidden'));
});

test('comparison tables added above existing charts never hide those charts', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.match(source, /const addAbove = \(section, compare\) => \{\n\s*compare\.classList\.add\('cx-above'\);/);
  assert.ok(source.includes('.cx-section:not(.cx-compare-on) > .cx-compare:not(.cx-above) { display: none; }'));
});

test('withdrawals show members marked 退会予定 as this month planned withdrawals', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.ok(source.includes("composition.teams?.[id]?.status?.scheduled"));
  assert.ok(source.includes('当月の退会予定 <b>${scheduledOf(id)}人</b>'));
  assert.ok(source.includes('予定 ${num(planned)}人'));
});

test('no analysis shows per-100-member values', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.ok(!source.includes('100人'));
});

test('admissions tab shows fiscal trials and trial-to-admission rates from the published conversion data', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.ok(source.includes("data.admissionConversion?.asOf === data.asOf && data.admissionConversion.fiscalYear === h.fiscalYear"));
  assert.ok(source.includes("block('体験と入会率'"));
  // Rates and year-over-year deltas come from the published values used by the team profiles.
  assert.ok(source.includes('const publishedDelta = published?.admissionYoYDelta;'));
});

test('comparison views lead with charts and keep number tables folded', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  for (const helper of ['const hbars = ', 'const dumbbell = ', 'const groupedBars = ', 'const details = ']) assert.ok(source.includes(helper), helper);
  assert.ok(source.split("details('数値を表で見る'").length - 1 >= 4);
  assert.ok(!source.includes('<div class="cx-kpis">'));
});

test('admissions tab shows monthly trials and trial-to-admission rates only from a reconciled monthly series', async () => {
  const source = await readFile(resolve(process.cwd(), 'index.html'), 'utf8');
  assert.ok(source.includes("mc?.status === 'ok' && mc.asOf === data.asOf && mc.fiscalYear === h.fiscalYear"));
  assert.ok(source.includes("block('月別の体験と入会率'"));
  assert.ok(source.includes("details('数値を表で見る', table)"));
});
