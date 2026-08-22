import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { gitBlobSha, parseFrozenJson, publishTrialData, validatePublishedTrialData } from './trial-publication.mjs';
import { validateSnapshot } from './validate-snapshot.mjs';
import { fiscalYearFor, serialToIsoDate, trialPublicInput } from './private-trial-aggregate.mjs';

const MAIN_FILES = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js'];
const PUBLIC_FILES = [...MAIN_FILES, 'snapshot-manifest.json', 'trial-data.js', 'trial-manifest.json'];
const TEAM_IDS = ['A', 'B', 'C', 'D'];
const RANGES = Object.freeze({
  dashboard: "'00_ダッシュボード'!A1:H23",
  teams: "'01_チーム比較'!A1:P12",
  monthly: "'03_月次集計'!A1:V12",
  events: "'04_イベント力'!A1:S100",
  retention: "'05_定着力'!A1:R10",
  admission: "'06_入会力（年度）'!A1:H12",
  schoolAge: "'09_学齢継続'!A1:J12",
  curve: "'10_定着曲線'!A1:K17",
  quality: "'99_データ品質'!A1:F20",
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function jsonSource(name, value) {
  return `window.${name} = Object.freeze(${JSON.stringify(value, null, 2)});\n`;
}

export function parsePublicSource(source, file) {
  try {
    return parseFrozenJson(source, file);
  } catch {
    const marker = 'Object.freeze(';
    const start = source.indexOf(marker);
    const end = source.lastIndexOf(');');
    assert(start >= 0 && end > start, `${file}: Object.freeze payload not found`);
    // 既存公開ファイルの識別子キーだけをJSONへ正規化する。式や関数は許容しない。
    const objectLiteral = source.slice(start + marker.length, end)
      .replace(/([,{]\s*)([A-Za-z_$][\w$]*)(\s*:)/g, '$1"$2"$3')
      .replace(/,(\s*[}\]])/g, '$1');
    try { return JSON.parse(objectLiteral); } catch { throw new Error(`${file}: public object is not JSON-compatible`); }
  }
}

function requiredNumber(value, label) {
  assert(value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value)), `${label}_INVALID`);
  return Number(value);
}

function requiredCount(value, label) {
  const count = requiredNumber(value, label);
  assert(Number.isSafeInteger(count) && count >= 0, `${label}_INVALID`);
  return count;
}

function round(value, digits = 1) {
  return Number((requiredNumber(value, 'SOURCE_VALUE') * (10 ** digits)).toFixed(0)) / (10 ** digits);
}

function percentage(value, label = 'SOURCE_RATE') {
  return round(requiredNumber(value, label) * 100);
}

function teamRows(rows, headerRow, teamColumn = 0) {
  const result = new Map();
  for (const row of rows.slice(headerRow + 1)) if (TEAM_IDS.includes(row?.[teamColumn])) result.set(row[teamColumn], row);
  assert(TEAM_IDS.every((team) => result.has(team)), 'SOURCE_TEAM_ROWS_INCOMPLETE');
  return result;
}

function formatJapaneseDate(asOf) {
  const [year, month, day] = asOf.split('-').map(Number);
  return `${year}年${month}月${day}日`;
}

function sourceAsOf(monthly) {
  const rows = teamRows(monthly, 3, 1);
  const dates = new Set(TEAM_IDS.map((team) => serialToIsoDate(rows.get(team)[21])));
  assert(dates.size === 1 && !dates.has(null), 'SOURCE_ASOF_INVALID');
  return [...dates][0];
}

