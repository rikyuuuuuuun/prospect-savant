import { baseNote, buildTeamMetricExplanation, EXPLANATION_PREFIX, OPERATION_NOTE_PREFIX } from './metric-explanation-text.mjs';

export const CONTINUOUS_SCORE_VERSION = 'continuous-soft-rank-v2';
const RANGE_SHARE = 0.2;
const LEVEL_SHARE = 0.01;
const valid = value => Number.isFinite(value) && value >= 0;

// Smooth each head-to-head comparison rather than compressing all teams toward
// the overall mean. A shared, proportional transition width keeps ordering fair
// and lets teams approach one another without a step at the crossing point.
export function continuousScore(value, peers) {
  const available = peers.filter(valid);
  if (!valid(value) || !available.length) return null;
  const values = [value, ...available];
  const mean = values.reduce((sum, item) => sum + item, 0) / values.length;
  if (mean === 0) return 0;
  const width = (Math.max(...values) - Math.min(...values)) * RANGE_SHARE + mean * LEVEL_SHARE;
  return available.reduce((sum, peer) => {
    const difference = value - peer;
    return sum + 50 * (1 + difference / Math.hypot(difference, width));
  }, 0) / available.length;
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
      // Event denominators and historical-max normalization remain unchanged.
      event: Number.isFinite(original.event) ? weighted([
        { score: ev.event.participationScore, weight: ev.event.participationWeight },
        { score: ev.event.repeatScore, weight: ev.event.repeatWeight },
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
    team.overall = Number.isFinite(team.overall) && weights.every(item => Number.isFinite(scores[item.key]))
      ? Math.round(weighted(weights.map(item => ({ score: scores[item.key], weight: item.value })))) : null;
    ev.retention = { ...ev.retention, periods: result.periods.map(period => ({ ...period, relativeScore: period.relativeScore === null ? null : Math.round(period.relativeScore) })), weightedIndex: team.metrics.retention };
    ev.admission.relativeScore = team.metrics.admission;
    ev.growth.relativeScore = team.metrics.growth;
    ev.event.score = team.metrics.event;
    Object.assign(ev.family, { pointScore: result.pointScore === null ? null : Math.round(result.pointScore), rateScore: result.rateScore === null ? null : Math.round(result.rateScore), calculatedScore: team.metrics.family });
  }
  const complete = teams.every(team => Number.isFinite(team.overall));
  for (const team of teams) {
    team.rank = complete ? 1 + teams.filter(other => other.overall > team.overall).length : null;
    if ('status' in team) team.status = complete ? '算出済' : '総合順位確認中';
  }
}

// Project the verified anonymous snapshot into staff-facing scores at bundle build
// time. Keep source files, Sheets reconciliation and historical records intact.
export function projectContinuousScores(source, sourceEvents, minimumSample = 20) {
  const data = structuredClone(source), events = structuredClone(sourceEvents);
  const originalVersion = data.scoreVersion;
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
      }).replace('A〜Dの相対順位を加重', '実績差による連続相対点を加重')
        .replace(/(相対点(?:が)?|人数相対点|紹介率相対点)(\d+)\.0/g, '$1$2')
        .replace(/(→)(\d+)\.0(?=、|となり|×|）)/g, '$1$2')
        .replace(/([+-]?\d+\.\d+)点/g, (_, value) => `${Math.round(Number(value))}点`);
      team.note = `${EXPLANATION_PREFIX}${explanation}${context ? `${OPERATION_NOTE_PREFIX}${context}` : ''}`;
    } else team.note = '比較できる実績が不足している指標は確認中です。総合点・順位を保留しています。';
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
  if (methodology) methodology.body = '定着・年度入会・成長・紹介は、各チームとの実績差を連続的に点数化し、その平均で採点します。実績差が大きいほど点差が開き、追い上げる途中でも点数が動きます。同じ実績なら50点、全チーム実績ゼロなら0点。定着は比較可能な期間を加重、紹介は人数70％＋紹介率30％。イベント力は従来の歴代MAX到達度と参加70％＋継続30％を維持します。総合点は丸め前の各指標×既存配点で計算し、点数と点差は整数表示・整数で順位判定します。前回分も同じ方式で再計算します。小さな改善は表示できる点数に達すると1点ずつ変わります。他チームの実績の変化でも点数は動きます。';
  data.scoring = { version: CONTINUOUS_SCORE_VERSION, precision: 0, reference: 'smooth-pairwise-comparison', transition: { rangeShare: RANGE_SHARE, levelShare: LEVEL_SHARE }, allZeroScore: 0 };
  return { data, events };
}
