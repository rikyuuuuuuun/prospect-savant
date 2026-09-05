# P-01 / P-02 source consistency repair

Status: review candidate. Merge and production Sheets changes require the owner's final go-sign.

The old 05/12 migration document describes the original one-time rollout. The current source instead computes the operational aggregate through a daily readiness gate. Before all four daily source syncs complete, the per-team aggregate is blank. SUM previously turned those blanks into a valid-looking zero. A separately maintained monthly cutoff could also disagree with the member aggregate's date.

## Deployment dependencies

Before merging this PR, apply the reviewed private Sheets repair plan (18 input cells, exact preimages and rollback included in the private repair bundle):

- Preserve the operational aggregate and its existing quality/approval gate. Guard the 05 totals and 12 references/totals against missing team counts.
- Import 05 A12:H18 into 98 A12:H18, including its definition, date, snapshot and receipts.
- Import 97 J10:K18 into 98 J12:K20, including the readiness reason.
- Bind monthly V5:V8 to the imported member date.
- Correct the missing-admission-date check to compare active/planned contract records against registered-date contract records. Do not subtract contract records from operational persons.

No new service-account permissions or secrets are needed: the publisher continues reading the existing Savant workbook. Both new imports use the same source workbook as the already authorized import. Re-read the private source under the actual service account in three manual non-publishing runs before enabling the new path.

## Runtime behaviour

The publisher accepts only an actual 05 readback with matching 12, monthly, team and headline counts, complete provenance, and the same member/trial date. A second complete anonymous-source read detects calculation changes during capture. Inconsistent reads are retried at most three times; a persistent inconsistency still stops publication. Quality failures still stop publication; their diagnostic now includes the failing row number without exposing source text.

An incomplete daily sync before 09:30 Tokyo retains the last published snapshot and records a waiting state. An incomplete source after that deadline is an explicit failure, so waiting cannot silently become permanent success. Unknown conflicts and other data-quality failures are never treated as ordinary sync wait.

Ordinary watchdog pulses skip an already current snapshot. Same-day corrections require an explicit `force` input. The watchdog waits for its uniquely named publisher run and verifies the resulting published date, rather than equating dispatch success with publication success.

## Acceptance and rollback

1. Re-read all edited cells and spill ranges; stop on drift from reviewed preimages.
2. Apply the two per-workbook atomic batches, then verify formulas, quality, actual canonical counts and dates.
3. Run three read-only candidate generations against the live source, including all validators. The local replay in the repair bundle does not substitute for these live post-cutover runs.
4. Merge only after the final go-sign, then publish the verified current-date candidate and verify the public date and content hashes.
5. On a mismatch, retain the last good public snapshot. Revert the code change, then restore exact Sheets preimages in reverse batch order, only if the cells still equal this repair's postimage. Never restore old fixed membership totals.

The historical `SOURCE_QUALITY_BLOCKED` jobs did not log their failing row. The exact historical row cannot be recovered from that message alone; the new row diagnostics prevent that ambiguity recurring.
