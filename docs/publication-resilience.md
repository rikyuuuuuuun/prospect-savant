# Daily publication resilience

A pending new reservation or an unavailable daily trial sheet must not stop verified membership, retention, event, growth or annual conversion publication.

- Current/future reflected reservations with no canonical or legacy match may remain pending. The remaining cohort must pass the original quality gate, and the canonical source must pass its final readback. Historical unmatched receipts, ambiguous matches, invalid dates, and excluded rows in history still block publication.
- After canonical cohort validation, known daily-sheet read/schema/route failures may withhold daily trial counts. Unknown failures and changed canonical sources are not swallowed.
- Withheld counts use the existing `unavailable`/null contract. Never invent a zero, sum an incomplete set of teams, or relabel a prior day's counts.
- The whole seven-file bundle remains atomic. Annual conversion reconciliation, source freshness, member reconciliation, privacy, JavaScript validation, manifest hashes and deployed HTTP verification remain required.
- `snapshot-manifest.json.publication.status` is `partial` while daily trial counts are unavailable, otherwise `complete`. Legacy manifests without this field remain readable.
- Scheduled publication and the watchdog revisit a current-day partial publication. Once the source recovers, the regular pipeline publishes complete counts without force. Retries use the existing bounded schedule; no external scheduler is added.
- Partial publication is operationally usable, not a claim that every metric is current. The UI shows daily counts as 確認中, and Actions/HTTP verification records publication status.
- If a pending reservation remains unmatched into a later day, it is historical and requires source reconciliation; it is no longer automatically deferrable.

Recovery pulse operations continue to change only the pulse line on the dedicated automation branch.
