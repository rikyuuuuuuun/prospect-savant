import { buildOperationalRoster } from './operational-member-roster.mjs';
import { serialToIsoDate, fiscalYearFor } from './private-trial-aggregate.mjs';

export const COMPOSITION_DEFINITION = 'operational-member-composition-v1';
export const COMPOSITION_BUCKETS = Object.freeze({
  grade: ['preschool', 'k1', 'k2', 'k3', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'j1', 'j2', 'j3', 'h1', 'h2', 'h3', 'adult', 'unknown'],
  gender: ['male', 'female', 'other', 'unknown'],
  tenure: ['lt3', 'm3to6', 'm6to12', 'y1to2', 'y2to3', 'y3to5', 'y5plus', 'unknown'],
  age: ['lt5', 'a5to6', 'a7to9', 'a10to12', 'a13to15', 'a16plus', 'unknown'],
  status: ['active', 'paused', 'scheduled', 'unknown'],
});
const IDS = ['A', 'B', 'C', 'D'];
const ACTIVE = ['在籍', '休会', '退会予定'];
const fail = code => { throw new Error(`MEMBER_COMPOSITION_${code}`); };
const check = (ok, code) => { if (!ok) fail(code); };
const iso = value => {
  if (value === '' || value == null) return null;
  const result = serialToIsoDate(value);
  return typeof result === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(result) && Number.isFinite(Date.parse(result)) && new Date(result).toISOString().slice(0, 10) === result ? result : null;
};
export function completedMonths(start, end) {
  const [sy, sm, sd] = start.split('-').map(Number);
  const [ey, em, ed] = end.split('-').map(Number);
  // A month begun on the last day completes on the last day of a shorter month.
  return (ey - sy) * 12 + em - sm - (ed < Math.min(sd, new Date(Date.UTC(ey, em, 0)).getUTCDate()) ? 1 : 0);
}
export function schoolGrade(birthday, asOf) {
  if (!birthday || birthday > asOf) return 'unknown';
  const grade = Number(fiscalYearFor(asOf)) - Number(birthday.slice(0, 4)) - 6 + (birthday.slice(5) <= '04-01' ? 1 : 0);
  if (grade < -2) return 'preschool';
  if (grade <= 0) return `k${grade + 3}`;
  if (grade <= 6) return `p${grade}`;
  if (grade <= 9) return `j${grade - 6}`;
  if (grade <= 12) return `h${grade - 9}`;
  return 'adult';
}
const uniqueValue = values => {
  const known = [...new Set(values.filter(value => value != null && value !== ''))];
  return known.length === 1 ? known[0] : null;
};
const gender = value => {
  const text = String(value ?? '').trim().toLowerCase();
  if (['男', '男性', '男児', 'male', 'm'].includes(text)) return 'male';
  if (['女', '女性', '女児', 'female', 'f'].includes(text)) return 'female';
  return ['その他', 'other'].includes(text) ? 'other' : null;
};

function aggregate(members, asOf) {
  const result = { members: members.length, ...Object.fromEntries(Object.entries(COMPOSITION_BUCKETS).map(([key, buckets]) => [key, Object.fromEntries(buckets.map(bucket => [bucket, 0]))])), entryYear: {} };
  const months = [];
  for (const member of members) {
    const age = member.birthday ? completedMonths(member.birthday, asOf) / 12 : null;
    result.grade[schoolGrade(member.birthday, asOf)]++;
    result.gender[member.gender || 'unknown']++;
    result.age[age == null ? 'unknown' : age < 5 ? 'lt5' : age < 7 ? 'a5to6' : age < 10 ? 'a7to9' : age < 13 ? 'a10to12' : age < 16 ? 'a13to15' : 'a16plus']++;
    result.status[member.status || 'unknown']++;
    const duration = member.joinedAt ? completedMonths(member.joinedAt, asOf) : null;
    result.tenure[duration == null ? 'unknown' : duration < 3 ? 'lt3' : duration < 6 ? 'm3to6' : duration < 12 ? 'm6to12' : duration < 24 ? 'y1to2' : duration < 36 ? 'y2to3' : duration < 60 ? 'y3to5' : 'y5plus']++;
    if (duration != null) months.push(duration);
    const year = member.joinedAt ? fiscalYearFor(member.joinedAt) : 'unknown';
    result.entryYear[year] = (result.entryYear[year] || 0) + 1;
  }
  months.sort((a, b) => a - b);
  result.summary = { knownTenure: months.length, tenureMonthsTotal: months.reduce((a, b) => a + b, 0), meanTenureMonths: months.length ? Number((months.reduce((a, b) => a + b, 0) / months.length).toFixed(1)) : null,
    medianTenureMonths: months.length ? (months[Math.floor((months.length - 1) / 2)] + months[Math.floor(months.length / 2)]) / 2 : null };
  return result;
}

