const TEAM_IDS = new Set(['A', 'B', 'C', 'D']);
const ELIGIBLE_STATUSES = new Set(['在籍', '休会', '退会予定']);
const EXCLUDED_STATUSES = new Set(['退会', '削除']);

function fail(message) {
  throw new Error(`operational roster: ${message}`);
}

function requireExactKeys(value, allowedKeys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object`);
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) fail(`${label} contains unsupported field ${key}`);
  }
}

function requirePersonKey(value, label) {
  if (typeof value !== 'string') fail(`${label} personKey must be a string`);
  const personKey = value.trim();
  if (!personKey) fail(`${label} is missing personKey`);
  return personKey;
}

function requireTeam(value, label) {
  const team = String(value || '').trim();
  if (!TEAM_IDS.has(team)) fail(`${label} has invalid team ${JSON.stringify(team)}`);
  return team;
}

function indexOverrides(overrides) {
  const indexed = new Map();
  for (const override of overrides) {
    requireExactKeys(override, new Set(['personKey', 'effectiveTeam', 'approved', 'active']), 'team override');
    const personKey = requirePersonKey(override.personKey, 'team override');
    const team = requireTeam(override.effectiveTeam, `team override ${personKey}`);
    if (override.approved !== true || override.active !== true) {
      fail(`team override ${personKey} must be approved and active`);
    }
    if (indexed.has(personKey)) fail(`duplicate team override for ${personKey}`);
    indexed.set(personKey, { team, approved: true, active: true });
  }
  return indexed;
}

/**
 * Builds a one-person-per-row operational roster from a private, already
 * normalized membership feed. The caller must never commit that feed to this
 * public repository.
 */
export function buildOperationalRoster({ records, teamOverrides = [], exceptions = [] }) {
  if (!Array.isArray(records)) fail('records must be an array');
  if (!Array.isArray(teamOverrides)) fail('teamOverrides must be an array');
  if (!Array.isArray(exceptions)) fail('exceptions must be an array');

  const overrides = indexOverrides(teamOverrides);
  const grouped = new Map();

  for (const record of records) {
    requireExactKeys(record, new Set(['personKey', 'team', 'status']), 'eligible source record');
    const personKey = requirePersonKey(record.personKey, 'source record');
    const team = requireTeam(record.team, `source record ${personKey}`);
    const status = String(record.status || '').trim();
    if (EXCLUDED_STATUSES.has(status)) continue;
    if (!ELIGIBLE_STATUSES.has(status)) {
      fail(`unknown status ${JSON.stringify(status)} for a source record`);
    }
    if (!grouped.has(personKey)) grouped.set(personKey, new Set());
    grouped.get(personKey).add(team);
  }

  const roster = [];
  for (const personKey of overrides.keys()) {
    if (!grouped.has(personKey)) fail(`team override ${personKey} has no eligible source person`);
  }
  for (const [personKey, teams] of grouped) {
    const override = overrides.get(personKey);
    if (teams.size > 1 && !override) {
      fail(`ambiguous effective team for ${personKey}`);
    }
    if (override && teams.size < 2) {
      fail(`team override ${personKey} does not resolve a source conflict`);
    }
    if (override && !teams.has(override.team)) {
      fail(`team override ${personKey} selects a team absent from source records`);
    }
    roster.push({ personKey, team: override?.team || [...teams][0], source: 'kaihipay' });
  }

  const rosterByPerson = new Map(roster.map((member) => [member.personKey, member]));
  for (const exception of exceptions) {
    requireExactKeys(exception, new Set(['personKey', 'team', 'approved', 'active']), 'operational exception');
    const personKey = requirePersonKey(exception.personKey, 'operational exception');
    const team = requireTeam(exception.team, `operational exception ${personKey}`);
    if (exception.approved !== true || exception.active !== true) {
      fail(`operational exception ${personKey} must be approved and active`);
    }
    if (rosterByPerson.has(personKey)) {
      fail(`operational exception ${personKey} duplicates a source person`);
    }
    const member = { personKey, team, source: 'approved-exception' };
    roster.push(member);
    rosterByPerson.set(personKey, member);
  }

  roster.sort((left, right) => left.personKey.localeCompare(right.personKey));
  const counts = Object.fromEntries([...TEAM_IDS].map((team) => [team, 0]));
  for (const member of roster) counts[member.team] += 1;

  return {
    roster,
    counts,
    total: roster.length,
  };
}
