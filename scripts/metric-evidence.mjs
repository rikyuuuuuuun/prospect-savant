import { readReferralEvidence } from './referral-evidence.mjs';
import {
  TEAM_IDS, assertEvidence, number, count, round1, rawPctFromFraction, pctFromFraction,
  findHeaderRow, rowsByTeam, percentileScore, retainedFromRate,
  buildRetentionEvidenceFromSource, buildRetentionEvidenceFromCurve,
} from './metric-retention-evidence.mjs';

const FAMILY_COMPONENTS = [
  { key: 'sibling', label: '兄弟姉妹在籍世帯率', sourceLabel: '兄弟姉妹在籍世帯率', rateIndex: 3, numeratorIndex: 2, denominatorIndex: 1, weightLabel: '家庭継続力 兄弟姉妹重み' },
  { key: 'retention2y', label: '2年継続率', sourceLabel: '2年継続率', rateIndex: 5, denominatorIndex: 4, weightLabel: '家庭継続力 2年継続重み' },
  { key: 'reentry', label: '再入会率', sourceLabel: '再入会率（6か月基準）', rateIndex: 8, numeratorIndex: 7, denominatorIndex: 6, weightLabel: '家庭継続力 再入会重み' },
  { key: 'eventRepeat', label: 'イベント継続参加率', sourceLabel: 'イベント継続参加率', rateIndex: 11, numeratorIndex: 10, denominatorIndex: 9, weightLabel: '家庭継続力 イベント継続重み' },
];

function metricScore(team, key) {
  const value = team?.metrics?.[key];
  return Number.isFinite(value) ? value : null;
}

function buildAdmissionEvidence(rows) {
  const header = findHeaderRow(rows, ['チーム', '年度入会率']);
  assertEvidence(header >= 0, 'ADMISSION_EVIDENCE_HEADER_MISSING');
  const map = rowsByTeam(rows, header);
  return Object.fromEntries(TEAM_IDS.map((id) => {
    const row = map.get(id);
    assertEvidence(row, `ADMISSION_EVIDENCE_${id}_MISSING`);
    return [id, {
      trials: count(row[1]), admissions: count(row[2]), rate: pctFromFraction(row[3]),
      previousRate: pctFromFraction(row[4]), yoyDelta: pctFromFraction(row[5]),
      relativeScore: number(row[6]) === null ? null : round1(number(row[6])),
    }];
  }));
}

function buildGrowthEvidence(rows, data) {
  const header = findHeaderRow(rows, ['チーム', '上位10％記録', '成長力点']);
  assertEvidence(header >= 0, 'GROWTH_EVIDENCE_HEADER_MISSING');
  const map = rowsByTeam(rows, header);
  return Object.fromEntries(TEAM_IDS.map((id) => {
    const row = map.get(id);
    assertEvidence(row, `GROWTH_EVIDENCE_${id}_MISSING`);
    return [id, {
      top10: count(row[1]), top10to20: count(row[2]), top20to30: count(row[3]),
      relativeScore: number(row[4]) === null ? null : round1(number(row[4])),
      top30Children: count(row[5]), weightedPoints: count(row[6]), status: String(row[7] ?? ''),
      competitionCount: count(data?.quality?.competitionCount), competitionRows: count(data?.quality?.competitionRows),
    }];
  }));
}

function configLabel(value) {
  return String(value ?? '').normalize('NFKC').replace(/[\s:：]/g, '');
}

function familyWeightRow(rows, component) {
  const expected = configLabel(component.weightLabel);
  const matches = rows.filter((candidate) => configLabel(candidate?.[0]) === expected);
  if (matches.length === 0) {
    const foundOutsideLabelColumn = rows.some((candidate) => candidate.slice(1).some((value) => configLabel(value) === expected));
    assertEvidence(false, `FAMILY_WEIGHT_${component.key}_${foundOutsideLabelColumn ? 'LABEL_COLUMN_UNSUPPORTED' : 'LABEL_MISSING'}`);
  }
  assertEvidence(matches.length === 1, `FAMILY_WEIGHT_${component.key}_LABEL_AMBIGUOUS`);
  return matches[0];
}

function familyWeights(rows) {
  const weights = {};
  for (const component of FAMILY_COMPONENTS) {
    const row = familyWeightRow(rows, component);
    const value = number(row?.[1]);
    assertEvidence(value !== null && value > 0, `FAMILY_WEIGHT_${component.key}_VALUE_INVALID`);
    weights[component.key] = value <= 1 ? round1(value * 100) : round1(value);
  }
  return weights;
}

