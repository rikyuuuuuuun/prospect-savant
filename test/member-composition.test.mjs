import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMemberComposition, schoolGrade, completedMonths, validateMemberComposition, unavailableComposition, compositionInputFromRanges, fetchMemberComposition } from '../scripts/member-composition.mjs';

const asOf = '2026-10-18';
const counts = { A: 1, B: 0, C: 0, D: 0 };
const member = patch => ({ id: 'record-1', person: 'person-1', team: 'A', status: '在籍', birthday: '2018-04-02', gender: '女', joinedAt: '2025-04-01', ...patch });
const build = (records, settings = [], expectedCounts = counts) => buildMemberComposition({ records, settings, asOf, expectedCounts });
const dataFor = c => ({ asOf, memberDefinition: { id: 'operational-person-v1' }, headline: { members: c.overall?.members ?? 1 }, teams: ['A','B','C','D'].map(id => ({ id, members: c.teams?.[id]?.members ?? counts[id] })) });

test('school grades respect April 1/2 birth and April school-year boundaries', () => {
  assert.equal(schoolGrade('2020-04-01', '2026-04-01'), 'p1');
  assert.equal(schoolGrade('2020-04-02', '2026-04-01'), 'k3');
  assert.equal(schoolGrade('2020-04-01', '2026-03-31'), 'k3');
  assert.equal(schoolGrade('2020-04-02', '2027-04-01'), 'p1');
  assert.equal(schoolGrade('2014-04-01', asOf), 'j1');
  assert.equal(schoolGrade(null, asOf), 'unknown');
  assert.equal(schoolGrade('2027-01-01', asOf), 'unknown');
});

test('completed tenure months include leap years, short months and anniversary boundaries', () => {
  assert.equal(completedMonths('2026-07-19', asOf), 2);
  assert.equal(completedMonths('2026-07-18', asOf), 3);
  assert.equal(completedMonths('2026-07-17', asOf), 3);
  assert.equal(completedMonths('2024-01-31', '2024-02-29'), 1);
  assert.equal(completedMonths('2024-02-29', '2025-02-28'), 12);
});

test('deduplicates contracts, applies approved effective teams and retains unknown exception attributes', () => {
  const records = [member(), member({ id: 'record-2', team: 'B', status: '休会' }), member({ id: 'retired', person: 'retired', status: '退会' })];
  const settings = [{ type: 'TEAM_OVERRIDE', person: 'person-1', team: 'B', approved: true, active: true }, { type: 'EXCEPTION', person: 'exception', team: 'C', approved: true, active: true }];
  const result = build(records, settings, { A: 0, B: 1, C: 1, D: 0 });
  assert.equal(result.overall.members, 2);
  assert.equal(result.teams.B.members, 1);
  assert.equal(result.teams.B.status.paused, 1);
  assert.equal(result.teams.C.gender.unknown, 1);
  assert.equal(result.overall.tenure.unknown, 1);
  assert.equal(result.overall.summary.knownTenure, 1);
  assert.equal(result.overall.summary.meanTenureMonths, 18);
  assert.ok(!JSON.stringify(result).includes('person-1'));
  assert.ok(!JSON.stringify(result).includes('record-1'));
  assert.throws(() => build(records), /ROSTER_UNRESOLVED/);
  assert.throws(() => build(records, settings.map(s => ({...s, approved:false}))), /ROSTER_UNRESOLVED/);
});

test('conflicting demographics and future or missing dates stay unknown without affecting totals', () => {
  const result = build([member({ birthday: '2027-01-01', joinedAt: '2027-01-01' }), member({ id:'second', gender:'男', birthday:'', joinedAt:'' })]);
  assert.equal(result.overall.gender.unknown, 1);
  assert.equal(result.overall.age.unknown, 1);
  assert.equal(result.overall.grade.unknown, 1);
  assert.equal(result.overall.tenure.unknown, 1);
  assert.equal(result.overall.summary.meanTenureMonths, null);
  assert.equal(result.overall.entryYear.unknown, 1);
  const active = build([member({status:'休会'}), member({id:'second',status:'在籍'})]);
  assert.equal(active.overall.status.active, 1);
  assert.equal(build([member({gender:'other'})]).overall.gender.other, 1);
});

test('validation rejects inconsistent totals, stale dates, private fields and fabricated zero availability', () => {
  const composition = build([member()]), data = dataFor(composition);
  assert.equal(validateMemberComposition(composition, data), composition);
  for (const mutate of [
    c => { c.overall.gender.male++; },
    c => { c.teams.A.grade.p1++; },
    c => { c.overall.summary.meanTenureMonths++; },
    c => { c.asOf='2026-10-17'; },
    c => { c.teams.A.personKey='private'; },
    c => { c.overall.entryYear.bad=1; },
  ]) {
    const copy=structuredClone(composition); mutate(copy);
    assert.throws(() => validateMemberComposition(copy,data), /MEMBER_COMPOSITION/);
  }
  assert.throws(() => build([member()],[],{...counts,A:2}), /COUNT_MISMATCH/);
  assert.equal(validateMemberComposition(unavailableComposition(asOf),data).overall,null);
  assert.throws(() => validateMemberComposition({...unavailableComposition(asOf),overall:composition.overall},data));
  const empty=build([],[],{A:0,B:0,C:0,D:0});
  assert.equal(empty.overall.members,0);
  assert.equal(empty.overall.summary.meanTenureMonths,null);
});

const rawRanges=()=>[
  {values:[['Prospect会員ID'],['record-1']]}, {values:[['在籍状態'],['在籍']]},
  {values:[['生年月日','学年','性別'],['2018-04-02','','女']]},
  {values:[['入会日'],['2025-04-01']]}, {values:[['主チーム'],['A']]},
  {values:[['Prospect人物ID'],['person-1']]},
  {values:[['種別','対象キー','承認時sourceTeams','effectiveTeam','有効','承認根拠','現在状態','現在有効']]},
];
test('private reader validates headers and detects source changes even if aggregate counts stay equal', async () => {
  assert.equal(buildMemberComposition(compositionInputFromRanges(rawRanges(),asOf,counts)).overall.members,1);
  const bad=rawRanges();bad[2].values[0][0]='氏名';
  assert.throws(()=>compositionInputFromRanges(bad,asOf,counts),/SCHEMA_INVALID/);
  for (const changed of [false,true]) {
    let reads=0;
    const requestJson=async url=>{
      if(url.includes('FORMULA'))return {valueRanges:[{values:[['=IMPORTRANGE("https://docs.google.com/spreadsheets/d/synthetic/edit","\'12_Savant連携\'!A4:AE9")']]}]};
      if(!url.includes('values:batchGet'))return {sheets:['01_会員マスター','97_Savant運用会員設定'].map(title=>({properties:{title,gridProperties:{rowCount:100}}}))};
      const ranges=rawRanges();if(++reads===2 && changed)ranges[0].values[1][0]='changed-key';
      return {valueRanges:ranges};
    };
    const promise=fetchMemberComposition({spreadsheetId:'synthetic',token:'synthetic',asOf,expectedCounts:counts,requestJson});
    if(changed)await assert.rejects(promise,/SOURCE_CHANGED/);
    else assert.equal((await promise).overall.gender.female,1);
  }
});
