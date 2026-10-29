import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { parseFrozenJson } from '../scripts/trial-publication.mjs';
import { continuousScore, projectContinuousScores, CONTINUOUS_SCORE_VERSION } from '../scripts/continuous-scores.mjs';
import { buildSavantBundle } from '../scripts/build-staff-pages.mjs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = async file => parseFrozenJson(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'), file);
const fixture = async () => ({ source: await read('data.js'), events: await read('event-data.js') });

test('score increases before passing a peer, including the lowest and highest teams', () => {
  assert.ok(continuousScore(11, [20, 30, 40]) > continuousScore(10, [20, 30, 40]));
  assert.ok(continuousScore(29, [20, 30, 40]) > continuousScore(28, [20, 30, 40]));
  assert.ok(continuousScore(41, [10, 20, 30]) > continuousScore(40, [10, 20, 30]));
  assert.ok(Math.abs(continuousScore(30 - 1e-6, [20, 30, 40]) - continuousScore(30 + 1e-6, [20, 30, 40])) < 0.001);
});

test('ties, zeros and unavailable evidence have explicit, finite behavior', () => {
  assert.equal(continuousScore(10, [10, 10, 10]), 60);
  assert.equal(continuousScore(0, [0, 0, 0]), 60);
  assert.ok(continuousScore(0, [10, 20, 30]) > 35);
  assert.ok(continuousScore(10, [0, 0, 0]) < 85);
  assert.equal(continuousScore(null, [10]), null);
  assert.equal(continuousScore(10, [null, undefined, NaN]), null);
  assert.equal(continuousScore(10, [10, null]), 60);
});

test('clear performance gaps produce wide scores while closing the gap changes points before overtaking', () => {
  const values = [60, 70, 80, 90];
  const scores = values.map((value, index) => continuousScore(value, values.filter((_, i) => i !== index)));
  assert.ok(scores[3] - scores[0] > 35, 'clear differences should remain visible on the comparison index');
  const before = continuousScore(70, [60, 80, 90]);
  const closer = continuousScore(75, [60, 80, 90]);
  assert.ok(Math.round(closer) > Math.round(before), 'visible integer points rise before passing 80');
  assert.ok(closer < continuousScore(80, [60, 75, 90]), 'the pursuing team stays behind until its actual performance catches up');
});

test('all teams share the same comparison width, preserving ordering and proportional scale', () => {
  for (const values of [[1, 2, 50, 100], [98.4, 98.5, 98.6, 98.7], [0, 0, 1, 3]]) {
    const scores = values.map((value, index) => continuousScore(value, values.filter((_, i) => i !== index)));
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    assert.ok(Math.abs(continuousScore(mean, values) - 60) < 1e-9);
    scores.forEach((score, index) => {
      assert.ok(score > 35 && score < 85);
      if (index > 0 && values[index] > values[index - 1]) assert.ok(score > scores[index - 1]);
      const scaled = continuousScore(values[index] * 10, values.filter((_, i) => i !== index).map(value => value * 10));
      assert.ok(Math.abs(scaled - score) < 1e-9);
    });
  }
});

test('two-team periods also improve continuously without a rank crossing', () => {
  assert.ok(continuousScore(79, [80]) > continuousScore(78, [80]));
  assert.ok(continuousScore(82, [80]) > continuousScore(81, [80]));
  assert.ok(Math.abs(continuousScore(80 - 1e-6, [80]) - continuousScore(80 + 1e-6, [80])) < 0.001);
});

