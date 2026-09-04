export function syntheticMemberReadback(asOf = '2026-08-21', counts = { A: 1, B: 2, C: 3, D: 4 }) {
  const rows = Array.from({ length: 7 }, () => Array(8).fill(''));
  ['operational-person-v1', `${asOf}-v1-001-operational-members`, asOf, 'fixture-source', 'fixture-overlay'].forEach((v, i) => rows[i][7] = v);
  Object.entries(counts).forEach(([id, n], i) => rows[i + 2].splice(0, 5, id, n, n, 0, 0));
  rows[6][0] = '合計'; rows[6][1] = Object.values(counts).reduce((a, b) => a + b, 0);
  return rows;
}

export function syntheticMemberGate(asOf = '2026-08-21') {
  const rows = Array.from({length:9}, () => ['', 0]);
  rows[0] = ['snapshotDate', asOf]; rows[8] = ['status', 'READY']; return rows;
}
