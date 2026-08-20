import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildOperationalRoster } from './operational-member-roster.mjs';

const PUBLIC_FILES = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js'];
const MEMBER_DEFINITION = Object.freeze({ id: 'operational-person-v1', label: '人物単位運用会員' });
const INPUT_KEYS = new Set(['snapshot', 'records', 'teamOverrides', 'exceptions', 'approvalReceipt']);

function requireExactKeys(value, allowedKeys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) throw new Error(`${label} contains unsupported field ${key}`);
  }
}

function gitBlobSha(content) {
  const bytes = Buffer.from(content.replace(/\r\n/g, '\n'), 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

function parseFrozenJson(source, label) {
  const marker = 'Object.freeze(';
  const start = source.indexOf(marker);
  const end = source.lastIndexOf(');');
  if (start < 0 || end < 0 || end <= start) throw new Error(`${label}: Object.freeze JSON payload not found`);
  return JSON.parse(source.slice(start + marker.length, end));
}

function replaceSnapshotId(source, file, snapshotId) {
  const pattern = /((?:["']?snapshotId["']?)\s*:\s*["'])[^"']+(["'])/;
  if (!pattern.test(source)) throw new Error(`${file}: snapshotId was not found`);
  return source.replace(pattern, `$1${snapshotId}$2`);
}

function requireSnapshot(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('private input must be an object');
  for (const key of Object.keys(input)) {
    if (!INPUT_KEYS.has(key)) throw new Error(`unexpected private input field ${key}`);
  }
  const snapshot = input.snapshot;
  if (!snapshot || typeof snapshot !== 'object') throw new Error('input snapshot is required');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshot.asOf || '')) throw new Error('snapshot.asOf must be YYYY-MM-DD');
  if (!/^\d{4}-\d{2}-\d{2}-v\d+-\d+-operational-members$/.test(snapshot.id || '')) {
    throw new Error('snapshot.id must be an operational-member snapshot ID');
  }
  if (Object.keys(snapshot).some((key) => !['id', 'asOf'].includes(key))) throw new Error('snapshot contains unsupported metadata');
  return snapshot;
}

function japaneseDateLabel(date) {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}年${month}月${day}日`;
}

function receiptEntries(entries, key) {
  const result = {};
  for (const entry of entries) {
    const entryKey = key(entry);
    if (Object.hasOwn(result, entryKey)) throw new Error(`approvalReceipt contains duplicate entry ${entryKey}`);
    result[entryKey] = entry.count;
  }
  return result;
}

function validateApprovalReceipt(input) {
  const receipt = input.approvalReceipt;
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) throw new Error('approvalReceipt is required');
  if (Object.keys(receipt).some((key) => !['teamOverrides', 'exceptions'].includes(key))) {
    throw new Error('approvalReceipt contains unsupported fields');
  }
  if (!Array.isArray(receipt.teamOverrides) || !Array.isArray(receipt.exceptions)) {
    throw new Error('approvalReceipt must contain teamOverrides and exceptions arrays');
  }
  const actualOverrides = {};
  for (const override of input.teamOverrides || []) {
    const records = (input.records || []).filter((record) => record.personKey === override.personKey && ['在籍', '休会', '退会予定'].includes(record.status));
    const sourceTeams = [...new Set(records.map((record) => record.team))].sort();
    const key = `${sourceTeams.join(',')}→${override.effectiveTeam}`;
    actualOverrides[key] = (actualOverrides[key] || 0) + 1;
  }
  const actualExceptions = {};
  for (const exception of input.exceptions || []) {
    actualExceptions[exception.team] = (actualExceptions[exception.team] || 0) + 1;
  }
  const declaredOverrides = receiptEntries(receipt.teamOverrides, (entry) => {
    requireExactKeys(entry, new Set(['sourceTeams', 'effectiveTeam', 'count']), 'approvalReceipt teamOverrides entry');
    if (!Array.isArray(entry.sourceTeams) || !entry.effectiveTeam || !Number.isInteger(entry.count) || entry.count < 1) {
      throw new Error('approvalReceipt teamOverrides entry is invalid');
    }
    if (entry.sourceTeams.some((team) => typeof team !== 'string' || !['A', 'B', 'C', 'D'].includes(team))
      || typeof entry.effectiveTeam !== 'string' || !['A', 'B', 'C', 'D'].includes(entry.effectiveTeam)) {
      throw new Error('approvalReceipt teamOverrides entry has invalid team');
    }
    return `${[...entry.sourceTeams].sort().join(',')}→${entry.effectiveTeam}`;
  });
  const declaredExceptions = receiptEntries(receipt.exceptions, (entry) => {
    requireExactKeys(entry, new Set(['team', 'count']), 'approvalReceipt exceptions entry');
    if (!entry.team || !Number.isInteger(entry.count) || entry.count < 1) throw new Error('approvalReceipt exceptions entry is invalid');
    if (typeof entry.team !== 'string' || !['A', 'B', 'C', 'D'].includes(entry.team)) throw new Error('approvalReceipt exceptions entry has invalid team');
    return entry.team;
  });
  if (JSON.stringify(actualOverrides) !== JSON.stringify(declaredOverrides)) throw new Error('approvalReceipt teamOverrides do not match input');
  if (JSON.stringify(actualExceptions) !== JSON.stringify(declaredExceptions)) throw new Error('approvalReceipt exceptions do not match input');
  return { teamOverrides: declaredOverrides, exceptions: declaredExceptions };
}

/**
 * Converts a private normalized feed into the public aggregate snapshot.
 * Input must contain opaque person keys only and must remain outside Git.
 */
export async function publishOperationalMemberSnapshot({ rootDir, input }) {
  const root = resolve(rootDir);
  const snapshot = requireSnapshot(input);
  const approvalReceipt = validateApprovalReceipt(input);
  const operational = buildOperationalRoster(input);
  const dataPath = resolve(root, 'data.js');
  const dataSource = await readFile(dataPath, 'utf8');
  const data = parseFrozenJson(dataSource, 'data.js');

  data.snapshotId = snapshot.id;
  data.asOf = snapshot.asOf;
  data.asOfLabel = japaneseDateLabel(snapshot.asOf);
  data.memberDefinition = MEMBER_DEFINITION;
  data.headline.members = operational.total;
  for (const team of data.teams || []) {
    if (!(team.id in operational.counts)) throw new Error(`data.js contains unexpected team ${team.id}`);
    team.members = operational.counts[team.id];
    team.monthlyDelta = null;
  }
  if (!data.comparison?.memberDefinition) {
    data.comparison.memberDefinition = { id: 'legacy-record-count-v0', label: '旧レコード件数' };
  }
  data.headline.monthlyDelta = null;
  await writeFile(dataPath, `window.PROSPECT_SAVANT_DATA = Object.freeze(${JSON.stringify(data, null, 2)});\n`, 'utf8');

  for (const file of PUBLIC_FILES.slice(1)) {
    const path = resolve(root, file);
    const source = await readFile(path, 'utf8');
    await writeFile(path, replaceSnapshotId(source, file, snapshot.id), 'utf8');
  }

  const manifestPath = resolve(root, 'snapshot-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.snapshotId = snapshot.id;
  manifest.asOf = snapshot.asOf;
  manifest.sourceCommit = `private-roster-sha256:${createHash('sha256').update(JSON.stringify(input)).digest('hex')}`;
  manifest.sourceKind = 'private-canonical-operational-roster';
  manifest.operationalMemberDefinition = MEMBER_DEFINITION.id;
  manifest.approvalReceipt = approvalReceipt;
  manifest.files = Object.fromEntries(await Promise.all(PUBLIC_FILES.map(async (file) => {
    const content = await readFile(resolve(root, file), 'utf8');
    return [file, gitBlobSha(content)];
  })));
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  return operational;
}

async function main() {
  const [inputPath, rootArg] = process.argv.slice(2);
  if (!inputPath) throw new Error('usage: node scripts/publish-operational-member-snapshot.mjs <private-input.json> [root-dir]');
  const input = JSON.parse(await readFile(resolve(inputPath), 'utf8'));
  const result = await publishOperationalMemberSnapshot({ rootDir: rootArg || process.cwd(), input });
  console.log(JSON.stringify({ counts: result.counts, total: result.total }, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
