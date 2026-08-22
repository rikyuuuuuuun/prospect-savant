const TEAM_IDS = Object.freeze(['A', 'B', 'C', 'D']);
const DATE_HEADERS = new Set(['体験予約日', '体験日']);
const ATTENDANCE_HEADERS = new Set(['出席確認', '出席、フォーム確認']);

export { TEAM_IDS };

export function normalise(value) {
  return String(value ?? '').normalize('NFKC').replace(/\s+/g, '').trim();
}

export function tokyoDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function fiscalYearFor(date) {
  const [year, month] = date.split('-').map(Number);
  return String(month >= 4 ? year : year - 1);
}

export function serialToIsoDate(value) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (typeof value === 'string') {
    const match = value.trim().match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
    if (match) return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
  }
  if (!Number.isFinite(value)) return null;
  const date = new Date(Date.UTC(1899, 11, 30) + Math.floor(value) * 86_400_000);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString().slice(0, 10);
}

export function discoverTrialSchema(dateHeaderValues, candidateHeaderValues) {
  const dates = Array.from({ length: dateHeaderValues?.length || 0 }, (_, index) => dateHeaderValues[index]?.[0]);
  for (let row = 0; row < dates.length; row += 1) {
    if (!DATE_HEADERS.has(normalise(dates[row]))) continue;
    const values = candidateHeaderValues?.[row] || [];
    const attendanceIndex = values.findIndex((value) => ATTENDANCE_HEADERS.has(normalise(value)));
    const admissionIndex = values.findIndex((value) => normalise(value) === '入会');
    if (attendanceIndex >= 0 && admissionIndex >= 0) {
      return { headerRow: row + 1, attendanceColumn: String.fromCharCode('E'.charCodeAt(0) + attendanceIndex), admissionColumn: String.fromCharCode('E'.charCodeAt(0) + admissionIndex) };
    }
  }
  throw new Error('SOURCE_SCHEMA_INVALID');
}

/** 入力は日付列だけ。ヘッダー検証は取得時に完了しており、個人情報列は受け取らない。 */
export function aggregateTeam({ sheets, targetDate }) {
  let today = 0;
  let recognisedSheets = 0;
  for (const sheet of sheets) {
    if (!Array.isArray(sheet.dateColumn) || !Number.isSafeInteger(sheet.headerRow) || sheet.headerRow < 1) continue;
    const dates = sheet.dateColumn;
    recognisedSheets += 1;
    for (let index = sheet.headerRow; index < dates.length; index += 1) {
      const date = serialToIsoDate(dates[index]);
      if (!date) continue;
      if (date === targetDate) today += 1;
    }
  }
  if (!recognisedSheets) throw new Error('SOURCE_SCHEMA_INVALID');
  return { today };
}

export function parseSheetIds(secret) {
  let ids;
  try { ids = JSON.parse(secret); } catch { throw new Error('TRIAL_SHEET_IDS_SECRET_INVALID'); }
  if (!ids || typeof ids !== 'object' || Array.isArray(ids) || Object.keys(ids).length !== TEAM_IDS.length) throw new Error('TRIAL_SHEET_IDS_SECRET_INVALID');
  for (const team of TEAM_IDS) if (typeof ids[team] !== 'string' || !ids[team].trim()) throw new Error('TRIAL_SHEET_IDS_SECRET_INVALID');
  return ids;
}

export function trialPublicInput({ aggregates, annualTeams, targetDate, fiscalYear }) {
  const teams = Object.fromEntries(TEAM_IDS.map((team) => [team, aggregates[team].today]));
  const annual = Object.fromEntries(TEAM_IDS.map((team) => [team, {
    admissions: annualTeams[team].admissions,
    trials: annualTeams[team].trials,
  }]));
  return {
    snapshot: { asOf: targetDate, id: `${targetDate}-trial-001` },
    timezone: 'Asia/Tokyo',
    today: { status: 'ok', date: targetDate, teams },
    annual: { status: 'ok', fiscalYear, teams: annual },
  };
}
