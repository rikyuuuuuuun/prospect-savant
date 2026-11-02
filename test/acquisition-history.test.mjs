import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {acquisitionCategory,buildAcquisitionHistory,validateAcquisitionHistory,fetchAcquisitionHistory,unavailableAcquisition} from '../scripts/acquisition-history.mjs';
const asOf='2026-11-02';
function row(id,team,note,received=asOf,kind='体験申込'){
  const r=[];r[0]='FORM-'+id;r[2]=received;r[4]=team;r[11]=kind;r[12]='フォーム';r[34]=note;return r;
}
const note=label=>'クラブを知ったきっかけ：'+label;
test('source is taken only from the receiver prefix; free text and names never infer a channel',()=>{
  assert.equal(acquisitionCategory(note('紹介')),'referral');
  assert.equal(acquisitionCategory('受付種別：キャンセル待ち／'+note('チラシ')+'／フォーム備考：検証用'),'flyer');
  assert.equal(acquisitionCategory('フォーム備考：'+note('紹介')),'unknown');
  assert.equal(acquisitionCategory('紹介者照合：後処理待ち'),'unknown');
});
test('counts all five teams, optional-name referrals, waitlists and unknowns without publishing private input',()=>{
  const h=buildAcquisitionHistory({asOf,rows:[row('1','A',note('チラシ')),row('2','A',note('紹介')),row('3','A','相談だけ'),row('4','E',note('その他'),asOf,'キャンセル待ち申込')]});
  assert.deepEqual(h.teams.A,{flyer:1,referral:1,other:0,unknown:1,total:3});
  assert.equal(h.teams.E.other,1);assert.equal(h.months[0].teams.A.total,3);
  assert.doesNotMatch(JSON.stringify(h),/FORM-|相談|照合|受付ID/);
});
test('exclusion markers are receipt-bound; holds stay in application counts and duplicates fail',()=>{
  const excluded=row('test','A',note('紹介')+'／[PROSPECT_ANALYTICS_DISPOSITION_V1:EXCLUDE_TEST:FORM-test]');
  const held=row('hold','A',note('紹介')+'／[PROSPECT_ANALYTICS_DISPOSITION_V1:HOLD_UNDATED:FORM-hold]');
  assert.equal(buildAcquisitionHistory({asOf,rows:[excluded,held]}).teams.A.referral,1);
  const forged=[...excluded];forged[0]='FORM-other';
  assert.throws(()=>buildAcquisitionHistory({asOf,rows:[forged]}),/RECEIPT_MISMATCH/);
  assert.throws(()=>buildAcquisitionHistory({asOf,rows:[held,held]}),/DUPLICATE_RECEIPT/);
});
test('counts received dates from launch, excludes future submissions and resets with the fiscal year',()=>{
  const rows=[row('old','A',note('紹介'),'2026-11-01'),row('now','A',note('紹介')),row('future','A',note('紹介'),'2026-11-03')];
  assert.equal(buildAcquisitionHistory({asOf,rows}).teams.A.total,1);
  const h=buildAcquisitionHistory({asOf:'2027-04-02',rows:[row('last','A',note('紹介'),'2027-03-31'),row('next','A',note('チラシ'),'2027-04-01')]});
  assert.equal(h.since,'2027-04-01');assert.equal(h.teams.A.total,1);assert.equal(h.teams.A.flyer,1);
});

test('an operator-marked E-team form test cannot create a referral or affect shares; genuine E applications remain',()=>{
  const testRow=row('e-check','E',note('紹介')+'／[PROSPECT_ANALYTICS_DISPOSITION_V1:EXCLUDE_TEST:FORM-e-check]');
  const onlyTest=buildAcquisitionHistory({asOf,rows:[testRow]});
  assert.deepEqual(onlyTest.teams.E,{flyer:0,referral:0,other:0,unknown:0,total:0});
  const withReal=buildAcquisitionHistory({asOf,rows:[testRow,row('e-real','E',note('チラシ'))]});
  assert.deepEqual(withReal.teams.E,{flyer:1,referral:0,other:0,unknown:0,total:1});
  assert.equal(withReal.months[0].teams.E.total,1);
});
test('validation rejects leaked fields, inconsistent totals and stale dates; unavailable is not zero',()=>{
  const h=buildAcquisitionHistory({asOf,rows:[]});
  assert.throws(()=>validateAcquisitionHistory({...h,receipt:'private'},{asOf}),/PRIVATE_FIELD/);
  const bad=structuredClone(h);bad.teams.A.total=1;
  assert.throws(()=>validateAcquisitionHistory(bad,{asOf}),/TOTAL_MISMATCH/);
  assert.throws(()=>validateAcquisitionHistory(h,{asOf:'2026-11-03'}),/SOURCE_MISMATCH/);
  assert.deepEqual(validateAcquisitionHistory(unavailableAcquisition(asOf),{asOf}).teams,null);
});
test('private reader requests only required columns, verifies headers and detects changes during read',async()=>{
  let reads=0;
  const requestJson=async raw=>{
    const u=new URL(raw);
    if(u.searchParams.get('valueRenderOption')==='FORMULA')return{valueRanges:[{values:[['=IMPORTRANGE("https://docs.google.com/spreadsheets/d/master/edit","\'12_Savant連携\'!A4:AE9")']]}]};
    if(!u.pathname.endsWith('values:batchGet'))return{sheets:[{properties:{title:'14_LINE体験受付',gridProperties:{rowCount:100,columnCount:36}}}]};
    assert.deepEqual(u.searchParams.getAll('ranges').map(x=>x.match(/!([A-Z]+)4/)[1]),['A','C','E','L','M','AI']);
    reads++;return{valueRanges:['受付ID','受信日時','チーム','メッセージ種別','抽出方法','エラー・備考'].map((header,i)=>({values:[[header,['FORM-one',asOf,'A','体験申込','フォーム',note(reads===1?'紹介':'その他')][i]]]}))};
  };
  await assert.rejects(()=>fetchAcquisitionHistory({spreadsheetId:'savant',token:'unused',asOf,requestJson}),/SOURCE_CHANGED/);
});
test('graphs are in admissions only and correctly show shares, small samples, team selection and unknowns',async()=>{
  const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
  const overview=html.match(/overview: \[([^\]]+)\]/)[1];assert.doesNotMatch(overview,/acquisition/);
  assert.match(html,/admissions: \[[^\]]*acquisition-section/);
  const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('const history=window.PROSPECT_SAVANT_DATA?.acquisitionHistory'));
  const history=buildAcquisitionHistory({asOf,rows:[row('1','A',note('チラシ')),row('2','A',note('紹介')),row('3','A','未取得')]});
  const content={innerHTML:''},select={value:'all',addEventListener(_event,fn){this.change=fn}};
  vm.runInNewContext(script,{window:{PROSPECT_SAVANT_DATA:{asOf,acquisitionHistory:history}},document:{getElementById:id=>id==='acquisition-content'?content:select}});
  assert.match(content.innerHTML,/50.0%/);assert.match(content.innerHTML,/未取得：1人/);assert.match(content.innerHTML,/回答が少ない/);
  select.value='E';select.change();assert.match(content.innerHTML,/回答蓄積待ち/);assert.doesNotMatch(content.innerHTML,/NaN|Infinity/);
});
