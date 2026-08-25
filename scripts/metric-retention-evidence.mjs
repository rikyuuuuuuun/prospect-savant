export const TEAM_IDS = ['A', 'B', 'C', 'D'];
export const RETENTION_PERIODS = [
  { key: 'm3', label: '3か月', months: 3, rateIndex: 1, sampleIndex: 2, weight: 1 },
  { key: 'm6', label: '6か月', months: 6, rateIndex: 3, sampleIndex: 4, weight: 2 },
  { key: 'm12', label: '12か月', months: 12, rateIndex: 5, sampleIndex: 6, weight: 3 },
  { key: 'y2', label: '2年', months: 24, rateIndex: 7, sampleIndex: 8, weight: 4 },
  { key: 'y3', label: '3年', months: 36, rateIndex: 9, sampleIndex: 10, weight: 5 },
  { key: 'y4', label: '4年', months: 48, rateIndex: 11, sampleIndex: 12, weight: 6 },
  { key: 'y5', label: '5年', months: 60, rateIndex: 13, sampleIndex: 14, weight: 7 },
  { key: 'y6', label: '6年', months: 72, rateIndex: 15, sampleIndex: 16, weight: 8 },
];

export function assertEvidence(condition, message) {
  if (!condition) throw new Error(message);
}
export function number(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
export function count(value) {
  const parsed = number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}
export function round1(value) {
  return Number(Number(value).toFixed(1));
}
export function rawPctFromFraction(value) {
  const parsed = number(value);
  return parsed === null ? null : parsed * 100;
}
export function pctFromFraction(value) {
  const parsed = rawPctFromFraction(value);
  return parsed === null ? null : round1(parsed);
}
export function findHeaderRow(rows, expected) {
  return rows.findIndex((row) => expected.every((label) => row?.includes(label)));
}
export function rowsByTeam(rows, headerIndex, teamColumn = 0) {
  const map = new Map();
  for (const row of rows.slice(headerIndex + 1)) {
    const id = row?.[teamColumn];
    if (TEAM_IDS.includes(id)) map.set(id, row);
  }
  return map;
}
export function percentileScore(value, values) {
  const numeric = number(value);
  const peers = values.map(number).filter((item) => item !== null);
  if (numeric === null || peers.length < 2) return null;
  const higher = peers.filter((item) => item > numeric + 1e-12).length;
  const equal = peers.filter((item) => Math.abs(item - numeric) <= 1e-12).length;
  const averageRank = higher + (equal + 1) / 2;
  return round1((peers.length - averageRank + 0.5) / peers.length * 100);
}
export function retainedFromRate(sample, rate) {
  return Number.isSafeInteger(sample) && Number.isFinite(rate) ? Math.round(sample * rate / 100) : null;
}

function finalise(periodsByTeam) {
  return Object.fromEntries(TEAM_IDS.map((id) => {
    const periods = periodsByTeam[id];
    const scored = periods.filter((period) => period.scored && Number.isFinite(period.relativeScore));
    const denominator = scored.reduce((sum, period) => sum + period.weight, 0);
    const weightedIndex = denominator
      ? round1(scored.reduce((sum, period) => sum + period.relativeScore * period.weight, 0) / denominator)
      : null;
    return [id, { periods, weightedIndex }];
  }));
}

export function buildRetentionEvidenceFromSource(rows, minimumSample = 20) {
  const header = findHeaderRow(rows, ['チーム', '3か月\n継続率']);
  assertEvidence(header >= 0, 'RETENTION_EVIDENCE_HEADER_MISSING');
  const teamRows = rowsByTeam(rows, header);
  assertEvidence(TEAM_IDS.every((id) => teamRows.has(id)), 'RETENTION_EVIDENCE_TEAMS_MISSING');
  const periodsByTeam = Object.fromEntries(TEAM_IDS.map((id) => [id, []]));
  for (const period of RETENTION_PERIODS) {
    const candidates = TEAM_IDS.map((id) => {
      const row = teamRows.get(id);
      const rawRate = rawPctFromFraction(row?.[period.rateIndex]);
      const rate = rawRate === null ? null : round1(rawRate);
      const sample = count(row?.[period.sampleIndex]);
      return { id, rawRate, rate, sample, eligible: rawRate !== null && sample !== null && sample >= minimumSample };
    });
    const rates = candidates.filter((entry) => entry.eligible).map((entry) => entry.rawRate);
    for (const entry of candidates) {
      const retained = entry.eligible ? retainedFromRate(entry.sample, entry.rawRate) : null;
      periodsByTeam[entry.id].push({
        key: period.key, label: period.label, months: period.months, weight: period.weight,
        sample: entry.sample, retained,
        exited: retained === null || entry.sample === null ? null : entry.sample - retained,
        rate: entry.rate,
        relativeScore: entry.eligible ? percentileScore(entry.rawRate, rates) : null,
        scored: entry.eligible && rates.length >= 2,
      });
    }
  }
  return finalise(periodsByTeam);
}

export function buildRetentionEvidenceFromCurve(curve) {
  if (!curve?.teams || !Array.isArray(curve.months)) return null;
  const minimumSample = Number.isSafeInteger(curve.minimumSample) ? curve.minimumSample : 20;
  const periodsByTeam = Object.fromEntries(TEAM_IDS.map((id) => [id, []]));
  for (const period of RETENTION_PERIODS) {
    const index = curve.months.indexOf(period.months);
    if (index < 0) continue;
    const candidates = TEAM_IDS.map((id) => {
      const displayedRate = number(curve.teams?.[id]?.rates?.[index]);
      const sample = count(curve.teams?.[id]?.samples?.[index]);
      const retained = displayedRate !== null && sample !== null ? retainedFromRate(sample, displayedRate) : null;
      // 公開curveは率を小数1桁に丸めるため、実人数から精密率を復元して順位を再現する。
      const rawRate = retained !== null && sample > 0 ? retained / sample * 100 : displayedRate;
      const rate = rawRate === null ? null : round1(rawRate);
      return { id, rawRate, rate, sample, retained, eligible: rawRate !== null && sample !== null && sample >= minimumSample };
    });
    const rates = candidates.filter((entry) => entry.eligible).map((entry) => entry.rawRate);
    for (const entry of candidates) {
      const retained = entry.eligible ? entry.retained : null;
      periodsByTeam[entry.id].push({
        key: period.key, label: period.label, months: period.months, weight: period.weight,
        sample: entry.sample, retained,
        exited: retained === null || entry.sample === null ? null : entry.sample - retained,
        rate: entry.rate,
        relativeScore: entry.eligible ? percentileScore(entry.rawRate, rates) : null,
        scored: entry.eligible && rates.length >= 2,
      });
    }
  }
  return finalise(periodsByTeam);
}
