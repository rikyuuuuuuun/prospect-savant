import { fiscalYearFor, serialToIsoDate } from './private-trial-aggregate.mjs';
import { trialAnalyticsDisposition } from './trial-analytics-disposition.mjs';

export const ACQUISITION_DEFINITION='club-discovery-source-v1';
export const ACQUISITION_TEAMS=Object.freeze(['A','B','C','D','E']);
export const ACQUISITION_CATEGORIES=Object.freeze(['flyer','referral','other']);
const LAUNCH='2026-11-02';
const check=(ok,code)=>{if(!ok)throw Error('ACQUISITION_'+code)};
const date=value=>{const s=serialToIsoDate(value);return s&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&new Date(s).toISOString().slice(0,10)===s?s:null};
const empty=()=>({flyer:0,referral:0,other:0,unknown:0,total:0});
const categories={チラシ:'flyer',紹介:'referral',その他:'other'};
// Read only the receiver-generated prefix, before free-form consultation notes.
export function acquisitionCategory(note){
  const label=String(note||'').match(/^(?:受付種別：キャンセル待ち／)?クラブを知ったきっかけ：(チラシ|紹介|その他)(?:／|$)/)?.[1];
  return categories[label]||'unknown';
}
export function buildAcquisitionHistory({rows,asOf}){
  check(date(asOf)===asOf,'DATE_INVALID');
  const since=[LAUNCH,`${fiscalYearFor(asOf)}-04-01`].sort().at(-1);
  const teams=Object.fromEntries(ACQUISITION_TEAMS.map(id=>[id,empty()]));
  const months=[];
  for(let month=since.slice(0,7);month<=asOf.slice(0,7);){
    months.push({month,teams:Object.fromEntries(ACQUISITION_TEAMS.map(id=>[id,empty()]))});
    const [y,m]=month.split('-').map(Number);month=new Date(Date.UTC(y,m,1)).toISOString().slice(0,7);
  }
  const seen=new Set();
  for(const row of rows){
    if(row[12]!=='フォーム'||!['体験申込','キャンセル待ち申込'].includes(row[11]))continue;
    const disposition=trialAnalyticsDisposition(row);
    if(['EXCLUDE_TEST','EXCLUDE_OWNER'].includes(disposition))continue;
    const receipt=String(row[0]||'').trim(),team=row[4],received=date(row[2]);
    if(!receipt||!ACQUISITION_TEAMS.includes(team))continue;
    check(!seen.has(receipt),'DUPLICATE_RECEIPT');seen.add(receipt);
    check(received,'RECEIVED_DATE_INVALID');
    if(received<since||received>asOf)continue;
    const category=acquisitionCategory(row[34]);
    const bucket=months.find(item=>item.month===received.slice(0,7));
    for(const counts of [teams[team],bucket.teams[team]]){counts[category]++;counts.total++;}
  }
  return validateAcquisitionHistory({definition:ACQUISITION_DEFINITION,status:'ok',asOf,since,timezone:'Asia/Tokyo',teams,months},{asOf});
}
export function unavailableAcquisition(asOf){return{definition:ACQUISITION_DEFINITION,status:'unavailable',asOf,since:[LAUNCH,`${fiscalYearFor(asOf)}-04-01`].sort().at(-1),timezone:'Asia/Tokyo',teams:null,months:null}}
export function validateAcquisitionHistory(value,data){
  check(value&&value.definition===ACQUISITION_DEFINITION&&value.asOf===data.asOf,'SOURCE_MISMATCH');
  check(Object.keys(value).sort().join()===['definition','status','asOf','since','timezone','teams','months'].sort().join(),'PRIVATE_FIELD');
  check(value.timezone==='Asia/Tokyo'&&date(value.since)===value.since,'SCOPE_INVALID');
  check(value.since===[LAUNCH,`${fiscalYearFor(value.asOf)}-04-01`].sort().at(-1),'PERIOD_INVALID');
  if(value.status==='unavailable'){check(value.teams===null&&value.months===null,'UNAVAILABLE_NOT_NULL');return value}
  check(value.status==='ok'&&Array.isArray(value.months),'STATUS_INVALID');
  const countKeys=['flyer','referral','other','unknown','total'];
  const validateTeams=teams=>{
    check(teams&&Object.keys(teams).sort().join()===ACQUISITION_TEAMS.join(),'TEAM_INVALID');
    for(const counts of Object.values(teams)){
      check(counts&&Object.keys(counts).sort().join()===countKeys.slice().sort().join(),'PRIVATE_FIELD');
      check(Object.values(counts).every(n=>Number.isSafeInteger(n)&&n>=0),'COUNT_INVALID');
      check(counts.total===counts.flyer+counts.referral+counts.other+counts.unknown,'TOTAL_MISMATCH');
    }
  };
  validateTeams(value.teams);
  const expectedMonths=[];for(let m=value.since.slice(0,7);m<=value.asOf.slice(0,7);){expectedMonths.push(m);const[y,n]=m.split('-').map(Number);m=new Date(Date.UTC(y,n,1)).toISOString().slice(0,7)}
  check(JSON.stringify(value.months.map(m=>m.month))===JSON.stringify(expectedMonths),'MONTH_INVALID');
  for(const month of value.months){check(Object.keys(month).sort().join()==='month,teams','PRIVATE_FIELD');validateTeams(month.teams)}
  for(const team of ACQUISITION_TEAMS)for(const key of countKeys)check(value.months.reduce((n,m)=>n+m.teams[team][key],0)===value.teams[team][key],'MONTH_TOTAL_MISMATCH');
  return value;
}

