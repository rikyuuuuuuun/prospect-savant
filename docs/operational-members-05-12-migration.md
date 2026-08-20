# 05/12 operational-member migration plan

## Verified current state

`05_会員数集計!B:D` are record-level `COUNTIFS` by `01_会員マスター` status/team, and `F` is `B+C`. `12_Savant連携!B` directly references `05!F`; it therefore propagates the legacy 1,032 count. No tracked `prospect-gas` source references either tab. This is a formula path, not evidence that no live sync can overwrite it.

## Production wiring

Keep the legacy `05!A:Z` table unchanged for record-level operational detail. The live audit found `N:Z` already occupied by retention calculations, while `A10:Z30` is empty. Materialize the aggregate-only block in the empty lower area:

| Range | Meaning | Source |
| --- | --- | --- |
| `A12:E18` | title, headers, A-D rows, total | canonical aggregate only |
| `B14:B17` | 運用会員数 | canonical final count |
| `C14:C17` | 会費ペイ人物数 | effective-team resolved source persons |
| `D14:D17` | 承認例外 | explicit non-KaihiPay inclusions |
| `E14:E17` | 競合除外数 | effective team以外から除いた件数、audit-only |
| `G12:H16` | definition/snapshot/as-of/source and overlay digests | canonical provenance only |

Change only `12!B5:B8` to reference `05!B14:B17`. Preserve `12!C:E` as record-level fields and label the mixed granularity. Do not implement person resolution in a Sheet formula or a second Savant path.

The executable contract is `scripts/operational-member-canonical.mjs`; it is consumed by both the Sheet projector and Savant publisher. The rollout materializes only the aggregate output and provenance in the 05 lower block; the private source itself is never committed. `12` references only that aggregate count, not person-level source data.

## Migration and rollback

1. Capture a formula/value/format/revision preimage for `05!A10:H18` and `12!B5:B9`; prove the lower 05 block is empty and unrelated consumers remain unchanged.
2. Generate the approved private canonical output and validate its digests plus A333/B309/C224/D192/1058.
3. Stage the 05 lower aggregate block and metadata; validate the shadow output and 12 reference formulas before switching 12 B.
4. Switch `12!B5:B8` once, validate 05/12/Savant definition ID, snapshot ID, digests, and counts.
5. Merge and publish the Savant snapshot only after the same validation succeeds.

Rollback: first restore `12!B5:B8` to `05!F5:F8`, then restore the exact 05 preimage. Revert the Savant snapshot separately if it was merged. Do not alter 01/KaihiPay or delete private overlay evidence.

## Remaining production gate

The full live GAS source and whether a sync rewrites these ranges are unverified. The canonical runner/ownership and overlay lifecycle (rule ID, effective dates, approval reference) must be approved before production wiring.
