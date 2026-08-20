import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

function parseFrozenJson(source) {
  const marker = 'Object.freeze(';
  const start = source.indexOf(marker);
  const end = source.lastIndexOf(');');
  return JSON.parse(source.slice(start + marker.length, end));
}

test('publishes a self-consistent v7 operational-event-denominator snapshot', async () => {
  const source = await readFile(resolve(process.cwd(), 'data.js'), 'utf8');
  const data = parseFrozenJson(source);
  const counts = Object.fromEntries(data.teams.map((team) => [team.id, team.members]));

  assert.equal(data.memberDefinition.id, 'operational-person-v1');
  assert.equal(data.scoreVersion, 'v7-operational-member-denominator');
  assert.deepEqual(Object.keys(counts).sort(), ['A', 'B', 'C', 'D']);
  assert.equal(data.headline.members, Object.values(counts).reduce((sum, members) => sum + members, 0));
  assert.equal(data.comparison.scoreVersion, 'v7-operational-member-denominator');
  assert.equal(data.comparison.memberDefinition.id, data.memberDefinition.id);
  assert.ok(data.comparison.previousAsOf < data.asOf);
  assert.equal(data.headline.monthlyDelta, data.headline.members - data.comparison.headline.members);
  for (const team of data.teams) {
    const previous = data.comparison.teams.find((candidate) => candidate.id === team.id);
    assert.ok(previous, `missing previous team ${team.id}`);
    assert.equal(team.monthlyDelta, team.members - previous.members);
  }
});
