export const MEMBER_DELTA_DEFINITION = 'previous-month-end-v1';

const TEAM_IDS = Object.freeze(['A', 'B', 'C', 'D']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

function teamMap(snapshot, label) {
  assert(Array.isArray(snapshot?.teams), `${label}: teams must be an array`);
  const teams = new Map();
  for (const team of snapshot.teams) {
    assert(team && TEAM_IDS.includes(team.id) && !teams.has(team.id), `${label}: team composition is invalid`);
    assert(Number.isSafeInteger(team.members) && team.members >= 0, `${label}: ${team.id} members must be a non-negative integer`);
    teams.set(team.id, team);
  }
  assert(teams.size === TEAM_IDS.length, `${label}: team composition is invalid`);
  return teams;
}

export function previousMonthEnd(asOf) {
  assert(isValidIsoDate(asOf), 'member monthly comparison: current asOf is invalid');
  const [year, month] = asOf.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, 0)).toISOString().slice(0, 10);
}

export function buildMemberMonthlyComparison(snapshot) {
  assert(isValidIsoDate(snapshot?.asOf), 'member monthly comparison: baseline asOf is invalid');
  assert(typeof snapshot?.asOfLabel === 'string' && snapshot.asOfLabel.length > 0,
    'member monthly comparison: baseline label is required');
  assert(typeof snapshot?.memberDefinition?.id === 'string' && snapshot.memberDefinition.id.length > 0,
    'member monthly comparison: member definition is required');
  assert(Number.isSafeInteger(snapshot?.headline?.members) && snapshot.headline.members >= 0,
    'member monthly comparison: headline members must be a non-negative integer');
  const teams = teamMap(snapshot, 'member monthly comparison baseline');
  const total = TEAM_IDS.reduce((sum, id) => sum + teams.get(id).members, 0);
  assert(total === snapshot.headline.members,
    'member monthly comparison: baseline headline members must equal team total');

  return {
    definition: MEMBER_DELTA_DEFINITION,
    previousAsOf: snapshot.asOf,
    previousAsOfLabel: snapshot.asOfLabel,
    headline: { members: snapshot.headline.members },
    teams: TEAM_IDS.map((id) => ({ id, members: teams.get(id).members })),
    memberDefinition: clone(snapshot.memberDefinition),
  };
}

export function selectMemberMonthlyComparison(previousData, currentAsOf, definitionId) {
  const baselineAsOf = previousMonthEnd(currentAsOf);
  if (previousData?.memberDefinition?.id !== definitionId) return null;
  if (previousData.asOf === baselineAsOf) return buildMemberMonthlyComparison(previousData);

  const existing = previousData.memberMonthlyComparison;
  if (existing?.definition === MEMBER_DELTA_DEFINITION
      && existing.previousAsOf === baselineAsOf
      && existing.memberDefinition?.id === definitionId) {
    return clone(existing);
  }
  return null;
}

export function applyMemberMonthlyDelta(data) {
  data.memberDeltaDefinition = MEMBER_DELTA_DEFINITION;
  const comparison = data.memberMonthlyComparison;
  const expectedAsOf = previousMonthEnd(data.asOf);
  const comparable = comparison?.definition === MEMBER_DELTA_DEFINITION
    && comparison.previousAsOf === expectedAsOf
    && comparison.memberDefinition?.id === data.memberDefinition?.id;

  if (!comparable) {
    data.memberMonthlyComparison = null;
    data.headline.monthlyDelta = null;
    for (const team of data.teams || []) team.monthlyDelta = null;
    return false;
  }

  const currentTeams = teamMap(data, 'member monthly comparison current');
  const previousTeams = teamMap(comparison, 'member monthly comparison baseline');
  const previousTotal = TEAM_IDS.reduce((sum, id) => sum + previousTeams.get(id).members, 0);
  assert(previousTotal === comparison.headline?.members,
    'member monthly comparison: baseline headline members must equal team total');
  assert(Number.isSafeInteger(data.headline?.members) && data.headline.members >= 0,
    'member monthly comparison: current headline members must be a non-negative integer');

  data.headline.monthlyDelta = data.headline.members - comparison.headline.members;
  for (const id of TEAM_IDS) {
    currentTeams.get(id).monthlyDelta = currentTeams.get(id).members - previousTeams.get(id).members;
  }
  return true;
}

export function assertMemberMonthlyState(data) {
  assert(data?.memberDeltaDefinition === MEMBER_DELTA_DEFINITION,
    `memberDeltaDefinition must be ${MEMBER_DELTA_DEFINITION}`);
  const comparison = data.memberMonthlyComparison;
  if (comparison === null || comparison === undefined) {
    assert(data.headline?.monthlyDelta === null,
      'headline monthlyDelta must be null without a previous-month-end comparison');
    for (const team of data.teams || []) {
      assert(team.monthlyDelta === null,
        `team ${team.id}: monthlyDelta must be null without a previous-month-end comparison`);
    }
    return;
  }

  assert(comparison.definition === MEMBER_DELTA_DEFINITION,
    'member monthly comparison definition is invalid');
  assert(comparison.previousAsOf === previousMonthEnd(data.asOf),
    'member monthly comparison must use the previous calendar month end');
  assert(comparison.memberDefinition?.id === data.memberDefinition?.id,
    'member monthly comparison member definition must match current');
  assert(Number.isSafeInteger(comparison.headline?.members) && comparison.headline.members >= 0,
    'member monthly comparison headline members must be a non-negative integer');

  const currentTeams = teamMap(data, 'member monthly comparison current');
  const previousTeams = teamMap(comparison, 'member monthly comparison baseline');
  const previousTotal = TEAM_IDS.reduce((sum, id) => sum + previousTeams.get(id).members, 0);
  assert(previousTotal === comparison.headline.members,
    'member monthly comparison headline members must equal team total');
  assert(data.headline.monthlyDelta === data.headline.members - comparison.headline.members,
    'headline monthlyDelta must equal current minus previous-month-end members');
  for (const id of TEAM_IDS) {
    const current = currentTeams.get(id);
    const previous = previousTeams.get(id);
    assert(current.monthlyDelta === current.members - previous.members,
      `team ${id}: monthlyDelta must equal current minus previous-month-end members`);
  }
}
