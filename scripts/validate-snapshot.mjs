import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const REQUIRED_FILES = [
  'data.js',
  'event-data.js',
  'retention-data.js',
  'school-age-data.js',
];

const PRIVATE_PATTERNS = [
  [/https:\/\/(?:docs|drive)\.google\.com/i, 'Google Workspace URL'],
  [/https:\/\/script\.google\.com/i, 'Apps Script URL'],
  [/\.workers\.dev\b/i, 'Worker URL'],
  [/\bAKfycb[\w-]+/i, 'Apps Script deployment ID'],
  [/\bAIza[\w-]+/i, 'Google API key'],
  [/Prospect(?:会員|人物)ID/i, 'internal person/member ID label'],
  [/LINE_(?:CHANNEL_)?SECRET/i, 'secret binding name'],
];

function gitBlobSha(content) {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1')
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest('hex');
}

function parseFrozenJson(source, label) {
  const marker = 'Object.freeze(';
  const start = source.indexOf(marker);
  const end = source.lastIndexOf(');');
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`${label}: Object.freeze JSON payload not found`);
  }
  return JSON.parse(source.slice(start + marker.length, end));
}

function add(errors, condition, message) {
  if (!condition) errors.push(message);
}

export async function validateSnapshot(rootDir = process.cwd()) {
  const errors = [];
  const manifestPath = resolve(rootDir, 'snapshot-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

  add(errors, manifest.schemaVersion === 1, 'manifest schemaVersion must be 1');
  add(errors, /^\d{4}-\d{2}-\d{2}$/.test(manifest.asOf || ''), 'manifest asOf must be YYYY-MM-DD');
  add(errors, Boolean(manifest.snapshotId), 'manifest snapshotId is required');
  add(errors, Boolean(manifest.scoreVersion), 'manifest scoreVersion is required');

  const sources = {};
  for (const file of REQUIRED_FILES) {
    const content = await readFile(resolve(rootDir, file), 'utf8');
    sources[file] = content;
    add(errors, manifest.files?.[file] === gitBlobSha(content), `${file}: manifest blob hash mismatch`);
    for (const [pattern, label] of PRIVATE_PATTERNS) {
      add(errors, !pattern.test(content), `${file}: prohibited ${label}`);
    }
  }

  add(errors, Object.keys(manifest.files || {}).length === REQUIRED_FILES.length,
    'manifest must list exactly the four public data files');

  const data = parseFrozenJson(sources['data.js'], 'data.js');
  const events = parseFrozenJson(sources['event-data.js'], 'event-data.js');

  add(errors, data.asOf === manifest.asOf, 'data.js asOf must match manifest');
  add(errors, data.scoreVersion === manifest.scoreVersion, 'data.js scoreVersion must match manifest');
  add(errors, events.scoringVersion === manifest.scoreVersion, 'event-data.js scoringVersion must match manifest');

  const teamIds = ['A', 'B', 'C', 'D'];
  const dataTeams = new Map((data.teams || []).map((team) => [team.id, team]));
  for (const teamId of teamIds) {
    add(errors, dataTeams.has(teamId), `data.js missing team ${teamId}`);
    add(errors, Boolean(events.teams?.[teamId]), `event-data.js missing team ${teamId}`);
    if (dataTeams.has(teamId) && events.teams?.[teamId]) {
      add(errors, dataTeams.get(teamId).metrics?.event === events.teams[teamId].score,
        `team ${teamId}: event score differs between data.js and event-data.js`);
    }
  }

  add(errors,
    events.events?.length === manifest.invariants?.expectedEligibleEventCount,
    `eligible event count must be ${manifest.invariants?.expectedEligibleEventCount}`);

  const excluded = new RegExp(manifest.invariants?.excludedEventNamePattern || '大会.*練習');
  for (const event of events.events || []) {
    add(errors, !excluded.test(event.name || ''), `excluded event leaked into public events: ${event.id}`);
    const participants = teamIds.reduce((sum, id) => sum + (event.teams?.[id]?.participants || 0), 0);
    const unassigned = event.total?.unassignedParticipants || 0;
    add(errors, participants + unassigned === event.total?.participants,
      `${event.id}: team participants do not reconcile to total`);
  }

  for (const upcoming of events.upcomingEvents || []) {
    add(errors, upcoming.status === 'provisional', `${upcoming.id}: upcoming status must be provisional`);
    add(errors, upcoming.aggregate === false, `${upcoming.id}: upcoming aggregate must be false`);
  }

  const event2024 = (events.events || []).find((event) => event.id === 'EV-2024-SUMMER');
  add(errors, Boolean(event2024), 'EV-2024-SUMMER is required for historical continuity');
  if (event2024) {
    const d = event2024.teams?.D;
    add(errors, d?.eligible === false, 'D must be ineligible for EV-2024-SUMMER');
    add(errors, d?.participants === null && d?.members === null && d?.rate === null,
      'D pre-launch values must be null for EV-2024-SUMMER');
  }

  return {
    ok: errors.length === 0,
    snapshotId: manifest.snapshotId,
    asOf: manifest.asOf,
    scoreVersion: manifest.scoreVersion,
    checkedFiles: REQUIRED_FILES,
    errors,
  };
}

async function main() {
  const root = process.argv[2] ? resolve(process.argv[2]) : process.cwd();
  const result = await validateSnapshot(root);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}

