import { serialToIsoDate, fiscalYearFor } from './private-trial-aggregate.mjs';
import { previousMonthEnd } from './member-monthly-change.mjs';
export const WITHDRAWAL_DEFINITION = 'member-retirement-explicit-stop-detected-v1';
const IDS = ['A', 'B', 'C', 'D'];
const ACTIVE = new Set(['在籍', '休会', '退会予定']);
const assert = (ok, code) => { if (!ok) throw new Error(`WITHDRAWAL_${code}`); };
const date = value => {
  if (value === '' || value == null) return null;
  const d = serialToIsoDate(value);
  assert(typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && new Date(d).toISOString().slice(0,10) === d, 'DATE_INVALID');
  return d;
};
const emptyMonth = month => ({ month, explicit: 0, stopped: 0, detected: 0, count: 0, cohortCount: 0, missingEntry: 0, denominator: null, rate: null });

// Only anonymous aggregates leave this function. IDs are used solely for deduplication in memory.
export function buildWithdrawalHistory({ members, courses, changes, asOf }, data = { asOf }) {
  assert(date(asOf) === asOf && data.asOf === asOf, 'ASOF_INVALID');
  const fiscalYear = fiscalYearFor(asOf);
  const months = Array.from({length:12}, (_,i) => new Date(Date.UTC(Number(fiscalYear), i+3, 1)).toISOString().slice(0,7));
  const teams = Object.fromEntries(IDS.map(id => [id, { unknownMonth: 0, months: months.map(m => m > asOf.slice(0,7) ? null : emptyMonth(m)) }]));
  const seen = new Set();
  for (const m of members) {
    assert(m.id && m.person && !seen.has(m.id), 'MEMBER_KEY_INVALID'); seen.add(m.id);
    assert(['在籍','休会','退会予定','退会','削除','未確認'].includes(m.status), 'STATUS_INVALID');
  }
  const byPerson = new Map();
  members.forEach(m => { if(!byPerson.has(m.person)) byPerson.set(m.person,[]); byPerson.get(m.person).push(m); });
  const events = [];
  for (const m of members) {
    if (!IDS.includes(m.team) || m.status === '削除') continue;
    const history = changes.filter(c => c.id === m.id && c.field === '在籍状態' && c.before && date(c.at) <= asOf).sort((a,b) => String(date(a.at)).localeCompare(String(date(b.at))));
    const retirements = history.filter(c => c.after === '退会' && c.before !== '退会');
    // A current retired row may predate change-log coverage. Never invent its retirement month.
    if (m.status === '退会' && (!retirements.length || history.slice(history.indexOf(retirements.at(-1))+1).some(c => ACTIVE.has(c.after)))) retirements.push({id:m.id, team:m.team, at:null});
    for (let i=0; i<retirements.length; i++) {
      const event = retirements[i];
      const at = date(event.at);
      const nextReentry = at ? history.find(c => date(c.at) >= at && c.before === '退会' && ACTIVE.has(c.after)) : null;
      const end = nextReentry ? date(nextReentry.at) : asOf;
      const previousReentry = history.filter(c => (!at || date(c.at) <= at) && c.before === '退会' && ACTIVE.has(c.after)).at(-1);
      const start = previousReentry ? date(previousReentry.at) : null;
      let when = null, source = null;
      // The current retirement date belongs only to the latest recorded retirement episode.
      if (i === retirements.length-1) {
        const explicit = date(m.retiredAt);
        const stopped = date(m.billingStoppedAt);
        if (explicit && explicit <= end && (!start || explicit >= start)) { when=explicit; source='explicit'; }
        else if (!explicit && stopped && stopped <= end && (!start || stopped >= start)) { when=stopped; source='stopped'; }
        // A future explicit date is not overridden by an earlier detection date.
        if (explicit && explicit > asOf) continue;
      }
      const related = courses.filter(c => c.id === m.id);
      if (!when) {
        const stops = related.filter(c => c.endedAt && c.detected && date(c.endedAt) <= end && (!start || date(c.endedAt) >= start));
        const last = stops.map(c => date(c.endedAt)).sort().at(-1);
        // A course replacement or remaining contract is not a complete billing stop.
        const stillContracted = last && related.some(c => (!c.startedAt || date(c.startedAt) <= last) && ((!c.endedAt && c.active) || (c.endedAt && date(c.endedAt) > last)));
        if (last && !stillContracted) { when=last; source='detected'; }
      }
      const team = IDS.includes(event.team) ? event.team : m.team;
      // A second account still in the club is a transfer/duplicate, not a club withdrawal.
      const otherActive = byPerson.get(m.person).some(other => other.id !== m.id && ACTIVE.has(other.status) && (!when || (date(other.joinedAt) && date(other.joinedAt) <= when)));
      if (otherActive) continue;
      events.push({person:m.person, team, when, source, joined:date(m.joinedAt)});
    }
  }
  const grouped = new Map();
  for (const e of events) {
    const key = e.person + '|' + (e.when?.slice(0,7) || 'unknown');
    const old = grouped.get(key);
    if (old && old.team !== e.team) { old.team=null; continue; }
    if (!old || ['explicit','stopped','detected'].indexOf(e.source) < ['explicit','stopped','detected'].indexOf(old.source)) grouped.set(key,e);
  }
  let unassigned=0;
  for (const e of grouped.values()) {
    if (!e.team) { unassigned++; continue; }
    if (!e.when) { teams[e.team].unknownMonth++; continue; }
    if (e.when > asOf || e.when < `${fiscalYear}-04-01`) continue;
    const row = teams[e.team].months[months.indexOf(e.when.slice(0,7))];
    row[e.source]++; row.count++;
    if (!e.joined) row.missingEntry++;
    else if (e.joined < row.month+'-01') row.cohortCount++;
  }
  const baseline=data.memberMonthlyComparison;
  if (baseline?.previousAsOf === previousMonthEnd(asOf) && baseline.memberDefinition?.id === data.memberDefinition?.id) {
    for (const id of IDS) {
      const row=teams[id].months[months.indexOf(asOf.slice(0,7))];
      const count=baseline.teams.find(t=>t.id===id)?.members;
      if (Number.isSafeInteger(count) && count>=0) row.denominator=count;
    }
  }
  for (const team of Object.values(teams)) for (const row of team.months) {
    if (row && unassigned === 0 && team.unknownMonth === 0 && row.missingEntry === 0 && row.denominator > 0 && row.cohortCount <= row.denominator) row.rate=Number((100*row.cohortCount/row.denominator).toFixed(2));
  }
  const output={definition:WITHDRAWAL_DEFINITION,asOf,fiscalYear,months,teams,unassigned};
  validateWithdrawalHistory(output,data); return output;
}