function canonicalFamilyRates(rows) {
  const header = findHeaderRow(rows, ['指標', ...TEAM_IDS]);
  assertEvidence(header >= 0, 'FAMILY_CANONICAL_HEADER_MISSING');
  const columns = new Map(rows[header].map((value, index) => [String(value ?? ''), index]));
  assertEvidence(TEAM_IDS.every((id) => columns.has(id)), 'FAMILY_CANONICAL_TEAMS_MISSING');
  return Object.fromEntries(FAMILY_COMPONENTS.map((component, index) => {
    const row = rows[header + index + 1];
    assertEvidence(configLabel(row?.[0]) === configLabel(component.sourceLabel), `FAMILY_CANONICAL_${component.key}_ROW_INVALID`);
    return [component.key, Object.fromEntries(TEAM_IDS.map((id) => {
      const rate = rawPctFromFraction(row[columns.get(id)]);
      assertEvidence(rate === null || (rate >= 0 && rate <= 100), `FAMILY_CANONICAL_${component.key}_${id}_RATE_INVALID`);
      return [id, rate];
    }))];
  }));
}

function matchingCounts(row, component, canonicalRate) {
  const detailedRate = rawPctFromFraction(row?.[component.rateIndex]);
  if (canonicalRate === null || detailedRate === null || round1(canonicalRate) !== round1(detailedRate)) {
    return { numerator: null, denominator: null };
  }
  const denominator = count(row[component.denominatorIndex]);
  let numerator = component.numeratorIndex === undefined ? null : count(row[component.numeratorIndex]);
  if (component.key === 'retention2y' && denominator !== null) numerator = retainedFromRate(denominator, canonicalRate);
  const countRate = denominator && numerator !== null ? rawPctFromFraction(numerator / denominator) : null;
  if (countRate === null || round1(countRate) !== round1(canonicalRate)) return { numerator: null, denominator: null };
  return { numerator, denominator };
}

function buildFamilyEvidence(rows, configRows, teams) {
  const detailedHeader = findHeaderRow(rows, ['チーム', '運用世帯', '兄弟世帯', '家庭継続力点']);
  assertEvidence(detailedHeader >= 0, 'FAMILY_EVIDENCE_HEADER_MISSING');
  const detailedRows = rowsByTeam(rows, detailedHeader);
  const ratesByComponent = canonicalFamilyRates(rows);
  const weights = familyWeights(configRows);
  const componentScores = Object.fromEntries(TEAM_IDS.map((id) => [id, {}]));
  for (const component of FAMILY_COMPONENTS) {
    const rates = TEAM_IDS.map((id) => ratesByComponent[component.key][id]).filter((rate) => rate !== null);
    for (const id of TEAM_IDS) {
      const rawRate = ratesByComponent[component.key][id];
      componentScores[id][component.key] = rawRate === null ? null : percentileScore(rawRate, rates);
    }
  }
  return Object.fromEntries(TEAM_IDS.map((id) => {
    const row = detailedRows.get(id);
    assertEvidence(row, `FAMILY_EVIDENCE_${id}_MISSING`);
    const components = {};
    for (const component of FAMILY_COMPONENTS) {
      const rawRate = ratesByComponent[component.key][id];
      const rate = rawRate === null ? null : round1(rawRate);
      const { numerator, denominator } = matchingCounts(row, component, rawRate);
      components[component.key] = {
        key: component.key, label: component.label, numerator, denominator, rate,
        relativeScore: componentScores[id][component.key], weight: weights[component.key],
      };
    }
    const available = Object.values(components).filter((component) => Number.isFinite(component.relativeScore));
    const weightTotal = available.reduce((sum, component) => sum + component.weight, 0);
    const calculatedScore = weightTotal
      ? round1(available.reduce((sum, component) => sum + component.relativeScore * component.weight, 0) / weightTotal)
      : null;
    return [id, { components, calculatedScore, score: metricScore(teams.get(id), 'family'), status: String(row[14] ?? '') }];
  }));
}

function buildEventEvidence(eventHistory) {
  const participationWeight = number(eventHistory?.scoreWeights?.participation) ?? 70;
  const repeatWeight = number(eventHistory?.scoreWeights?.repeat) ?? 30;
  return Object.fromEntries(TEAM_IDS.map((id) => {
    const team = eventHistory?.teams?.[id];
    return [id, team ? {
      averageRate: number(team.averageRate), participationScore: number(team.participationScore),
      repeatRate: number(team.repeatRate), repeatScore: number(team.repeatScore), score: number(team.score),
      participationWeight, repeatWeight,
    } : null];
  }));
}

