import { TEAM_IDS } from './metric-retention-evidence.mjs';
import { buildMetricEvidence, buildLegacyPreviousEvidence } from './metric-evidence.mjs';
import { EXPLANATION_PREFIX, OPERATION_NOTE_PREFIX, baseNote, buildTeamMetricExplanation } from './metric-explanation-text.mjs';

export { buildMetricEvidence } from './metric-evidence.mjs';
export { buildRetentionEvidenceFromCurve } from './metric-retention-evidence.mjs';

export function applyMetricEvidenceAndExplanations({ data, ranges, retentionCurve, eventHistory, previousRetentionCurve, previousEventHistory, previousTrialData }) {
  const currentEvidence = buildMetricEvidence({ data, ranges, retentionCurve, eventHistory });
  const legacyPrevious = buildLegacyPreviousEvidence({ data, previousRetentionCurve, previousEventHistory, previousTrialData });
  const previousTeams = new Map((data?.comparison?.teams || []).map((team) => [team.id, team]));
  const previousEvidence = Object.fromEntries(TEAM_IDS.map((id) => [id, previousTeams.get(id)?.metricEvidence || legacyPrevious[id] || null]));

  for (const team of data.teams || []) {
    const id = team.id;
    const previousTeam = previousTeams.get(id);
    const context = baseNote(team.note);
    team.metricEvidence = currentEvidence[id];
    const explanation = buildTeamMetricExplanation({
      team, previousTeam,
      currentEvidence: currentEvidence[id], previousEvidence: previousEvidence[id],
      allCurrentEvidence: currentEvidence, allPreviousEvidence: previousEvidence,
      previousLabel: data.comparison?.previousAsOfLabel,
    });
    team.note = `${EXPLANATION_PREFIX}${explanation}${context ? `${OPERATION_NOTE_PREFIX}${context}` : ''}`;
  }
  return data;
}
