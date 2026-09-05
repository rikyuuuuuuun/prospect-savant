import test from 'node:test';
import assert from 'node:assert/strict';
import { readReferralEvidence, applyReferralMetadata, REFERRAL_DEFINITION } from '../scripts/referral-evidence.mjs';
const serial = d => (Date.parse(d + 'T00:00:00Z') - Date.UTC(1899, 11, 30)) / 86400000;
function source() {
  return [[], ['年度開始', serial('2026-04-01'), '基準日', serial('2026-09-06')], [],
    ['チーム', '紹介体験', '兄弟姉妹入会', '紹介ポイント', '紹介力点', '定義', '基準日会員数', '紹介率', '人数相対点', '紹介率相対点', '人数配点', '紹介率配点'],
    ['A',5,4,9,80,REFERRAL_DEFINITION,300,9/300,87.5,62.5,0.7,0.3],
    ['B',0,8,8,46.25,REFERRAL_DEFINITION,300,8/300,50,37.5,0.7,0.3],
    ['C',0,5,5,12.5,REFERRAL_DEFINITION,200,5/200,12.5,12.5,0.7,0.3],
    ['D',1,7,8,61.25,REFERRAL_DEFINITION,100,8/100,50,87.5,0.7,0.3],
    ['全体',6,24,30,'','',900,30/900], [], ['', '', '', '', '', 'READY']];
}
test('all five introductions count; equal counts favor the smaller team through rate', () => {
  const result = readReferralEvidence(source(), '2026-09-06');
  assert.equal(result.A.trialPoints,5); assert.equal(result.A.points,9);
  assert.equal(result.B.pointScore,result.D.pointScore);
  assert.ok(result.D.calculatedScore > result.B.calculatedScore);
  assert.equal(result.D.rate,8); assert.deepEqual(result.D.weights,{points:70,rate:30});
});
test('70/30 leaves a path for a smaller team with fewer referrals to win overall', () => {
  const rows=source();
  const members=[900,100,140,200], points=[9,8,7,6], ps=[87.5,62.5,37.5,12.5], rs=[12.5,87.5,62.5,37.5];
  rows.slice(4,8).forEach((r,i)=>{ r[1]=points[i];r[2]=0;r[3]=points[i];r[4]=ps[i]*.7+rs[i]*.3;r[6]=members[i];r[7]=points[i]/members[i];r[8]=ps[i];r[9]=rs[i]; });
  rows[8]=['全体',30,0,30,'','',1340,30/1340];
  const e=readReferralEvidence(rows,'2026-09-06');
  assert.equal(e.A.calculatedScore,65); assert.equal(e.B.calculatedScore,70);
});
test('fails closed on bad weights, denominator, stale source, totals and component scores', () => {
  for (const mutate of [r=>r[10][5]='MEMBER_SYNC_PENDING',r=>r[4][3]=10,r=>r[4][4]=50,r=>r[8][3]=99,r=>r[4][1]='',r=>r[1][1]=serial('2025-04-01'),r=>r[4][6]=0,r=>r[4][6]='',r=>r[4][7]=0.8,r=>r[4][8]=50,r=>r[4][10]=0.3,r=>r[8][6]=999]) {
    const rows=source();mutate(rows);assert.throws(()=>readReferralEvidence(rows,'2026-09-06'));
  }
  assert.throws(()=>readReferralEvidence(source(),'2026-09-05'),/ASOF/);
});
test('all teams with zero referrals receive zero in both components', () => {
  const rows=source();rows.slice(4,9).forEach(r=>{r[1]=r[2]=r[3]=r[4]=r[7]=r[8]=r[9]=0;});
  assert.equal(readReferralEvidence(rows,'2026-09-06').A.calculatedScore,0);
});
test('migration preserves event definition and validates public member denominator', () => {
  const previous={asOf:'2026-09-05',metricDefinitions:{family:'referral-points-v1'}};
  const data={asOf:'2026-09-06',scoreVersion:'v7-operational-member-denominator',metricLabels:{family:'家庭継続力'},weights:[{key:'family',label:'家庭継続力'}],comparison:{previousAsOf:'2026-09-05'},teams:['A','B','C','D'].map((id,i)=>({id,members:[300,300,200,100][i],metrics:{family:[80,46,13,61][i]},benchmark:{}}))};
  applyReferralMetadata(data,source(),previous);
  assert.equal(data.metricLabels.family,'紹介力');assert.equal(data.teams[0].benchmark.referralPoints,9);assert.equal(data.teams[0].benchmark.referralRate,3);
  assert.equal(data.comparison.metricDefinitions.family,'referral-points-v1');assert.equal(data.scoreVersion,'v7-operational-member-denominator');
  data.teams[0].members=999;assert.throws(()=>applyReferralMetadata(data,source(),previous),/MEMBER_MISMATCH/);
});
