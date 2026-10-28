import test from 'node:test';
import assert from 'node:assert/strict';
import { readRetentionAvailability, HISTORICAL_RETENTION_DEFINITION, validateRetentionAvailability } from '../scripts/retention-availability.mjs';
const ids = ['A','B','C','D'];
function fixture(unknown = 0) {
  return {
    members: ids.map((id, i) => { const row = [id]; row[30] = `0件実移動確認／${[320,220,154,60][i]}件過去基準維持／0件課金停止確認／${unknown}件退会日不明`; return row; }),
    retention: [['チーム', '3か月\n継続率'], ...ids.map((id, i) => [id, ...Array.from({length:8}, () => [unknown ? '' : .9 - i * .1, 100]).flat()])],
  };
}
test('historical withdrawals retain numeric rates without claiming confirmed physical dates', () => {
  const {members, retention} = fixture();
  const result = readRetentionAvailability(members, retention, '2026-10-11');
  assert.equal(result.definition, HISTORICAL_RETENTION_DEFINITION);
  assert.equal(result.teams.A.historicalWithdrawals, 320);
  for (const state of Object.values(result.teams)) { assert.equal(state.confirmedWithdrawals, 0); assert.equal(state.unknownWithdrawals, 0); assert.equal(state.scoreAvailable, true); }
});
test('future unknown withdrawal still withholds a rate and rejects fabricated numeric rates', () => {
  const {members, retention} = fixture(1);
  assert.equal(readRetentionAvailability(members, retention, '2026-10-11').teams.A.scoreAvailable, false);
  retention[1][1] = .9;
  assert.throws(() => readRetentionAvailability(members, retention, '2026-10-11'), /RETENTION_UNKNOWN_RATE_PRESENT_A/);
});
test('mixed policies and invalid historical counts are rejected', () => {
  const {members, retention} = fixture(); members[0][30] = '0件実移動確認／0件実日時不明';
  assert.throws(() => readRetentionAvailability(members, retention, '2026-10-11'), /RETENTION_SOURCE_POLICY_MIXED/);
  const f=fixture(), availability=readRetentionAvailability(f.members,f.retention,'2026-10-11'); availability.teams.A.historicalWithdrawals=-1;
  assert.throws(() => validateRetentionAvailability({asOf:'2026-10-11',retentionAvailability:availability,teams:ids.map(id=>({id,metrics:{retention:50}}))}),/RETENTION_AVAILABILITY_INVALID_A/);
});
test('roster archive dates are counted separately and do not withhold the rate', () => {
  const {members, retention} = fixture();
  members.forEach((row, i) => { row[30] = `0件実移動確認／${[320,220,154,60][i]}件過去基準維持／0件課金停止確認／${i === 2 ? 1 : 0}件名簿退会日確認／0件退会日不明`; });
  const result = readRetentionAvailability(members, retention, '2026-10-28');
  assert.equal(result.teams.C.rosterDateWithdrawals, 1);
  assert.equal(result.teams.C.unknownWithdrawals, 0);
  assert.equal(result.teams.C.scoreAvailable, true);
  validateRetentionAvailability({asOf:'2026-10-28',retentionAvailability:result,teams:ids.map(id=>({id,rank:1,metrics:{retention:50}}))});
  result.teams.C.rosterDateWithdrawals = -1;
  assert.throws(() => validateRetentionAvailability({asOf:'2026-10-28',retentionAvailability:result,teams:ids.map(id=>({id,metrics:{retention:50}}))}), /RETENTION_AVAILABILITY_INVALID_C/);
});
