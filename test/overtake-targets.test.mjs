import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseFrozenJson } from '../scripts/trial-publication.mjs';
import { projectContinuousScores } from '../scripts/continuous-scores.mjs';
import { applyFutureGains } from '../scripts/overtake-targets.mjs';

const fixture = async () => {
  const read = async file => parseFrozenJson(await readFile(new URL(`../${file}`,import.meta.url),'utf8'),file);
  return {source:await read('data.js'),events:await read('event-data.js')};
};

test('each displayed future goal replays to a strict integer overtake without changing historical performance',async()=>{
  const {source,events}=await fixture(), before=JSON.stringify({source,events});
  const initial=projectContinuousScores(source,events).data;
  let checked=0;
  for(const [id,goal] of Object.entries(initial.overtakeTargets)) {
    if(goal.status==='leader') {assert.equal(initial.teams.find(t=>t.id===id).rank,1);continue;}
    if(goal.status==='no-plan') {assert.deepEqual(goal.scenarios,[]);continue;}
    assert.equal(goal.status,'ready');
    assert.equal(goal.scenarios.length,1);
    const plan=goal.scenarios[0], candidate=structuredClone(source);
    const mine=candidate.teams.find(t=>t.id===id), original=source.teams.find(t=>t.id===id);
    const available=original.metricEvidence.admission.trials-original.metricEvidence.admission.admissions;
    const newTrials=plan.referralTrials+Math.max(0,plan.admissions-Math.min(plan.admissions,plan.referralTrials)-available);
    mine.members+=plan.admissions;
    mine.metricEvidence.admission.admissions+=plan.admissions;
    mine.metricEvidence.admission.trials+=newTrials;
    mine.metricEvidence.family.points+=plan.referralTrials;
    mine.metricEvidence.family.trialPoints+=plan.referralTrials;
    mine.metricEvidence.family.members+=plan.admissions;
    assert.equal(plan.newTrials,newTrials);
    assert.equal(plan.futureMembers,mine.members);
    for(const key of ['retention','growth','event']) assert.deepEqual(mine.metricEvidence[key],original.metricEvidence[key]);
    const after=projectContinuousScores(candidate,events).data;
    const me=after.teams.find(t=>t.id===id),rival=after.teams.find(t=>t.id===goal.targetId);
    assert.equal(me.overall,plan.ownScore);
    assert.equal(rival.overall,plan.rivalScore);
    assert.ok(me.overall>rival.overall);
    assert.ok(me.rank<initial.teams.find(t=>t.id===id).rank);
    checked++;
  }
  assert.ok(checked>0);
  assert.equal(JSON.stringify({source,events}),before);
});

test('future referred admissions add members and trial attendance once, while preserving past retention',async()=>{
  const {source}=await fixture(), original=structuredClone(source.teams), teams=structuredClone(original);
  const result=applyFutureGains(teams,'C',3,2);
  const before=original.find(t=>t.id==='C'),after=teams.find(t=>t.id==='C');
  assert.equal(after.members,before.members+3);
  assert.equal(after.metricEvidence.family.members,before.metricEvidence.family.members+3);
  assert.equal(after.metricEvidence.family.points,before.metricEvidence.family.points+2);
  assert.equal(after.metricEvidence.admission.admissions,before.metricEvidence.admission.admissions+3);
  assert.equal(after.metricEvidence.admission.trials,before.metricEvidence.admission.trials+2);
  assert.equal(result.referredAdmissions,2);
  assert.equal(result.existingTrialAdmissions,1);
  for(const key of ['retention','growth','event']) assert.deepEqual(after.metricEvidence[key],before.metricEvidence[key]);
  assert.deepEqual(teams.filter(t=>t.id!=='C'),original.filter(t=>t.id!=='C'));
});

test('referral trials without admission increase the trial denominator, never the member count',async()=>{
  const {source}=await fixture(), before=structuredClone(source.teams[0]);
  applyFutureGains(source.teams,before.id,0,4);
  const after=source.teams[0];
  assert.equal(after.members,before.members);
  assert.equal(after.metricEvidence.admission.trials,before.metricEvidence.admission.trials+4);
  assert.ok(after.metricEvidence.admission.rate<before.metricEvidence.admission.admissions/before.metricEvidence.admission.trials*100);
});

test('admissions beyond the existing trial pool include new trials and reject invalid inputs',async()=>{
  const {source}=await fixture(), original=structuredClone(source.teams), team=source.teams[0];
  const remaining=team.metricEvidence.admission.trials-team.metricEvidence.admission.admissions;
  const before=team.metricEvidence.admission.trials;
  const result=applyFutureGains(source.teams,team.id,remaining+5,0);
  assert.equal(result.newTrials,5);
  assert.equal(team.metricEvidence.admission.trials,before+5);
  assert.ok(team.metricEvidence.admission.admissions<=team.metricEvidence.admission.trials);
  assert.throws(()=>applyFutureGains(original,team.id,-1,0),/INVALID/);
  assert.throws(()=>applyFutureGains(original,team.id,1.5,0),/INVALID/);
});

test('comparison index and missing-data safeguards remain unchanged',async()=>{
  const {source,events}=await fixture();
  const {data}=projectContinuousScores(source,events);
  assert.equal(data.scoring.center,60);
  assert.ok(data.teams.find(t=>t.id==='C').metrics.retention>=35);
  assert.ok(data.teams.find(t=>t.id==='A').metrics.growth<=85);
  source.teams[0].overall=source.teams[0].metrics.retention=null;
  const missing=projectContinuousScores(source,events).data;
  assert.ok(Object.values(missing.overtakeTargets).every(goal=>goal.status==='unavailable'&&goal.scenarios.length===0));
});

test('team cards contain one short future headcount target and keep assumptions outside the cards',async()=>{
  const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
  const renderer=html.slice(html.indexOf('const assumptions ='));
  assert.ok(renderer.includes('入会あと'));
  assert.ok(renderer.includes('うち紹介入会'));
  assert.ok(!renderer.includes('継続率の目標人数を見る'));
  assert.ok(!renderer.includes('goal.scenarios.map'));
  assert.ok(renderer.includes('<details class="overtake-assumptions">'));
});