export function validateWithdrawalHistory(h,data) {
  const exact=(o,keys)=>assert(o && Object.keys(o).sort().join()===keys.sort().join(),'FIELDS_INVALID');
  exact(h,['definition','asOf','fiscalYear','months','teams','unassigned']);
  assert(h.definition===WITHDRAWAL_DEFINITION && h.asOf===data.asOf && date(h.asOf)===h.asOf && h.fiscalYear===fiscalYearFor(h.asOf),'DEFINITION_OR_DATE_INVALID');
  assert(Number.isSafeInteger(h.unassigned)&&h.unassigned>=0,'UNASSIGNED_INVALID');
  const months=Array.from({length:12},(_,i)=>new Date(Date.UTC(Number(h.fiscalYear),i+3,1)).toISOString().slice(0,7));
  assert(JSON.stringify(months)===JSON.stringify(h.months),'MONTHS_INVALID');exact(h.teams,IDS);
  for(const id of IDS){const t=h.teams[id];exact(t,['unknownMonth','months']);assert(Number.isSafeInteger(t.unknownMonth)&&t.unknownMonth>=0 && t.months.length===12,'COUNTS_INVALID');
    t.months.forEach((r,i)=>{
      if(months[i]>h.asOf.slice(0,7)){assert(r===null,'FUTURE_INVALID');return;}
      exact(r,['month','explicit','stopped','detected','count','cohortCount','missingEntry','denominator','rate']);
      assert(r.month===months[i],'MONTH_INVALID');
      for(const key of ['explicit','stopped','detected','count','cohortCount','missingEntry'])assert(Number.isSafeInteger(r[key])&&r[key]>=0,'COUNTS_INVALID');
      assert(r.count===r.explicit+r.stopped+r.detected && r.cohortCount+r.missingEntry<=r.count,'TOTAL_INVALID');
      assert(r.denominator===null||(Number.isSafeInteger(r.denominator)&&r.denominator>=0),'DENOMINATOR_INVALID');
      if(r.rate!==null)assert(h.unassigned===0 && t.unknownMonth===0 && r.missingEntry===0 && r.denominator>0 && r.cohortCount<=r.denominator && r.rate===Number((100*r.cohortCount/r.denominator).toFixed(2)),'RATE_INVALID');
    });
  }return h;
}

