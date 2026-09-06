import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = html.slice(html.indexOf('        const referralComparable ='), html.indexOf('        const buildMovementItems ='));
const context = { window: {} };
vm.runInNewContext(readFileSync(new URL('../data.js', import.meta.url), 'utf8'), context);
const fixture = context.window.PROSPECT_SAVANT_DATA;
function run(data, key) {
  return vm.runInNewContext(`${script}\nrateChangeMarkup(data.teams[0], key)`, { data, key });
}
test('current percentages compare against dated evidence, not scores; new referral definition is excluded', () => {
  assert.match(run(fixture, 'retention12mRate'), /前日比 変化なし/);
  assert.match(run(fixture, 'referralRate'), /比較対象外/);
});
test('increase, decrease and unchanged use displayed percentage-point precision', () => {
  const data = structuredClone(fixture);
  data.teams[0].benchmark.admissionRate = 87.3;
  assert.match(run(data, 'admissionRate'), /up.*前日比 ▲ \+1.2ポイント/);
  data.teams[0].benchmark.admissionRate = 85;
  assert.match(run(data, 'admissionRate'), /down.*前日比 ▼ −1.1ポイント/);
  data.teams[0].benchmark.admissionRate = null;
  assert.match(run(data, 'admissionRate'), /比較対象外/);
});
test('same day, stale evidence, definition changes and fiscal rollover do not claim a change', () => {
  for (const mutate of [
    d => { d.comparison.previousAsOf = d.asOf; },
    d => { d.comparison.teams[0].metricEvidence.asOf = '2026-09-01'; },
    d => { d.memberDefinition.id = 'changed'; },
    d => { d.comparison.previousAsOf = '2026-03-31'; d.comparison.teams[0].metricEvidence.asOf = '2026-03-31'; },
  ]) {
    const data = structuredClone(fixture); mutate(data);
    assert.match(run(data, 'admissionRate'), /比較対象外/);
  }
});
test('non-consecutive snapshots are previous-update comparisons and referral uses two decimals', () => {
  const data = structuredClone(fixture);
  data.comparison.previousAsOf = '2026-09-04';
  const before = data.comparison.teams[0].metricEvidence;
  before.asOf = '2026-09-04';
  before.family = structuredClone(data.teams[0].metricEvidence.family);
  data.comparison.metricDefinitions = structuredClone(data.metricDefinitions);
  before.family.rate = 2.60;
  assert.match(run(data, 'referralRate'), /前回比 ▲ \+0.09ポイント/);
  before.family.fiscalYear = '2025';
  assert.match(run(data, 'referralRate'), /比較対象外/);
});
