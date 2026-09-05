import test from 'node:test';
import assert from 'node:assert/strict';
import { readReferralEvidence, applyReferralMetadata } from '../scripts/referral-evidence.mjs';
const serial = d => (Date.parse(d + 'T00:00:00Z') - Date.UTC(1899, 11, 30)) / 86400000;
function source() {
  return [[], ['年度開始', serial('2026-04-01'), '基準日', serial('2026-09-06')], [],
    ['チーム', '紹介体験', '兄弟姉妹入会', '紹介ポイント', '紹介力点', '定義'],
    ['A', 5, 4, 9, 87.5, 'referral-points-v1'], ['B', 0, 8, 8, 50, 'referral-points-v1'],
    ['C', 0, 5, 5, 12.5, 'referral-points-v1'], ['D', 1, 7, 8, 50, 'referral-points-v1'],
    ['全体', 6, 24, 30], [], ['', '', '', '', '', 'READY']];
}
test('referral evidence counts all five introductions and siblings without a scale denominator', () => {
  const result = readReferralEvidence(source(), '2026-09-06');
  assert.equal(result.A.trialPoints, 5);
  assert.equal(result.A.points, 9);
  assert.equal(result.B.calculatedScore, result.D.calculatedScore);
  assert.equal(result.A.scaleAdjustment, 'none');
});
test('referral evidence fails closed on missing, stale, inconsistent or adjusted results', () => {
  for (const mutate of [r => r[10][5] = 'ERROR', r => r[4][3] = 10, r => r[4][4] = 50, r => r[8][3] = 99, r => r[4][1] = '', r => r[1][1] = serial('2025-04-01')]) {
    const rows = source(); mutate(rows); assert.throws(() => readReferralEvidence(rows, '2026-09-06'));
  }
  assert.throws(() => readReferralEvidence(source(), '2026-09-05'), /ASOF/);
});
test('all teams with zero introductions receive zero instead of an invented midpoint', () => {
  const rows = source(); rows.slice(4, 9).forEach(r => { r[1] = r[2] = r[3] = r[4] = 0; });
  assert.equal(readReferralEvidence(rows, '2026-09-06').A.calculatedScore, 0);
});
test('migration marks the previous metric definition and preserves the event definition', () => {
  const previous = { asOf: '2026-09-05' };
  const data = { asOf: '2026-09-06', scoreVersion: 'v7-operational-member-denominator', metricLabels: { family: '家庭継続力' }, weights: [{key:'family',label:'家庭継続力'}], comparison: { previousAsOf:'2026-09-05' }, teams: ['A','B','C','D'].map((id,i) => ({ id, metrics:{family:[88,50,13,50][i]}, benchmark:{} })) };
  applyReferralMetadata(data, source(), previous);
  assert.equal(data.metricLabels.family, '紹介力');
  assert.equal(data.teams[0].benchmark.referralPoints, 9);
  assert.deepEqual(data.comparison.metricDefinitions, {});
  assert.equal(data.scoreVersion, 'v7-operational-member-denominator');
});