// Input stays private. Only whitelisted aggregate fields leave this function.
export function buildMemberComposition({ records, settings, asOf, expectedCounts }) {
  check(iso(asOf) === asOf, 'ASOF_INVALID');
  const grouped = new Map();
  for (const record of records) {
    if (!IDS.includes(record.team) || !ACTIVE.includes(record.status)) continue;
    check(record.id && record.person, 'KEY_MISSING');
    if (!grouped.has(record.person)) grouped.set(record.person, []);
    grouped.get(record.person).push(record);
  }
  const eligible = [...grouped].flatMap(([personKey, rows]) => rows.map(row => ({ personKey, team: row.team, status: row.status })));
  const overrides = settings.filter(row => row.type === 'TEAM_OVERRIDE' && row.approved && row.active && new Set(grouped.get(row.person)?.map(member => member.team)).size > 1)
    .map(row => ({ personKey: row.person, effectiveTeam: row.team, approved: true, active: true }));
  const exceptions = settings.filter(row => row.type === 'EXCEPTION' && row.approved && row.active)
    .map(row => ({ personKey: row.person, team: row.team, approved: true, active: true }));
  let roster;
  try { roster = buildOperationalRoster({ records: eligible, teamOverrides: overrides, exceptions }).roster; }
  catch { fail('ROSTER_UNRESOLVED'); }
  const people = roster.map(member => {
    const rows = grouped.get(member.personKey) || [];
    const birthday = uniqueValue(rows.map(row => iso(row.birthday)).filter(value => value && value <= asOf && value >= `${Number(asOf.slice(0, 4)) - 110}-01-01`));
    const joinedAt = rows.map(row => iso(row.joinedAt)).filter(value => value && value <= asOf && value >= '1900-01-01').sort()[0] || null;
    const states = rows.filter(row => row.team === member.team).map(row => row.status);
    // Multiple current contracts may have different states: an active contract wins.
    const state = states.includes('在籍') ? 'active' : states.includes('退会予定') ? 'scheduled' : states.includes('休会') ? 'paused' : 'unknown';
    return { team: member.team, birthday, joinedAt, gender: uniqueValue(rows.map(row => gender(row.gender))), status: state };
  });
  const composition = { definition: COMPOSITION_DEFINITION, memberDefinition: 'operational-person-v1', asOf, status: 'ok', overall: aggregate(people, asOf), teams: Object.fromEntries(IDS.map(id => [id, aggregate(people.filter(person => person.team === id), asOf)])) };
  validateMemberComposition(composition, { asOf, memberDefinition: { id: 'operational-person-v1' }, headline: { members: Object.values(expectedCounts).reduce((a, b) => a + b, 0) }, teams: IDS.map(id => ({ id, members: expectedCounts[id] })) });
  return composition;
}

export function unavailableComposition(asOf, reason = 'SOURCE_UNAVAILABLE') {
  return { definition: COMPOSITION_DEFINITION, memberDefinition: 'operational-person-v1', asOf, status: 'unavailable', reason, overall: null, teams: null };
}
export function validateMemberComposition(value, data) {
  const exact = (object, keys) => check(object && !Array.isArray(object) && Object.keys(object).sort().join() === [...keys].sort().join(), 'FIELDS_INVALID');
  exact(value, ['definition', 'memberDefinition', 'asOf', 'status', 'overall', 'teams', ...(value?.status === 'unavailable' ? ['reason'] : [])]);
  check(value.definition === COMPOSITION_DEFINITION && value.memberDefinition === data.memberDefinition?.id && value.asOf === data.asOf && iso(value.asOf) === value.asOf, 'DEFINITION_OR_DATE_INVALID');
  if (value.status === 'unavailable') {
    check(value.overall === null && value.teams === null && ['SOURCE_UNAVAILABLE', 'SOURCE_CHANGED', 'ROSTER_UNRESOLVED', 'COUNT_MISMATCH', 'SCHEMA_INVALID'].includes(value.reason), 'UNAVAILABLE_INVALID');
    return value;
  }
  check(value.status === 'ok', 'STATUS_INVALID');
  exact(value.teams, IDS);
  for (const [id, row] of [['ALL', value.overall], ...Object.entries(value.teams)]) {
    exact(row, ['members', ...Object.keys(COMPOSITION_BUCKETS), 'entryYear', 'summary']);
    check(Number.isSafeInteger(row.members) && row.members >= 0 && row.members === (id === 'ALL' ? data.headline.members : data.teams.find(team => team.id === id)?.members), 'COUNT_MISMATCH');
    for (const [key, buckets] of Object.entries(COMPOSITION_BUCKETS)) exact(row[key], buckets);
    check(row.entryYear && Object.keys(row.entryYear).every(year => year === 'unknown' || (/^(19|20)\d{2}$/.test(year) && Number(year) <= Number(fiscalYearFor(value.asOf)))) , 'YEAR_INVALID');
    for (const buckets of [...Object.keys(COMPOSITION_BUCKETS), 'entryYear']) {
      const counts = Object.values(row[buckets]);
      check(counts.every(count => Number.isSafeInteger(count) && count >= 0) && counts.reduce((a, b) => a + b, 0) === row.members, 'TOTAL_MISMATCH');
    }
    exact(row.summary, ['knownTenure', 'tenureMonthsTotal', 'meanTenureMonths', 'medianTenureMonths']);
    const summary = row.summary;
    check(summary.knownTenure === row.members - row.tenure.unknown && Number.isSafeInteger(summary.tenureMonthsTotal) && summary.tenureMonthsTotal >= 0, 'SUMMARY_INVALID');
    check(summary.knownTenure ? summary.meanTenureMonths === Number((summary.tenureMonthsTotal / summary.knownTenure).toFixed(1)) && Number.isFinite(summary.medianTenureMonths) && summary.medianTenureMonths >= 0 && summary.medianTenureMonths <= summary.tenureMonthsTotal : summary.meanTenureMonths === null && summary.medianTenureMonths === null && summary.tenureMonthsTotal === 0, 'SUMMARY_INVALID');
  }
  for (const key of [...Object.keys(COMPOSITION_BUCKETS), 'entryYear']) {
    const buckets = new Set([ ...Object.keys(value.overall[key]), ...IDS.flatMap(id => Object.keys(value.teams[id][key])) ]);
    for (const bucket of buckets) check((value.overall[key][bucket] || 0) === IDS.reduce((sum, id) => sum + (value.teams[id][key][bucket] || 0), 0), 'TEAM_SUM_MISMATCH');
  }
  for (const key of ['knownTenure', 'tenureMonthsTotal']) check(value.overall.summary[key] === IDS.reduce((sum, id) => sum + value.teams[id].summary[key], 0), 'SUMMARY_TOTAL_MISMATCH');
  return value;
}

