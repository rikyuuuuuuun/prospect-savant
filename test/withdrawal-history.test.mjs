import { emptyRanges } from './support/withdrawal-fixture.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {buildWithdrawalHistory,validateWithdrawalHistory,withdrawalInputFromRanges,fetchWithdrawalHistory,applyWithdrawalBaseline} from '../scripts/withdrawal-history.mjs';
const asOf='2026-09-06';
const data={asOf,memberDefinition:{id:'operational-person-v1'},memberMonthlyComparison:{previousAsOf:'2026-08-31',memberDefinition:{id:'operational-person-v1'},teams:['A','B','C','D'].map(id=>({id,members:100}))}};
const member=(patch={})=>({id:'one',person:'person-one',status:'退会',team:'A',joinedAt:'2025-01-01',...patch});
const build=(members,courses=[],changes=[])=>buildWithdrawalHistory({asOf,members,courses,changes},data);
const row=h=>h.teams.A.months[5];
test('explicit retirement wins over billing stop and detection, while unknown never becomes zero percent',()=>{
 const h=build([member({retiredAt:'2026-09-02',billingStoppedAt:'2026-08-31'})],[{id:'one',endedAt:'2026-08-31',detected:true}]);
 assert.equal(row(h).explicit,1);assert.equal(row(h).rate,1);
 const unknown=build([member()]);assert.equal(unknown.teams.A.unknownMonth,1);assert.equal(row(unknown).rate,null);
});
test('uses billing stop then approved detection and excludes partial course changes',()=>{
 assert.equal(row(build([member({billingStoppedAt:'2026-09-02'})])).stopped,1);
 const course={id:'one',startedAt:'2025-01-01',endedAt:'2026-09-03',detected:true};
 assert.equal(row(build([member()],[course])).detected,1);
 const h=build([member()],[course,{id:'one',startedAt:'2025-01-01',active:true}]);
 assert.equal(row(h).count,0);assert.equal(h.teams.A.unknownMonth,1);
});
test('does not count suspension, scheduled/future withdrawals, or transfers as withdrawals',()=>{
 const members=[member({status:'休会',retiredAt:'2026-09-01'}),member({id:'two',person:'two',status:'退会予定',retiredAt:'2026-09-30'}),member({id:'three',person:'three',retiredAt:'2026-09-30'})];
 assert.equal(row(build(members)).count,0);
 assert.equal(row(build([member({retiredAt:'2026-09-02'}),member({id:'other',status:'在籍',team:'B'})])).count,0);
});
test('counts same-month entry/exit but excludes it from the monthly-start cohort; missing entry blocks rate',()=>{
 const h=build([member({joinedAt:'2026-09-01',retiredAt:'2026-09-02'})]);assert.equal(row(h).count,1);assert.equal(row(h).cohortCount,0);assert.equal(row(h).rate,0);
 assert.equal(row(build([member({joinedAt:'',retiredAt:'2026-09-02'})])).rate,null);
});
test('deduplicates people and quarantines conflicting historical teams without assigning a team',()=>{
 assert.equal(row(build([member({retiredAt:'2026-09-02'}),member({id:'two',retiredAt:'2026-09-02'})])).count,1);
 const h=build([member(),member({id:'two',team:'B'})]);assert.equal(h.unassigned,1);assert.equal(row(h).rate,null);
});
test('retains recorded withdrawals after reentry, without counting ordinary suspension',()=>{
 const h=build([member({status:'在籍',retiredAt:'2026-08-31'})],[],[{id:'one',team:'A',at:'2026-09-01',field:'在籍状態',before:'退会予定',after:'退会'},{id:'one',team:'A',at:'2026-09-04',field:'在籍状態',before:'退会',after:'在籍'}]);
 assert.equal(h.teams.A.months[4].count,1);
});
test('rejects malformed dates, public private fields, corrupt totals and unjustified rates; future months stay null',()=>{
 assert.throws(()=>build([member({retiredAt:'not-date'})]));
 const h=build([member()]);assert.equal(h.teams.A.months[6],null);
 assert.throws(()=>validateWithdrawalHistory({...h,person:'private'},data));
 const wrong=structuredClone(h);row(wrong).rate=0;assert.throws(()=>validateWithdrawalHistory(wrong,data));
 const stale=applyWithdrawalBaseline(h,{...data,memberMonthlyComparison:{...data.memberMonthlyComparison,previousAsOf:'2026-07-31'}});assert.equal(row(stale).denominator,null);
});
test('private source validates headers, reads complete histories and refuses concurrent source changes',async()=>{
 let calls=0;
 const requestJson=async url=>{
  if(url.includes('FORMULA'))return{valueRanges:[{values:[['=IMPORTRANGE("https://docs.google.com/spreadsheets/d/test/edit","\'12_Savant連携\'!A4:AE9")']]}]};
  if(!url.includes('values:batchGet'))return{sheets:['01_会員マスター','02_所属コース履歴','08_会員変更履歴'].map(title=>({properties:{title,gridProperties:{rowCount:20,columnCount:33}}}))};
  const ranges=emptyRanges();if(++calls===2){ranges[0].values.push(['one']);ranges[1].values.push(['退会']);ranges[2].values.push(['2025-01-01','','','','A']);ranges[3].values.push(['p']);}return{valueRanges:ranges};
 };
 assert.throws(()=>withdrawalInputFromRanges([],asOf));
 await assert.rejects(fetchWithdrawalHistory({spreadsheetId:'s',token:'test',asOf,requestJson}),/SOURCE_CHANGED/);
});
