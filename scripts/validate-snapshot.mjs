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
  [/\bPERS-\d+\b/i, 'internal person identifier'],
  [/Prospect(?:会員|人物)ID/i, 'internal person/member ID label'],
  [/["']?(?:personKey|memberKey|prospectPersonId)["']?\s*:/i, 'person-key field'],
  [/LINE_(?:CHANNEL_)?SECRET/i, 'secret binding name'],
];

function gitBlobSha(content) {
  const bytes = Buffer.from(content.replace(/\r\n/g, '\n'), 'utf8');
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

function snapshotIdFromSource(source, label) {
  const match = source.match(/["']?snapshotId["']?\s*:\s*["']([^"']+)["']/);
  if (!match) throw new Error(`${label}: snapshotId not found`);
  return match[1];
}

function add(errors, condition, message) {
  if (!condition) errors.push(message);
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

export async function validateSnapshot(rootDir = process.cwd()) {
  const errors = [];
  const manifestPath = resolve(rootDir, 'snapshot-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

  add(errors, manifest.schemaVersion === 1, 'manifest schemaVersion must be 1');
  add(errors, isValidIsoDate(manifest.asOf), 'manifest asOf must be a valid YYYY-MM-DD');
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
  add(errors, data.snapshotId === manifest.snapshotId, 'data.js snapshotId must match manifest');
  add(errors, data.scoreVersion === manifest.scoreVersion, 'data.js scoreVersion must match manifest');
  add(errors, events.scoringVersion === manifest.scoreVersion, 'event-data.js scoringVersion must match manifest');
  if (events.memberDefinition !== undefined) {
    add(errors, events.memberDefinition?.id === data.memberDefinition?.id,
      'event-data.js memberDefinition must match data.js');
  }
  for (const file of REQUIRED_FILES.slice(1)) {
    add(errors, snapshotIdFromSource(sources[file], file) === manifest.snapshotId,
      `${file}: snapshotId must match manifest`);
  }

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
  const operationalMemberTotal = teamIds.reduce((sum, teamId) => sum + (dataTeams.get(teamId)?.members || 0), 0);
  add(errors, data.headline?.members === operationalMemberTotal,
    'headline members must equal the sum of team members');
  add(errors, data.teams?.length === teamIds.length && dataTeams.size === teamIds.length,
    'data.js must contain exactly teams A, B, C, D');
  const weights = new Map((data.weights || []).map((weight) => [weight.key, weight.value]));
  if (data.scoreVersion === 'v7-operational-member-denominator' && weights.size) {
    for (const team of data.teams || []) {
      const overall = [...weights].reduce((sum, [key, weight]) => sum + (team.metrics?.[key] || 0) * weight / 100, 0);
      add(errors, team.overall === Math.floor(overall), `team ${team.id}: overall must equal weighted metrics`);
    }
    const ranks = [...(data.teams || [])].sort((left, right) => right.overall - left.overall).map((team) => team.id);
    for (const [index, id] of ranks.entries()) add(errors, dataTeams.get(id)?.rank === index + 1, `team ${id}: rank must match overall`);
  }

  const comparison = data.comparison;
  if (comparison !== undefined && comparison !== null) {
    add(errors, typeof comparison.scoreVersion === 'string' && comparison.scoreVersion.length > 0,
      'comparison scoreVersion is required');
    add(errors, isValidIsoDate(comparison.previousAsOf), 'comparison previousAsOf must be a valid YYYY-MM-DD');
    add(errors, comparison.previousAsOf <= data.asOf, 'comparison must not be newer than current');
    add(errors, typeof comparison.previousAsOfLabel === 'string' && comparison.previousAsOfLabel.length > 0,
      'comparison previousAsOfLabel is required');
    add(errors, typeof comparison.memberDefinition?.id === 'string' && comparison.memberDefinition.id.length > 0,
      'comparison memberDefinition is required');
    add(errors, Number.isSafeInteger(comparison.headline?.members) && comparison.headline.members >= 0,
      'comparison headline members must be a non-negative integer');

    const comparisonTeams = new Map((comparison.teams || []).map((team) => [team.id, team]));
    add(errors, comparison.teams?.length === teamIds.length && comparisonTeams.size === teamIds.length && teamIds.every((teamId) => comparisonTeams.has(teamId)),
      'comparison must contain exactly teams A, B, C, D');
    const comparisonTotal = teamIds.reduce((sum, teamId) => sum + (comparisonTeams.get(teamId)?.members || 0), 0);
    add(errors, comparison.headline?.members === comparisonTotal,
      'comparison headline members must equal the sum of team members');

    const memberComparable = data.memberDefinition?.id === comparison.memberDefinition?.id;
    if (memberComparable && comparisonTeams.size === teamIds.length) {
      add(errors, Number.isSafeInteger(data.headline?.monthlyDelta),
        'headline monthlyDelta must be an integer');
      for (const teamId of teamIds) {
        const current = dataTeams.get(teamId);
        add(errors, Number.isSafeInteger(current?.monthlyDelta),
          `team ${teamId}: monthlyDelta must be an integer`);
      }
    } else {
      add(errors, data.headline?.monthlyDelta === null,
        'headline monthlyDelta must be null when member definitions differ');
      for (const teamId of teamIds) {
        add(errors, dataTeams.get(teamId)?.monthlyDelta === null,
          `team ${teamId}: monthlyDelta must be null when member definitions differ`);
      }
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
    if (events.scoringVersion === 'v7-operational-member-denominator') {
      const eligibleTeams = teamIds.filter((id) => event.teams?.[id]?.eligible !== false);
      const denominator = eligibleTeams.reduce((sum, id) => sum + (event.teams?.[id]?.members || 0), 0);
      add(errors, denominator === event.total?.members, `${event.id}: team denominators do not reconcile to total`);
      if (denominator > 0) add(errors, event.total?.rate === Number((event.total.participants / denominator * 100).toFixed(1)), `${event.id}: total rate must match denominator`);
      for (const id of eligibleTeams) {
        const team = event.teams[id];
        add(errors, Number.isSafeInteger(team?.members) && team.members > 0, `${event.id} ${id}: operational denominator is required`);
        add(errors, team?.participants <= team?.members, `${event.id} ${id}: participants exceed denominator`);
        add(errors, team?.rate === Number((team.participants / team.members * 100).toFixed(1)), `${event.id} ${id}: rate must match denominator`);
      }
    }
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
