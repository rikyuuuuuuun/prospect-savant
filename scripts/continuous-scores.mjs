import { baseNote, buildTeamMetricExplanation, EXPLANATION_PREFIX, OPERATION_NOTE_PREFIX } from './metric-explanation-text.mjs';
import { buildOvertakeTargets } from './overtake-targets.mjs';
import { includeETeam } from './e-team-metrics.mjs';

export const CONTINUOUS_SCORE_VERSION = 'reference-index-v4';
const RANGE_SHARE = 0.3;
const LEVEL_SHARE = 0.01;
const REFERENCE = 60;
const RADIUS = 25;
const eventIndex = value => Number.isFinite(value) ? 35 + Math.max(0, Math.min(100, value)) / 2 : null;
const valid = value => Number.isFinite(value) && value >= 0;

// A comparison index, not a completion percentage. The group mean is 60;
// bounded continuous differences approach 35/85 without implying zero/perfection.
export function continuousScore(value, peers) {
  const available = peers.filter(valid);
  if (!valid(value) || !available.length) return null;
  const values = [value, ...available];
  const mean = values.reduce((sum, item) => sum + item, 0) / values.length;
  if (mean === 0) return REFERENCE;
  const width = (Math.max(...values) - Math.min(...values)) * RANGE_SHARE + mean * LEVEL_SHARE;
  const difference = value - mean;
  return REFERENCE + RADIUS * difference / Math.hypot(difference, width);
}

const weighted = entries => {
  const available = entries.filter(item => Number.isFinite(item.score) && item.weight > 0);
  const total = available.reduce((sum, item) => sum + item.weight, 0);
  return total ? available.reduce((sum, item) => sum + item.score * item.weight, 0) / total : null;
};
const ratio = (numerator, denominator, fallback) => valid(numerator) && denominator > 0
  ? numerator / denominator * 100 : valid(fallback) ? fallback : null;

function scoreTeams(teams, weights, minimumSample) {
  const evidence = team => team.metricEvidence;
  const relative = (team, getter) => continuousScore(getter(team), teams.filter(other => other.id !== team.id).map(getter));
  const retainedRate = period => period?.scored && period.sample >= minimumSample
    ? ratio(period.retained, period.sample, period.rate) : null;
  const raw = new Map();
  for (const team of teams) {
    const ev = evidence(team);
    if (!ev?.retention || !ev.admission || !ev.growth || !ev.event || ev.family?.definition !== 'referral-volume-rate-v2') {
      team.metrics = Object.fromEntries(weights.map(item => [item.key, null]));
      team.overall = team.rank = null;
      continue;
    }
    const original = team.metrics;
    const periods = ev.retention.periods.map(period => ({ ...period,
      relativeScore: relative(team, other => Number.isFinite(other.metrics.retention)
        ? retainedRate(evidence(other)?.retention?.periods?.find(item => item.key === period.key)) : null),
    }));
    const scores = {
      retention: Number.isFinite(original.retention) ? weighted(periods.map(period => ({ score: period.relativeScore, weight: period.weight }))) : null,
      admission: Number.isFinite(original.admission) ? relative(team, other => {
        const item = evidence(other)?.admission;
        return item ? ratio(item.admissions, item.trials, item.rate) : null;
      }) : null,
      growth: Number.isFinite(original.growth) ? relative(team, other => evidence(other)?.growth?.weightedPoints) : null,
      // Preserve historical-max normalization and 70/30 weights, then use the
      // same display range instead of a 100-point completion percentage.
      event: Number.isFinite(original.event) ? weighted([
        { score: eventIndex(ev.event.participationScore), weight: ev.event.participationWeight },
        { score: eventIndex(ev.event.repeatScore), weight: ev.event.repeatWeight },
      ]) : null,
    };
    const pointScore = relative(team, other => evidence(other)?.family?.points);
    const rateScore = relative(team, other => {
      const item = evidence(other)?.family;
      return item ? ratio(item.points, item.members, item.rate) : null;
    });
    scores.family = Number.isFinite(original.family) && pointScore !== null && rateScore !== null
      ? weighted([{ score: pointScore, weight: ev.family.weights.points }, { score: rateScore, weight: ev.family.weights.rate }]) : null;
    raw.set(team.id, { scores, periods, pointScore, rateScore });
  }
  // Apply only after every team has been scored, so peer inputs are immutable.
  for (const team of teams) {
    const result = raw.get(team.id);
    if (!result) continue;
    const ev = evidence(team), { scores } = result;
    team.metrics = Object.fromEntries(Object.entries(scores).map(([key, value]) => [key, value === null ? null : Math.round(value)]));
    const available = weights.filter(item => item.value > 0 && Number.isFinite(scores[item.key]));
    const totalWeight = weights.reduce((sum, item) => sum + item.value, 0);
    team.overall = available.length && totalWeight > 0
      ? Math.round(available.reduce((sum, item) => sum + scores[item.key] * item.value, 0) / totalWeight) : null;
    ev.retention = { ...ev.retention, periods: result.periods.map(period => ({ ...period, relativeScore: period.relativeScore === null ? null : Math.round(period.relativeScore) })), weightedIndex: team.metrics.retention };
    ev.admission.relativeScore = team.metrics.admission;
    ev.growth.relativeScore = team.metrics.growth;
    ev.event.score = team.metrics.event;
    Object.assign(ev.family, { pointScore: result.pointScore === null ? null : Math.round(result.pointScore), rateScore: result.rateScore === null ? null : Math.round(result.rateScore), calculatedScore: team.metrics.family });
  }
  for (const team of teams) {
    team.rank = Number.isFinite(team.overall)
      ? 1 + teams.filter(other => Number.isFinite(other.overall) && other.overall > team.overall).length : null;
    const count = weights.filter(item => Number.isFinite(team.metrics[item.key])).length;
    if ('status' in team) team.status = count === weights.length ? '算出済'
      : count ? `${count}/${weights.length}指標で集計` : '対象実績待ち';
  }
}

