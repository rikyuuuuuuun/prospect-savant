const NOTE_PREFIX = 'スコア理由：';

const unavailableReason = `${NOTE_PREFIX}比較できる前回スコアがないため、変動理由は表示できません。`;
const definitionMismatchReason = `${NOTE_PREFIX}前回とスコア定義が異なるため、変動理由は比較できません。`;
const incompleteReason = `${NOTE_PREFIX}スコア内訳の比較データが不完全なため、変動理由は表示できません。`;
const reconciliationReason = `${NOTE_PREFIX}総合点差と指標差の配点計算が一致しないため、変動理由は表示できません。`;

function signed(value, digits = 0) {
  const rounded = Number(Number(value).toFixed(digits));
  if (rounded === 0) return digits ? Number(0).toFixed(digits) : '0';
  return `${rounded > 0 ? '+' : ''}${digits ? rounded.toFixed(digits) : rounded}`;
}

function cleanExistingScoreReason(note) {
  if (typeof note !== 'string' || !note.trim()) return '';
  const lines = note.split('\n');
  if (lines[0]?.startsWith(NOTE_PREFIX)) lines.shift();
  return lines.join('\n').trim();
}

function metricDrivers(team, previousTeam, weights, metricLabels) {
  if (!team?.metrics || !previousTeam?.metrics || !Array.isArray(weights) || !weights.length) return null;
  const currentKeys = Object.keys(team.metrics);
  const previousKeys = Object.keys(previousTeam.metrics);
  if (currentKeys.length !== weights.length || previousKeys.length !== weights.length) return null;

  const seen = new Set();
  const drivers = [];
  let weightTotal = 0;
  for (const weight of weights) {
    const key = String(weight?.key || '');
    const label = String(metricLabels?.[key] || weight?.label || '');
    const weightValue = Number(weight?.value);
    const current = team.metrics[key];
    const previous = previousTeam.metrics[key];
    if (!key || seen.has(key) || !label || !Number.isFinite(weightValue) || weightValue < 0
      || !Number.isFinite(current) || !Number.isFinite(previous)) return null;
    seen.add(key);
    weightTotal += weightValue;
    const delta = current - previous;
    drivers.push({
      key,
      label,
      weight: weightValue,
      delta,
      contribution: delta * weightValue / 100,
    });
  }

  if (Math.abs(weightTotal - 100) > 1e-9) return null;
  if (!currentKeys.every((key) => seen.has(key)) || !previousKeys.every((key) => seen.has(key))) return null;
  return drivers;
}

function driverText(driver) {
  return `${driver.label} ${signed(driver.delta)}点（配点${signed(driver.weight)}%・総合へ約${signed(driver.contribution, 1)}点）`;
}

export function buildScoreChangeReason({
  team,
  previousTeam,
  scoreVersion,
  previousScoreVersion,
  previousAsOfLabel,
  weights,
  metricLabels,
}) {
  if (scoreVersion !== previousScoreVersion) return definitionMismatchReason;
  if (!team || !previousTeam || team.id !== previousTeam.id
    || !Number.isFinite(team.overall) || !Number.isFinite(previousTeam.overall)) return unavailableReason;

  const drivers = metricDrivers(team, previousTeam, weights, metricLabels);
  if (!drivers) return incompleteReason;

  const overallDelta = team.overall - previousTeam.overall;
  const contributionTotal = drivers.reduce((sum, driver) => sum + driver.contribution, 0);
  if (Math.abs(contributionTotal - overallDelta) > 0.51) return reconciliationReason;

  const comparisonLabel = previousAsOfLabel ? `${previousAsOfLabel}比` : '前回比';
  const changed = drivers.filter((driver) => driver.delta !== 0);
  if (overallDelta === 0 && !changed.length) {
    return `${NOTE_PREFIX}${comparisonLabel} 0点。主要${drivers.length}指標に変化はありません。`;
  }

  const byImpact = (a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)
    || Math.abs(b.delta) - Math.abs(a.delta)
    || a.key.localeCompare(b.key);

  if (overallDelta === 0) {
    const positive = changed.filter((driver) => driver.contribution > 0).sort(byImpact)[0];
    const negative = changed.filter((driver) => driver.contribution < 0).sort(byImpact)[0];
    if (positive && negative) {
      return `${NOTE_PREFIX}${comparisonLabel} 0点。${driverText(positive)}の押し上げと${driverText(negative)}の押し下げが相殺しています。`;
    }
    return `${NOTE_PREFIX}${comparisonLabel} 0点。指標変化はありますが、総合点は丸め後に変化していません。`;
  }

  const direction = Math.sign(overallDelta);
  const aligned = changed
    .filter((driver) => Math.sign(driver.contribution) === direction)
    .sort(byImpact)
    .slice(0, 2);
  if (!aligned.length) return reconciliationReason;

  const opposing = changed
    .filter((driver) => Math.sign(driver.contribution) === -direction)
    .sort(byImpact)[0];
  const verb = overallDelta > 0 ? '押し上げました' : '押し下げました';
  const main = aligned.map(driverText).join('と');
  const counter = opposing
    ? ` 一方、${driverText(opposing)}は逆方向に働いています。`
    : '';
  return `${NOTE_PREFIX}${comparisonLabel} ${signed(overallDelta)}点。主因は${main}で、総合点を${verb}。${counter}`.trim();
}

export function applyScoreChangeNotes(data) {
  const previousTeams = new Map((data?.comparison?.teams || []).map((team) => [team.id, team]));
  for (const team of data?.teams || []) {
    const contextNote = cleanExistingScoreReason(team.note);
    const reason = buildScoreChangeReason({
      team,
      previousTeam: previousTeams.get(team.id),
      scoreVersion: data.scoreVersion,
      previousScoreVersion: data.comparison?.scoreVersion,
      previousAsOfLabel: data.comparison?.previousAsOfLabel,
      weights: data.weights,
      metricLabels: data.metricLabels,
    });
    team.note = [reason, contextNote].filter(Boolean).join('\n');
  }
  return data;
}