function annualFromSource(admission) {
  const rows = teamRows(admission, 3);
  return Object.fromEntries(TEAM_IDS.map((team) => {
    const trials = requiredCount(rows.get(team)[1], `ANNUAL_TRIALS_${team}`);
    const admissions = requiredCount(rows.get(team)[2], `ANNUAL_ADMISSIONS_${team}`);
    assert(admissions <= trials, `ANNUAL_COUNTS_INVALID_${team}`);
    return [team, {
      trials, admissions, rate: percentage(rows.get(team)[3], `ANNUAL_RATE_${team}`),
      previousRate: percentage(rows.get(team)[4], `ANNUAL_PREVIOUS_RATE_${team}`), yoyDelta: percentage(rows.get(team)[5], `ANNUAL_DELTA_${team}`), score: round(rows.get(team)[6], 0),
    }];
  }));
}

function updateData(data, ranges, asOf) {
  const dashboard = ranges.dashboard;
  const teamComparison = teamRows(ranges.teams, 3);
  const retention = teamRows(ranges.retention, 3);
  const annual = annualFromSource(ranges.admission);
  const eventSummary = teamRows(ranges.events, 3);
  const oldData = structuredClone(data);
  assert(asOf >= oldData.asOf, 'SOURCE_ASOF_OLDER_THAN_PUBLIC');

  data.snapshotId = `savant-${asOf}-0730`;
  data.asOf = asOf;
  data.asOfLabel = formatJapaneseDate(asOf);
  // 4行目は見出し、5行目がダッシュボードの集計値。見出しを数値として扱わない。
  data.headline.members = requiredNumber(dashboard[4]?.[0], 'DASHBOARD_MEMBERS');
  data.headline.monthlyDelta = requiredNumber(dashboard[4]?.[1], 'DASHBOARD_MONTHLY_DELTA');
  data.headline.admissionRate = percentage(dashboard[4]?.[2], 'DASHBOARD_ADMISSION_RATE');
  data.headline.latestEventParticipants = requiredNumber(dashboard[4]?.[3], 'DASHBOARD_LATEST_EVENT_PARTICIPANTS');

  const currentTeams = new Map(data.teams.map((team) => [team.id, team]));
  for (const id of TEAM_IDS) {
    const team = currentTeams.get(id);
    const source = teamComparison.get(id);
    const retentionSource = retention.get(id);
    const eventSource = eventSummary.get(id);
    assert(team && source && retentionSource && eventSource, 'SOURCE_TEAM_MAPPING_INVALID');
    assert(percentage(source[5], `TEAM_ADMISSION_RATE_${id}`) === annual[id].rate, `ANNUAL_RATE_RECONCILIATION_REQUIRED_${id}`);
    assert(round(source[6], 0) === annual[id].score, `ANNUAL_SCORE_RECONCILIATION_REQUIRED_${id}`);
    team.members = requiredNumber(source[1], `TEAM_MEMBERS_${id}`);
    team.monthlyDelta = requiredNumber(source[2], `TEAM_MONTHLY_DELTA_${id}`);
    team.overall = round(source[13], 0);
    team.rank = requiredNumber(source[14], `TEAM_RANK_${id}`);
    team.status = String(source[15]);
    team.metrics.retention = round(source[4], 0);
    team.metrics.admission = round(source[6], 0);
    team.metrics.event = round(source[9], 0);
    team.metrics.growth = round(source[10], 0);
    team.metrics.family = round(source[11], 0);
    team.benchmark.retention12mRate = percentage(retentionSource[5], `RETENTION_12M_RATE_${id}`);
    team.benchmark.retention12mSample = requiredNumber(retentionSource[6], `RETENTION_12M_SAMPLE_${id}`);
    team.benchmark.admissionRate = annual[id].rate;
    team.benchmark.admissionPreviousRate = annual[id].previousRate;
    team.benchmark.admissionYoYDelta = annual[id].yoyDelta;
    team.benchmark.eventRate = percentage(eventSource[2], `EVENT_RATE_${id}`);
    team.benchmark.repeatRate = percentage(eventSource[7], `EVENT_REPEAT_RATE_${id}`);
  }
  const members = data.teams.reduce((sum, team) => sum + team.members, 0);
  assert(members === data.headline.members, 'SOURCE_HEADLINE_MEMBER_MISMATCH');
  const annualTotal = TEAM_IDS.reduce((sum, id) => ({
    admissions: sum.admissions + annual[id].admissions,
    trials: sum.trials + annual[id].trials,
  }), { admissions: 0, trials: 0 });
  assert(annualTotal.trials > 0 && data.headline.admissionRate === round(annualTotal.admissions * 100 / annualTotal.trials),
    'DASHBOARD_ANNUAL_RATE_RECONCILIATION_REQUIRED');

  if (oldData.asOf < asOf && oldData.memberDefinition?.id === data.memberDefinition?.id) {
    data.comparison = {
      scoreVersion: oldData.scoreVersion,
      previousAsOf: oldData.asOf,
      previousAsOfLabel: oldData.asOfLabel,
      headline: oldData.headline,
      teams: oldData.teams.map((team) => ({ id: team.id, rank: team.rank, members: team.members, overall: team.overall, metrics: team.metrics })),
      memberDefinition: oldData.memberDefinition,
    };
  }
  return annual;
}

