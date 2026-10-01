import { syntheticTrialQuality } from './support/trial-disposition.mjs';
import { syntheticMemberReadback, syntheticMemberGate } from './support/member-readback.mjs';
import { conversionRows } from './support/annual-conversion.mjs';
import { ANNUAL_CONVERSION_RANGE } from '../scripts/annual-conversion-source.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { applyMemberMonthlyDelta, buildMemberMonthlyComparison, previousMonthEnd } from '../scripts/member-monthly-change.mjs';
import { REFERRAL_RANGE } from '../scripts/referral-evidence.mjs';
import { parsePublicSource, publishPrivateSavantSource } from '../scripts/publish-private-savant-source.mjs';
import { publishPrivateSavantWithExplanations } from '../scripts/publish-private-savant-with-explanations.mjs';
import { PUBLIC_FILES } from '../scripts/stage-public-snapshot.mjs';

const root = resolve(import.meta.dirname, '..');
const readPublic = async (file) => parsePublicSource(await readFile(join(root, file), 'utf8'), file);
const serial = (iso) => Math.floor((Date.parse(`${iso}T00:00:00Z`) - Date.UTC(1899, 11, 30)) / 86_400_000);
const RANGES = {
  dashboard: "'00_ダッシュボード'!A1:H23", teams: "'01_チーム比較'!A1:P12", monthly: "'03_月次集計'!A1:V12",
  events: "'04_イベント力'!A1:S100", retention: "'05_定着力'!A1:R10", admission: "'06_入会力（年度）'!A1:H12",
  schoolAge: "'09_学齢継続'!A1:J12", curve: "'10_定着曲線'!A1:K17",
  memberMaster: "'98_会員マスター連携'!A4:AE9",
  quality: "'99_データ品質'!A1:F20",
};

