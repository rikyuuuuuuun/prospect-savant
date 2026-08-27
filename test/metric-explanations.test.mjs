import test from 'node:test';
import assert from 'node:assert/strict';
import { applyMetricEvidenceAndExplanations, buildMetricEvidence } from '../scripts/metric-explanations.mjs';

function fixtures() {
  const teams = [
    {id:'A', metrics:{retention:72,admission:88,event:66,growth:88,family:47}, note:''},
    {id:'B', metrics:{retention:57,admission:63,event:76,growth:63,family:71}, note:''},
    {id:'C', metrics:{retention:17,admission:38,event:50,growth:38,family:42}, note:''},
    {id:'D', metrics:{retention:33,admission:13,event:43,growth:13,family:38}, note:'家庭継続力は評価対象が十分に蓄積するまで暫定です。'},
  ];
  const data = {asOf:'2026-08-25', teams, quality:{competitionCount:2,competitionRows:1068}, comparison:{previousAsOf:'2026-08-24',previousAsOfLabel:'2026年8月24日',teams:[
    {id:'A',metrics:{retention:81,admission:88,event:66,growth:88,family:55}},
    {id:'B',metrics:{retention:48,admission:63,event:76,growth:63,family:63}},
    {id:'C',metrics:{retention:17,admission:38,event:50,growth:38,family:42}},
    {id:'D',metrics:{retention:33,admission:13,event:43,growth:13,family:38}},
  ]}};
  const retention = [['定着力'],['desc'],[],['チーム','3か月\n継続率','対象','6か月\n継続率','対象','12か月継続率','対象','2年\n継続率','対象','3年\n継続率','対象','4年\n継続率','対象','5年\n継続率','対象','6年\n継続率','対象','長期加重\n定着点'],
    ['A',.9849246231,597,.9494382022,534,.8238866397,494,.5784313725,408,.4148148148,270,.2957746479,142,null,0,null,0,71.6667],
    ['B',.9879275654,497,.9418604651,430,.7932816537,387,.5805369128,298,.3013698630,146,null,0,null,0,null,0,57.2133],
    ['C',.9718309859,355,.8967741935,310,.6937269373,271,.4657534247,146,null,0,null,0,null,0,null,0,16.68],
    ['D',.9692982456,228,.9319371728,191,.7777777778,144,1,5,null,0,null,0,null,0,null,0,33.3333]];
  const admission=[['入会力'],[],[],['チーム','2026年度体験','2026年度入会','年度入会率','前年同期間率','前年差','入会力点','状態'],['A',107,93,.8691588785,.827,.042,87.5,'参考'],['B',107,82,.7663551402,.806,-.04,62.5,'参考'],['C',81,51,.6296296296,.595,.034,37.5,'参考'],['D',77,44,.5714285714,.636,-.065,12.5,'参考']];
  const growth=[['チーム','上位10％記録','10〜20％記録','20〜30％記録','成長力点','上位30％の子ども','上位30％加重点','状態'],['A',69,48,46,87.5,86,349,'算出済'],['B',31,37,39,62.5,65,206,'算出済'],['C',12,14,20,37.5,32,84,'算出済'],['D',5,10,9,12.5,19,44,'算出済'],['全体',117,109,114,null,202,683,'']];
  const family=[['家庭'],[],[],['指標','A','B','C','D','全体'],['兄弟姉妹在籍世帯率',.26,.299,.267,.235,.268],['2年継続率',.5784,.5805,.4658,null,.562],['再入会率（6か月基準）',.0032,0,0,.0185,.003],['イベント継続参加率',.375,.455,.3827,.311,.4],[],[],[],[],[],['チーム','運用世帯','兄弟世帯','兄弟率','2年対象','2年継続率','退会履歴','再入会','再入会率','イベント参加','継続参加','イベント継続率','算出指標数','家庭継続力点','算出状態'],['A',254,66,.2598425197,408,.5784313725,310,1,.0032258065,208,78,.375,4,45.8,'算出可能'],['B',234,70,.2991452991,298,.5805369128,207,0,0,189,86,.455026455,4,79.2,'算出可能'],['C',161,43,.2670807453,146,.4657534247,149,0,0,81,31,.3827160494,4,37.5,'算出可能'],['D',149,35,.2348993289,5,null,54,1,.0185185185,61,19,.3114754098,3,33.3,'暫定']];
  const config=[['x'],['家庭継続力 兄弟姉妹重み',.25],['家庭継続力 2年継続重み',.20],['家庭継続力 再入会重み',.20],['家庭継続力 イベント継続重み',.15]];
  const eventHistory={scoreWeights:{participation:70,repeat:30},teams:{A:{averageRate:18.8,participationScore:58.8,repeatRate:37.5,repeatScore:82.4,score:66},B:{averageRate:20.8,participationScore:65,repeatRate:45.5,repeatScore:100,score:76},C:{averageRate:11.4,participationScore:35.7,repeatRate:38.3,repeatScore:84.1,score:50},D:{averageRate:10.3,participationScore:32.4,repeatRate:31.1,repeatScore:68.5,score:43}}};
  const retentionCurve={minimumSample:20,months:[1,3,6,9,12,18,24,36,48],teams:{A:{rates:[99.7,98.5,94.9,88.5,82.4,70.8,57.8,41.5,29.6],samples:[632,597,534,513,494,439,408,270,142]},B:{rates:[100,98.8,94.2,87,79.3,73.9,58.1,30.1,null],samples:[509,497,430,414,387,333,298,146,0]},C:{rates:[99.2,97.2,89.7,80.6,69.4,59.4,46.6,null,null],samples:[380,355,310,304,271,219,146,0,0]},D:{rates:[100,96.9,93.2,86.1,77.8,69.8,null,null,null],samples:[248,228,191,180,144,43,5,0,0]}}};
  const previousRetentionCurve={minimumSample:20,months:[1,3,6,9,12,18,24,36,48],teams:{A:{rates:[99.7,98.5,94.9,88.5,82.4,70.8,57.8,41.5,29.6],samples:[632,597,534,513,494,439,408,270,142]},B:{rates:[100,98.8,94.2,86.9,79.3,73.9,57.8,30.1,null],samples:[509,497,430,413,387,333,296,146,0]},C:{rates:[99.2,97.2,89.7,80.6,69.4,59.2,46.6,null,null],samples:[379,353,310,304,271,218,146,0,0]},D:{rates:[100,96.9,93.2,86,77.8,69.8,null,null,null],samples:[248,228,190,179,144,43,5,0,0]}}};
  return {data,ranges:{retention,admission,growth,family,config},retentionCurve,eventHistory,previousRetentionCurve,previousEventHistory:eventHistory,previousTrialData:{annual:{teams:{A:{admissions:93,trials:107},B:{admissions:82,trials:107},C:{admissions:51,trials:81},D:{admissions:44,trials:77}}}}};
}

