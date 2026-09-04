import { createHash } from 'node:crypto';

export const MEMBER_READBACK_RANGE = "'98_会員マスター連携'!A12:H18";
export const MEMBER_GATE_RANGE = "'98_会員マスター連携'!J12:K20";
const IDS = ['A', 'B', 'C', 'D'];
const fail = (code) => { throw new Error(code); };
const count = (value, code) => {
  if (!Number.isSafeInteger(value) || value < 0) fail(code);
  return value;
};

// This is a live IMPORTRANGE readback of the 05 aggregate, not a local projection.
// Private receipts remain in the private source; only their digest may be public.
export function readMemberReceipt(rows, gate) {
  const status = gate?.[8]?.[1];
  if (!status) fail('MEMBER_GATE_MISSING');
  if (status !== 'READY' && status !== 'BLOCKED_SYNC_NOT_COMPLETE') fail('MEMBER_SOURCE_BLOCKED');
  if (!Array.isArray(rows) || rows.length !== 7) fail('MEMBER_READBACK_MISSING');
  if (rows[0]?.[7] !== 'operational-person-v1') fail('MEMBER_DEFINITION_INVALID');
  const empty = (v) => v === '' || v === null || v === undefined;
  if (IDS.every((_, i) => empty(rows[i + 2]?.[1])) && empty(rows[2]?.[7])) {
    if (status !== 'BLOCKED_SYNC_NOT_COMPLETE') fail('MEMBER_GATE_COUNT_CONFLICT');
    return { ready: false, reason: 'MEMBER_SYNC_PENDING' };
  }
  if (status !== 'READY') fail('MEMBER_GATE_COUNT_CONFLICT');
  const counts = {};
  for (let i = 0; i < IDS.length; i++) {
    const row = rows[i + 2];
    if (row?.[0] !== IDS[i]) fail('MEMBER_TEAM_ORDER_INVALID');
    counts[IDS[i]] = count(row[1], `MEMBER_COUNT_INVALID_${IDS[i]}`);
    const source = count(row[2], 'MEMBER_SOURCE_COUNT_INVALID');
    const exception = count(row[3], 'MEMBER_EXCEPTION_COUNT_INVALID');
    count(row[4], 'MEMBER_EXCLUSION_COUNT_INVALID');
    if (source + exception !== row[1]) fail('MEMBER_COMPONENT_MISMATCH');
  }
  const total = IDS.reduce((n, id) => n + counts[id], 0);
  if (count(rows[6]?.[1], 'MEMBER_TOTAL_INVALID') !== total) fail('MEMBER_TOTAL_MISMATCH');
  const [snapshotId, asOf, sourceReceipt, overlayReceipt] = [1, 2, 3, 4].map(i => rows[i]?.[7]);
  if (typeof asOf !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(asOf) || new Date(`${asOf}T00:00:00Z`).toISOString().slice(0, 10) !== asOf) fail('MEMBER_ASOF_INVALID');
  if (gate[0]?.[1] !== asOf) fail('MEMBER_GATE_DATE_CONFLICT');
  if (typeof snapshotId !== 'string' || !snapshotId.startsWith(`${asOf}-`) || !sourceReceipt || !overlayReceipt) fail('MEMBER_PROVENANCE_MISSING');
  const receipt = { definitionId: rows[0][7], snapshotId, asOf, sourceReceipt, overlayReceipt, counts, total };
  return { ready: true, ...receipt, digest: createHash('sha256').update(JSON.stringify(receipt)).digest('hex') };
}

export function assertMemberSourceReadback(snapshot) {
  const ranges = snapshot?.ranges || {};
  const receipt = readMemberReceipt(ranges[MEMBER_READBACK_RANGE], ranges[MEMBER_GATE_RANGE]);
  if (!receipt.ready) fail(receipt.reason);
  const sources = [
    ["'98_会員マスター連携'!A4:AE9", 1, 0, 1, '12'],
    ["'03_月次集計'!A1:V12", 4, 1, 2, 'MONTHLY'],
    ["'01_チーム比較'!A1:P12", 4, 0, 1, 'TEAMS'],
  ];
  for (const [key, start, teamColumn, countColumn, label] of sources) {
    const rows = ranges[key];
    const seen = new Set();
    for (const row of rows?.slice(start, start + 4) || []) {
      const id = row?.[teamColumn];
      if (id === '' || id == null || id === '合計') continue;
      if (!IDS.includes(id) || seen.has(id)) fail(`MEMBER_${label}_TEAM_INVALID`);
      seen.add(id);
      if (count(row[countColumn], `MEMBER_${label}_COUNT_INVALID`) !== receipt.counts[id]) fail(`MEMBER_${label}_COUNT_MISMATCH_${id}`);
    }
    if (seen.size !== 4) fail(`MEMBER_${label}_TEAM_MISSING`);
  }
  if (ranges["'98_会員マスター連携'!A4:AE9"]?.[5]?.[1] !== receipt.total) fail('MEMBER_12_TOTAL_MISMATCH');
  if (ranges["'00_ダッシュボード'!A1:H23"]?.[4]?.[0] !== receipt.total) fail('MEMBER_HEADLINE_MISMATCH');
  if (snapshot.trialAggregate?.targetDate !== receipt.asOf) fail('MEMBER_SOURCE_DATE_MISMATCH');
  return receipt;
}

export function validateSourceQuality(rows) {
  if (!Array.isArray(rows) || rows.length < 5) fail('SOURCE_QUALITY_MISSING');
  const blocked = /(?:異常|エラー|失敗|未更新|要確認|欠損)/;
  rows.slice(4).forEach((row, index) => {
    const status = String(row?.[5] ?? '').trim();
    if (!status) fail(`SOURCE_QUALITY_STATUS_MISSING_R${index + 5}`);
    if (blocked.test(status)) fail(`SOURCE_QUALITY_BLOCKED_R${index + 5}`);
  });
}
