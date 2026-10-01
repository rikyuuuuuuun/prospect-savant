import { createHash } from 'node:crypto';
import { serialToIsoDate, TEAM_IDS } from './private-trial-aggregate.mjs';

export const TRIAL_ANALYTICS_DEFINITION = 'reflected-trial-receipt-disposition-v1';
const PREFIX = 'PROSPECT_ANALYTICS_DISPOSITION_';
const MARKER = /\[PROSPECT_ANALYTICS_DISPOSITION_V1:(EXCLUDE_TEST|EXCLUDE_OWNER|HOLD_UNDATED):(FORM-[A-Za-z0-9-]+)\]/g;
const RECEIPT = /^FORM-[A-Za-z0-9-]+$/;
const text = value => String(value ?? '');
export const normaliseTrialRoute = value => text(value).replace(/^[\s\u00A0\u3000\uFEFF]+|[\s\u00A0\u3000\uFEFF]+$/g, '').trim();
const check = (ok, code) => { if (!ok) throw new Error(`TRIAL_DISPOSITION_${code}`); };
const legacyReceiptFromNote = value => text(value).match(/LINE受付ID\s*[:=：]\s*(FORM-[A-Za-z0-9-]+)/i)?.[1] || '';
const empty = value => value === '' || value == null;
export function trialDate(value) {
  const date = serialToIsoDate(value);
  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date ? date : null;
}

/** Same private AI contract as GAS. Neither IDs nor marker text leave this module. */
export function trialAnalyticsDisposition(row) {
  const note = text(row[34]);
  if (!note.includes(PREFIX)) return '';
  const tokens = [...note.matchAll(MARKER)];
  check(tokens.length === 1 && !note.replace(tokens[0][0], '').includes(PREFIX), 'MARKER_INVALID');
  const [, disposition, receipt] = tokens[0];
  check(receipt === text(row[0]).trim() && text(row[11]) === '体験申込' && text(row[12]) === 'フォーム', 'RECEIPT_MISMATCH');
  return disposition;
}

export function trialReceiptFromNote(value) {
  const note = text(value);
  if (!/LINE受付ID/i.test(note)) return '';
  const matches = [...note.matchAll(/LINE受付ID\s*[:=：]\s*(FORM-[A-Za-z0-9-]+)/gi)];
  check(matches.length === 1 && !/LINE受付ID/i.test(note.replace(matches[0][0], '')), 'NOTE_INVALID');
  // Do not silently accept a truncated ID when punctuation is inside its token.
  const suffix = note.slice(matches[0].index + matches[0][0].length);
  check(!/^[A-Za-z0-9_-]/.test(suffix), 'NOTE_INVALID');
  return matches[0][1];
}

export function buildTrialIntakeIndex(rows) {
  const index = new Map();
  for (const row of rows) {
    const disposition = trialAnalyticsDisposition(row);
    const receipt = text(row[0]).trim();
    const form = text(row[11]) === '体験申込' && text(row[12]) === 'フォーム';
    if (!receipt) {
      check(!(form && text(row[23]) === '反映済'), 'RECEIPT_NOT_UNIQUE');
      continue;
    }
    check(!index.has(receipt), 'RECEIPT_NOT_UNIQUE');
    if (form && (disposition || text(row[23]) === '反映済')) {
      check(RECEIPT.test(receipt), 'RECEIPT_INVALID');
      check(TEAM_IDS.includes(text(row[4])), 'TEAM_INVALID');
      check(normaliseTrialRoute(row[6]) && normaliseTrialRoute(row[7]), 'ROUTE_INVALID');
    }
    index.set(receipt, { row, disposition, form });
  }
  return index;
}

