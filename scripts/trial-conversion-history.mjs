import { fiscalYearFor, serialToIsoDate } from './private-trial-aggregate.mjs';

export const TRIAL_CONVERSION_HISTORY_DEFINITION = 'trial-attendance-fiscal-monthly-v1';
const IDS = ['A', 'B', 'C', 'D'];
const TITLE = '09_体験入会突合';
const HEADER_ROW = 4;
// Same columns the annual 12_Savant連携!A12:H17 table counts. The admission flag is 09 I列, not 01 P「入会日」
// (admission-date totals are a separate series). Matched exactly after NFKC/whitespace normalisation.
export const TRIAL_CONVERSION_HEADERS = Object.freeze({ date: '体験日', team: 'チーム', attended: '出席', admitted: '入会（体験表／会員マスター）' });
const UNAVAILABLE_REASONS = new Set(['ANNUAL_MISMATCH', 'SOURCE_CHANGED', 'SCHEMA_INVALID', 'SOURCE_UNAVAILABLE']);
const check = (ok, code) => { if (!ok) throw new Error(`TRIAL_CONVERSION_HISTORY_${code}`); };
const exact = (value, keys) => value && typeof value === 'object' && Object.keys(value).sort().join() === [...keys].sort().join();
const validDate = date => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
const serialOf = date => (Date.parse(date) - Date.UTC(1899, 11, 30)) / 86400000;
const monthsOf = fiscalYear => Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(Number(fiscalYear), i + 3, 1)).toISOString().slice(0, 7));
const sum = values => values.reduce((n, v) => n + (v ?? 0), 0);
const flag = (value, code) => {
  if (value === true) return true;
  if (value === false || value === '' || value == null) return false;
  throw new Error(`TRIAL_CONVERSION_HISTORY_${code}_VALUE_INVALID`);
};

/** Columns arrive header-first and stay in memory; only per-month team counts leave this function. */
export function buildTrialConversionHistory({ dates, teams, attended, admitted, asOf }) {
  check(validDate(asOf), 'DATE_INVALID');
  const H = TRIAL_CONVERSION_HEADERS;
  const head = column => squash(column?.[0]);
  check(head(dates) === squash(H.date) && head(teams) === squash(H.team) && head(attended) === squash(H.attended) && head(admitted) === squash(H.admitted), 'HEADER_INVALID');
  const fiscalYear = fiscalYearFor(asOf);
  const months = monthsOf(fiscalYear);
  const open = month => month <= asOf.slice(0, 7);
  const series = () => months.map(month => open(month) ? 0 : null);
  const byTeam = Object.fromEntries(IDS.map(id => [id, { trials: series(), admissions: series() }]));
  // Matches the annual cutoff: before the day after asOf, so timestamps on asOf count.
  const cutoff = serialOf(asOf) + 1, start = `${fiscalYear}-04-01`;
  for (let i = 1; i < Math.max(dates.length, teams.length, attended.length, admitted.length); i++) {
    const team = teams[i];
    if (!IDS.includes(team) || !flag(attended[i], 'ATTENDANCE')) continue;
    const admittedRow = flag(admitted[i], 'ADMISSION');
    check(dates[i] !== '' && dates[i] != null, 'TRIAL_DATE_INVALID');
    if (typeof dates[i] === 'number' && dates[i] >= cutoff) continue;
    const date = serialToIsoDate(dates[i]);
    check(validDate(date), 'TRIAL_DATE_INVALID');
    if (date > asOf || date < start) continue;
    const index = months.indexOf(date.slice(0, 7));
    check(index >= 0, 'MONTH_INVALID');
    byTeam[team].trials[index]++;
    if (admittedRow) byTeam[team].admissions[index]++;
  }
  const total = Object.fromEntries(['trials', 'admissions'].map(key => [key, months.map((month, i) => open(month) ? IDS.reduce((n, id) => n + byTeam[id][key][i], 0) : null)]));
  const history = { status: 'ok', definition: TRIAL_CONVERSION_HISTORY_DEFINITION, asOf, fiscalYear, months, teams: byTeam, total };
  validateTrialConversionHistory(history, { asOf });
  return history;
}

export function unavailableTrialConversionHistory(asOf, reason) {
  return { status: 'unavailable', definition: TRIAL_CONVERSION_HISTORY_DEFINITION, asOf, fiscalYear: fiscalYearFor(asOf),
    reason: UNAVAILABLE_REASONS.has(reason) ? reason : 'SOURCE_UNAVAILABLE' };
}

