import { TEAM_IDS, percentileScore } from './metric-retention-evidence.mjs';
import { fiscalYearFor, serialToIsoDate } from './private-trial-aggregate.mjs';

export const REFERRAL_RANGE = "'08_紹介力'!A1:F11";
export const REFERRAL_DEFINITION = 'referral-points-v1';
const check = (ok, code) => { if (!ok) throw new Error(code); };

export function readReferralEvidence(rows, asOf) {
  check(Array.isArray(rows) && rows[10]?.[5] === 'READY', 'REFERRAL_SOURCE_NOT_READY');
  check(serialToIsoDate(rows[1]?.[3]) === asOf, 'REFERRAL_ASOF_MISMATCH');
  check(serialToIsoDate(rows[1]?.[1]) === `${fiscalYearFor(asOf)}-04-01`, 'REFERRAL_YEAR_MISMATCH');
  check(JSON.stringify(rows[3]?.slice(0, 6)) === JSON.stringify(['チーム', '紹介体験', '兄弟姉妹入会', '紹介ポイント', '紹介力点', '定義']), 'REFERRAL_HEADER_MISMATCH');
  const selected = rows.slice(4, 8);
  selected.forEach((row, i) => {
    check(row[0] === TEAM_IDS[i] && row[5] === REFERRAL_DEFINITION, 'REFERRAL_TEAM_OR_DEFINITION_INVALID');
    check(row.slice(1, 4).every(v => Number.isSafeInteger(v) && v >= 0), 'REFERRAL_COUNT_INVALID');
    check(row[1] + row[2] === row[3], 'REFERRAL_TOTAL_MISMATCH');
  });
  const points = selected.map(row => row[3]);
  for (let col = 1; col <= 3; col++) check(selected.reduce((n, row) => n + row[col], 0) === rows[8]?.[col], 'REFERRAL_HEADLINE_MISMATCH');
  return Object.fromEntries(selected.map(row => {
    const calculatedScore = Math.max(...points) === 0 ? 0 : percentileScore(row[3], points);
    check(Number.isFinite(row[4]) && Math.abs(calculatedScore - row[4]) < 0.01, 'REFERRAL_SCORE_MISMATCH');
    return [row[0], { definition: REFERRAL_DEFINITION, fiscalYear: fiscalYearFor(asOf), asOf,
      trialPoints: row[1], siblingPoints: row[2], points: row[3], calculatedScore,
      status: '算出可能', scaleAdjustment: 'none' }];
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
    team.benchmark.referralPoints = evidence[team.id].points;
    team.note = String(team.note || '').replace(/家庭継続力は[^。]*。/g, '');
  }
  for (const item of data.methodology || []) {
    if (typeof item.body === 'string') item.body = item.body.replaceAll('家庭継続', '紹介');
  }
  return evidence;
}