/** Fresh reconciliation of 14 intake versus canonical 09 S; never rewrite history to pass. */
export function buildTrialAnalyticsQuality(intakeRows, experienceRows) {
  const intake = buildTrialIntakeIndex(intakeRows);
  const summary = { definition: TRIAL_ANALYTICS_DEFINITION, total: 0, pendingWorkflow: 0,
    excludedTest: 0, excludedOwner: 0, pendingDate: 0, eligible: 0,
    receiptColumnUniqueMatched: 0, receiptNoteConflicts: 0, legacyEvidenceRows: 0, exactUniqueMatched: 0, unresolvedEligible: 0, invalidEligibleDate: 0,
    ambiguousMatches: 0, archivedMatchRows: 0 };
  for (const [receipt, { row, disposition, form }] of intake) {
    if (!form) continue;
    if (text(row[23]) !== '反映済' && !disposition) { summary.pendingWorkflow++; continue; }
    summary.total++;
    if (disposition) {
      // Broad evidence is used only to preserve excluded/held history for review.
      const generatedId = `EXP-LINE-${createHash('sha256').update(receipt).digest('hex').slice(0, 16)}`;
      const prior = experienceRows.filter(match => text(match[18]).trim() === receipt || legacyReceiptFromNote(match[17]) === receipt || text(match[0]) === generatedId);
      summary[disposition === 'EXCLUDE_TEST' ? 'excludedTest' : disposition === 'EXCLUDE_OWNER' ? 'excludedOwner' : 'pendingDate']++;
      summary.archivedMatchRows += prior.length;
      continue;
    }
    summary.eligible++;
    // S is authoritative. Copied legacy notes cannot pull another receipt's row
    // into this cohort, and a manual row without S cannot manufacture a match.
    const matches = experienceRows.filter(match => text(match[18]).trim() === receipt);
    const generatedId = `EXP-LINE-${createHash('sha256').update(receipt).digest('hex').slice(0, 16)}`;
    summary.legacyEvidenceRows += experienceRows.filter(match => !text(match[18]).trim() && (legacyReceiptFromNote(match[17]) === receipt || text(match[0]) === generatedId)).length;
    if (matches.length === 1) summary.receiptColumnUniqueMatched++;
    const date = trialDate(row[14]);
    if (!date) summary.invalidEligibleDate++;
    if (matches.length > 1) summary.ambiguousMatches++;
    const noted = matches[0] && legacyReceiptFromNote(matches[0][17]);
    if (noted && noted !== receipt) summary.receiptNoteConflicts++;
    if (date && matches.length === 1 && text(matches[0][3]) === text(row[4]) && trialDate(matches[0][1]) === date) summary.exactUniqueMatched++;

  }
  summary.unresolvedEligible = summary.eligible - summary.exactUniqueMatched;
  summary.status = summary.unresolvedEligible === 0 && summary.archivedMatchRows === 0 ? 'READY' : 'REVIEW';
  return summary;
}

const QUALITY_COUNTS = ['total', 'pendingWorkflow', 'excludedTest', 'excludedOwner', 'pendingDate', 'eligible', 'receiptColumnUniqueMatched', 'receiptNoteConflicts', 'legacyEvidenceRows', 'exactUniqueMatched', 'unresolvedEligible', 'invalidEligibleDate', 'ambiguousMatches', 'archivedMatchRows'];
export function assertTrialAnalyticsQuality(summary) {
  check(summary && Object.keys(summary).sort().join() === ['definition', 'status', ...QUALITY_COUNTS].sort().join(), 'QUALITY_FIELDS_INVALID');
  check(summary.definition === TRIAL_ANALYTICS_DEFINITION, 'QUALITY_DEFINITION_INVALID');
  for (const key of QUALITY_COUNTS) check(Number.isSafeInteger(summary[key]) && summary[key] >= 0, 'QUALITY_COUNT_INVALID');
  check(summary.total === summary.eligible + summary.excludedTest + summary.excludedOwner + summary.pendingDate &&
    summary.eligible === summary.exactUniqueMatched + summary.unresolvedEligible &&
    summary.receiptColumnUniqueMatched <= summary.eligible && summary.exactUniqueMatched <= summary.receiptColumnUniqueMatched, 'QUALITY_TOTAL_MISMATCH');
  check(summary.status === 'READY' && summary.unresolvedEligible === 0 && summary.invalidEligibleDate === 0 &&
    summary.ambiguousMatches === 0 && summary.archivedMatchRows === 0, 'QUALITY_BLOCKED');
  return summary;
}

