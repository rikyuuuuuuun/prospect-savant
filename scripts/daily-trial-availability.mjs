import { assertTrialAnalyticsQuality } from './trial-analytics-disposition.mjs';

const REASONS = new Set(['TRIAL_SYNC_PENDING', 'TRIAL_DAILY_SOURCE_UNAVAILABLE']);
const exact = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) &&
  Object.keys(value).sort().join() === [...keys].sort().join();

export function unavailableDailyTrial({ targetDate, fiscalYear, reason }) {
  if (!REASONS.has(reason)) throw new Error('TRIAL_UNAVAILABLE_REASON_INVALID');
  return { targetDate, fiscalYear, status: 'unavailable', reason, aggregates: null };
}

export function assertDailyTrialAvailability(value) {
  if (value?.status === 'unavailable') {
    if (!exact(value, ['targetDate', 'fiscalYear', 'status', 'reason', 'aggregates']) ||
        !REASONS.has(value.reason) || value.aggregates !== null) {
      throw new Error('TRIAL_UNAVAILABLE_RECEIPT_INVALID');
    }
    return;
  }
  if (value?.status !== undefined && value.status !== 'ok') throw new Error('TRIAL_STATUS_INVALID');
  if (!value?.aggregates) throw new Error('TRIAL_AGGREGATE_MISSING');
  if (value.reservationReadiness) {
    const proof = value.reservationReadiness, quality = value.quality;
    if (!exact(proof, ['definition', 'targetDate', 'pendingReceipts']) ||
        proof.definition !== 'future-reconciliation-pending-v1' || proof.targetDate !== value.targetDate ||
        !Number.isSafeInteger(proof.pendingReceipts) || proof.pendingReceipts <= 0 ||
        quality?.status !== 'REVIEW' || proof.pendingReceipts !== quality.unresolvedEligible ||
        quality.receiptColumnUniqueMatched !== quality.exactUniqueMatched) {
      throw new Error('TRIAL_FUTURE_RECONCILIATION_PROOF_INVALID');
    }
    // Validate the fully reconciled cohort with the unchanged strict gate. This
    // scoped copy is never published as the original source quality.
    assertTrialAnalyticsQuality({ ...quality, status: 'READY',
      total: quality.total - proof.pendingReceipts, eligible: quality.eligible - proof.pendingReceipts,
      unresolvedEligible: 0 });
    return;
  }
  assertTrialAnalyticsQuality(value.quality);
}

// Called only after the canonical disposition quality gate has passed.
// Unknown/programming errors and central source consistency errors are never masked.
export function isDailyTrialSourceFailure(error) {
  const code = String(error?.message || '');
  if (/^TRIAL_SOURCE_UNAVAILABLE_(?:[ABCD]_(?:GOOGLE_SHEETS_(?:403|404|429|500|502|503|504|TIMEOUT|NETWORK|RESPONSE_INVALID|INCOMPLETE)|SOURCE_SCHEMA_INVALID)(?:_|$))+$/.test(code)) return true;
  return /^TRIAL_DISPOSITION_(?:SOURCE_SCHEMA_INVALID|SOURCE_RECEIPT_UNRESOLVED|SOURCE_RECEIPT_NOT_UNIQUE|TEAM_INVALID|ROUTE_MISMATCH|WORKFLOW_UNRESOLVED|SOURCE_DATE_MISMATCH)$/.test(code);
}