test('projects all teams and the previous publication without mutating validated source data', async () => {
  const { source, events } = await fixture(), before = JSON.stringify({ source, events });
  const projected = projectContinuousScores(source, events);
  assert.equal(JSON.stringify({ source, events }), before);
  assert.ok(projected.data.scoreVersion.endsWith(CONTINUOUS_SCORE_VERSION));
  assert.equal(projected.data.comparison.scoreVersion, projected.data.scoreVersion);
  assert.deepEqual(projected.data.weights, source.weights);
  assert.deepEqual(projected.events.events, events.events);
  assert.deepEqual(projected.data.headline, source.headline);
  for (const team of projected.data.teams) {
    assert.ok(Number.isInteger(team.overall));
    assert.ok(Object.values(team.metrics).every(Number.isInteger));
    assert.equal(team.rank, 1 + projected.data.teams.filter(other => other.overall > team.overall).length);
    assert.deepEqual(team.benchmark, source.teams.find(other => other.id === team.id).benchmark);
    assert.equal(team.metrics.event, Math.round(35 + (team.metricEvidence.event.participationScore * .7 + team.metricEvidence.event.repeatScore * .3) / 2));
    assert.equal(projected.events.teams[team.id].score, team.metrics.event);
    assert.doesNotMatch(team.note, /相対順位を加重|\d+\.\d+点/);
  }
});

test('one extra referral near a competitor improves the integer metric before overtaking', async () => {
  const { source, events } = await fixture();
  source.teams.forEach((team, index) => Object.assign(team.metricEvidence.family, { points: [16, 18, 6, 19][index], members: 100 }));
  const before = projectContinuousScores(source, events);
  const team = source.teams.find(team => team.id === 'A');
  team.metricEvidence.family.points += 1;
  const after = projectContinuousScores(source, events);
  assert.ok(after.data.teams.find(team => team.id === 'A').metrics.family > before.data.teams.find(team => team.id === 'A').metrics.family);
});

test('reports the closing gap to the same rival using comparable integer scores', async () => {
  const { source, events } = await fixture();
  source.comparison.teams.find(team => team.id === 'B').metricEvidence.family.points = 0;
  const { data } = projectContinuousScores(source, events);
  const team = data.teams.find(team => team.id === 'B');
  const previous = data.comparison.teams.find(item => item.id === team.id);
  const target = data.teams.find(item => item.id === team.chase.targetId);
  const previousTarget = data.comparison.teams.find(item => item.id === target.id);
  assert.ok(team.chase.closed > 0);
  assert.equal(team.chase.closed, previousTarget.overall - previous.overall - (target.overall - team.overall));
  assert.ok(Number.isInteger(team.chase.closed));
});

test('teams with the same displayed total share the same rank', async () => {
  const { source, events } = await fixture();
  source.teams[1].metricEvidence = structuredClone(source.teams[0].metricEvidence);
  source.teams[1].metrics = structuredClone(source.teams[0].metrics);
  const { data } = projectContinuousScores(source, events);
  assert.equal(data.teams[0].overall, data.teams[1].overall);
  assert.equal(data.teams[0].rank, data.teams[1].rank);
});

test('withheld retention and missing evidence never become zero or a fabricated overall rank', async () => {
  const { source, events } = await fixture();
  source.teams[0].metrics.retention = source.teams[0].overall = null;
  const result = projectContinuousScores(source, events);
  assert.equal(result.data.teams[0].metrics.retention, null);
  assert.equal(result.data.teams[0].overall, null);
  assert.ok(result.data.teams.every(team => team.rank === null));
  delete source.teams[1].metricEvidence;
  const missing = projectContinuousScores(source, events);
  assert.equal(missing.data.teams[1].overall, null);
  assert.ok(Object.values(missing.data.teams[1].metrics).every(value => value === null));
});

test('different score definitions stay incomparable and the deployed bundle uses projected integer scores', async () => {
  const { source, events } = await fixture();
  source.comparison.scoreVersion = 'older-definition';
  const result = projectContinuousScores(source, events);
  assert.notEqual(result.data.comparison.scoreVersion, result.data.scoreVersion);
  const bundle = await buildSavantBundle(root);
  const context = { window: {} };
  for (const script of [...bundle.html.matchAll(/<script>([\s\S]*?)<\/script>/g)].slice(0, 5)) {
    new vm.Script(script[1]).runInNewContext(context);
  }
  assert.equal(context.window.PROSPECT_SAVANT_DATA.scoring.precision, 0);
  assert.ok(context.window.PROSPECT_SAVANT_DATA.teams.every(team => Number.isInteger(team.overall)));
  assert.ok(bundle.html.includes('前回より'));
});
