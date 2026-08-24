const TEAM_IDS = Object.freeze(['A', 'B', 'C', 'D']);
const POLICIES = new Set(['unconfirmed', 'including-reenrollment']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function exact(value, keys, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label}_INVALID`);
  assert(Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key)), `${label}_INVALID`);
}

export function validateAdmissions(admissions, label = 'ADMISSIONS') {
  exact(admissions, ['asOf', 'definition', 'fiscalYear', 'futureAdmissionCount', 'reEnrollmentPolicy', 'teams'], label);
  assert(isIsoDate(admissions.asOf), `${label}_ASOF_INVALID`);
  assert(admissions.definition === 'member-master-admission-date-annual-v1', `${label}_DEFINITION_INVALID`);
  assert(/^\d{4}$/.test(admissions.fiscalYear), `${label}_FISCAL_YEAR_INVALID`);
  assert(POLICIES.has(admissions.reEnrollmentPolicy), `${label}_REENROLLMENT_POLICY_INVALID`);
  assert(admissions.futureAdmissionCount === null || (Number.isSafeInteger(admissions.futureAdmissionCount) && admissions.futureAdmissionCount >= 0), `${label}_FUTURE_COUNT_INVALID`);
  exact(admissions.teams, TEAM_IDS, `${label}_TEAMS`);
  for (const id of TEAM_IDS) {
    exact(admissions.teams[id], ['cumulative'], `${label}_${id}`);
    assert(Number.isSafeInteger(admissions.teams[id].cumulative) && admissions.teams[id].cumulative >= 0, `${label}_${id}_COUNT_INVALID`);
  }
  return admissions;
}

/**
 * Returns only safely comparable admission-date deltas. Any missing
 * provenance, definition change, rollback, self-comparison, future-date risk,
 * or negative delta deliberately suppresses every notification.
 */
export function admissionNoticeItems(current, previous) {
  try {
    validateAdmissions(current, 'CURRENT_ADMISSIONS');
    validateAdmissions(previous, 'PREVIOUS_ADMISSIONS');
    assert(current.definition === previous.definition, 'ADMISSIONS_DEFINITION_MISMATCH');
    assert(current.fiscalYear === previous.fiscalYear, 'ADMISSIONS_FISCAL_YEAR_MISMATCH');
    assert(current.reEnrollmentPolicy === 'including-reenrollment' && previous.reEnrollmentPolicy === 'including-reenrollment', 'ADMISSIONS_REENROLLMENT_UNCONFIRMED');
    assert(current.futureAdmissionCount === 0 && previous.futureAdmissionCount === 0, 'ADMISSIONS_FUTURE_DATE_UNCONFIRMED');
    assert(current.asOf > previous.asOf, 'ADMISSIONS_NOT_FORWARD');
    const deltas = TEAM_IDS.map((id) => ({ id, count: current.teams[id].cumulative - previous.teams[id].cumulative }));
    assert(deltas.every((item) => item.count >= 0), 'ADMISSIONS_COUNTER_DECREASED');
    return deltas.filter((item) => item.count > 0);
  } catch {
    return [];
  }
}