function updateRetentionCurve(curve, range, snapshotId, asOf) {
  const rows = new Map(range.slice(4).map((row) => [Number(row[0]), row]));
  curve.snapshotId = snapshotId;
  curve.asOf = asOf;
  for (const team of TEAM_IDS) {
    const rateColumn = TEAM_IDS.indexOf(team) + 1;
    const sampleColumn = TEAM_IDS.indexOf(team) + 6;
    curve.teams[team].rates = curve.months.map((month) => {
      const row = rows.get(month);
      assert(row, 'SOURCE_RETENTION_CURVE_INCOMPLETE');
      const sample = requiredNumber(row[sampleColumn], `RETENTION_SAMPLE_${team}_${month}`);
      return sample >= curve.minimumSample ? percentage(row[rateColumn], `RETENTION_RATE_${team}_${month}`) : null;
    });
    curve.teams[team].samples = curve.months.map((month) => requiredNumber(rows.get(month)[sampleColumn], `RETENTION_SAMPLE_${team}_${month}`));
  }
  curve.overall.rates = curve.months.map((month) => {
    const row = rows.get(month);
    const sample = requiredNumber(row[10], `RETENTION_SAMPLE_ALL_${month}`);
    return sample >= curve.minimumSample ? percentage(row[5], `RETENTION_RATE_ALL_${month}`) : null;
  });
  curve.overall.samples = curve.months.map((month) => requiredNumber(rows.get(month)[10], `RETENTION_SAMPLE_ALL_${month}`));
}

function updateSchoolAge(schoolAge, range, snapshotId, asOf) {
  const rows = teamRows(range, 3);
  const all = range.slice(4).find((row) => row?.[0] === '合計');
  assert(all, 'SOURCE_SCHOOL_AGE_TOTAL_MISSING');
  schoolAge.snapshotId = snapshotId;
  schoolAge.asOf = asOf;
  const update = (target, row) => {
    target.samples = [1, 3, 5, 7].map((index) => requiredNumber(row[index], 'SCHOOL_AGE_SAMPLE'));
    target.rates = [2, 4, 6, 8].map((index, position) => target.samples[position] >= schoolAge.minimumSample ? percentage(row[index], 'SCHOOL_AGE_RATE') : null);
  };
  for (const id of TEAM_IDS) update(schoolAge.teams[id], rows.get(id));
  update(schoolAge.overall, all);
}