test('late explanation failure leaves all original public files byte-identical', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'savant-explanation-failure-'));
  try {
    for (const file of PUBLIC_FILES) await copyFile(join(root, file), join(dir, file));
    const before = await Promise.all(PUBLIC_FILES.map(file => readFile(join(dir, file), 'utf8')));
    const ranges = sourceRows(data, events, retentionCurve, schoolAge, trial);
    for (const range of ["'07_成長力'!P4:W9", "'08_家庭継続力'!A1:O31", "'90_配点設定'!A1:J50"]) ranges[range] = [['invalid metric input']];
    const sourcePath = join(dir, 'source.json');
    await writeFile(sourcePath, JSON.stringify({ ranges, trialAggregate: { quality: syntheticTrialQuality(), targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A','B','C','D'].map(id => [id, {today: 0}])) } }));
    // The core snapshot is valid; only the later explanation phase rejects it.
    await publishPrivateSavantSource({ rootDir: dir, sourcePath, dryRun: true });
    await assert.rejects(() => publishPrivateSavantWithExplanations({ rootDir: dir, sourcePath }), /(?:RETENTION|FAMILY|GROWTH|WEIGHT|METRIC)/);
    assert.deepEqual(await Promise.all(PUBLIC_FILES.map(file => readFile(join(dir, file), 'utf8'))), before);
  } finally { await rm(dir, {recursive:true, force:true}); }
});

function sourceRows(data, events, retentionCurve, schoolAge, trial) {
  const source = {};
  const conversion = Object.fromEntries(data.teams.map(team => [team.id, {
    ...trial.annual.teams[team.id],
    previousTrials: data.admissionConversion?.teams[team.id].previousTrials ?? 1000,
    previousAdmissions: data.admissionConversion?.teams[team.id].previousAdmissions ?? Math.round(team.benchmark.admissionPreviousRate * 10),
  }]));
  source[ANNUAL_CONVERSION_RANGE] = conversionRows(data.asOf, conversion);
  source[RANGES.dashboard] = [[], [], [], ['運用会員数', '前月差（参考）', '年度入会率', '直近イベント実参加'], [data.headline.members, data.headline.monthlyDelta, data.headline.admissionRate / 100, data.headline.latestEventParticipants]];
  source[RANGES.teams] = [[], [], [], [], ...data.teams.map((team) => [team.id, team.members, team.monthlyDelta, 0, team.metrics.retention, team.benchmark.admissionRate / 100, team.metrics.admission, team.benchmark.eventRate / 100, team.benchmark.repeatRate / 100, team.metrics.event, team.metrics.growth, team.metrics.family, 1, team.overall, team.rank, team.status])];
  source[RANGES.monthly] = [[], [], [], [], ...data.teams.map((team) => ['', team.id, team.members, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', serial(data.asOf)])];
  source[RANGES.retention] = [[], [], [], [], ...data.teams.map((team) => [team.id, '', '', '', '', team.benchmark.retention12mRate / 100, team.benchmark.retention12mSample])];
  source[RANGES.admission] = [[], [], [], [], ...data.teams.map((team) => {
    const annual = trial.annual.teams[team.id];
    const previousRate = conversion[team.id].previousAdmissions / conversion[team.id].previousTrials;
    return [team.id, annual.trials, annual.admissions, annual.admissions / annual.trials, previousRate, annual.admissions / annual.trials - previousRate, team.metrics.admission];
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
  source[RANGES.memberMaster] = [
    ['チーム', '現在会員数', '在籍', '退会予定', '休会', '入会日登録済', '年度累計体験', '年度体験→入会', '年度実入会'],
    ...data.teams.map((team) => ['A', 'B', 'C', 'D'].includes(team.id) && [team.id, team.members, '', '', '', team.members, trial.annual.teams[team.id].trials, trial.annual.teams[team.id].admissions, trial.annual.teams[team.id].admissions]),
  ];
  source[RANGES.memberMaster].push(['合計', data.headline.members]);
  source["'98_会員マスター連携'!A12:H18"] = syntheticMemberReadback(data.asOf, Object.fromEntries(data.teams.map(t => [t.id, t.members])));
  source["'98_会員マスター連携'!J12:K20"] = syntheticMemberGate(data.asOf);
  source[RANGES.quality] = [[], [], [], [], ['source', '', '', '', '', '正常']];
  return source;
}

function syntheticMonthlyBaseline(data) {
  const baseline = structuredClone(data);
  baseline.asOf = previousMonthEnd(data.asOf);
  baseline.asOfLabel = baseline.asOf;
  baseline.teams.forEach((team, index) => { team.members = index * 10; });
  baseline.headline.members = baseline.teams.reduce((total, team) => total + team.members, 0);
  return baseline;
}

function explanationSourceRows(data, events, retentionCurve, schoolAge, trial) {
  const ranges = sourceRows(data, events, retentionCurve, schoolAge, trial);
  ranges[RANGES.retention] = [[], [], [], ['チーム', '3か月\n継続率'], ...data.teams.map((team) => [
    team.id, ...team.metricEvidence.retention.periods.flatMap((period) => [
      period.retained === null ? (period.rate === null ? null : period.rate / 100) : period.retained / period.sample,
      period.sample,
    ]),
  ])];
  ranges[RANGES.admission][3] = ['チーム', '', '', '年度入会率'];
  ranges["'07_成長力'!P4:W9"] = [['チーム', '上位10％記録', '', '', '成長力点'], ...data.teams.map((team) => {
    const e = team.metricEvidence.growth;
    return [team.id, e.top10, e.top10to20, e.top20to30, e.relativeScore, e.top30Children, e.weightedPoints, e.status];
  })];
  // The public fixture uses referral evidence rather than the legacy family metric.
  ranges["'08_家庭継続力'!A1:O31"] = [['legacy metric']];
  ranges["'90_配点設定'!A1:J50"] = [['legacy config']];
  const referral = [[], ['', `${trial.annual.fiscalYear}-04-01`, '', data.asOf], [],
    ['チーム', '紹介体験', '兄弟姉妹入会', '紹介ポイント', '紹介力点', '定義', '基準日会員数', '紹介率', '人数相対点', '紹介率相対点', '人数配点', '紹介率配点'],
    ...data.teams.map((team) => {
      const e = team.metricEvidence.family;
      return [team.id, e.trialPoints, e.siblingPoints, e.points, e.calculatedScore, e.definition,
        e.members, e.points / e.members, e.pointScore, e.rateScore, 0.7, 0.3];
    }),
  ];
  const sum = (column) => referral.slice(4).reduce((total, row) => total + row[column], 0);
  referral.push(['合計', sum(1), sum(2), sum(3), '', '', sum(6), sum(3) / sum(6)], [], ['', '', '', '', '', 'READY']);
  ranges[REFERRAL_RANGE] = referral;
  return ranges;
}

for (const confirmed of [false, true]) {
  test(`source publication ${confirmed ? 'keeps' : 'withholds'} a carried month-end comparison based on source counts`, async () => {
    const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
    const dir = await mkdtemp(join(tmpdir(), 'savant-monthly-source-'));
    try {
      await Promise.all(PUBLIC_FILES.map((file) => copyFile(join(root, file), join(dir, file))));
      data.memberMonthlyComparison = buildMemberMonthlyComparison(syntheticMonthlyBaseline(data));
      applyMemberMonthlyDelta(data);
      await writeFile(join(dir, 'data.js'), `window.PROSPECT_SAVANT_DATA = Object.freeze(${JSON.stringify(data)});\n`);
      const ranges = sourceRows(data, events, retentionCurve, schoolAge, trial);
      if (confirmed) for (const row of ranges[RANGES.monthly].slice(4)) {
        row[3] = data.memberMonthlyComparison.teams.find((team) => team.id === row[1]).members;
      }
      const sourcePath = join(dir, 'source.json');
      await writeFile(sourcePath, JSON.stringify({ ranges, trialAggregate: { quality: syntheticTrialQuality(),
        targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear,
        aggregates: Object.fromEntries(data.teams.map((team) => [team.id, { today: 0 }])),
      } }));
      await publishPrivateSavantSource({ rootDir: dir, sourcePath });
      const published = parsePublicSource(await readFile(join(dir, 'data.js'), 'utf8'), 'data.js');
      assert.deepEqual(published.memberMonthlyComparison, confirmed ? data.memberMonthlyComparison : null);
      assert.equal(published.headline.monthlyDelta, confirmed ? data.headline.members - data.memberMonthlyComparison.headline.members : null);
      for (const team of published.teams) {
        assert.equal(team.monthlyDelta, confirmed ? team.members - data.memberMonthlyComparison.teams.find((previous) => previous.id === team.id).members : null);
      }
    } finally { await rm(dir, { recursive: true, force: true }); }
  });

  test(`explanation publication ${confirmed ? 'restores a source-confirmed' : 'restores an estimated source-unconfirmed'} Git month-end baseline`, async () => {
    const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
    const dir = await mkdtemp(join(tmpdir(), 'savant-monthly-history-'));
    const git = (...args) => execFileSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { cwd: dir, stdio: 'pipe' });
    try {
      const baseline = syntheticMonthlyBaseline(data);
      git('init');
      await writeFile(join(dir, 'data.js'), `window.PROSPECT_SAVANT_DATA = Object.freeze(${JSON.stringify(baseline)});\n`);
      git('add', 'data.js');
      git('commit', '-m', 'Synthetic month-end baseline');
      await Promise.all(PUBLIC_FILES.map((file) => copyFile(join(root, file), join(dir, file))));
      data.memberMonthlyComparison = null;
      data.headline.monthlyDelta = null;
      data.teams.forEach((team) => { team.monthlyDelta = null; });
      await writeFile(join(dir, 'data.js'), `window.PROSPECT_SAVANT_DATA = Object.freeze(${JSON.stringify(data)});\n`);
      git('add', 'data.js');
      git('commit', '-m', 'Current snapshot without monthly comparison');
      const ranges = explanationSourceRows(data, events, retentionCurve, schoolAge, trial);
      if (confirmed) for (const row of ranges[RANGES.monthly].slice(4)) {
        row[3] = baseline.teams.find((team) => team.id === row[1]).members;
      }
      const sourcePath = join(dir, 'source.json');
      await writeFile(sourcePath, JSON.stringify({ ranges, trialAggregate: { quality: syntheticTrialQuality(),
        targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear,
        aggregates: Object.fromEntries(data.teams.map((team) => [team.id, { today: 0 }])),
      } }));
      const result = await publishPrivateSavantWithExplanations({ rootDir: dir, sourcePath });
      assert.equal(result.ok, true);
      const published = parsePublicSource(await readFile(join(dir, 'data.js'), 'utf8'), 'data.js');
      assert.equal(published.memberMonthlyComparison.previousAsOf, baseline.asOf);
      assert.equal(published.headline.monthlyDelta, data.headline.members - baseline.headline.members);
      assert.equal(Boolean(published.memberMonthlyComparison.estimate), !confirmed);
      for (const team of published.teams) {
        assert.equal(team.monthlyDelta, team.members - baseline.teams.find((previous) => previous.id === team.id).members);
      }
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
}

test('dry-run transforms only a complete reconciled anonymous source snapshot', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    await writeFile(sourcePath, JSON.stringify({ ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality: syntheticTrialQuality(), targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])) } }), 'utf8');
    const result = await publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: true });
    assert.deepEqual(result, { ok: true, changedFiles: ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'snapshot-manifest.json', 'trial-data.js', 'trial-manifest.json'], dryRun: true });
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('uses the central annual source even when a direct daily aggregate carries unrelated annual fields', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const files = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'snapshot-manifest.json', 'trial-data.js', 'trial-manifest.json'];
    await Promise.all(files.map((file) => copyFile(join(root, file), join(dir, file))));
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality: syntheticTrialQuality(), targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])) } };
    snapshot.trialAggregate.aggregates.C = { today: 3, trials: 999, admissions: 999 };
    await writeFile(sourcePath, JSON.stringify(snapshot), 'utf8');
    await publishPrivateSavantSource({ rootDir: dir, sourcePath });
    const published = parsePublicSource(await readFile(join(dir, 'trial-data.js'), 'utf8'), 'trial-data.js');
    assert.equal(published.today.teams.C, 3);
    assert.deepEqual(published.annual.teams.C, trial.annual.teams.C);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('stores only anonymous member-master admission counters with the approved re-enrollment and future-date policy', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const files = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'snapshot-manifest.json', 'trial-data.js', 'trial-manifest.json'];
    await Promise.all(files.map((file) => copyFile(join(root, file), join(dir, file))));
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality: syntheticTrialQuality(), targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])) } };
    await writeFile(sourcePath, JSON.stringify(snapshot), 'utf8');
    await publishPrivateSavantSource({ rootDir: dir, sourcePath });
    const published = parsePublicSource(await readFile(join(dir, 'data.js'), 'utf8'), 'data.js');
    assert.deepEqual(Object.keys(published.admissions).sort(), ['asOf', 'definition', 'fiscalYear', 'futureAdmissionCount', 'reEnrollmentPolicy', 'teams']);
    assert.equal(published.admissions.reEnrollmentPolicy, 'including-reenrollment');
    assert.equal(published.admissions.futureAdmissionCount, 0);
    assert.deepEqual(published.admissions.teams.A, { cumulative: trial.annual.teams.A.admissions });
    assert.doesNotMatch(await readFile(join(dir, 'data.js'), 'utf8'), /(?:氏名|メール|電話|住所|Prospect人物ID|会費ペイ会員ID|docs\.google\.com)/i);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('rejects an invalid central annual count before touching public files', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality: syntheticTrialQuality(), targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])) } };
    snapshot.ranges[RANGES.admission][6][1] = -1;
    await writeFile(sourcePath, JSON.stringify(snapshot), 'utf8');
    await assert.rejects(() => publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: true }), /ANNUAL_TRIALS_C_INVALID/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('refuses a dashboard relative-score input that disagrees with the annual source', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality: syntheticTrialQuality(), targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])) } };
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
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality: syntheticTrialQuality(), targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])) } };
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
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality: syntheticTrialQuality(), targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])) } };
    snapshot.ranges["'98_会員マスター連携'!J12:K20"] = syntheticMemberGate('2026-08-21');
    for (const row of snapshot.ranges[RANGES.monthly].slice(4)) row[21] = serial('2026-08-21');
    snapshot.ranges["'98_会員マスター連携'!A12:H18"] = syntheticMemberReadback('2026-08-21', Object.fromEntries(data.teams.map(t => [t.id, t.members])));
    snapshot.trialAggregate.targetDate = '2026-08-21';
    await writeFile(sourcePath, JSON.stringify(snapshot), 'utf8');
    await assert.rejects(() => publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: true }), /SOURCE_ASOF_OLDER_THAN_PUBLIC/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('refuses a trial date that does not match the central source as-of date', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality: syntheticTrialQuality(), targetDate: '2026-08-23', fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])) } };
    await writeFile(sourcePath, JSON.stringify(snapshot), 'utf8');
    await assert.rejects(() => publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: true }), /MEMBER_SOURCE_DATE_MISMATCH/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('refuses a trial fiscal year that does not match the central source as-of date', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality: syntheticTrialQuality(), targetDate: data.asOf, fiscalYear: '2025', aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])) } };
    await writeFile(sourcePath, JSON.stringify(snapshot), 'utf8');
    await assert.rejects(() => publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: true }), /TRIAL_FISCAL_YEAR_SOURCE_ASOF_MISMATCH/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('refuses a quality table with an unspecified status', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-test-'));
  try {
    const sourcePath = join(dir, 'source.json');
    const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality: syntheticTrialQuality(), targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])) } };
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
    await writeFile(sourcePath, JSON.stringify({ ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality: syntheticTrialQuality(), targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A', 'B', 'C', 'D'].map((team) => [team, { today: 0 }])) } }), 'utf8');
    await publishPrivateSavantSource({ rootDir: dir, sourcePath });
    const first = await Promise.all(files.map((file) => readFile(join(dir, file), 'utf8')));
    const manifest = JSON.parse(await readFile(join(dir, 'snapshot-manifest.json'), 'utf8'));
    assert.match(manifest.sourceCommit, /^sheets-readback-sha256:[a-f0-9]{64}$/);
    assert.equal(manifest.sourceKind, 'private-sheets-readonly-anonymous-aggregate-v1');
    await publishPrivateSavantSource({ rootDir: dir, sourcePath });
    const second = await Promise.all(files.map((file) => readFile(join(dir, file), 'utf8')));
    assert.deepEqual(second, first);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('publication requires a fresh eligible-cohort receipt and cannot force-normal unresolved rows', async () => {
  const [data, events, retentionCurve, schoolAge, trial] = await Promise.all(['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'].map(readPublic));
  const dir = await mkdtemp(join(tmpdir(), 'prospect-savant-trial-quality-'));
  try {
    for (const file of PUBLIC_FILES) await copyFile(join(root, file), join(dir, file));
    const before = await Promise.all(PUBLIC_FILES.map(file => readFile(join(dir, file))));
    const sourcePath = join(dir, 'source.json');
    for (const quality of [undefined, { ...syntheticTrialQuality(), status: 'READY', total: 1, eligible: 1, unresolvedEligible: 1 }]) {
      const snapshot = { ranges: sourceRows(data, events, retentionCurve, schoolAge, trial), trialAggregate: { quality, targetDate: data.asOf, fiscalYear: trial.annual.fiscalYear, aggregates: Object.fromEntries(['A','B','C','D'].map(id => [id, {today:0}])) } };
      await writeFile(sourcePath, JSON.stringify(snapshot));
      await assert.rejects(() => publishPrivateSavantSource({ rootDir: dir, sourcePath }), /TRIAL_DISPOSITION_QUALITY_(FIELDS_INVALID|BLOCKED)/);
      assert.deepEqual(await Promise.all(PUBLIC_FILES.map(file => readFile(join(dir, file)))), before);
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});
