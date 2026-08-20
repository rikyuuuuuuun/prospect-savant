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

test('publishes the v7 operational-event-denominator snapshot', async () => {
  const source = await readFile(resolve(process.cwd(), 'data.js'), 'utf8');
  const data = parseFrozenJson(source);
  const counts = Object.fromEntries(data.teams.map((team) => [team.id, team.members]));

  assert.equal(data.memberDefinition.id, 'operational-person-v1');
  assert.equal(data.scoreVersion, 'v7-operational-member-denominator');
  assert.equal(data.comparison.scoreVersion, 'v6-event-eligibility-70-30');
  assert.deepEqual(counts, { A: 333, B: 309, C: 224, D: 192 });
  assert.equal(data.headline.members, 1058);
  assert.equal(data.headline.monthlyDelta, null);
  assert.equal(data.comparison.memberDefinition.id, 'legacy-record-count-v0');
});