/** Preserve unmarked manual rows. Receipt rows require exact physical route and current intake date. */
export function aggregateDispositionTrials({ sheets, intakeRows, targetDate }) {
  check(trialDate(targetDate) === targetDate, 'TARGET_DATE_INVALID');
  const intake = buildTrialIntakeIndex(intakeRows);
  const seen = new Set();
  const aggregates = Object.fromEntries(TEAM_IDS.map(team => [team, { today: 0 }]));
  const dailyReceipt = { receiptRows: 0, eligibleRows: 0, excludedRows: 0, pendingRows: 0, manualRows: 0, crossOwnerRows: 0 };
  for (const sheet of sheets) {
    check(TEAM_IDS.includes(sheet.owner) && Number.isSafeInteger(sheet.headerRow) && sheet.headerRow > 0 && Array.isArray(sheet.dateColumn) && Array.isArray(sheet.noteColumn), 'SOURCE_SCHEMA_INVALID');
    for (let i = sheet.headerRow; i < Math.max(sheet.dateColumn.length, sheet.noteColumn.length); i++) {
      const value = sheet.dateColumn[i];
      const receipt = trialReceiptFromNote(sheet.noteColumn[i]);
      const date = trialDate(value);
      if (!receipt) {
        if (date) { dailyReceipt.manualRows++; if (date === targetDate) aggregates[sheet.owner].today++; }
        continue;
      }
      check(!seen.has(receipt), 'SOURCE_RECEIPT_NOT_UNIQUE');
      seen.add(receipt);
      dailyReceipt.receiptRows++;
      const record = intake.get(receipt);
      check(record?.form, 'SOURCE_RECEIPT_UNRESOLVED');
      const { row, disposition } = record;
      const team = text(row[4]);
      check(TEAM_IDS.includes(team), 'TEAM_INVALID');
      check(normaliseTrialRoute(row[6]) === sheet.spreadsheetId && normaliseTrialRoute(row[7]) === normaliseTrialRoute(sheet.title), 'ROUTE_MISMATCH');
      if (team !== sheet.owner) dailyReceipt.crossOwnerRows++;
      if (disposition) { dailyReceipt[disposition === 'HOLD_UNDATED' ? 'pendingRows' : 'excludedRows']++; continue; }
      check(text(row[23]) === '反映済', 'WORKFLOW_UNRESOLVED');
      check(date && date === trialDate(row[14]), 'SOURCE_DATE_MISMATCH');
      dailyReceipt.eligibleRows++;
      if (date === targetDate) aggregates[team].today++;
    }
  }
  return { aggregates, dailyReceipt };
}

