// Counterfactual plans only: mutate anonymous copies, never the source records.
// Opponents' raw performance is held fixed, but all relative scores are recalculated.
const rate = (a, b) => b > 0 ? a * 100 / b : null;
const action = (metric, label, from, to, unit, extra = {}) => ({ metric, label, from, to, delta: to - from, unit, ...extra });

function changeMetric(team, key, amount, events) {
  const e = team.metricEvidence;
  if (key === 'admission') {
    const current = e.admission.admissions, total = e.admission.trials;
    const target = Math.min(total, current + amount);
    e.admission.admissions = target;
    e.admission.rate = rate(target, total);
    return target > current ? [action(key, '同じ体験人数での入会', current, target, '人', { denominator: total })] : [];
  }
  if (key === 'family') {
    const current = e.family.points;
    e.family.points += amount;
    e.family.trialPoints += amount;
    e.family.rate = rate(e.family.points, e.family.members);
    return [action(key, '紹介ポイント', current, e.family.points, 'pt')];
  }
  if (key === 'growth') {
    const current = e.growth.weightedPoints;
    e.growth.weightedPoints += amount;
    return [action(key, '大会の上位30％加重点', current, e.growth.weightedPoints, '点')];
  }
  if (key === 'retention') {
    const periods = e.retention.periods.filter(p => p.scored && Number.isFinite(p.retained) && p.sample > 0);
    const before = new Map(periods.map(p => [p.key, p.retained]));
    for (const p of periods) {
      p.retained = Math.min(p.sample, Math.ceil(p.retained + p.sample * amount / 100 - 1e-10));
      p.rate = rate(p.retained, p.sample);
      p.exited = p.sample - p.retained;
    }
    return [action(key, '対象期間すべての継続率', 0, amount, 'ポイント', {
      qualifier: '各期間で改善・上限100％',
      periods: periods.map(p => ({ key: p.key, label: p.label, fromRetained: before.get(p.key), retained: p.retained, sample: p.sample })),
    })];
  }
  if (key === 'event') {
    const current = e.event.averageRate;
    const target = Math.min(events.historicalMaxRate, current + amount);
    e.event.averageRate = target;
    e.event.participationScore = Math.min(100, e.event.participationScore + (target - current) / events.historicalMaxRate * 100);
    return [action(key, '平均イベント参加率', current, target, '％', { qualifier: '継続参加率は固定' })];
  }
  return [];
}

export function buildOvertakeTargets({ source, currentTeams, events, evaluate }) {
  const complete = currentTeams.every(t => Number.isFinite(t.overall) && Number.isFinite(t.rank));
  return Object.fromEntries(currentTeams.map(team => {
    if (!complete) return [team.id, { status: 'unavailable', scenarios: [] }];
    const above = currentTeams.filter(t => t.overall > team.overall).sort((a, b) => a.overall - b.overall || a.id.localeCompare(b.id))[0];
    const tied = currentTeams.find(t => t.id !== team.id && t.overall === team.overall);
    const rival = above || tied;
    if (!rival) {
      const below = currentTeams.filter(t => t.id !== team.id).sort((a,b) => b.overall - a.overall)[0];
      return [team.id, { status: 'leader', lead: below ? team.overall - below.overall : null, scenarios: [] }];
    }
    const original = source.teams.find(t => t.id === team.id);
    if (!original?.metricEvidence) return [team.id, { status: 'unavailable', scenarios: [] }];
    const descriptors = [
      { id: 'admission', keys: ['admission'], max: original.metricEvidence.admission.trials - original.metricEvidence.admission.admissions },
      { id: 'family', keys: ['family'], max: 10000 },
      { id: 'growth', keys: ['growth'], max: 10000 },
      { id: 'retention', keys: ['retention'], max: 100 },
      { id: 'event', keys: ['event'], max: Math.max(0, Math.ceil(events.historicalMaxRate - original.metricEvidence.event.averageRate)) },
      { id: 'admission-family', keys: ['admission', 'family'], max: 10000 },
      { id: 'growth-family', keys: ['growth', 'family'], multipliers: {growth:10}, max: 1000 },
      { id: 'retention-admission', keys: ['retention', 'admission'], multipliers: {admission:3}, max: 100 },
    ];
    const unavailable = [], scenarios = [];
    for (const plan of descriptors) {
      const cache = new Map();
      const simulate = increments => {
        const teams = structuredClone(source.teams);
        const mine = teams.find(t => t.id === team.id);
        const actions = plan.keys.flatMap(key => changeMetric(mine, key, increments[key], events)).filter(a => a.delta > 0);
        const scored = evaluate(teams);
        const me = scored.find(t => t.id === team.id), other = scored.find(t => t.id === rival.id);
        return { pass: Number.isFinite(me.overall) && Number.isFinite(other.overall) && me.overall > other.overall,
          actions, ownScore: me.overall, rivalScore: other.overall, rank: me.rank };
      };
      const run = n => {
        if (cache.has(n)) return cache.get(n);
        const result = { parameter:n, ...simulate(Object.fromEntries(plan.keys.map(key => [key,n * (plan.multipliers?.[key] || 1)]))) };
        cache.set(n, result);
        return result;
      };
      if (!(plan.max > 0)) { unavailable.push(plan.id); continue; }
      let high = 1;
      while (high < plan.max && !run(high).pass) high = Math.min(plan.max, high * 2);
      if (!run(high).pass) { unavailable.push(plan.id); continue; }
      let low = 0;
      while (high - low > 1) {
        const middle = Math.floor((low + high) / 2);
        if (run(middle).pass) high = middle; else low = middle;
      }
      let result = run(high);
      // Explicitly verify strict overtaking after integer rounding, never a tie.
      if (!result.pass || run(high - 1).pass) throw Error('OVERTAKE_THRESHOLD_INVALID');
      if (plan.keys.length > 1) {
        // Remove unnecessary work from a combination, while preserving a strict
        // overtake. This is a concrete example, not a global cost optimization.
        const increments = Object.fromEntries(plan.keys.map(key => [key,high * (plan.multipliers?.[key] || 1)]));
        for (const key of plan.keys) {
          let lower = -1, upper = increments[key];
          while (upper - lower > 1) {
            const middle = Math.floor((lower + upper) / 2);
            if (simulate({...increments,[key]:middle}).pass) upper = middle; else lower = middle;
          }
          increments[key] = upper;
        }
        result = { parameter:high, increments, ...simulate(increments) };
        if (result.actions.length < 2) continue; // A simpler single-indicator plan already exists.
      }
      scenarios.push({ id: plan.id, combined: plan.keys.length > 1, ...result });
    }
    // A balanced combination is an example, not a claim about the cheapest action.
    const combined = ['admission-family','retention-admission','growth-family'].map(id => scenarios.find(s => s.id === id)).find(Boolean);
    const singles = ['admission','retention','family','growth','event'].map(id => scenarios.find(s => s.id === id)).filter(Boolean);
    const selected = [...(combined ? [combined] : []), ...singles].slice(0, 2);
    return [team.id, { status: selected.length ? 'ready' : 'no-plan', targetId: rival.id,
      targetRank: rival.rank, gap: rival.overall - team.overall, scenarios: selected,
      unavailable, definition: 'fixed-raw-peers-and-denominators-strict-integer-overtake-v1' }];
  }));
}