/** Monthly cohorts must add up to the published fiscal-year counts exactly, per team and field. */
export function validateTrialConversionHistory(history, data) {
  check(history?.definition === TRIAL_CONVERSION_HISTORY_DEFINITION, 'DEFINITION_INVALID');
  check(validDate(history.asOf) && history.asOf === data.asOf && history.fiscalYear === fiscalYearFor(data.asOf), 'DATE_MISMATCH');
  if (history.status === 'unavailable') {
    check(exact(history, ['status', 'definition', 'asOf', 'fiscalYear', 'reason']) && UNAVAILABLE_REASONS.has(history.reason), 'FIELDS_INVALID');
    return history;
  }
  check(history.status === 'ok' && exact(history, ['status', 'definition', 'asOf', 'fiscalYear', 'months', 'teams', 'total']), 'FIELDS_INVALID');
  const months = monthsOf(history.fiscalYear);
  check(JSON.stringify(history.months) === JSON.stringify(months), 'MONTHS_INVALID');
  check(exact(history.teams, IDS) && exact(history.total, ['trials', 'admissions']), 'TEAMS_INVALID');
  const open = i => months[i] <= data.asOf.slice(0, 7);
  for (const value of [history.total, ...IDS.map(id => history.teams[id])]) {
    check(exact(value, ['trials', 'admissions']), 'SERIES_INVALID');
    for (const key of ['trials', 'admissions']) {
      check(Array.isArray(value[key]) && value[key].length === 12, 'SERIES_INVALID');
      value[key].forEach((v, i) => check(open(i) ? Number.isSafeInteger(v) && v >= 0 : v === null, 'COUNT_INVALID'));
    }
    value.admissions.forEach((v, i) => check(!open(i) || v <= value.trials[i], 'ADMISSIONS_EXCEED_TRIALS'));
  }
  for (const key of ['trials', 'admissions']) {
    months.forEach((_, i) => { if (open(i)) check(history.total[key][i] === IDS.reduce((n, id) => n + history.teams[id][key][i], 0), 'TOTAL_MISMATCH'); });
  }
  if (data.admissionConversion) {
    const conversion = data.admissionConversion;
    check(conversion.asOf === history.asOf && conversion.fiscalYear === history.fiscalYear, 'ANNUAL_DATE_MISMATCH');
    for (const id of IDS) for (const key of ['trials', 'admissions']) {
      check(sum(history.teams[id][key]) === conversion.teams?.[id]?.[key], `ANNUAL_MISMATCH_${id}_${key}`);
    }
  }
  return history;
}

const columnLetter = index => { let s = ''; for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + (n - 1) % 26) + s; return s; };

// Resolve the member master through the existing private link; never embed a Workspace ID in public code or output.
export async function fetchTrialConversionHistory({ spreadsheetId, token, asOf, conversion, requestJson }) {
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
  const sheets = metadata.sheets?.filter(s => s.properties?.title === TITLE) || [];
  const grid = sheets[0]?.properties?.gridProperties;
  check(sheets.length === 1 && Number.isSafeInteger(grid?.rowCount) && grid.rowCount > HEADER_ROW && grid.rowCount <= 50000
    && Number.isSafeInteger(grid.columnCount) && grid.columnCount >= 4 && grid.columnCount <= 200, 'SOURCE_GRID_INVALID');
  // Header row only; each required header must appear exactly once.
  const headerUrl = batchUrl(id, [`'${TITLE}'!A${HEADER_ROW}:${columnLetter(grid.columnCount - 1)}${HEADER_ROW}`], 'UNFORMATTED_VALUE', 'ROWS');
  const header = (await requestJson(headerUrl, token)).valueRanges?.[0]?.values?.[0] || [];
  const keys = ['date', 'team', 'attended', 'admitted'];
  const columns = keys.map(key => {
    const found = header.flatMap((value, index) => squash(value) === squash(TRIAL_CONVERSION_HEADERS[key]) ? [index] : []);
    if (found.length !== 1) {
      const error = new Error(`TRIAL_CONVERSION_HISTORY_HEADER_${found.length ? 'DUPLICATE' : 'MISSING'}_${key.toUpperCase()}`);
      error.profile = profileHeader(header, TRIAL_CONVERSION_HEADERS[key]);
      throw error;
    }
    return columnLetter(found[0]);
  });
  const url = batchUrl(id, columns.map(column => `'${TITLE}'!${column}${HEADER_ROW}:${column}${grid.rowCount}`));
  const capture = async () => {
    const raw = await requestJson(url, token);
    check(raw.valueRanges?.length === 4, 'SOURCE_INCOMPLETE');
    const [dates, teams, attended, admitted] = raw.valueRanges.map(range => range?.values?.[0] || []);
    try { return buildTrialConversionHistory({ dates, teams, attended, admitted, asOf }); }
    catch (error) { error.profile = profileTrialColumns({ dates, teams, attended, admitted }); throw error; }
  };
  const history = await capture();
  validateTrialConversionHistory(history, { asOf, admissionConversion: conversion });
  check(JSON.stringify(history) === JSON.stringify(await capture())
    && JSON.stringify((await requestJson(headerUrl, token)).valueRanges?.[0]?.values?.[0] || []) === JSON.stringify(header), 'SOURCE_CHANGED_DURING_READ');
  return history;
}

