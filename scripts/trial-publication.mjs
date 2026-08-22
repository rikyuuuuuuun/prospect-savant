import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const TEAM_IDS = ['A', 'B', 'C', 'D'];
const TODAY_STATUSES = new Set(['ok', 'unavailable']);
const ANNUAL_STATUSES = new Set(['ok', 'unavailable']);

export const TRIAL_DATA_FILE = 'trial-data.js';
export const TRIAL_MANIFEST_FILE = 'trial-manifest.json';

const PRIVATE_PATTERNS = [
  [/https?:\/\//i, 'URL'],
  [/(?:spreadsheet|sheet)[_-]?id/i, 'spreadsheet identifier field'],
  [/(?:venue|facility|会場|施設|氏名|名前)/i, 'private label'],
  [/\bPERS-\d+\b/i, 'internal person identifier'],
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function exact(value, keys, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  assert(actual.length === expected.length && actual.every((key, index) => key === expected[index]), `${label} has unexpected fields`);
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function nonNegativeInteger(value, label) {
  assert(Number.isSafeInteger(value) && value >= 0, `${label} must be a non-negative integer`);
}

export function gitBlobSha(content) {
  const bytes = Buffer.from(content.replace(/\r\n/g, '\n'), 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

export function parseFrozenJson(source, label) {
  const marker = 'Object.freeze(';
  const start = source.indexOf(marker);
  const end = source.lastIndexOf(');');
  assert(start >= 0 && end > start, `${label}: Object.freeze JSON payload not found`);
  return JSON.parse(source.slice(start + marker.length, end));
}

function validateCounts(teams, label) {
  exact(teams, TEAM_IDS, label);
  for (const id of TEAM_IDS) nonNegativeInteger(teams[id], `${label}.${id}`);
}

function validateAnnualTeams(teams) {
  exact(teams, TEAM_IDS, 'annual.teams');
  for (const id of TEAM_IDS) {
    exact(teams[id], ['admissions', 'trials'], `annual.teams.${id}`);
    nonNegativeInteger(teams[id].admissions, `annual.teams.${id}.admissions`);
    nonNegativeInteger(teams[id].trials, `annual.teams.${id}.trials`);
    assert(teams[id].admissions <= teams[id].trials, `annual.teams.${id}: admissions exceed trials`);
  }
}

export function validatePrivateTrialInput(input) {
  exact(input, ['annual', 'snapshot', 'timezone', 'today'], 'input');
  exact(input.snapshot, ['asOf', 'id'], 'snapshot');
  assert(isIsoDate(input.snapshot.asOf), 'snapshot.asOf must be a valid YYYY-MM-DD');
  assert(typeof input.snapshot.id === 'string' && /^\d{4}-\d{2}-\d{2}-trial-\d{3}$/.test(input.snapshot.id), 'snapshot.id is invalid');
  assert(input.timezone === 'Asia/Tokyo', 'timezone must be Asia/Tokyo');

  exact(input.today, ['date', 'status', 'teams'], 'today');
  assert(isIsoDate(input.today.date), 'today.date must be a valid YYYY-MM-DD');
  assert(input.today.date === input.snapshot.asOf, 'today.date must equal snapshot.asOf');
  assert(TODAY_STATUSES.has(input.today.status), 'today.status is invalid');
  if (input.today.status === 'ok') validateCounts(input.today.teams, 'today.teams');
  else assert(input.today.teams === null, 'today.teams must be null when unavailable');

  exact(input.annual, ['fiscalYear', 'status', 'teams'], 'annual');
  assert(/^\d{4}$/.test(input.annual.fiscalYear || ''), 'annual.fiscalYear is invalid');
  assert(ANNUAL_STATUSES.has(input.annual.status), 'annual.status is invalid');
  if (input.annual.status === 'ok') validateAnnualTeams(input.annual.teams);
  else assert(input.annual.teams === null, 'annual.teams must be null when unavailable');
}

function publicTrialData(input) {
  const today = input.today.status === 'ok'
    ? { status: 'ok', date: input.today.date, total: TEAM_IDS.reduce((sum, id) => sum + input.today.teams[id], 0), teams: input.today.teams }
    : { status: 'unavailable', date: input.today.date, total: null, teams: null };
  return {
    schemaVersion: 1,
    snapshotId: input.snapshot.id,
    timezone: input.timezone,
    sourceKind: 'private-sheets-readonly-anonymous-aggregate-v2',
    today,
    annual: input.annual.status === 'ok'
      ? { status: 'ok', fiscalYear: input.annual.fiscalYear, teams: input.annual.teams }
      : { status: 'unavailable', fiscalYear: input.annual.fiscalYear, teams: null },
  };
}

function annualRate(entry) {
  return Math.round(entry.admissions * 1000 / entry.trials) / 10;
}

async function validateAnnualRates(rootDir, annual) {
  if (annual.status !== 'ok') return;
  const data = parseFrozenJson(await readFile(resolve(rootDir, 'data.js'), 'utf8'), 'data.js');
  const teams = new Map((data.teams || []).map((team) => [team.id, team]));
  for (const id of TEAM_IDS) {
    const expected = annualRate(annual.teams[id]);
    assert(teams.get(id)?.benchmark?.admissionRate === expected,
      `annual.teams.${id}: admission rate does not match data.js`);
  }
}

export async function publishTrialData({ rootDir = process.cwd(), input }) {
  validatePrivateTrialInput(input);
  await validateAnnualRates(rootDir, input.annual);
  const data = publicTrialData(input);
  const source = `window.PROSPECT_TRIAL_DATA = Object.freeze(${JSON.stringify(data, null, 2)});\n`;
  const manifest = {
    schemaVersion: 1,
    snapshotId: data.snapshotId,
    file: TRIAL_DATA_FILE,
    sha1: gitBlobSha(source),
  };
  await writeFile(resolve(rootDir, TRIAL_DATA_FILE), source, 'utf8');
  await writeFile(resolve(rootDir, TRIAL_MANIFEST_FILE), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return { snapshotId: data.snapshotId, todayStatus: data.today.status, annualStatus: data.annual.status };
}

export async function validatePublishedTrialData(rootDir = process.cwd()) {
  const source = await readFile(resolve(rootDir, TRIAL_DATA_FILE), 'utf8');
  const manifest = JSON.parse(await readFile(resolve(rootDir, TRIAL_MANIFEST_FILE), 'utf8'));
  const data = parseFrozenJson(source, TRIAL_DATA_FILE);
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  add(manifest.schemaVersion === 1, 'trial manifest schemaVersion must be 1');
  add(manifest.file === TRIAL_DATA_FILE, 'trial manifest file must be trial-data.js');
  add(manifest.sha1 === gitBlobSha(source), 'trial-data.js: manifest blob hash mismatch');
  add(manifest.snapshotId === data.snapshotId, 'trial-data.js: snapshotId must match manifest');
  for (const [pattern, label] of PRIVATE_PATTERNS) add(!pattern.test(source), `trial-data.js: prohibited ${label}`);
  try {
    exact(data, ['annual', 'schemaVersion', 'snapshotId', 'sourceKind', 'today', 'timezone'], 'public trial data');
    add(data.schemaVersion === 1, 'trial-data.js schemaVersion must be 1');
    add(data.timezone === 'Asia/Tokyo', 'trial-data.js timezone must be Asia/Tokyo');
    add(['private-team-trial-sheet-aggregate-v1', 'private-sheets-readonly-anonymous-aggregate-v2'].includes(data.sourceKind), 'trial-data.js sourceKind is invalid');
    exact(data.today, ['date', 'status', 'teams', 'total'], 'public today');
    add(isIsoDate(data.today.date), 'trial-data.js today.date must be a valid YYYY-MM-DD');
    if (data.today.status === 'ok') {
      validateCounts(data.today.teams, 'public today.teams');
      add(data.today.total === TEAM_IDS.reduce((sum, id) => sum + data.today.teams[id], 0), 'trial-data.js today total must equal the team sum');
    } else add(data.today.status === 'unavailable' && data.today.teams === null && data.today.total === null, 'trial-data.js unavailable today must not contain counts');
    exact(data.annual, ['fiscalYear', 'status', 'teams'], 'public annual');
    if (data.annual.status === 'ok') {
      validateAnnualTeams(data.annual.teams);
      await validateAnnualRates(rootDir, data.annual);
    } else add(data.annual.status === 'unavailable' && data.annual.teams === null, 'trial-data.js unavailable annual must not contain counts');
  } catch (error) { errors.push(error.message); }
  return { ok: errors.length === 0, snapshotId: data.snapshotId, errors };
}