// Project the verified anonymous snapshot into staff-facing scores at bundle build
// time. Keep source files, Sheets reconciliation and historical records intact.
export function projectContinuousScores(source, sourceEvents, minimumSample = 20, sourceAuxiliary = {}) {
  const data = structuredClone(source), events = structuredClone(sourceEvents);
  const auxiliary = structuredClone(sourceAuxiliary);
  const originalVersion = data.scoreVersion;
  includeETeam(data, events, auxiliary);
  const scoringSource = structuredClone(data);
  scoreTeams(data.teams, data.weights, minimumSample);
  data.sourceScoreVersion = originalVersion;
  data.scoreVersion = `${originalVersion}:${CONTINUOUS_SCORE_VERSION}`;
  if (data.comparison) {
    const sameVersion = data.comparison.scoreVersion === originalVersion;
    scoreTeams(data.comparison.teams, data.weights, minimumSample);
    data.comparison.scoreVersion = sameVersion ? data.scoreVersion : `incomparable:${data.comparison.scoreVersion}`;
  }
  const currentEvidence = Object.fromEntries(data.teams.map(team => [team.id, team.metricEvidence]));
  const previousEvidence = Object.fromEntries((data.comparison?.teams || []).map(team => [team.id, team.metricEvidence]));
  for (const team of data.teams) {
    const context = baseNote(team.note);
    const previousTeam = data.comparison?.scoreVersion === data.scoreVersion
      ? data.comparison.teams.find(item => item.id === team.id) : null;
    if (team.metricEvidence && Object.values(team.metrics).every(Number.isFinite)) {
      const explanation = buildTeamMetricExplanation({ team, previousTeam, currentEvidence: team.metricEvidence,
        previousEvidence: previousTeam?.metricEvidence, allCurrentEvidence: currentEvidence,
        allPreviousEvidence: previousEvidence, previousLabel: data.comparison?.previousAsOfLabel,
      }).replace('全チームの相対順位を加重', '実績差による連続相対点を加重')
        .replace(/(相対点(?:が)?|人数相対点|紹介率相対点)(\d+)\.0/g, '$1$2')
        .replace(/(→)(\d+)\.0(?=、|となり|×|）)/g, '$1$2')
        .replace(/([+-]?\d+\.\d+)点/g, (_, value) => `${Math.round(Number(value))}点`);
      team.note = `${EXPLANATION_PREFIX}${explanation}${context ? `${OPERATION_NOTE_PREFIX}${context}` : ''}`;
    } else {
      const count = Object.values(team.metrics).filter(Number.isFinite).length;
      team.note = Number.isFinite(team.overall)
        ? `${data.weights.length}指標中${count}指標で集計しています。総合点は算出済みの各指標の指数×配点を合計し、全指標の総配点で割って算出します。対象実績が増えるとその指標の寄与が総合点へ加わります。${context}`
        : `総合点の対象となる実績を集計中です。${context}`;
    }
    if (events?.teams?.[team.id]) events.teams[team.id].score = team.metrics.event;
    const higher = data.teams.filter(other => other.overall > team.overall).sort((a, b) => a.overall - b.overall)[0];
    if (team.rank !== null && higher) {
      const gap = higher.overall - team.overall;
      const previousTarget = data.comparison?.teams.find(other => other.id === higher.id);
      const definitionsMatch = JSON.stringify(data.comparison?.metricDefinitions || {}) === JSON.stringify(data.metricDefinitions || {});
      const previousGap = previousTeam && definitionsMatch && Number.isFinite(previousTeam.overall) && Number.isFinite(previousTarget?.overall)
        ? previousTarget.overall - previousTeam.overall : null;
      team.chase = { targetId: higher.id, gap, closed: previousGap !== null && previousGap > 0 ? previousGap - gap : null };
    }
  }
  const methodology = data.methodology.find(item => item.title === '指標ごとに正規化');
  if (methodology) methodology.body = '各指標は60を基準とする比較指数です。定着・年度入会・成長・紹介は、比較可能な全チームの実績平均からの差を、共通の比較幅でなめらかに換算します。各指標の比較範囲は35〜85です。全チーム同じ実績なら60です。定着の期間重み、紹介の人数70％＋率30％、イベントの参加70％＋継続30％と歴代MAXの集計基準を使用します。イベントは歴代MAX到達度を35〜85の指数へ換算。総合は、算出済みの各指標の丸め前の指数×既存配点を合計し、全指標の総配点で割って整数に丸めます。一部指標が対象実績待ちでも総合点と順位を算出し、使用した指標数を表示します。対象となる指標が増えるとその寄与が総合点へ加わります。前回も同じ方式で再計算します。';
  data.scoreGuide = [{value:35,label:'比較下側'},{value:60,label:'比較基準'},{value:85,label:'比較上側'}];
  data.scoring = { version: CONTINUOUS_SCORE_VERSION, precision: 0, reference: 'group-mean', center: REFERENCE, range: [35,85], transition: { rangeShare: RANGE_SHARE, levelShare: LEVEL_SHARE }, allZeroScore: REFERENCE };
  data.quality.completeness = Math.round(data.teams.reduce((sum, team) => sum + Object.values(team.metrics).filter(Number.isFinite).length, 0) / (data.teams.length * data.weights.length) * 100);
  data.overtakeTargets = buildOvertakeTargets({ source: scoringSource, currentTeams: data.teams,
    evaluate: teams => { scoreTeams(teams, source.weights, minimumSample); return teams; },
  });
  return { data, events, ...auxiliary };
}
