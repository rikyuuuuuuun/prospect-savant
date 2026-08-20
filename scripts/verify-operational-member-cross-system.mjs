import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { projectOperationalMembersForSheets } from './operational-member-sheet-projection.mjs';

function parseFrozenJson(source) {
  const marker = 'Object.freeze(';
  const start = source.indexOf(marker);
  const end = source.lastIndexOf(');');
  return JSON.parse(source.slice(start + marker.length, end));
}

export async function verifyOperationalMemberCrossSystem({ input, rootDir }) {
  const projection = projectOperationalMembersForSheets(input);
  const data = parseFrozenJson(await readFile(resolve(rootDir, 'data.js'), 'utf8'));
  const manifest = JSON.parse(await readFile(resolve(rootDir, 'snapshot-manifest.json'), 'utf8'));
  const savantCounts = Object.fromEntries(data.teams.map((team) => [team.id, team.members]));
  const sheet05Counts = Object.fromEntries(projection.sheet05.rows.map((row) => [row.team, row.operationalMembers]));
  const sheet12Counts = Object.fromEntries(projection.sheet12.rows.map((row) => [row.team, row.currentMembers]));
  const aggregateCounts = Object.fromEntries(projection.aggregateArtifact.rows.map((row) => [row.team, row.operationalMembers]));
  assert.deepEqual(aggregateCounts, projection.canonical.finalCounts, 'aggregate artifact diverges from canonical output');
  assert.deepEqual(sheet05Counts, projection.canonical.finalCounts, '05 equivalent diverges from canonical output');
  assert.deepEqual(sheet12Counts, projection.canonical.finalCounts, '12 equivalent diverges from canonical output');
  assert.deepEqual(savantCounts, projection.canonical.finalCounts, 'Savant snapshot diverges from canonical output');
  assert.equal(data.memberDefinition.id, projection.canonical.definitionId, 'Savant definition diverges');
  assert.equal(data.snapshotId, projection.canonical.snapshot.id, 'Savant snapshot ID diverges');
  assert.equal(data.asOf, projection.canonical.snapshot.asOf, 'Savant as-of diverges');
  for (const output of [projection.aggregateArtifact, projection.sheet05, projection.sheet12]) {
    assert.equal(output.definitionId, projection.canonical.definitionId, 'projection definition diverges');
    assert.equal(output.snapshotId, projection.canonical.snapshot.id, 'projection snapshot ID diverges');
    assert.equal(output.sourceDigest, projection.canonical.sourceDigest, 'projection source digest diverges');
    assert.equal(output.overlayDigest, projection.canonical.overlayDigest, 'projection overlay digest diverges');
  }
  assert.equal(manifest.snapshotId, projection.canonical.snapshot.id, 'manifest snapshot ID diverges');
  assert.equal(manifest.operationalMemberDefinition, projection.canonical.definitionId, 'manifest definition diverges');
  assert.equal(manifest.sourceCommit, projection.canonical.sourceDigest, 'manifest source digest diverges');
  assert.equal(manifest.overlayDigest, projection.canonical.overlayDigest, 'manifest overlay digest diverges');
  return { counts: projection.canonical.finalCounts, total: projection.canonical.total, sourceDigest: projection.canonical.sourceDigest };
}

async function main() {
  const [inputPath, rootArg] = process.argv.slice(2);
  if (!inputPath) throw new Error('usage: node scripts/verify-operational-member-cross-system.mjs <private-input.json> [root-dir]');
  const input = JSON.parse(await readFile(resolve(inputPath), 'utf8'));
  console.log(JSON.stringify(await verifyOperationalMemberCrossSystem({ input, rootDir: rootArg || process.cwd() }), null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
