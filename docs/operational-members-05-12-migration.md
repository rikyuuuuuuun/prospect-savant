# 05/12 operational-member migration plan

## Verified current state

`05_会員数集計!B:D` are record-level `COUNTIFS` by `01_会員マスター` status/team, and `F` is `B+C`. `12_Savant連携!B` directly references `05!F`; it therefore propagates the legacy 1,032 count. The complete live GAS source audit found no direct or indirect write path to either tab; all central writes use an explicit allowlist that excludes both tabs.

## Production wiring

Keep the legacy `05!A:M` record-level table unchanged. `05!N:Z` is currently blank but is intentionally left untouched. The live audit found `05!A10:H18` empty; materialize the aggregate-only block there:

| Range | Meaning | Source |
| --- | --- | --- |
| `A12:E18` | title, headers, A-D rows, total | canonical aggregate only |
| `B14:B17` | 運用会員数 | canonical final count |
| `C14:C17` | 会費ペイ人物数 | effective-team resolved source persons |
| `D14:D17` | 承認例外 | explicit non-KaihiPay inclusions |
| `E14:E17` | 競合除外数 | effective team以外から除いた件数、audit-only |
| `G12:H16` | definition/snapshot/as-of/source and overlay digests | canonical provenance only |

Change only `12!B5:B8` to reference `05!B14:B17`. Preserve `12!C:E` as record-level fields. The 05 lower-block title and provenance identify B as the person-level count; this rollout intentionally makes no note, label, or formula change elsewhere in 12. Do not implement person resolution in a Sheet formula or a second Savant path.

The executable contract is `scripts/operational-member-canonical.mjs`; it is consumed by both the Sheet projector and Savant publisher. The rollout materializes only the aggregate output and provenance in the 05 lower block; the private source itself is never committed. `12` references only that aggregate count, not person-level source data.

## Migration and rollback

1. Capture a formula/value/format/revision preimage for `05!A10:H18` and `12!B5:B9`; prove the lower 05 block is empty and unrelated consumers remain unchanged.
2. Generate the approved private canonical output and validate its digests plus A333/B309/C224/D192/1058.
3. Stage the 05 lower aggregate block and metadata; validate the shadow output and 12 reference formulas before switching 12 B.
4. Switch `12!B5:B8` once, validate 05/12/Savant definition ID, snapshot ID, digests, and counts. Validate downstream `13_Savant分析!M47:M51` updates to the same A-D/total figures; `11_売上集計!H5:H9` remains on legacy `05!F` and must be unchanged.
5. Merge and publish the Savant snapshot only after the same validation succeeds.

Rollback: first restore `12!B5:B8` to `05!F5:F8`, then restore the exact 05 preimage. Revert the Savant snapshot separately if it was merged. Do not alter 01/KaihiPay or delete private overlay evidence.

## Snapshot freshness and separate work

This rollout is an approved `2026-08-20` canonical snapshot, materialized with its source and overlay digests. It does not add an automatic refresh runner. A later refresh must regenerate the same aggregate from an approved private source and replace the lower block atomically. Existing GAS timeout/partial-write risks and a durable sync redesign remain separate work; this migration does not change the existing sync path.
