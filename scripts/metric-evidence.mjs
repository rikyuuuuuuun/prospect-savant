import {
  TEAM_IDS, assertEvidence, number, count, round1, rawPctFromFraction, pctFromFraction,
  findHeaderRow, rowsByTeam, percentileScore, retainedFromRate,
  buildRetentionEvidenceFromSource, buildRetentionEvidenceFromCurve,
} from './metric-retention-evidence.mjs';

const FAMILY_COMPONENTS = [
  { key: 'sibling', label: '兄弟姉妹在籍世帯率', rateIndex: 3, numeratorIndex: 2, denominatorIndex: 1, weightLabel: '家庭継続力 兄弟姉妹重み' },
  { key: 'retention2y', label: '2年継続率', rateIndex: 5, denominatorIndex: 4, weightLabel: '家庭継続力 2年継続重み' },
  { key: 'reentry', label: '再入会率', rateIndex: 8, numeratorIndex: 7, denominatorIndex: 6, weightLabel: '家庭継続力 再入会重み' },
  { key: 'eventRepeat', label: 'イベント継続参加率', rateIndex: 11, numeratorIndex: 10, denominatorIndex: 9, weightLabel: '家庭継続力 イベント継続重み' },
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

function familyWeights(rows) {
  const weights = {};
  for (const component of FAMILY_COMPONENTS) {
    const row = rows.find((candidate) => candidate?.[0] === component.weightLabel);
    const value = number(row?.[1]);
    assertEvidence(value !== null && value > 0, `FAMILY_WEIGHT_${component.key}_MISSING`);
    weights[component.key] = value <= 1 ? round1(value * 100) : round1(value);
  }
  return weights;
}

function buildFamilyEvidence(rows, configRows, teams) {
  const header = findHeaderRow(rows, ['チーム', '運用世帯', '兄弟世帯', '家庭継続力点']);
  assertEvidence(header >= 0, 'FAMILY_EVIDENCE_HEADER_MISSING');
  const map = rowsByTeam(rows, header);
  const weights = familyWeights(configRows);
  const componentScores = Object.fromEntries(TEAM_IDS.map((id) => [id, {}]));
  for (const component of FAMILY_COMPONENTS) {
    const rates = TEAM_IDS.map((id) => rawPctFromFraction(map.get(id)?.[component.rateIndex])).filter((rate) => rate !== null);
    for (const id of TEAM_IDS) {
      const rawRate = rawPctFromFraction(map.get(id)?.[component.rateIndex]);
      componentScores[id][component.key] = rawRate === null ? null : percentileScore(rawRate, rates);
    }
  }
  return Object.fromEntries(TEAM_IDS.map((id) => {
    const row = map.get(id);
    assertEvidence(row, `FAMILY_EVIDENCE_${id}_MISSING`);
    const components = {};
    for (const component of FAMILY_COMPONENTS) {
      const denominator = count(row[component.denominatorIndex]);
      const rate = pctFromFraction(row[component.rateIndex]);
      let numerator = component.numeratorIndex === undefined ? null : count(row[component.numeratorIndex]);
      if (component.key === 'retention2y' && denominator !== null && rate !== null) numerator = retainedFromRate(denominator, rate);
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
  const family = buildFamilyEvidence(ranges.family, ranges.config, teams);
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