test('builds anonymous evidence that reconciles to the five public metric scores', () => {
  const f=fixtures();
  const evidence=buildMetricEvidence({data:f.data,ranges:f.ranges,retentionCurve:f.retentionCurve,eventHistory:f.eventHistory});
  assert.equal(evidence.A.retention.weightedIndex,71.7);
  assert.deepEqual(evidence.A.retention.periods.find(p=>p.months===24), {key:'y2',label:'2年',months:24,weight:4,sample:408,retained:236,exited:172,rate:57.8,relativeScore:50,scored:true});
  assert.equal(evidence.A.family.components.sibling.numerator,66);
  assert.equal(evidence.A.family.components.sibling.denominator,254);
  assert.equal(evidence.A.family.calculatedScore,46.9);
  assert.equal(evidence.A.growth.weightedPoints,349);
});

test('uses the canonical family score inputs instead of stale detailed-table rates', () => {
  const f=fixtures();
  f.ranges.family[5][1]=.5794621026894866;
  const evidence=buildMetricEvidence({data:f.data,ranges:f.ranges,retentionCurve:f.retentionCurve,eventHistory:f.eventHistory});
  assert.equal(evidence.A.family.calculatedScore,46.9);
  assert.equal(evidence.A.family.components.retention2y.rate,57.9);
  assert.equal(evidence.A.family.components.retention2y.numerator,null);
  assert.equal(evidence.A.family.components.retention2y.denominator,null);
});

test('withholds detailed family counts when they no longer reconcile to the canonical rate', () => {
  const f=fixtures();
  f.ranges.family.find((row) => row?.[0] === 'A')[2]=65;
  const evidence=buildMetricEvidence({data:f.data,ranges:f.ranges,retentionCurve:f.retentionCurve,eventHistory:f.eventHistory});
  assert.equal(evidence.A.family.components.sibling.rate,26);
  assert.equal(evidence.A.family.components.sibling.numerator,null);
  assert.equal(evidence.A.family.components.sibling.denominator,null);
});

test('explains a canonical family rate when stale detailed counts are withheld', () => {
  const f=fixtures();
  f.ranges.family[5][1]=.5794621026894866;
  applyMetricEvidenceAndExplanations(f);
  const note=f.data.teams.find((team) => team.id === 'A').note;
  assert.match(note,/2年継続率 57\.9%（相対点50\.0、人数内訳は現行率と整合しないため非表示）/);
  assert.doesNotMatch(note,/2年継続率は対象不足/);
  assert.doesNotMatch(note,/2年継続率 57\.8%/);
});