export function buildMetricEvidence({ data, ranges, retentionCurve, eventHistory }) {
  const teams = new Map((data?.teams || []).map((team) => [team.id, team]));
  assertEvidence(TEAM_IDS.every((id) => teams.has(id)), 'METRIC_EVIDENCE_TEAMS_MISSING');
  const retention = buildRetentionEvidenceFromSource(ranges.retention, retentionCurve?.minimumSample || 20);
  const admission = buildAdmissionEvidence(ranges.admission);
  const growth = buildGrowthEvidence(ranges.growth, data);
  const family = ranges.referral ? readReferralEvidence(ranges.referral, data.asOf) : buildFamilyEvidence(ranges.family, ranges.config, teams);
  const event = buildEventEvidence(eventHistory);
  for (const id of TEAM_IDS) {
    const team = teams.get(id);
    assertEvidence(Math.abs(retention[id].weightedIndex - metricScore(team, 'retention')) <= 0.6, `RETENTION_EVIDENCE_SCORE_MISMATCH_${id}`);
    assertEvidence(Math.abs(admission[id].relativeScore - metricScore(team, 'admission')) <= 0.6, `ADMISSION_EVIDENCE_SCORE_MISMATCH_${id}`);
    assertEvidence(Math.abs(growth[id].relativeScore - metricScore(team, 'growth')) <= 0.6, `GROWTH_EVIDENCE_SCORE_MISMATCH_${id}`);
    assertEvidence(Math.abs(family[id].calculatedScore - metricScore(team, 'family')) <= 0.6, `FAMILY_EVIDENCE_SCORE_MISMATCH_${id}`);
    assertEvidence(Math.abs(event[id].score - metricScore(team, 'event')) <= 0.6, `EVENT_EVIDENCE_SCORE_MISMATCH_${id}`);
  }
  return Object.fromEntries(TEAM_IDS.map((id) => [id, {
    version: 'metric-evidence-v1', asOf: data.asOf,
    retention: retention[id], admission: admission[id], event: event[id], growth: growth[id], family: family[id],
  }]));
}

export function buildLegacyPreviousEvidence({ data, previousRetentionCurve, previousEventHistory, previousTrialData }) {
  const previousRetention = buildRetentionEvidenceFromCurve(previousRetentionCurve) || {};
  const previousTeams = new Map((data?.comparison?.teams || []).map((team) => [team.id, team]));
  const event = buildEventEvidence(previousEventHistory);
  const annual = previousTrialData?.annual?.teams || {};
  const previousRepeatRates = TEAM_IDS.map((id) => event[id]?.repeatRate).filter(Number.isFinite);
  return Object.fromEntries(TEAM_IDS.map((id) => {
    const team = previousTeams.get(id);
    const trials = count(annual?.[id]?.trials);
    const admissions = count(annual?.[id]?.admissions);
    const rate = trials ? round1(admissions / trials * 100) : null;
    const period2y = previousRetention[id]?.periods?.find((period) => period.months === 24) || null;
    const familyComponents = {
      sibling: null,
      retention2y: period2y ? {
        key: 'retention2y', label: '2年継続率', numerator: period2y.retained, denominator: period2y.sample,
        rate: period2y.rate, relativeScore: period2y.relativeScore, weight: 20,
      } : null,
      reentry: null,
      eventRepeat: event[id] ? {
        key: 'eventRepeat', label: 'イベント継続参加率', numerator: null, denominator: null,
        rate: event[id].repeatRate,
        relativeScore: Number.isFinite(event[id]?.repeatRate) ? percentileScore(event[id].repeatRate, previousRepeatRates) : null,
        weight: 15,
      } : null,
    };
    return [id, {
      version: 'legacy-partial-v1', asOf: data?.comparison?.previousAsOf,
      retention: previousRetention[id] || null,
      admission: team ? { trials, admissions, rate, previousRate: null, yoyDelta: null, relativeScore: metricScore(team, 'admission') } : null,
      event: event[id], growth: null,
      family: team ? { components: familyComponents, calculatedScore: null, score: metricScore(team, 'family'), status: '旧snapshotは一部内訳のみ' } : null,
    }];
  }));
}
