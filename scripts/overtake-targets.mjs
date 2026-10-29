// Future gains only. Historical retention, competition and event records never change.
const rate = (numerator, denominator) => denominator > 0 ? numerator * 100 / denominator : null;

export function applyFutureGains(teams, teamId, admissions, referralTrials) {
  if (![admissions,referralTrials].every(n => Number.isSafeInteger(n) && n >= 0)) throw Error('FUTURE_GAIN_INVALID');
  const team = teams.find(t => t.id === teamId), e = team.metricEvidence;
  const available = Math.max(0, e.admission.trials - e.admission.admissions);
  // Referred admissions are included in admissions, not counted a second time.
  // Other admissions use existing trial attendees first; any shortfall adds a new trial.
  const referredAdmissions = Math.min(admissions, referralTrials);
  const existingTrialAdmissions = Math.min(available, admissions - referredAdmissions);
  const newNonReferralAdmissions = admissions - referredAdmissions - existingTrialAdmissions;
  const newTrials = referralTrials + newNonReferralAdmissions;
  team.members += admissions;
  e.admission.admissions += admissions;
  e.admission.trials += newTrials;
  e.admission.rate = rate(e.admission.admissions, e.admission.trials);
  e.family.points += referralTrials;
  e.family.trialPoints += referralTrials;
  e.family.members += admissions;
  e.family.rate = rate(e.family.points,e.family.members);
  return { admissions, referralTrials, referredAdmissions, existingTrialAdmissions, newTrials, futureMembers:team.members };
}

export function buildOvertakeTargets({source,currentTeams,evaluate}) {
  const complete = currentTeams.every(t => Number.isFinite(t.overall) && Number.isFinite(t.rank));
  return Object.fromEntries(currentTeams.map(team => {
    if (!complete) return [team.id,{status:'unavailable',scenarios:[]}];
    const above = currentTeams.filter(t => t.overall > team.overall).sort((a,b) => a.overall-b.overall || a.id.localeCompare(b.id))[0];
    const tied = currentTeams.find(t => t.id !== team.id && t.overall === team.overall);
    const rival = above || tied;
    if (!rival) {
      const next = currentTeams.filter(t => t.id !== team.id).sort((a,b) => b.overall-a.overall)[0];
      return [team.id,{status:'leader',lead:next ? team.overall-next.overall : null,scenarios:[]}];
    }
    const original = source.teams.find(t=>t.id===team.id);
    if (!original?.metricEvidence) return [team.id,{status:'unavailable',scenarios:[]}];
    const remaining = Math.max(0,original.metricEvidence.admission.trials-original.metricEvidence.admission.admissions);
    const profiles = [
      {id:'admission', gains:n=>[n,0]},
      {id:'referral-trial', gains:n=>[0,n]},
      {id:'existing-first', gains:n=>[n,Math.max(0,n-remaining)]},
      ...[.25,.5,.75,1].map(fraction=>({id:`referral-share-${fraction}`,gains:n=>[n,Math.floor(n*fraction)]})),
    ];
    const scenarios = [];
    for (const profile of profiles) {
      const cache = new Map();
      const run = n => {
        if (cache.has(n)) return cache.get(n);
        const teams = structuredClone(source.teams), [admissions,referralTrials] = profile.gains(n);
        const gains = applyFutureGains(teams,team.id,admissions,referralTrials);
        const scored = evaluate(teams), mine = scored.find(t=>t.id===team.id), other = scored.find(t=>t.id===rival.id);
        const result = {parameter:n,...gains,ownScore:mine.overall,rivalScore:other.overall,rank:mine.rank,
          pass:Number.isFinite(mine.overall)&&Number.isFinite(other.overall)&&mine.overall>other.overall};
        cache.set(n,result);
        return result;
      };
      let high = 1;
      while(high < 10000 && !run(high).pass) high = Math.min(10000,high*2);
      if (!run(high).pass) continue;
      let low = 0;
      while(high-low>1) {
        const middle = Math.floor((low+high)/2);
        if(run(middle).pass) high=middle; else low=middle;
      }
      if(!run(high).pass || run(high-1).pass) throw Error('FUTURE_OVERTAKE_THRESHOLD_INVALID');
      scenarios.push({id:profile.id,...run(high)});
    }
    // Pick one concise example from the searched future-growth patterns.
    // This is not a global cost or conversion forecast.
    scenarios.sort((a,b) => Math.max(a.admissions,a.referralTrials)-Math.max(b.admissions,b.referralTrials)
      || a.referralTrials-b.referralTrials || a.admissions-b.admissions);
    return [team.id,{status:scenarios.length?'ready':'no-plan',targetId:rival.id,targetRank:rival.rank,
      gap:rival.overall-team.overall,scenarios:scenarios.slice(0,1),definition:'future-admission-referral-gains-v2'}];
  }));
}