test('fails closed when a canonical family rate is outside 0 to 100 percent', () => {
  const f=fixtures();
  f.ranges.family[4][1]=1.1;
  assert.throws(
    () => buildMetricEvidence({data:f.data,ranges:f.ranges,retentionCurve:f.retentionCurve,eventHistory:f.eventHistory}),
    /FAMILY_CANONICAL_sibling_A_RATE_INVALID/,
  );
});

test('accepts only superficial family weight-label formatting differences', () => {
  const f=fixtures();
  f.ranges.config=[
    ['x'],
    ['家庭継続力：　兄弟姉妹重み','.25'],
    ['家庭継続力: 2年継続重み',.20],
    ['家庭継続力　再入会重み',.20],
    ['家庭継続力 イベント継続重み',.15],
  ];
  const evidence=buildMetricEvidence({data:f.data,ranges:f.ranges,retentionCurve:f.retentionCurve,eventHistory:f.eventHistory});
  assert.equal(evidence.A.family.components.sibling.weight,25);
  assert.equal(evidence.A.family.components.retention2y.weight,20);
  assert.equal(evidence.A.family.components.reentry.weight,20);
  assert.equal(evidence.A.family.components.eventRepeat.weight,15);
});

test('fails closed when a family weight label changes meaning', () => {
  const f=fixtures();
  f.ranges.config[1][0]='家庭継続力 兄弟世帯重み';
  assert.throws(
    () => buildMetricEvidence({data:f.data,ranges:f.ranges,retentionCurve:f.retentionCurve,eventHistory:f.eventHistory}),
    /FAMILY_WEIGHT_sibling_LABEL_MISSING/,
  );
});

test('classifies unsupported family-weight column placement without logging source cells', () => {
  const f=fixtures();
  f.ranges.config[1]=['別の設定','家庭継続力 兄弟姉妹重み',.25];
  assert.throws(
    () => buildMetricEvidence({data:f.data,ranges:f.ranges,retentionCurve:f.retentionCurve,eventHistory:f.eventHistory}),
    /FAMILY_WEIGHT_sibling_LABEL_COLUMN_UNSUPPORTED/,
  );
});

test('fails closed when normalized family-weight labels are duplicated', () => {
  const f=fixtures();
  f.ranges.config.push(['家庭継続力：兄弟姉妹重み',.25]);
  assert.throws(
    () => buildMetricEvidence({data:f.data,ranges:f.ranges,retentionCurve:f.retentionCurve,eventHistory:f.eventHistory}),
    /FAMILY_WEIGHT_sibling_LABEL_AMBIGUOUS/,
  );
});

test('fails closed when a family-weight value is not positive', () => {
  const f=fixtures();
  f.ranges.config[1][1]=0;
  assert.throws(
    () => buildMetricEvidence({data:f.data,ranges:f.ranges,retentionCurve:f.retentionCurve,eventHistory:f.eventHistory}),
    /FAMILY_WEIGHT_sibling_VALUE_INVALID/,
  );
});

test('explains A retention drop as a B-team crossover instead of inventing A churn', () => {
  const f=fixtures();
  applyMetricEvidenceAndExplanations(f);
  const note=f.data.teams.find(t=>t.id==='A').note;
  assert.match(note,/A TEAM自身の率は57\.8%→57\.8%で実質不変/);
  assert.match(note,/B TEAMが171\/296人・57\.8%から173\/298人・58\.1%へ動き/);
  assert.match(note,/相対点が83\.3→50\.0/);
  assert.match(note,/定着力へ約-8\.9点影響/);
  assert.doesNotMatch(note,/総合点/);
});

test('explains the same crossover in family-continuity scoring and preserves operational notes', () => {
  const f=fixtures();
  applyMetricEvidenceAndExplanations(f);
  const a=f.data.teams.find(t=>t.id==='A').note;
  const b=f.data.teams.find(t=>t.id==='B').note;
  const d=f.data.teams.find(t=>t.id==='D').note;
  assert.match(a,/家庭継続力へ約-8\.3点影響/);
  assert.match(b,/家庭継続力へ約\+8\.3点影響/);
  assert.match(a,/旧snapshotでは兄弟世帯率・再入会率など一部の前回匿名内訳を保持していなかった/);
  assert.match(d,/運用注記｜家庭継続力は評価対象が十分に蓄積するまで暫定です/);
});

test('publishes only anonymous aggregate evidence', () => {
  const f=fixtures();
  applyMetricEvidenceAndExplanations(f);
  const publicText=JSON.stringify(f.data);
  assert.doesNotMatch(publicText,/(?:PERS-\d+|氏名|メール|電話|住所|docs\.google\.com|personKey|memberKey)/i);
});