const kind = value => value === true ? 'true' : value === false ? 'false' : value === '' || value == null ? 'empty'
  : typeof value === 'number' ? 'number' : typeof value === 'string' ? (/^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/.test(value.trim()) ? 'dateString' : 'string') : 'other';
const tally = values => values.reduce((acc, value) => ({ ...acc, [kind(value)]: (acc[kind(value)] || 0) + 1 }), {});

/** Value-type counts only: no cell text, row number or person-level value leaves this function. */
export function profileTrialColumns({ dates, teams, attended, admitted }) {
  const rows = Array.from({ length: Math.max(dates.length, teams.length, attended.length, admitted.length) - 1 }, (_, i) => i + 1);
  const inTeam = rows.filter(i => IDS.includes(teams[i]));
  return { teamRows: inTeam.length, attended: tally(inTeam.map(i => attended[i])), admitted: tally(inTeam.map(i => admitted[i])),
    attendedDates: tally(inTeam.filter(i => attended[i] === true).map(i => dates[i])) };
}

// Labels the run log may name; any other header text is only counted, never printed.
const HEADER_CANDIDATES = ['入会（体験表／会員マスター）', '入会','入会判定', '入会済', '入会有無', '入会状況', '入会確認', '入会フラグ', '入会可否', '入会日', '入会者', '入会(TRUE/FALSE)', '出席', '出席確認', '体験日', 'チーム'];
const squash = value => String(value ?? '').normalize('NFKC').replace(/\s+/g, '');
/** Header shape for a missing/duplicate column: matching candidate labels and counts only. */
export function profileHeader(header, label) {
  const cells = header.map(squash);
  return { columns: header.length, containing: cells.filter(cell => cell.includes(label)).length,
    candidates: HEADER_CANDIDATES.filter(candidate => candidate.includes(label) || label.includes(candidate))
      .map(candidate => [candidate, cells.filter(cell => cell === squash(candidate)).length, header.filter(cell => String(cell ?? '').trim() === candidate).length])
      .filter(([, normalised]) => normalised > 0) };
}

/** Fixed error code plus anonymous counts for the run log. */
export function trialConversionDiagnostic(error) {
  const code = String(error?.message || '');
  const detail = /^(TRIAL_CONVERSION_HISTORY_[A-Z_]+|GOOGLE_SHEETS_[A-Z0-9_]+)$/.test(code) ? code.replace(/^TRIAL_CONVERSION_HISTORY_/, '') : 'OTHER';
  return `detail=${detail}${error?.profile ? ` profile=${JSON.stringify(error.profile)}` : ''}`;
}

/** Optional analysis: a failed gate publishes as unavailable, never as zero or a stale series. */
export function trialConversionFailureReason(error) {
  const code = String(error?.message || '');
  if (/^TRIAL_CONVERSION_HISTORY_ANNUAL_/.test(code)) return 'ANNUAL_MISMATCH';
  if (code === 'TRIAL_CONVERSION_HISTORY_SOURCE_CHANGED_DURING_READ') return 'SOURCE_CHANGED';
  if (/^TRIAL_CONVERSION_HISTORY_(SCHEMA|HEADER|SOURCE_GRID|SOURCE_LINK)_INVALID$|^TRIAL_CONVERSION_HISTORY_HEADER_(MISSING|DUPLICATE)_|_VALUE_INVALID$|TRIAL_DATE_INVALID$/.test(code)) return 'SCHEMA_INVALID';
  return 'SOURCE_UNAVAILABLE';
}