/** Only anonymous counts leave memory. No names, receipt IDs, dates of individual requests or notes are returned. */
export async function fetchAcquisitionHistory({spreadsheetId,token,asOf,requestJson}){
  const params=new URLSearchParams({valueRenderOption:'FORMULA'});params.append('ranges',"'98_会員マスター連携'!A4");
  const base=id=>`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}`;
  const link=await requestJson(base(spreadsheetId)+'/values:batchGet?'+params,token);
  const master=link.valueRanges?.[0]?.values?.[0]?.[0]?.match(/^=IMPORTRANGE\("https:\/\/docs\.google\.com\/spreadsheets\/d\/([A-Za-z0-9_-]+)\/edit"\s*,\s*"'12_Savant連携'!A4:AE9"\)$/i)?.[1];
  check(master,'SOURCE_LINK_INVALID');
  const meta=await requestJson(base(master)+'?fields=sheets(properties(title,gridProperties))',token);
  const grids=meta.sheets?.filter(s=>s.properties?.title==='14_LINE体験受付')||[];
  const grid=grids[0]?.properties?.gridProperties;
  check(grids.length===1&&Number.isSafeInteger(grid?.rowCount)&&grid.rowCount>=5&&grid.rowCount<=50000&&grid.columnCount>=35,'GRID_INVALID');
  const columns=[['A',0,'受付ID'],['C',2,'受信日時'],['E',4,'チーム'],['L',11,'メッセージ種別'],['M',12,'抽出方法'],['AI',34,'エラー・備考']];
  const query=new URLSearchParams({valueRenderOption:'UNFORMATTED_VALUE',majorDimension:'COLUMNS',dateTimeRenderOption:'SERIAL_NUMBER'});
  columns.forEach(([c])=>query.append('ranges',`'14_LINE体験受付'!${c}4:${c}${grid.rowCount}`));
  const url=base(master)+'/values:batchGet?'+query;
  const initial=await requestJson(url,token);check(initial.valueRanges?.length===columns.length,'SOURCE_INCOMPLETE');
  const vectors=initial.valueRanges.map((v,i)=>{const a=v.values?.[0]||[];check(a[0]===columns[i][2],'HEADER_INVALID');return a});
  const rows=Array.from({length:Math.max(...vectors.map(v=>v.length))-1},(_,i)=>{const row=[];columns.forEach(([,index],j)=>row[index]=vectors[j][i+1]??'');return row});
  const result=buildAcquisitionHistory({rows,asOf});
  check(JSON.stringify(await requestJson(url,token))===JSON.stringify(initial),'SOURCE_CHANGED');
  return result;
}
