import { fiscalYearFor, serialToIsoDate } from './private-trial-aggregate.mjs';
export const ADMISSION_HISTORY_DEFINITION = 'member-master-admission-date-monthly-v1';
const IDS = ['A', 'B', 'C', 'D'];
const check = (ok, code) => { if (!ok) throw new Error(`ADMISSION_HISTORY_${code}`); };
const validDate = date => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
export function buildAdmissionHistory({ dates, teams, asOf }) {
  check(validDate(asOf), 'DATE_INVALID');
  check(dates?.[0] === '入会日' && teams?.[0] === '主チーム', 'HEADER_INVALID');
  const fiscalYear = fiscalYearFor(asOf);
  const months = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(Number(fiscalYear), i + 3, 1)).toISOString().slice(0, 7));
  const byTeam = Object.fromEntries(IDS.map(id => [id, months.map(month => month <= asOf.slice(0, 7) ? 0 : null)]));
  for (let i = 1; i < Math.max(dates.length, teams.length); i++) {
    const team = teams[i];
    if (!IDS.includes(team) || dates[i] == null || dates[i] === '') continue;
    // Match the existing annual COUNTIFS cutoff (<= the source's date serial), including timestamps.
    const cutoff = (Date.parse(asOf) - Date.UTC(1899, 11, 30)) / 86400000;
    if (typeof dates[i] === 'number' && dates[i] > cutoff) continue;
    const date = serialToIsoDate(dates[i]);
    check(validDate(date), 'ENTRY_DATE_INVALID');
    if (date > asOf || date < `${fiscalYear}-04-01`) continue;
    const index = months.indexOf(date.slice(0, 7));
    check(index >= 0, 'MONTH_INVALID');
    byTeam[team][index]++;
  }
  const history = { definition: ADMISSION_HISTORY_DEFINITION, asOf, fiscalYear, months, teams: byTeam,
    total: months.map((month, i) => month <= asOf.slice(0, 7) ? IDS.reduce((sum, id) => sum + byTeam[id][i], 0) : null) };
  validateAdmissionHistory(history, { asOf });
  return history;
}
export function validateAdmissionHistory(history, data) {
  check(history && Object.keys(history).sort().join() === ['definition','asOf','fiscalYear','months','teams','total'].sort().join(), 'FIELDS_INVALID');
  check(history.definition === ADMISSION_HISTORY_DEFINITION, 'DEFINITION_INVALID');
  check(validDate(history.asOf) && history.asOf === data.asOf && history.fiscalYear === fiscalYearFor(data.asOf), 'DATE_MISMATCH');
  const months = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(Number(history.fiscalYear), i + 3, 1)).toISOString().slice(0, 7));
  check(JSON.stringify(history.months) === JSON.stringify(months), 'MONTHS_INVALID');
  check(history.teams && Object.keys(history.teams).sort().join() === IDS.join(), 'TEAMS_INVALID');
  for (const values of [history.total, ...IDS.map(id => history.teams[id])]) {
    check(Array.isArray(values) && values.length === 12, 'SERIES_INVALID');
    values.forEach((v, i) => check(months[i] > data.asOf.slice(0, 7) ? v === null : Number.isSafeInteger(v) && v >= 0, 'COUNT_INVALID'));
  }
  months.forEach((month, i) => { if (month <= data.asOf.slice(0, 7)) check(history.total[i] === IDS.reduce((sum, id) => sum + history.teams[id][i], 0), 'TOTAL_MISMATCH'); });
  if (data.admissions) {
    check(data.admissions.asOf === history.asOf && data.admissions.fiscalYear === history.fiscalYear, 'ANNUAL_DATE_MISMATCH');
    IDS.forEach(id => check(history.teams[id].reduce((sum, n) => sum + (n ?? 0), 0) === data.admissions.teams[id]?.cumulative, `ANNUAL_TOTAL_MISMATCH_${id}`));
  }
  return history;
}

// Resolve the existing private source link; never embed a Workspace ID in public code or output.
export async function fetchAdmissionHistory({ spreadsheetId, token, asOf, requestJson }) {
  const batchUrl = (id, ranges, mode = 'UNFORMATTED_VALUE', dimension = 'COLUMNS') => {
    const params = new URLSearchParams({ valueRenderOption: mode, majorDimension: dimension, dateTimeRenderOption: 'SERIAL_NUMBER' });
    ranges.forEach(range => params.append('ranges', range));
    return `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}/values:batchGet?${params}`;
  };
  const link = await requestJson(batchUrl(spreadsheetId, ["'98_会員マスター連携'!A4"], 'FORMULA', 'ROWS'), token);
  const formula = link.valueRanges?.[0]?.values?.[0]?.[0];
  const match = typeof formula === 'string' && formula.match(/^=IMPORTRANGE\("https:\/\/docs\.google\.com\/spreadsheets\/d\/([A-Za-z0-9_-]+)\/edit"\s*,\s*"'12_Savant連携'!A4:AE9"\)$/i);
  check(match, 'SOURCE_LINK_INVALID');
  const id = match[1];
  const metadata = await requestJson(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}?fields=sheets(properties(title,gridProperties))`, token);
  const sheet = metadata.sheets?.find(s => s.properties?.title === '01_会員マスター');
  const rows = sheet?.properties?.gridProperties?.rowCount;
  check(Number.isSafeInteger(rows) && rows >= 5 && rows <= 50000 && sheet.properties.gridProperties.columnCount >= 20, 'SOURCE_GRID_INVALID');
  const url = batchUrl(id, [`'01_会員マスター'!P4:P${rows}`, `'01_会員マスター'!T4:T${rows}`]);
  const capture = async () => {
    const raw = await requestJson(url, token);
    check(raw.valueRanges?.length === 2, 'SOURCE_INCOMPLETE');
    return buildAdmissionHistory({ dates: raw.valueRanges[0]?.values?.[0], teams: raw.valueRanges[1]?.values?.[0], asOf });
  };
  const history = await capture();
  check(JSON.stringify(history) === JSON.stringify(await capture()), 'SOURCE_CHANGED_DURING_READ');
  return history;
}
