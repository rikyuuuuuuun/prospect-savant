import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parsePublicSource, publishPrivateSavantSource } from '../scripts/publish-private-savant-source.mjs';

const root = resolve(import.meta.dirname, '..');
const readPublic = async (file) => parsePublicSource(await readFile(join(root, file), 'utf8'), file);
const serial = (iso) => Math.floor((Date.parse(`${iso}T00:00:00Z`) - Date.UTC(1899, 11, 30)) / 86_400_000);
const RANGES = {
  dashboard: "'00_ダッシュボード'!A1:H23", teams: "'01_チーム比較'!A1:P12", monthly: "'03_月次集計'!A1:V12",
  events: "'04_イベント力'!A1:S100", retention: "'05_定着力'!A1:R10", admission: "'06_入会力（年度）'!A1:H12",
  schoolAge: "'09_学齢継続'!A1:J12", curve: "'10_定着曲線'!A1:K17",
  quality: "'99_データ品質'!A1:F20",
};

function sourceRows(data, events, retentionCurve, schoolAge, trial) {
  const source = {};
  source[RANGES.dashboard] = [[], [], [], [data.headline.members, data.headline.monthlyDelta, data.headline.admissionRate / 100, data.headline.latestEventParticipants]];
  source[RANGES.teams] = [[], [], [], [], ...data.teams.map((team) => [team.id, team.members, team.monthlyDelta, 0, team.metrics.retention, team.benchmark.admissionRate / 100, team.metrics.admission, team.benchmark.eventRate / 100, team.benchmark.repeatRate / 100, team.metrics.event, team.metrics.growth, team.metrics.family, 1, team.overall, team.rank, team.status])];
  source[RANGES.monthly] = [[], [], [], [], ...data.teams.map((team) => [team.id, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', serial(data.asOf)])];
  source[RANGES.retention] = [[], [], [], [], ...data.teams.map((team) => [team.id, '', '', '', '', team.benchmark.retention12mRate / 100, team.benchmark.retention12mSample])];
  source[RANGES.admission] = [[], [], [], [], ...data.teams.map((team) => {
    const annual = trial.annual.teams[team.id];
    return [team.id, annual.trials, annual.admissions, team.benchmark.admissionRate / 100, team.benchmark.admissionPreviousRate / 100, team.benchmark.admissionYoYDelta / 100, team.metrics.admission];
  })];
  source[RANGES.events] = [[], [], [], [], ...['A', 'B', 'C', 'D'].map((id) => {
    const team = events.teams[id];
    return [id, 0, team.averageRate / 100, events.historicalMaxRate / 100, team.participationScore, 0, 0, team.repeatRate / 100, team.repeatScore, team.score];
  }), [], [], [], [], [], [], [], [], [], [], ...events.events.map((event) => [
    serial(event.startDate), serial(event.endDate), 'private', 'private',
    event.teams.A.participants, event.teams.A.members, event.teams.A.rate / 100,
    event.teams.B.participants, event.teams.B.members, event.teams.B.rate / 100,
    event.teams.C.participants, event.teams.C.members, event.teams.C.rate / 100,
    event.teams.D.participants, event.teams.D.members, event.teams.D.rate === null ? null : event.teams.D.rate / 100,
    event.total.participants, event.total.members, event.total.rate / 100,
  ])];
  source[RANGES.schoolAge] = [[], [], [], [], ...['A', 'B', 'C', 'D'].map((id) => {
    const team = schoolAge.teams[id];
    return [id, team.samples[0], (team.rates[0] || 0) / 100, team.samples[1], (team.rates[1] || 0) / 100, team.samples[2], (team.rates[2] || 0) / 100, team.samples[3], (team.rates[3] || 0) / 100];
  }), ['合計', schoolAge.overall.samples[0], schoolAge.overall.rates[0] / 100, schoolAge.overall.samples[1], schoolAge.overall.rates[1] / 100, schoolAge.overall.samples[2], schoolAge.overall.rates[2] / 100, schoolAge.overall.samples[3], schoolAge.overall.rates[3] / 100]];
  source[RANGES.curve] = [[], [], [], [], ...retentionCurve.months.map((month, index) => [
    month,
    (retentionCurve.teams.A.rates[index] || 0) / 100, (retentionCurve.teams.B.rates[index] || 0) / 100, (retentionCurve.teams.C.rates[index] || 0) / 100, (retentionCurve.teams.D.rates[index] || 0) / 100,
    (retentionCurve.overall.rates[index] || 0) / 100,
    retentionCurve.teams.A.samples[index], retentionCurve.teams.B.samples[index], retentionCurve.teams.C.samples[index], retentionCurve.teams.D.samples[index], retentionCurve.overall.samples[index],
  ])];
  source[RANGES.quality] = [[], [], [], [], ['source', '', '', '', '', '正常']];
  return source;
}

test('dry-run transforms only a complete reconciled anonymous source snapshot', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    await writeFile(sourcePath, JSON.stringify({ ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0, ...trial.annual.teams[team] }])) } }), 'utf8');
    const result = await publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: true });
    assert.deepEqual(result, { ok: true, changedFiles: ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'snapshot-manifest.json', 'trial-data.js', 'trial-manifest.json'], dryRun: true });
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('refuses an annual source mismatch before touching public files', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0, ...trial.annual.teams[team] }])) } };
    snapshot.trialAggregate.aggregates.C.trials += 1;
    await writeFile(sourcePath, JSON.stringify(snapshot), 'utf8');
    await assert.rejects(() => publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: true }), /ANNUAL_RECONCILIATION_REQUIRED_C/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('refuses a dashboard relative-score input that disagrees with the annual source', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0, ...trial.annual.teams[team] }])) } };
    snapshot.ranges[RANGES.teams][6][5] = 0.5;
    await writeFile(sourcePath, JSON.stringify(snapshot), 'utf8');
    await assert.rejects(() => publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: true }), /ANNUAL_RATE_RECONCILIATION_REQUIRED_C/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('refuses an explicitly unhealthy source quality state', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0, ...trial.annual.teams[team] }])) } };
    snapshot.ranges[RANGES.quality][4][5] = '異常';
    await writeFile(sourcePath, JSON.stringify(snapshot), 'utf8');
    await assert.rejects(() => publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: true }), /SOURCE_QUALITY_BLOCKED/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('refuses a source snapshot older than the current public snapshot', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0, ...trial.annual.teams[team] }])) } };
    for (const row of snapshot.ranges[RANGES.monthly].slice(4)) row[21] = serial('2026-08-21');
    await writeFile(sourcePath, JSON.stringify(snapshot), 'utf8');
    await assert.rejects(() => publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: true }), /SOURCE_ASOF_OLDER_THAN_PUBLIC/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('refuses a quality table with an unspecified status', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0, ...trial.annual.teams[team] }])) } };
    snapshot.ranges[RANGES.quality][4][5] = '';
    await writeFile(sourcePath, JSON.stringify(snapshot), 'utf8');
    await assert.rejects(() => publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: true }), /SOURCE_QUALITY_STATUS_MISSING/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('same source creates byte-identical output on a second run', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  const files = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'snapshot-manifest.json', 'trial-data.js', 'trial-manifest.json'];
  try {
    await Promise.all(files.map((file) => copyFile(join(root, file), join(dir, file))));
    const sourcePath = join(dir, 'source.json');
    await writeFile(sourcePath, JSON.stringify({ ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0, ...trial.annual.teams[team] }])) } }), 'utf8');
    await publishPrivateSavantSource({ rootDir: dir, sourcePath });
    const first = await Promise.all(files.map((file) => readFile(join(dir, file), 'utf8')));
    const manifest = JSON.parse(await readFile(join(dir, 'snapshot-manifest.json'), 'utf8'));
    assert.equal(manifest.sourceCommit, 'sheets-readonly-source-v1');
    assert.equal(manifest.sourceKind, 'private-sheets-readonly-anonymous-aggregate-v1');
    await publishPrivateSavantSource({ rootDir: dir, sourcePath });
    const second = await Promise.all(files.map((file) => readFile(join(dir, file), 'utf8')));
    assert.deepEqual(second, first);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
