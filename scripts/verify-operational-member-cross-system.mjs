import { readMemberReceipt } from './source-member-readback.mjs';
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

export function verifyLiveOperationalMemberReadback({ input, sheet05Rows, gateRows, sheet12Rows }) {
  const projection = projectOperationalMembersForSheets(input);
  const receipt = readMemberReceipt(sheet05Rows, gateRows);
  assert.equal(receipt.ready, true, 'live member aggregate is not ready');
  assert.deepEqual(receipt.counts, projection.canonical.finalCounts, 'live 05 diverges from canonical output');
  assert.equal(receipt.definitionId, projection.canonical.definitionId, 'live 05 definition diverges');
  assert.equal(receipt.asOf, projection.canonical.snapshot.asOf, 'live 05 date diverges');
  assert.equal(receipt.snapshotId, projection.canonical.snapshot.id, 'live 05 snapshot diverges');
  for (const [i, id] of ['A', 'B', 'C', 'D'].entries()) {
    assert.equal(sheet12Rows?.[i + 1]?.[0], id, 'live 12 team order diverges');
    assert.equal(sheet12Rows[i + 1][1], receipt.counts[id], 'live 12 diverges from canonical output');
  }
  assert.equal(sheet12Rows?.[5]?.[1], receipt.total, 'live 12 total diverges');
  return receipt;
}

export async function verifyOperationalMemberCrossSystem({ input, rootDir, readback }) {
  assert(readback, 'live Sheets readback is required; a local projection is not verification');
  verifyLiveOperationalMemberReadback({ input, ...readback });
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
  const [inputPath, rootArg, readbackPath] = process.argv.slice(2);
  if (!inputPath || !readbackPath) throw new Error('usage: node scripts/verify-operational-member-cross-system.mjs <private-input.json> <root-dir> <private-readback.json>');
  const input = JSON.parse(await readFile(resolve(inputPath), 'utf8'));
  const readback = JSON.parse(await readFile(resolve(readbackPath), 'utf8'));
  console.log(JSON.stringify(await verifyOperationalMemberCrossSystem({ input, rootDir: rootArg || process.cwd(), readback }), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
