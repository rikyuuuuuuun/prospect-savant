import { TEAM_IDS, percentileScore } from './metric-retention-evidence.mjs';
import { fiscalYearFor, serialToIsoDate } from './private-trial-aggregate.mjs';

export const REFERRAL_RANGE = "'08_紹介力'!A1:L11";
export const REFERRAL_DEFINITION = 'referral-volume-rate-v2';
const check = (ok, code) => { if (!ok) throw new Error(code); };

export function readReferralEvidence(rows, asOf) {
  check(Array.isArray(rows) && rows[10]?.[5] === 'READY', 'REFERRAL_SOURCE_NOT_READY');
  check(serialToIsoDate(rows[1]?.[3]) === asOf, 'REFERRAL_ASOF_MISMATCH');
  check(serialToIsoDate(rows[1]?.[1]) === `${fiscalYearFor(asOf)}-04-01`, 'REFERRAL_YEAR_MISMATCH');
  check(JSON.stringify(rows[3]?.slice(0, 12)) === JSON.stringify(['チーム', '紹介体験', '兄弟姉妹入会', '紹介ポイント', '紹介力点', '定義', '基準日会員数', '紹介率', '人数相対点', '紹介率相対点', '人数配点', '紹介率配点']), 'REFERRAL_HEADER_MISMATCH');
  const selected = rows.slice(4, 8);
  selected.forEach((row, i) => {
    check(row[0] === TEAM_IDS[i] && row[5] === REFERRAL_DEFINITION, 'REFERRAL_TEAM_OR_DEFINITION_INVALID');
    check(row.slice(1, 4).every(v => Number.isSafeInteger(v) && v >= 0), 'REFERRAL_COUNT_INVALID');
    check(row[1] + row[2] === row[3], 'REFERRAL_TOTAL_MISMATCH');
    check(Number.isSafeInteger(row[6]) && row[6] > 0, 'REFERRAL_DENOMINATOR_INVALID');
    check(Number.isFinite(row[7]) && Math.abs(row[7] - row[3] / row[6]) < 1e-10, 'REFERRAL_RATE_MISMATCH');
    check(row[10] === 0.7 && row[11] === 0.3, 'REFERRAL_WEIGHT_MISMATCH');
  });
  const points = selected.map(row => row[3]);
  const rates = selected.map(row => row[7]);
  check(selected.reduce((n, row) => n + row[6], 0) === rows[8]?.[6], 'REFERRAL_MEMBER_TOTAL_MISMATCH');
  check(Math.abs(rows[8]?.[7] - rows[8]?.[3] / rows[8]?.[6]) < 1e-10, 'REFERRAL_HEADLINE_RATE_MISMATCH');
  for (let col = 1; col <= 3; col++) check(selected.reduce((n, row) => n + row[col], 0) === rows[8]?.[col], 'REFERRAL_HEADLINE_MISMATCH');
  return Object.fromEntries(selected.map(row => {
    const pointScore = Math.max(...points) === 0 ? 0 : percentileScore(row[3], points);
    const rateScore = Math.max(...rates) === 0 ? 0 : percentileScore(row[7], rates);
    check(Number.isFinite(row[8]) && Math.abs(row[8] - pointScore) < 0.01 && Number.isFinite(row[9]) && Math.abs(row[9] - rateScore) < 0.01, 'REFERRAL_COMPONENT_SCORE_MISMATCH');
    const calculatedScore = pointScore * 0.7 + rateScore * 0.3;
    check(Number.isFinite(row[4]) && Math.abs(calculatedScore - row[4]) < 0.01, 'REFERRAL_SCORE_MISMATCH');
    return [row[0], { definition: REFERRAL_DEFINITION, fiscalYear: fiscalYearFor(asOf), asOf,
      trialPoints: row[1], siblingPoints: row[2], points: row[3], calculatedScore,
      members: row[6], rate: row[7] * 100, pointScore, rateScore, weights: { points: 70, rate: 30 },
      status: '算出可能', denominatorBasis: 'operational-members-at-asof' }];
  }));
}

export function applyReferralMetadata(data, rows, previousData) {
  const evidence = readReferralEvidence(rows, data.asOf);
  data.metricDefinitions = { ...data.metricDefinitions, family: REFERRAL_DEFINITION };
  data.metricLabels.family = '紹介力';
  data.weights.find(item => item.key === 'family').label = '紹介力';
  if (data.comparison && data.comparison.previousAsOf === previousData.asOf) {
    data.comparison.metricDefinitions = previousData.metricDefinitions || {};
  }
  for (const team of data.teams) {
    check(Math.abs(team.metrics.family - evidence[team.id].calculatedScore) <= 0.51, 'REFERRAL_TEAM_SCORE_MISMATCH');
    check(team.members === evidence[team.id].members, 'REFERRAL_PUBLIC_MEMBER_MISMATCH');
    team.benchmark.referralPoints = evidence[team.id].points;
    team.benchmark.referralRate = evidence[team.id].rate;
    team.benchmark.referralMembers = evidence[team.id].members;
    team.note = String(team.note || '').replace(/家庭継続力は[^。]*。/g, '');
  }
  for (const item of data.methodology || []) {
    if (typeof item.body === 'string') item.body = item.body.replaceAll('家庭継続', '紹介');
  }
  const methodology = (data.methodology || []).find(item => item.title === '指標ごとに正規化');
  if (methodology) methodology.body = '定着・入会・成長はパーセンタイル、イベント力は対象実績の歴代MAX到達度。紹介力は紹介人数の相対点70％＋会員数に対する紹介率の相対点30％で表示します。';
  return evidence;
}
