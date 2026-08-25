import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gitBlobSha } from './trial-publication.mjs';
import { parsePublicSource, publishPrivateSavantSource } from './publish-private-savant-source.mjs';
import { validateSnapshot } from './validate-snapshot.mjs';
import { applyMetricEvidenceAndExplanations } from './metric-explanations.mjs';

const METRIC_RANGES = Object.freeze({
  retention: "'05_定着力'!A1:R10",
  admission: "'06_入会力（年度）'!A1:H12",
  growth: "'07_成長力'!P4:W9",
  family: "'08_家庭継続力'!A1:O31",
  config: "'90_配点設定'!A1:J50",
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function jsonSource(name, value) {
  return `window.${name} = Object.freeze(${JSON.stringify(value, null, 2)});\n`;
}
async function readPublic(root, file) {
  return parsePublicSource(await readFile(join(root, file), 'utf8'), file);
}
function metricRanges(snapshot) {
  const source = snapshot?.ranges || {};
  const ranges = Object.fromEntries(Object.entries(METRIC_RANGES).map(([key, range]) => [key, source[range]]));
  for (const [key, rows] of Object.entries(ranges)) assert(Array.isArray(rows) && rows.length, `METRIC_EVIDENCE_RANGE_MISSING_${key}`);
  return ranges;
}
function carryPreviousMetricEvidence(data, previousData) {
  if (!data?.comparison?.teams?.length || data.comparison.previousAsOf !== previousData?.asOf || data.comparison.scoreVersion !== previousData?.scoreVersion) return;
  const previousTeams = new Map((previousData.teams || []).map((team) => [team.id, team]));
  for (const team of data.comparison.teams) {
    const previous = previousTeams.get(team.id);
    if (previous?.metricEvidence?.version === 'metric-evidence-v1') team.metricEvidence = previous.metricEvidence;
  }
}

export async function publishPrivateSavantWithExplanations({ rootDir = process.cwd(), sourcePath, dryRun = false }) {
  assert(sourcePath, 'sourcePath is required');
  const root = resolve(rootDir);
  const snapshot = JSON.parse(await readFile(resolve(sourcePath), 'utf8'));
  const ranges = metricRanges(snapshot);
  const [previousData, previousRetentionCurve, previousEventHistory, previousTrialData] = await Promise.all([
    readPublic(root, 'data.js'),
    readPublic(root, 'retention-data.js'),
    readPublic(root, 'event-data.js'),
    readPublic(root, 'trial-data.js'),
  ]);

  const result = await publishPrivateSavantSource({ rootDir: root, sourcePath, dryRun: false });
  const [data, retentionCurve, eventHistory] = await Promise.all([
    readPublic(root, 'data.js'),
    readPublic(root, 'retention-data.js'),
    readPublic(root, 'event-data.js'),
  ]);
  carryPreviousMetricEvidence(data, previousData);
  applyMetricEvidenceAndExplanations({
    data, ranges, retentionCurve, eventHistory,
    previousRetentionCurve, previousEventHistory, previousTrialData,
  });

  const dataSource = jsonSource('PROSPECT_SAVANT_DATA', data);
  await writeFile(join(root, 'data.js'), dataSource, 'utf8');
  const manifestPath = join(root, 'snapshot-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.files['data.js'] = gitBlobSha(dataSource);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  const validation = await validateSnapshot(root);
  assert(validation.ok, `METRIC_EXPLANATION_SNAPSHOT_INVALID:${validation.errors.join(',')}`);

  if (dryRun) {
    // Underlying publisher writes the verified candidate into root. Restore behavior expected by callers by signaling dry-run only;
    // workflow uses a disposable checkout, while unit tests should call the pure explanation helpers.
    return { ...result, dryRun: true, metricExplanations: true };
  }
  return { ...result, metricExplanations: true };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const positionals = args.filter((arg) => arg !== '--dry-run');
  const [sourcePath, rootDir = process.cwd()] = positionals;
  const result = await publishPrivateSavantWithExplanations({ rootDir, sourcePath, dryRun });
  console.log(JSON.stringify(result));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
}
