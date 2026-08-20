import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { MEMBER_DEFINITION, createCanonicalOperationalMemberOutput, japaneseDateLabel } from './operational-member-canonical.mjs';

const PUBLIC_FILES = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js'];

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
  const dataPath = resolve(root, 'data.js');
  const data = frozenJson(await readFile(dataPath, 'utf8'), 'data.js');
  data.snapshotId = canonical.snapshot.id;
  data.asOf = canonical.snapshot.asOf;
  data.asOfLabel = japaneseDateLabel(canonical.snapshot.asOf);
  data.memberDefinition = MEMBER_DEFINITION;
  data.headline.members = canonical.total;
  data.headline.monthlyDelta = null;
  for (const team of data.teams || []) {
    if (!(team.id in canonical.finalCounts)) throw new Error(`data.js contains unexpected team ${team.id}`);
    team.members = canonical.finalCounts[team.id];
    team.monthlyDelta = null;
  }
  if (!data.comparison?.memberDefinition) data.comparison.memberDefinition = { id: 'legacy-record-count-v0', label: '旧レコード件数' };
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
