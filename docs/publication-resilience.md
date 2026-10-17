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

## Future reservation reconciliation versus today's count

A reflected reservation strictly after the snapshot date, with no canonical S match or legacy/generated-ID evidence, cannot change today's reservation count or the confirmed attendance cohort. After the complete remaining history passes the existing strict quality check, read and validate all four physical daily sources and their readbacks normally. Such future-only pending receipts no longer suppress today's verified counts.

Keep the original source quality as REVIEW in the private capture. A separate anonymous `future-reconciliation-pending-v1` receipt records the snapshot date and unresolved future count. Publication validation checks its exact fields, count consistency and the fully reconciled subset. The proof never appears in public data and does not mark the original source READY. Missing or inconsistent proof, today's pending reservation, historical mismatch, duplicate/date/team conflicts and archived excluded history retain their prior handling.

Operational follow-up remains required for reflected future receipts whose physical venue record is missing. Do not recreate a removed/moved booking or infer cancellation. When its date reaches the current/past cohort, the existing stricter availability/history checks apply. The new GAS catch-up scans every five minutes and distinguishes recoverable source-backed bookings from missing source records.

## Saved portal refresh after recovery

The shared-login portal stores a separate Savant HTML bundle. Verifying Pages alone does not verify that saved view. On 2026-10-08 a recovery publisher completed successfully while the last portal refresh had run earlier after display deployment, leaving the saved view on the previous day.

The portal refresh workflow also listens to successful `Recover Prospect Savant Daily Publish` completion, including validated `automation/savant-recovery-*` pulse branches. Recovery waits for its canonical publisher and live Pages verification before completing, so this refresh occurs after the new bundle is available. Failed recovery runs do not refresh. Workflow-run and workflow-maintenance push events refresh only Savant; scheduled/manual all-scope refreshes remain unchanged. Existing OIDC authentication, retry budget and previous-snapshot retention remain intact.

After repairing this path, verify the portal's saved `asOf` and rendered dashboard, not just the publisher result.

## 2026-10-18 外部トリガーの再導入（所有者委任による判断）

2026-09-29は「GPT監視のpulseに一本化」としていたが、以下の実測から再導入した。

- 2026-10-06〜10-17、schedule起動の遅延は毎日2〜4.5時間（06:07枠が08:26〜08:50、07:30枠が09:13〜12:07に起動）。当日の初回公開は08:50〜11:31にばらついた。
- `workflow_dispatch` はscheduleのような遅延を受けない。Workerは既存の回復workflowをdispatchするだけで、公開経路は正規publisherの1本のまま。当日公開済みならno-opになる。
- Cron TriggersはWorkers Paidに含まれ、追加費用はかからない。

同時に、06:07枠の失敗原因はschedule遅延ではなくGoogle Sheetsの429（分単位の読取quota）だったため、429のbackoffを分の境界を越える長さにし、待機ループでも再試行するよう修正した。
