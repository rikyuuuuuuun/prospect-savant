const TEAMS = ['A', 'B', 'C', 'D'];
const ELIGIBLE = new Set(['在籍', '休会', '退会予定']);

function date(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) throw new Error(`${label} must be YYYY-MM-DD`);
  return value;
}

function exact(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  for (const key of Object.keys(value)) if (!keys.has(key)) throw new Error(`${label} contains unsupported field ${key}`);
}

function activeAt(item, asOf, label) {
  date(item.startDate, `${label} startDate`);
  if (item.endDate !== undefined && item.endDate !== null) date(item.endDate, `${label} endDate`);
  return item.startDate <= asOf && (!item.endDate || asOf <= item.endDate);
}

/**
 * Private input only. Each interval is a status observed for a person at a
 * point in time. The result contains aggregates only and is safe for public
 * snapshot generation; person keys are never returned.
 */
export function operationalMembersAt({ asOf, intervals, teamOverrides = [], exceptions = [] }) {
  date(asOf, 'asOf');
  if (!Array.isArray(intervals) || !Array.isArray(teamOverrides) || !Array.isArray(exceptions)) throw new Error('historical input arrays are required');
  const candidates = new Map();
  for (const row of intervals) {
    exact(row, new Set(['personKey', 'team', 'status', 'startDate', 'endDate']), 'membership interval');
    if (typeof row.personKey !== 'string' || !row.personKey || !TEAMS.includes(row.team) || !ELIGIBLE.has(row.status)) throw new Error('membership interval is invalid');
    if (!activeAt(row, asOf, 'membership interval')) continue;
    if (!candidates.has(row.personKey)) candidates.set(row.personKey, new Set());
    candidates.get(row.personKey).add(row.team);
  }
  const overrides = new Map();
  for (const row of teamOverrides) {
    exact(row, new Set(['personKey', 'effectiveTeam', 'approved', 'active', 'startDate', 'endDate']), 'team override');
    if (typeof row.personKey !== 'string' || !TEAMS.includes(row.effectiveTeam) || row.approved !== true || row.active !== true) throw new Error('team override is invalid');
    if (!activeAt(row, asOf, 'team override')) continue;
    if (overrides.has(row.personKey)) throw new Error('duplicate effective team override');
    overrides.set(row.personKey, row.effectiveTeam);
  }
  const counts = Object.fromEntries(TEAMS.map((team) => [team, 0]));
  for (const [personKey, teams] of candidates) {
    const override = overrides.get(personKey);
    if (teams.size > 1 && !override) throw new Error(`ambiguous effective team for ${personKey}`);
    const team = override || [...teams][0];
    if (!teams.has(team)) throw new Error(`override selects absent team for ${personKey}`);
    counts[team] += 1;
  }
  for (const row of exceptions) {
    exact(row, new Set(['personKey', 'team', 'approved', 'active', 'startDate', 'endDate']), 'operational exception');
    if (typeof row.personKey !== 'string' || !row.personKey || !TEAMS.includes(row.team) || row.approved !== true || row.active !== true) throw new Error('operational exception is invalid');
    if (!activeAt(row, asOf, 'operational exception')) continue;
    if (candidates.has(row.personKey)) throw new Error('operational exception duplicates source person');
    counts[row.team] += 1;
  }
  return { counts, total: TEAMS.reduce((sum, team) => sum + counts[team], 0) };
}

export function buildOperationalEventDenominators({ events, intervals, teamOverrides, exceptions, dEvaluationStart = '2025-04-01' }) {
  if (!Array.isArray(events)) throw new Error('events must be an array');
  return events.map((event) => {
    exact(event, new Set(['id', 'startDate', 'participants', 'unassignedParticipants']), 'event');
    if (typeof event.id !== 'string' || !event.id || !event.participants || typeof event.participants !== 'object') throw new Error('event is invalid');
    const roster = operationalMembersAt({ asOf: event.startDate, intervals, teamOverrides, exceptions });
    const teams = {};
    for (const team of TEAMS) {
      const participants = event.participants[team];
      const eligible = team !== 'D' || event.startDate >= dEvaluationStart;
      if (!eligible) { teams[team] = { participants: null, members: null, rate: null, eligible: false }; continue; }
      if (!Number.isSafeInteger(participants) || participants < 0 || participants > roster.counts[team]) throw new Error(`${event.id} ${team}: participants must not exceed denominator`);
      teams[team] = { participants, members: roster.counts[team], rate: Number((participants / roster.counts[team] * 100).toFixed(1)) };
    }
    const eligibleTeams = TEAMS.filter((team) => teams[team].eligible !== false);
    const members = eligibleTeams.reduce((sum, team) => sum + teams[team].members, 0);
    const unassignedParticipants = event.unassignedParticipants || 0;
    if (!Number.isSafeInteger(unassignedParticipants) || unassignedParticipants < 0) throw new Error(`${event.id}: unassignedParticipants is invalid`);
    const participants = eligibleTeams.reduce((sum, team) => sum + teams[team].participants, 0) + unassignedParticipants;
    return { id: event.id, startDate: event.startDate, teams, total: { participants, members, rate: Number((participants / members * 100).toFixed(1)) } };
  });
}

export function scoreOperationalEvents({ events, repeatRates }) {
  const maxima = { participation: 0, repeat: 0 };
  const averages = Object.fromEntries(TEAMS.map((team) => [team, []]));
  for (const event of events) for (const team of TEAMS) if (event.teams[team].rate !== null) {
    averages[team].push(event.teams[team].rate);
    maxima.participation = Math.max(maxima.participation, event.teams[team].rate);
  }
  maxima.repeat = Math.max(...TEAMS.map((team) => repeatRates[team]));
  const teams = {};
  for (const team of TEAMS) {
    const averageRate = Number((averages[team].reduce((a, b) => a + b, 0) / averages[team].length).toFixed(1));
    const participationScore = Number((averageRate / maxima.participation * 100).toFixed(1));
    const repeatScore = Number((repeatRates[team] / maxima.repeat * 100).toFixed(1));
    teams[team] = { averageRate, participationScore, repeatRate: repeatRates[team], repeatScore, score: Math.round(participationScore * 0.7 + repeatScore * 0.3) };
  }
  return { historicalMaxRate: maxima.participation, repeatMaxRate: maxima.repeat, teams };
}
