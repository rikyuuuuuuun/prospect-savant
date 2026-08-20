import { createHash } from 'node:crypto';
import { buildOperationalRoster } from './operational-member-roster.mjs';

const TEAMS = ['A', 'B', 'C', 'D'];
const STATUSES = ['在籍', '退会予定', '休会', '退会', '削除'];
const INPUT_KEYS = new Set(['snapshot', 'records', 'teamOverrides', 'exceptions', 'approvalReceipt']);
export const MEMBER_DEFINITION = Object.freeze({ id: 'operational-person-v1', label: '人物単位運用会員' });

function exact(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  for (const key of Object.keys(value)) if (!keys.has(key)) throw new Error(`${label} contains unsupported field ${key}`);
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).sort().join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function digest(prefix, value) {
  return `${prefix}:${createHash('sha256').update(stableJson(value)).digest('hex')}`;
}

function receiptMap(entries, factory, label) {
  const result = {};
  for (const entry of entries) {
    const key = factory(entry);
    if (Object.hasOwn(result, key)) throw new Error(`approvalReceipt contains duplicate ${label} entry ${key}`);
    result[key] = entry.count;
  }
  return result;
}

function validateReceipt(input) {
  exact(input.approvalReceipt, new Set(['teamOverrides', 'exceptions']), 'approvalReceipt');
  const receipt = input.approvalReceipt;
  if (!Array.isArray(receipt.teamOverrides) || !Array.isArray(receipt.exceptions)) throw new Error('approvalReceipt must contain teamOverrides and exceptions arrays');
  const actualOverrides = {};
  const sourceTeamsByOverride = new Map();
  for (const override of input.teamOverrides || []) {
    const teams = [...new Set(input.records.filter((r) => r.personKey === override.personKey && ['在籍', '休会', '退会予定'].includes(r.status)).map((r) => r.team))].sort();
    const key = `${teams.join(',')}→${override.effectiveTeam}`;
    actualOverrides[key] = (actualOverrides[key] || 0) + 1;
    sourceTeamsByOverride.set(override.personKey, teams);
  }
  const actualExceptions = {};
  for (const exception of input.exceptions || []) actualExceptions[exception.team] = (actualExceptions[exception.team] || 0) + 1;
  const declaredOverrides = receiptMap(receipt.teamOverrides, (entry) => {
    exact(entry, new Set(['sourceTeams', 'effectiveTeam', 'count']), 'approvalReceipt teamOverrides entry');
    if (!Array.isArray(entry.sourceTeams) || entry.sourceTeams.some((team) => !TEAMS.includes(team)) || !TEAMS.includes(entry.effectiveTeam) || !Number.isInteger(entry.count) || entry.count < 1) throw new Error('approvalReceipt teamOverrides entry is invalid');
    return `${[...entry.sourceTeams].sort().join(',')}→${entry.effectiveTeam}`;
  }, 'teamOverrides');
  const declaredExceptions = receiptMap(receipt.exceptions, (entry) => {
    exact(entry, new Set(['team', 'count']), 'approvalReceipt exceptions entry');
    if (!TEAMS.includes(entry.team) || !Number.isInteger(entry.count) || entry.count < 1) throw new Error('approvalReceipt exceptions entry is invalid');
    return entry.team;
  }, 'exceptions');
  if (stableJson(actualOverrides) !== stableJson(declaredOverrides)) throw new Error('approvalReceipt teamOverrides do not match input');
  if (stableJson(actualExceptions) !== stableJson(declaredExceptions)) throw new Error('approvalReceipt exceptions do not match input');
  return { approvalReceipt: { teamOverrides: declaredOverrides, exceptions: declaredExceptions }, sourceTeamsByOverride };
}

export function japaneseDateLabel(date) {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}年${month}月${day}日`;
}

export function createCanonicalOperationalMemberOutput(input) {
  exact(input, INPUT_KEYS, 'private input');
  exact(input.snapshot, new Set(['id', 'asOf']), 'snapshot');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.snapshot.asOf || '') || !/^\d{4}-\d{2}-\d{2}-v\d+-\d+-operational-members$/.test(input.snapshot.id || '')) throw new Error('invalid operational snapshot');
  const { approvalReceipt, sourceTeamsByOverride } = validateReceipt(input);
  const operational = buildOperationalRoster(input);
  const statuses = Object.fromEntries(TEAMS.map((team) => [team, Object.fromEntries(STATUSES.map((status) => [status, 0]))]));
  for (const record of input.records) statuses[record.team][record.status] += 1;
  const effectiveSourcePersonCounts = Object.fromEntries(TEAMS.map((team) => [team, 0]));
  const approvedExceptionCounts = Object.fromEntries(TEAMS.map((team) => [team, 0]));
  for (const member of operational.roster) (member.source === 'kaihipay' ? effectiveSourcePersonCounts : approvedExceptionCounts)[member.team] += 1;
  const conflictExclusionCounts = Object.fromEntries(TEAMS.map((team) => [team, 0]));
  for (const override of input.teamOverrides || []) for (const team of sourceTeamsByOverride.get(override.personKey) || []) if (team !== override.effectiveTeam) conflictExclusionCounts[team] += 1;
  for (const team of TEAMS) if (operational.counts[team] !== effectiveSourcePersonCounts[team] + approvedExceptionCounts[team]) throw new Error(`canonical count reconciliation failed for ${team}`);
  return {
    definitionId: MEMBER_DEFINITION.id,
    snapshot: { id: input.snapshot.id, asOf: input.snapshot.asOf, asOfLabel: japaneseDateLabel(input.snapshot.asOf) },
    finalCounts: operational.counts, total: operational.total, effectiveSourcePersonCounts, approvedExceptionCounts,
    conflictExclusionCounts, conflictResolutionReceipt: approvalReceipt.teamOverrides, sourceStatusCounts: statuses,
    sourceDigest: digest('private-roster-sha256', { snapshot: input.snapshot, records: input.records }),
    overlayDigest: digest('private-overlay-sha256', { teamOverrides: input.teamOverrides, exceptions: input.exceptions, approvalReceipt: input.approvalReceipt }),
    approvalReceipt,
  };
}
