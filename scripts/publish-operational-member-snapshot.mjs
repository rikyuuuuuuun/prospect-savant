import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { MEMBER_DEFINITION, createCanonicalOperationalMemberOutput, japaneseDateLabel } from './operational-member-canonical.mjs';
import { applyMemberMonthlyDelta, selectMemberMonthlyComparison } from './member-monthly-change.mjs';

const PUBLIC_FILES = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js'];

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

function clonePublicAggregate(value) {
  return JSON.parse(JSON.stringify(value));
}

function validateTeamSnapshot(snapshot, teamIds, label) {
  if (!Array.isArray(snapshot.teams)) throw new Error(`${label}: teams must be an array`);
  const teams = new Map();
  for (const team of snapshot.teams) {
    if (!team || typeof team !== 'object' || !teamIds.includes(team.id) || teams.has(team.id)) {
      throw new Error(`${label}: team composition is invalid`);
    }
    if (!Number.isSafeInteger(team.members) || team.members < 0) {
      throw new Error(`${label}: ${team.id} members must be a non-negative integer`);
    }
    teams.set(team.id, team);
  }
  if (teams.size !== teamIds.length || teamIds.some((teamId) => !teams.has(teamId))) {
    throw new Error(`${label}: team composition is invalid`);
  }
  return teams;
}

function validateCurrentSnapshot(data, teamIds) {
  if (!isValidIsoDate(data.asOf)) throw new Error('data.js: current asOf is invalid');
  if (!data.headline || !Number.isSafeInteger(data.headline.members) || data.headline.members < 0) {
    throw new Error('data.js: current headline members must be a non-negative integer');
  }
  const teams = validateTeamSnapshot(data, teamIds, 'data.js: current');
  const total = [...teams.values()].reduce((sum, team) => sum + team.members, 0);
  if (data.headline.members !== total) throw new Error('data.js: current headline members do not match team total');
  return teams;
}

function validateComparison(comparison, currentAsOf, teamIds) {
  if (!comparison || typeof comparison !== 'object') throw new Error('data.js: comparison must be an object');
  if (typeof comparison.scoreVersion !== 'string' || !comparison.scoreVersion) {
    throw new Error('data.js: comparison scoreVersion is required');
  }
  if (!isValidIsoDate(comparison.previousAsOf) || comparison.previousAsOf >= currentAsOf) {
    throw new Error('data.js: comparison must be older than current');
  }
  if (typeof comparison.previousAsOfLabel !== 'string' || !comparison.previousAsOfLabel) {
    throw new Error('data.js: comparison previousAsOfLabel is required');
  }
  if (!comparison.memberDefinition?.id || typeof comparison.memberDefinition.id !== 'string') {
    throw new Error('data.js: comparison memberDefinition is required');
  }
  if (!comparison.headline || !Number.isSafeInteger(comparison.headline.members) || comparison.headline.members < 0) {
    throw new Error('data.js: comparison headline members must be a non-negative integer');
  }
  const teams = validateTeamSnapshot(comparison, teamIds, 'data.js: comparison');
  const total = [...teams.values()].reduce((sum, team) => sum + team.members, 0);
  if (comparison.headline.members !== total) throw new Error('data.js: comparison headline members do not match team total');
  return teams;
}

function comparisonFromCurrent(data) {
  return {
    scoreVersion: data.scoreVersion,
    previousAsOf: data.asOf,
    previousAsOfLabel: data.asOfLabel,
    headline: clonePublicAggregate(data.headline),
    teams: clonePublicAggregate(data.teams),
    memberDefinition: clonePublicAggregate(data.memberDefinition),
  };
}