export function withdrawalInputFromRanges(ranges,asOf) {
  assert(ranges.length===7,'SOURCE_INCOMPLETE');
  const [keys,states,dates,people,courseKeys,courseDates,changeRows]=ranges.map(r=>r.values||[]);
  assert(keys[0]?.[0]==='Prospect会員ID' && states[0]?.[0]==='在籍状態' && dates[0]?.[0]==='入会日' && dates[0]?.[1]==='退会日' && dates[0]?.[4]==='主チーム' && people[0]?.[0]==='Prospect人物ID','MASTER_HEADERS_INVALID');
  assert(courseKeys[0]?.[0]==='Prospect会員ID' && courseDates[0]?.[0]==='開始日' && courseDates[0]?.[1]==='終了日' && changeRows[0]?.[0]==='変更日時','HISTORY_HEADERS_INVALID');
  const members=keys.slice(1).flatMap((r,i)=>!r[0]?[]:[{id:r[0],status:states[i+1]?.[0],joinedAt:dates[i+1]?.[0],retiredAt:dates[i+1]?.[1],team:dates[i+1]?.[4],person:people[i+1]?.[0]||r[0]}]);
  const courses=courseKeys.slice(1).flatMap((r,i)=>!r[0]?[]:[{id:r[0],startedAt:courseDates[i+1]?.[0],endedAt:courseDates[i+1]?.[1],active:courseDates[i+1]?.[2]===true,detected:String(courseDates[i+1]?.[6]||'').includes('API上で契約コースから外れたため終了')}]);
  const changes=changeRows.slice(1).map(r=>({at:r[0],team:r[2],id:r[3],field:r[7],before:r[8],after:r[9]}));
  return {members,courses,changes,asOf};
}

export async function fetchWithdrawalHistory({spreadsheetId,token,asOf,requestJson}) {
  const batch=(id,ranges,mode='UNFORMATTED_VALUE')=>{const p=new URLSearchParams({valueRenderOption:mode,dateTimeRenderOption:'SERIAL_NUMBER'});ranges.forEach(r=>p.append('ranges',r));return `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}/values:batchGet?${p}`;};
  const link=await requestJson(batch(spreadsheetId,["'98_会員マスター連携'!A4"],'FORMULA'),token);
  const match=link.valueRanges?.[0]?.values?.[0]?.[0]?.match(/^=IMPORTRANGE\("https:\/\/docs\.google\.com\/spreadsheets\/d\/([A-Za-z0-9_-]+)\/edit"\s*,\s*"'12_Savant連携'!A4:AE9"\)$/i);
  assert(match,'SOURCE_LINK_INVALID');const id=match[1];
  const meta=await requestJson(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}?fields=sheets(properties(title,gridProperties))`,token);
  const size=name=>{const p=meta.sheets?.find(s=>s.properties?.title===name)?.properties;assert(p?.gridProperties.rowCount>=5 && p.gridProperties.rowCount<=50000,'GRID_INVALID');return p.gridProperties.rowCount;};
  const m=size('01_会員マスター'),c=size('02_所属コース履歴'),h=size('08_会員変更履歴');
  const url=batch(id,[`'01_会員マスター'!A4:A${m}`,`'01_会員マスター'!F4:F${m}`,`'01_会員マスター'!P4:T${m}`,`'01_会員マスター'!AG4:AG${m}`,`'02_所属コース履歴'!B4:B${c}`,`'02_所属コース履歴'!K4:Q${c}`,`'08_会員変更履歴'!B4:K${h}`]);
  const capture=async()=>buildWithdrawalHistory(withdrawalInputFromRanges((await requestJson(url,token)).valueRanges||[],asOf));
  const result=await capture();assert(JSON.stringify(result)===JSON.stringify(await capture()),'SOURCE_CHANGED_DURING_READ');return result;
}

export function applyWithdrawalBaseline(h,data) {
  const result=structuredClone(h);
  // Rates are rebuilt from the same public snapshot's monthly baseline, never from a different cutoff.
  for(const id of IDS)for(const row of result.teams[id].months){if(!row)continue;row.denominator=null;row.rate=null;
    if(row.month===data.asOf.slice(0,7) && data.memberMonthlyComparison?.previousAsOf===previousMonthEnd(data.asOf) && data.memberMonthlyComparison.memberDefinition?.id===data.memberDefinition?.id){
      row.denominator=data.memberMonthlyComparison.teams.find(t=>t.id===id)?.members??null;
      if(result.unassigned===0&&result.teams[id].unknownMonth===0&&row.missingEntry===0&&row.denominator>0&&row.cohortCount<=row.denominator)row.rate=Number((100*row.cohortCount/row.denominator).toFixed(2));
    }
  }return validateWithdrawalHistory(result,data);
}