function updateEventHistory(events, range, snapshotId, asOf) {
  const summary = teamRows(range, 3);
  events.snapshotId = snapshotId;
  events.asOf = asOf;
  events.historicalMaxRate = percentage(summary.get('A')[3], 'EVENT_HISTORICAL_MAX_RATE');
  events.repeatMaxRate = Math.max(...TEAM_IDS.map((id) => percentage(summary.get(id)[7], `EVENT_REPEAT_RATE_${id}`)));
  for (const id of TEAM_IDS) {
    const source = summary.get(id);
    events.teams[id] = {
      averageRate: percentage(source[2], `EVENT_AVERAGE_RATE_${id}`), participationScore: round(source[4]), repeatRate: percentage(source[7], `EVENT_REPEAT_RATE_${id}`), repeatScore: round(source[8]), score: round(source[9], 0),
    };
  }
  const detail = new Map(range.slice(15).filter((row) => Number.isFinite(row?.[0])).map((row) => [`${serialToIsoDate(row[0])}|${serialToIsoDate(row[1])}`, row]));
  assert(detail.size === events.events.length, 'EVENT_PUBLIC_MAPPING_REQUIRED');
  for (const event of events.events) {
    const row = detail.get(`${event.startDate}|${event.endDate}`);
    assert(row, 'EVENT_PUBLIC_MAPPING_REQUIRED');
    const updateTeam = (id, offset) => {
      const participants = row[offset] === null || row[offset] === undefined || row[offset] === '' ? null : requiredNumber(row[offset], `EVENT_PARTICIPANTS_${id}`);
      const members = row[offset + 1] === null || row[offset + 1] === undefined || row[offset + 1] === '' ? null : requiredNumber(row[offset + 1], `EVENT_MEMBERS_${id}`);
      const rate = participants === null || members === null ? null : percentage(row[offset + 2], `EVENT_RATE_${id}`);
      if (participants === null || members === null) return { ...event.teams[id], participants: null, members: null, rate: null, eligible: false };
      return { participants, members, rate };
    };
    event.teams.A = updateTeam('A', 4);
    event.teams.B = updateTeam('B', 7);
    event.teams.C = updateTeam('C', 10);
    event.teams.D = updateTeam('D', 13);
    event.total = { participants: requiredNumber(row[16], 'EVENT_TOTAL_PARTICIPANTS'), members: requiredNumber(row[17], 'EVENT_TOTAL_MEMBERS'), rate: percentage(row[18], 'EVENT_TOTAL_RATE') };
    const assigned = TEAM_IDS.reduce((sum, id) => sum + (event.teams[id].participants || 0), 0);
    if (event.total.participants > assigned) event.total.unassignedParticipants = event.total.participants - assigned;
    else delete event.total.unassignedParticipants;
  }
}

async function checkJavaScript(root) {
  for (const file of MAIN_FILES.concat('trial-data.js')) {
    await new Promise((resolvePromise, reject) => {
      const child = spawn(process.execPath, ['--check', file], { cwd: root, stdio: 'ignore' });
      child.once('exit', (code) => (code === 0 ? resolvePromise() : reject(new Error(`JS_SYNTAX_INVALID_${file}`))));
      child.once('error', reject);
    });
  }
}

function sourceRanges(snapshot) {
  const values = snapshot?.ranges || {};
  const ranges = Object.fromEntries(Object.entries(RANGES).map(([key, range]) => [key, values[range]]));
  for (const [key, rows] of Object.entries(ranges)) assert(Array.isArray(rows) && rows.length, `SOURCE_RANGE_MISSING_${key}`);
  ranges.trialAggregate = snapshot.trialAggregate;
  assert(ranges.trialAggregate?.aggregates, 'TRIAL_AGGREGATE_MISSING');
  return ranges;
}

function validateSourceQuality(range) {
  const blocked = /(?:異常|エラー|失敗|未更新|要確認|欠損)/;
  for (const row of range.slice(4)) {
    const status = String(row?.[5] ?? '');
    assert(status.trim(), 'SOURCE_QUALITY_STATUS_MISSING');
    assert(!blocked.test(status), 'SOURCE_QUALITY_BLOCKED');
  }
}

