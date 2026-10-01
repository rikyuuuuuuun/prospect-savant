import { createHash } from 'node:crypto';
import { buildTrialAnalyticsQuality } from '../../scripts/trial-analytics-disposition.mjs';
export const serial = date => (Date.parse(date) - Date.UTC(1899, 11, 30)) / 86400000;
export function intakeRow(id = 'FORM-synthetic-1', { team = 'A', book = 'a', title = '予約', date = '2026-08-22', status = '反映済', disposition = '' } = {}) {
  const row = [];
  Object.assign(row, { 0: id, 4: team, 6: book, 7: title, 11: '体験申込', 12: 'フォーム', 14: date ? serial(date) : '', 23: status,
    34: disposition ? `[PROSPECT_ANALYTICS_DISPOSITION_V1:${disposition}:${id}]` : '' });
  return row;
}
export function experienceRow(row) {
  const match = [];
  Object.assign(match, { 0: `EXP-LINE-${createHash('sha256').update(row[0]).digest('hex').slice(0,16)}`, 1: row[14], 3: row[4], 17: `LINE受付ID=${row[0]}`, 18: row[0] });
  return match;
}
export const syntheticTrialQuality = () => buildTrialAnalyticsQuality([], []);
export const centralTrialHeaders = {
  intake: [[0,'受付ID'],[4,'チーム'],[6,'体験管理ファイルID'],[7,'会場タブ'],[11,'メッセージ種別'],[12,'抽出方法'],[14,'体験日'],[23,'会場反映状態'],[34,'エラー・備考']],
  experience: [[0,'突合ID'],[1,'体験日'],[3,'チーム'],[17,'備考'],[18,'LINE受付ID']],
};
export function centralTrialValueRanges(intakeRows = [], experienceRows = []) {
  return Object.entries(centralTrialHeaders).flatMap(([key, columns]) => columns.map(([index, header]) => ({ values: [[header, ...(key === 'intake' ? intakeRows : experienceRows).map(row => row[index] ?? '')]] })));
}
export function gridTrialResponse(dates = ['体験予約日', serial('2026-08-22'), serial('2026-08-21')], notes = [], title = '予約') {
  return { sheets: [{ properties: { title }, data: [{ startRow: 0, startColumn: 0, rowData: dates.map((value, i) => ({ values: [{
    effectiveValue: typeof value === 'number' ? { numberValue: value } : { stringValue: value || '' }, ...(notes[i] ? { note: notes[i] } : {}),
  }] })) }] }] };
}
