import { TEAM_IDS, buildRetentionEvidenceFromSource } from './metric-retention-evidence.mjs';

export const RETENTION_DEFINITION = 'confirmed-roster-withdrawal-v1';
export const HISTORICAL_RETENTION_DEFINITION = 'historical-retained-forward-confirmed-v2';
export const emptySourceValue = value => value === '' || value === null || value === undefined;
const check = (condition, code) => { if (!condition) throw new Error(code); };

// Only this explicit, anonymous source receipt permits withheld retention values.
// An arbitrary empty cell or spreadsheet error must still stop publication.
export function readRetentionAvailability(memberRows, retentionRows, asOf) {
  const rows = TEAM_IDS.map(id => memberRows.find(row => row?.[0] === id));
  const receipts = rows.map(row => {
    const text = String(row?.[30] ?? '');
    const forward = text.match(/^(\d+)件実移動確認／(\d+)件過去基準維持／(\d+)件課金停止確認／(\d+)件退会日不明$/);
    if (forward) return { confirmed: +forward[1], historical: +forward[2], billing: +forward[3], unknown: +forward[4], definition: HISTORICAL_RETENTION_DEFINITION };
    const legacy = text.match(/^(\d+)件実移動確認／(\d+)件実日時不明$/);
    return legacy ? { confirmed: +legacy[1], unknown: +legacy[2], definition: RETENTION_DEFINITION } : null;
  });
  if (receipts.every(receipt => !receipt)) return null;
  check(receipts.every(Boolean), 'RETENTION_SOURCE_RECEIPT_INCOMPLETE');
  check(receipts.every(receipt => receipt.definition === receipts[0].definition), 'RETENTION_SOURCE_POLICY_MIXED');
  const evidence = buildRetentionEvidenceFromSource(retentionRows);
  const teams = Object.fromEntries(TEAM_IDS.map((id, index) => {
    const { confirmed, unknown, historical, billing } = receipts[index];
    check(Number.isSafeInteger(confirmed) && Number.isSafeInteger(unknown), 'RETENTION_SOURCE_RECEIPT_INVALID');
    const row = retentionRows.find(row => row?.[0] === id);
    for (const period of evidence[id].periods) {
      const rateIndex = 1 + evidence[id].periods.indexOf(period) * 2;
      const value = row?.[rateIndex];
      if (unknown > 0) check(emptySourceValue(value), `RETENTION_UNKNOWN_RATE_PRESENT_${id}`);
      else if (period.sample >= 20) check(!emptySourceValue(value) && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 1, `RETENTION_SOURCE_RATE_INVALID_${id}`);
    }
    return [id, { confirmedWithdrawals: confirmed, unknownWithdrawals: unknown,
      ...(historical !== undefined ? { historicalWithdrawals: historical, billingWithdrawals: billing } : {}),
      scoreAvailable: evidence[id].weightedIndex !== null }];
  }));
  return { definition: receipts[0].definition, asOf, teams };
}

export function retentionRate(value, label, withheld, convert) {
  if (withheld) {
    check(emptySourceValue(value), `${label}_MUST_BE_WITHHELD`);
    return null;
  }
  return convert(value, label);
}

export function validateRetentionAvailability(data, curve, schoolAge) {
  const availability = data.retentionAvailability;
  if (!availability) return;
  check([RETENTION_DEFINITION, HISTORICAL_RETENTION_DEFINITION].includes(availability.definition) && availability.asOf === data.asOf, 'RETENTION_AVAILABILITY_INVALID');
  check(Object.keys(availability.teams || {}).sort().join() === TEAM_IDS.join(), 'RETENTION_AVAILABILITY_TEAMS_INVALID');
  let unavailable = false, unknownTotal = 0;
  for (const id of TEAM_IDS) {
    const state = availability.teams[id], team = data.teams.find(team => team.id === id);
    check(Number.isSafeInteger(state.confirmedWithdrawals) && state.confirmedWithdrawals >= 0 && Number.isSafeInteger(state.unknownWithdrawals) && state.unknownWithdrawals >= 0 && typeof state.scoreAvailable === 'boolean', `RETENTION_AVAILABILITY_INVALID_${id}`);
    if (availability.definition === HISTORICAL_RETENTION_DEFINITION) for (const key of ['historicalWithdrawals', 'billingWithdrawals']) check(Number.isSafeInteger(state[key]) && state[key] >= 0, `RETENTION_AVAILABILITY_INVALID_${id}`);
    unknownTotal += state.unknownWithdrawals;
    check(state.scoreAvailable ? Number.isFinite(team.metrics.retention) : team.metrics.retention === null, `RETENTION_SCORE_AVAILABILITY_MISMATCH_${id}`);
    if (!state.scoreAvailable) unavailable = true;
    if (state.unknownWithdrawals > 0) {
      check(!state.scoreAvailable && team.benchmark.retention12mRate === null, `RETENTION_UNKNOWN_BENCHMARK_PRESENT_${id}`);
      for (const series of [curve, schoolAge]) check(series.teams[id].rates.every(rate => rate === null), `RETENTION_UNKNOWN_SERIES_PRESENT_${id}`);
    }
  }
  if (unknownTotal > 0) for (const series of [curve, schoolAge]) check(series.overall.rates.every(rate => rate === null), 'RETENTION_UNKNOWN_TOTAL_PRESENT');
  if (unavailable) for (const team of data.teams) check(team.rank === null, 'RETENTION_INCOMPLETE_RANK_PRESENT');
}