export function compositionInputFromRanges(ranges, asOf, expectedCounts) {
  check(ranges.length === 7, 'SCHEMA_INVALID');
  const [keys, states, demographics, joins, teams, persons, settings] = ranges.map(range => range.values || []);
  check(keys[0]?.[0] === 'Prospect会員ID' && states[0]?.[0] === '在籍状態' && demographics[0]?.[0] === '生年月日' && demographics[0]?.[2] === '性別' && joins[0]?.[0] === '入会日' && teams[0]?.[0] === '主チーム' && persons[0]?.[0] === 'Prospect人物ID' && settings[0]?.[0] === '種別' && settings[0]?.[7] === '現在有効', 'SCHEMA_INVALID');
  return { asOf, expectedCounts,
    records: keys.slice(1).flatMap((row, index) => !row[0] ? [] : [{ id: row[0], person: persons[index + 1]?.[0], status: states[index + 1]?.[0], team: teams[index + 1]?.[0], birthday: demographics[index + 1]?.[0], gender: demographics[index + 1]?.[2], joinedAt: joins[index + 1]?.[0] }]),
    settings: settings.slice(1).map(row => ({ type: row[0], person: row[1], team: row[3], approved: row[4] === true, active: row[7] === true })),
  };
}

export async function fetchMemberComposition({ spreadsheetId, token, asOf, expectedCounts, requestJson }) {
  const batch = (id, ranges, mode = 'UNFORMATTED_VALUE') => {
    const params = new URLSearchParams({ valueRenderOption: mode, dateTimeRenderOption: 'SERIAL_NUMBER' });
    ranges.forEach(range => params.append('ranges', range));
    return `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}/values:batchGet?${params}`;
  };
  const linkUrl = batch(spreadsheetId, ["'98_会員マスター連携'!A4"], 'FORMULA');
  const link = await requestJson(linkUrl, token);
  const formula = link.valueRanges?.[0]?.values?.[0]?.[0];
  const match = typeof formula === 'string' && formula.match(/^=IMPORTRANGE\("https:\/\/docs\.google\.com\/spreadsheets\/d\/([A-Za-z0-9_-]+)\/edit"\s*,\s*"'12_Savant連携'!A4:AE9"\)$/i);
  check(match, 'SCHEMA_INVALID');
  const id = match[1];
  const metadata = await requestJson(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}?fields=sheets(properties(title,gridProperties))`, token);
  const size = title => {
    const properties = metadata.sheets?.find(sheet => sheet.properties?.title === title)?.properties;
    check(Number.isSafeInteger(properties?.gridProperties?.rowCount) && properties.gridProperties.rowCount >= 5 && properties.gridProperties.rowCount <= 50000, 'SCHEMA_INVALID');
    return properties.gridProperties.rowCount;
  };
  const n = size('01_会員マスター'), s = size('97_Savant運用会員設定');
  const url = batch(id, ['A', 'F', 'I:K', 'P', 'T', 'AG'].map(column => { const [first, last = first] = column.split(':'); return `'01_会員マスター'!${first}4:${last}${n}`; }).concat(`'97_Savant運用会員設定'!A4:H${s}`));
  const capture = async () => (await requestJson(url, token)).valueRanges || [];
  const raw = await capture();
  const result = buildMemberComposition(compositionInputFromRanges(raw, asOf, expectedCounts));
  check(JSON.stringify(raw) === JSON.stringify(await capture()), 'SOURCE_CHANGED');
  check((await requestJson(linkUrl, token)).valueRanges?.[0]?.values?.[0]?.[0] === formula, 'SOURCE_CHANGED');
  return result;
}