async function publishInto(root, snapshot) {
  const ranges = sourceRanges(snapshot);
  validateSourceQuality(ranges.quality);
  const data = parsePublicSource(await readFile(join(root, 'data.js'), 'utf8'), 'data.js');
  const events = parsePublicSource(await readFile(join(root, 'event-data.js'), 'utf8'), 'event-data.js');
  const retention = parsePublicSource(await readFile(join(root, 'retention-data.js'), 'utf8'), 'retention-data.js');
  const schoolAge = parsePublicSource(await readFile(join(root, 'school-age-data.js'), 'utf8'), 'school-age-data.js');
  const asOf = sourceAsOf(ranges.monthly);
  assert(ranges.trialAggregate.targetDate === asOf, 'TRIAL_DATE_SOURCE_ASOF_MISMATCH');
  assert(ranges.trialAggregate.fiscalYear === fiscalYearFor(asOf), 'TRIAL_FISCAL_YEAR_SOURCE_ASOF_MISMATCH');
  updateData(data, ranges, asOf);
  updateEventHistory(events, ranges.events, data.snapshotId, asOf);
  updateRetentionCurve(retention, ranges.curve, data.snapshotId, asOf);
  updateSchoolAge(schoolAge, ranges.schoolAge, data.snapshotId, asOf);
  const output = {
    'data.js': jsonSource('PROSPECT_SAVANT_DATA', data),
    'event-data.js': jsonSource('PROSPECT_EVENT_HISTORY', events),
    'retention-data.js': jsonSource('PROSPECT_RETENTION_CURVE', retention),
    'school-age-data.js': jsonSource('PROSPECT_SCHOOL_AGE_RETENTION', schoolAge),
  };
  for (const [file, content] of Object.entries(output)) await writeFile(join(root, file), content, 'utf8');
  const oldManifest = JSON.parse(await readFile(join(root, 'snapshot-manifest.json'), 'utf8'));
  const manifest = {
    ...oldManifest,
    snapshotId: data.snapshotId,
    asOf,
    scoreVersion: data.scoreVersion,
    sourceCommit: 'sheets-readonly-source-v1',
    sourceKind: 'private-sheets-readonly-anonymous-aggregate-v1',
    files: Object.fromEntries(Object.entries(output).map(([file, content]) => [file, gitBlobSha(content)])),
  };
  await writeFile(join(root, 'snapshot-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  const trial = trialPublicInput({
    aggregates: ranges.trialAggregate.aggregates,
    annualTeams: annualFromSource(ranges.admission),
    targetDate: ranges.trialAggregate.targetDate,
    fiscalYear: ranges.trialAggregate.fiscalYear,
  });
  await publishTrialData({ rootDir: root, input: trial });
  const mainValidation = await validateSnapshot(root);
  const trialValidation = await validatePublishedTrialData(root);
  assert(mainValidation.ok, `SNAPSHOT_VALIDATION_FAILED:${mainValidation.errors.join(',')}`);
  assert(trialValidation.ok, `TRIAL_VALIDATION_FAILED:${trialValidation.errors.join(',')}`);
  await checkJavaScript(root);
}

export async function publishPrivateSavantSource({ rootDir = process.cwd(), sourcePath, dryRun = false }) {
  assert(sourcePath, 'sourcePath is required');
  const snapshot = JSON.parse(await readFile(resolve(sourcePath), 'utf8'));
  const candidate = await mkdtemp(join(tmpdir(), 'prospect-savant-publish-'));
  try {
    for (const file of PUBLIC_FILES) await copyFile(join(rootDir, file), join(candidate, file));
    await publishInto(candidate, snapshot);
    if (!dryRun) for (const file of PUBLIC_FILES) await copyFile(join(candidate, file), join(rootDir, file));
    return { ok: true, changedFiles: PUBLIC_FILES, dryRun };
  } finally {
    await rm(candidate, { recursive: true, force: true });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const positionals = args.filter((arg) => arg !== '--dry-run');
  const [sourcePath, rootDir = process.cwd()] = positionals;
  const result = await publishPrivateSavantSource({ rootDir, sourcePath, dryRun });
  console.log(JSON.stringify(result));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
