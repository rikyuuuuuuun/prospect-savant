import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { publishOperationalMemberSnapshot } from '../scripts/publish-operational-member-snapshot.mjs';

const PUBLIC_FILES = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js'];

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'prospect-operational-snapshot-'));
  await writeFile(join(root, 'data.js'), `window.PROSPECT_SAVANT_DATA = Object.freeze({
  "snapshotId": "old",
  "asOf": "2026-08-19",
  "asOfLabel": "old",
  "headline": { "members": 0, "monthlyDelta": 0 },
  "comparison": { "headline": { "members": 0 }, "teams": [] },
  "teams": [
    { "id": "A", "members": 0, "monthlyDelta": 0 },
    { "id": "B", "members": 0, "monthlyDelta": 0 },
    { "id": "C", "members": 0, "monthlyDelta": 0 },
    { "id": "D", "members": 0, "monthlyDelta": 0 }
  ]
});\n`, 'utf8');
  await writeFile(join(root, 'event-data.js'), 'window.PROSPECT_EVENT_HISTORY = Object.freeze({"snapshotId":"old"});\n', 'utf8');
  await writeFile(join(root, 'retention-data.js'), 'window.PROSPECT_RETENTION_CURVE = Object.freeze({snapshotId:"old"});\n', 'utf8');
  await writeFile(join(root, 'school-age-data.js'), 'window.PROSPECT_SCHOOL_AGE_RETENTION = Object.freeze({snapshotId:"old"});\n', 'utf8');
  await writeFile(join(root, 'snapshot-manifest.json'), JSON.stringify({ files: {} }), 'utf8');
  return root;
}

test('publishes one aggregate snapshot from a private canonical roster', async () => {
  const root = await fixture();
  try {
    const input = {
      snapshot: { id: '2026-08-20-v1-001-operational-members', asOf: '2026-08-20' },
      records: [
        { personKey: 'a', team: 'A', status: '在籍' },
        { personKey: 'bc', team: 'B', status: '在籍' },
        { personKey: 'bc', team: 'C', status: '休会' },
        { personKey: 'c', team: 'C', status: '休会' },
        { personKey: 'd', team: 'D', status: '退会予定' },
      ],
      teamOverrides: [{ personKey: 'bc', effectiveTeam: 'B', approved: true, active: true }],
      exceptions: [{ personKey: 'b-extra', team: 'B', approved: true, active: true }],
      approvalReceipt: {
        teamOverrides: [{ sourceTeams: ['B', 'C'], effectiveTeam: 'B', count: 1 }],
        exceptions: [{ team: 'B', count: 1 }],
      },
    };
    const result = await publishOperationalMemberSnapshot({ rootDir: root, input });

    assert.deepEqual(result.counts, { A: 1, B: 2, C: 1, D: 1 });
    assert.equal(result.total, 5);
    const data = await readFile(join(root, 'data.js'), 'utf8');
    assert.match(data, /"members": 5/);
    assert.match(data, /"monthlyDelta": null/);
    for (const file of PUBLIC_FILES) {
      assert.match(await readFile(join(root, file), 'utf8'), /2026-08-20-v1-001-operational-members/);
    }
    const manifest = JSON.parse(await readFile(join(root, 'snapshot-manifest.json'), 'utf8'));
    assert.equal(manifest.operationalMemberDefinition, 'operational-person-v1');
    assert.match(manifest.sourceCommit, /^private-roster-sha256:[0-9a-f]{64}$/);
    assert.equal(manifest.sourceKind, 'private-canonical-operational-roster');
    assert.deepEqual(manifest.approvalReceipt, {
      teamOverrides: { 'B,C→B': 1 },
      exceptions: { B: 1 },
    });
    assert.deepEqual(Object.keys(manifest.files), PUBLIC_FILES);

    const rerun = await publishOperationalMemberSnapshot({ rootDir: root, input });
    assert.deepEqual(rerun, result);

    await assert.rejects(
      publishOperationalMemberSnapshot({
        rootDir: root,
        input: { ...input, approvalReceipt: { ...input.approvalReceipt, exceptions: [{ team: 'B', count: 2 }] } },
      }),
      /approvalReceipt exceptions do not match input/,
    );
    await assert.rejects(
      publishOperationalMemberSnapshot({
        rootDir: root,
        input: {
          ...input,
          records: input.records.map((record, index) => index === 0
            ? { ...record, email: 'must-not-pass@example.invalid' }
            : record),
        },
      }),
      /contains unsupported field email/,
    );
    await assert.rejects(
      publishOperationalMemberSnapshot({
        rootDir: root,
        input: { ...input, approvalReceipt: { ...input.approvalReceipt, exceptions: [{ team: 'B', count: 1, approver: 'must-not-pass' }] } },
      }),
      /contains unsupported field approver/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
