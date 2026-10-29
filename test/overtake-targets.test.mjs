import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseFrozenJson } from '../scripts/trial-publication.mjs';
import { projectContinuousScores } from '../scripts/continuous-scores.mjs';

const fixture = async () => {
  const read = async file => parseFrozenJson(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'), file);
  return { source: await read('data.js'), events: await read('event-data.js') };
};

test('each displayed plan overtakes its named rival when replayed from the unchanged raw evidence', async () => {
  const { source, events } = await fixture(), before = JSON.stringify({source,events});
  const initial = projectContinuousScores(source, events).data;
  for (const [id, goal] of Object.entries(initial.overtakeTargets)) {
    if (goal.status === 'leader') { assert.equal(initial.teams.find(t=>t.id===id).rank,1); continue; }
    assert.equal(goal.status, 'ready');
    assert.ok(goal.scenarios.length > 0);
    for (const plan of goal.scenarios) {
      const candidate = structuredClone(source), mine = candidate.teams.find(t=>t.id===id);
      for (const action of plan.actions) {
        const e = mine.metricEvidence;
        if (action.metric === 'admission') {
          assert.ok(action.to <= e.admission.trials);
          e.admission.admissions = action.to;
        } else if (action.metric === 'family') e.family.points = action.to;
        else if (action.metric === 'growth') e.growth.weightedPoints = action.to;
        else if (action.metric === 'retention') {
          for (const p of action.periods) {
            assert.ok(p.retained <= p.sample && p.retained >= p.fromRetained);
            const period = e.retention.periods.find(item=>item.key===p.key);
            period.retained = p.retained;
          }
        } else if (action.metric === 'event') {
          e.event.participationScore = Math.min(100, e.event.participationScore + action.delta / events.historicalMaxRate * 100);
        }
      }
      const after = projectContinuousScores(candidate,events).data;
      const me = after.teams.find(t=>t.id===id), rival = after.teams.find(t=>t.id===goal.targetId);
      assert.equal(me.overall,plan.ownScore);
      assert.equal(rival.overall,plan.rivalScore);
      assert.ok(me.overall > rival.overall,'a displayed tie is not an overtake');
      assert.ok(me.rank < initial.teams.find(t=>t.id===id).rank);
    }
  }
  assert.equal(JSON.stringify({source,events}),before);
});

test('a lower relative position does not look like no activity and leadership is not perfection', async () => {
  const {source,events} = await fixture();
  const {data} = projectContinuousScores(source,events);
  assert.ok(data.teams.find(t=>t.id==='C').metrics.retention >= 35);
  assert.ok(data.teams.find(t=>t.id==='A').metrics.growth <= 85);
  assert.equal(data.scoring.center,60);
  for(const team of data.teams) {
    assert.ok(team.overall >= 35 && team.overall <= 85);
    assert.ok(Object.values(team.metrics).every(value=>Number.isInteger(value)&&value>=35&&value<=85));
  }
});

test('goals stay withheld when the full-team ranking cannot be confirmed', async () => {
  const {source,events} = await fixture();
  source.teams[0].overall = source.teams[0].metrics.retention = null;
  const {data} = projectContinuousScores(source,events);
  assert.ok(Object.values(data.overtakeTargets).every(goal=>goal.status==='unavailable' && goal.scenarios.length===0));
});

test('a team tied at the top gets a strict overtaking plan instead of being labeled sole leader', async () => {
  const {source,events} = await fixture();
  source.teams[1].metricEvidence = structuredClone(source.teams[0].metricEvidence);
  source.teams[1].metrics = structuredClone(source.teams[0].metrics);
  const {data} = projectContinuousScores(source,events);
  for (const id of ['A','B']) {
    assert.notEqual(data.overtakeTargets[id].status,'leader');
    assert.ok(data.overtakeTargets[id].scenarios.every(plan=>plan.ownScore>plan.rivalScore));
  }
});