function gitBlobSha(content) {
  const bytes = Buffer.from(content.replace(/\r\n/g, '\n'), 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

function frozenJson(source, label) {
  const start = source.indexOf('Object.freeze(');
  const end = source.lastIndexOf(');');
  if (start < 0 || end <= start) throw new Error(`${label}: Object.freeze JSON payload not found`);
  return JSON.parse(source.slice(start + 'Object.freeze('.length, end));
}

function replaceSnapshotId(source, file, snapshotId) {
  const pattern = /((?:["']?snapshotId["']?)\s*:\s*["'])[^"']+(["'])/;
  if (!pattern.test(source)) throw new Error(`${file}: snapshotId was not found`);
  return source.replace(pattern, `$1${snapshotId}$2`);
}

export async function publishOperationalMemberSnapshot({ rootDir, input }) {
  const root = resolve(rootDir);
  const canonical = createCanonicalOperationalMemberOutput(input);
  if (!isValidIsoDate(canonical.snapshot.asOf)) throw new Error('new snapshot asOf is invalid');
  const dataPath = resolve(root, 'data.js');
  const data = frozenJson(await readFile(dataPath, 'utf8'), 'data.js');
  const oldData = clonePublicAggregate(data);
  const teamIds = Object.keys(canonical.finalCounts).sort();
  validateCurrentSnapshot(data, teamIds);
  if (data.comparison !== undefined && data.comparison !== null) {
    validateComparison(data.comparison, data.asOf, teamIds);
  }

  if (canonical.snapshot.asOf < data.asOf) {
    throw new Error(`new snapshot asOf ${canonical.snapshot.asOf} is older than current ${data.asOf}`);
  }

  let comparison = data.comparison;
  if (data.asOf < canonical.snapshot.asOf && data.memberDefinition?.id === canonical.definitionId) {
    if (typeof data.scoreVersion !== 'string' || !data.scoreVersion) {
      throw new Error('data.js: current scoreVersion is required for comparison rollover');
    }
    if (typeof data.asOfLabel !== 'string' || !data.asOfLabel) {
      throw new Error('data.js: current asOfLabel is required for comparison rollover');
    }
    comparison = comparisonFromCurrent(data);
  }

  data.snapshotId = canonical.snapshot.id;
  data.asOf = canonical.snapshot.asOf;
  data.asOfLabel = japaneseDateLabel(canonical.snapshot.asOf);
  data.memberDefinition = MEMBER_DEFINITION;
  data.headline.members = canonical.total;
  for (const team of data.teams) {
    team.members = canonical.finalCounts[team.id];
  }

  data.comparison = comparison;
  data.memberMonthlyComparison = selectMemberMonthlyComparison(oldData, canonical.snapshot.asOf, canonical.definitionId);
  applyMemberMonthlyDelta(data);

  await writeFile(dataPath, `window.PROSPECT_SAVANT_DATA = Object.freeze(${JSON.stringify(data, null, 2)});\n`, 'utf8');
  for (const file of PUBLIC_FILES.slice(1)) {
    const path = resolve(root, file);
    await writeFile(path, replaceSnapshotId(await readFile(path, 'utf8'), file, canonical.snapshot.id), 'utf8');
  }
  const manifestPath = resolve(root, 'snapshot-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.snapshotId = canonical.snapshot.id;
  manifest.asOf = canonical.snapshot.asOf;
  manifest.sourceCommit = canonical.sourceDigest;
  manifest.sourceKind = 'private-canonical-operational-roster';
  manifest.operationalMemberDefinition = canonical.definitionId;
  manifest.overlayDigest = canonical.overlayDigest;
  manifest.approvalReceipt = canonical.approvalReceipt;
  manifest.files = Object.fromEntries(await Promise.all(PUBLIC_FILES.map(async (file) => [file, gitBlobSha(await readFile(resolve(root, file), 'utf8'))])));
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return { counts: canonical.finalCounts, total: canonical.total };
}

async function main() {
  const [inputPath, rootArg] = process.argv.slice(2);
  if (!inputPath) throw new Error('usage: node scripts/publish-operational-member-snapshot.mjs <private-input.json> [root-dir]');
  const input = JSON.parse(await readFile(resolve(inputPath), 'utf8'));
  console.log(JSON.stringify(await publishOperationalMemberSnapshot({ rootDir: rootArg || process.cwd(), input }), null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
