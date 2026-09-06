import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAdmissionHistory, validateAdmissionHistory, fetchAdmissionHistory } from '../scripts/admission-history.mjs';
const serial = date => (Date.parse(date) - Date.UTC(1899,11,30)) / 86400000;
const build = () => buildAdmissionHistory({asOf:'2026-09-06', dates:['入会日',serial('2026-04-01'),serial('2026-05-31')+0.5,serial('2026-09-06')+0.5,serial('2026-09-07'),null,serial('2026-03-31')],teams:['主チーム','A','B','A','C','D','D']});
test('buckets admission dates, includes zero months, preserves future nulls and the annual serial cutoff',()=>{
 const h=build();assert.deepEqual(h.total,[1,1,0,0,0,0,null,null,null,null,null,null]);assert.equal(h.teams.B[1],1);
});
test('rejects invalid dates, schema and annual mismatches',()=>{
 assert.throws(()=>buildAdmissionHistory({asOf:'2026-09-06',dates:['入会日','invalid'],teams:['主チーム','A']}),/ENTRY_DATE_INVALID/);
 assert.throws(()=>buildAdmissionHistory({asOf:'2026-09-06',dates:['wrong'],teams:['主チーム']}),/HEADER_INVALID/);
 const h=build();assert.throws(()=>validateAdmissionHistory(h,{asOf:'2026-09-07'}),/DATE_MISMATCH/);
 const data={asOf:h.asOf,admissions:{asOf:h.asOf,fiscalYear:h.fiscalYear,teams:Object.fromEntries(['A','B','C','D'].map(id=>[id,{cumulative:0}]))}};
 assert.throws(()=>validateAdmissionHistory(h,data),/ANNUAL_TOTAL_MISMATCH/);
 h.total[6]=0;assert.throws(()=>validateAdmissionHistory(h,{asOf:h.asOf}),/COUNT_INVALID/);
});
test('fiscal year starts April and resets without importing a prior-year month',()=>{
 const h=buildAdmissionHistory({asOf:'2027-04-02',dates:['入会日',serial('2027-03-31'),serial('2027-04-01')],teams:['主チーム','A','B']});
 assert.equal(h.fiscalYear,'2027');assert.equal(h.teams.A[0],0);assert.equal(h.teams.B[0],1);assert.equal(h.total[1],null);
});
test('private fetch emits only anonymous counts and rejects concurrent changes',async()=>{
 let reads=0;
 const requestJson=async raw=>{
  const u=new URL(raw);
  if(u.searchParams.get('valueRenderOption')==='FORMULA')return{valueRanges:[{values:[['=IMPORTRANGE("https://docs.google.com/spreadsheets/d/master/edit","\'12_Savant連携\'!A4:AE9")']]}]};
  if(!u.pathname.endsWith('values:batchGet'))return{sheets:[{properties:{title:'01_会員マスター',gridProperties:{rowCount:100,columnCount:33}}}]};
  reads++;return{valueRanges:[{values:[['入会日',serial('2026-05-01')]]},{values:[['主チーム',reads===1?'A':'B']]}]};
 };
 await assert.rejects(()=>fetchAdmissionHistory({spreadsheetId:'savant',token:'unused',asOf:'2026-09-06',requestJson}),/SOURCE_CHANGED_DURING_READ/);
});