const INTAKE_COLUMNS = [['A', 0, '受付ID'], ['E', 4, 'チーム'], ['G', 6, '体験管理ファイルID'], ['H', 7, '会場タブ'], ['L', 11, 'メッセージ種別'], ['M', 12, '抽出方法'], ['O', 14, '体験日'], ['X', 23, '会場反映状態'], ['AI', 34, 'エラー・備考']];
const EXPERIENCE_COLUMNS = [['A', 0, '突合ID'], ['B', 1, '体験日'], ['D', 3, 'チーム'], ['R', 17, '備考'], ['S', 18, 'LINE受付ID']];
const INTAKE_TITLE = '14_LINE体験受付';
const EXPERIENCE_TITLE = '09_体験入会突合';
const batchUrl = (id, ranges, mode = 'UNFORMATTED_VALUE', dimension = 'COLUMNS') => {
  const params = new URLSearchParams({ valueRenderOption: mode, majorDimension: dimension, dateTimeRenderOption: 'SERIAL_NUMBER' });
  ranges.forEach(range => params.append('ranges', range));
  return `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}/values:batchGet?${params}`;
};
function sparseRows(valueRanges, columns) {
  check(valueRanges.length === columns.length, 'SOURCE_INCOMPLETE');
  const vectors = valueRanges.map((range, i) => {
    const vector = range?.values?.[0] || [];
    check(Array.isArray(vector) && (columns[i][2] ? text(vector[0]).trim() === columns[i][2] : !empty(vector[0])), 'HEADER_INVALID');
    return vector;
  });
  return Array.from({ length: Math.max(...vectors.map(column => column.length)) - 1 }, (_, offset) => {
    const row = [];
    columns.forEach(([, index], i) => { row[index] = vectors[i][offset + 1] ?? ''; });
    return row;
  });
}

/** Resolve the canonical master through the existing private link, never a public hardcoded ID. */
export async function captureTrialDispositionSource({ spreadsheetId, token, requestJson }) {
  check(spreadsheetId, 'SOURCE_LINK_MISSING');
  const linkUrl = batchUrl(spreadsheetId, ["'98_会員マスター連携'!A4"], 'FORMULA', 'ROWS');
  const link = await requestJson(linkUrl, token);
  const formula = link.valueRanges?.[0]?.values?.[0]?.[0];
  const match = typeof formula === 'string' && formula.match(/^=IMPORTRANGE\("https:\/\/docs\.google\.com\/spreadsheets\/d\/([A-Za-z0-9_-]+)\/edit"\s*,\s*"'12_Savant連携'!A4:AE9"\)$/i);
  check(match, 'SOURCE_LINK_INVALID');
  const masterId = match[1];
  const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(masterId)}?fields=sheets(properties(title,gridProperties))`;
  const metadata = await requestJson(metadataUrl, token);
  const specs = [[INTAKE_TITLE, INTAKE_COLUMNS], [EXPERIENCE_TITLE, EXPERIENCE_COLUMNS]];
  const ranges = specs.flatMap(([title, columns]) => {
    const candidates = metadata.sheets?.filter(sheet => sheet.properties?.title === title) || [];
    const grid = candidates[0]?.properties?.gridProperties;
    check(candidates.length === 1 && Number.isSafeInteger(grid?.rowCount) && grid.rowCount >= 5 && grid.rowCount <= 50_000 && grid.columnCount >= columns.at(-1)[1] + 1, 'SOURCE_GRID_INVALID');
    return columns.map(([column]) => `'${title}'!${column}4:${column}${grid.rowCount}`);
  });
  const url = batchUrl(masterId, ranges);
  const capture = async () => {
    const raw = await requestJson(url, token);
    check(raw.valueRanges?.length === ranges.length, 'SOURCE_INCOMPLETE');
    return { intakeRows: sparseRows(raw.valueRanges.slice(0, INTAKE_COLUMNS.length), INTAKE_COLUMNS),
      experienceRows: sparseRows(raw.valueRanges.slice(INTAKE_COLUMNS.length), EXPERIENCE_COLUMNS) };
  };
  const initial = await capture();
  const quality = assertTrialAnalyticsQuality(buildTrialAnalyticsQuality(initial.intakeRows, initial.experienceRows));
  return { ...initial, quality, readback: async () => {
    check(JSON.stringify(await capture()) === JSON.stringify(initial), 'SOURCE_CHANGED_DURING_READ');
    check(JSON.stringify(await requestJson(metadataUrl, token)) === JSON.stringify(metadata), 'SOURCE_CHANGED_DURING_READ');
    check(JSON.stringify(await requestJson(linkUrl, token)) === JSON.stringify(link), 'SOURCE_LINK_CHANGED_DURING_READ');
  } };
}
