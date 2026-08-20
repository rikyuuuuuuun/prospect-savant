# 05/12 operational-member migration plan

## Verified current state

`05_会員数集計!B:D` are record-level `COUNTIFS` by `01_会員マスター` status/team, and `F` is `B+C`. `12_Savant連携!B` directly references `05!F`; it therefore propagates the legacy 1,032 count. No tracked `prospect-gas` source references either tab. This is a formula path, not evidence that no live sync can overwrite it.

## Proposed production wiring (requires separate approval)

Keep `05!A:M` unchanged for record-level operational detail. Add unused columns only after a live preimage/consumer check:

| Column | Meaning | Source |
| --- | --- | --- |
| N | 運用会員数 | canonical final count |
| O | 会費ペイ人物数 | effective-team resolved source persons |
| P | 承認例外 | explicit non-KaihiPay inclusions |
| Q | 競合除外数 | effective team以外から除いた件数、audit-only |

Change only `12!B5:B8` to reference `05!N5:N8`. Preserve `12!C:E` as record-level fields and label the mixed granularity. Do not implement person resolution in a Sheet formula or a second Savant path.

The executable shadow contract is `scripts/operational-member-canonical.mjs`; it is consumed by both the Sheet projector and Savant publisher. The future runner writes a protected, aggregate-only artifact (definition/snapshot/as-of/digests and A〜D N:Q values only). The final live tab name/number is an approval-time decision after a consumer/schema check; `20_` is already occupied by `20_活動マスター`. `05` references the approved artifact; `12` references `05`. The private source itself is never committed.

## Migration and rollback

1. Capture a formula/value/format/revision preimage for `05` and `12`; prove N:Q and related named ranges have no consumers.
2. Capture a fresh 01 plus approved-overlay digest, generate the canonical output, and validate A333/B309/C224/D192/1058.
3. Stage 05 N:Q and metadata; validate the shadow output and 12 reference formulas before switching 12 B.
4. Switch `12!B5:B8` once, validate 05/12/Savant definition ID, snapshot ID, digests, and counts; observe one natural sync.
5. Only after explicit approval may PR #9 merge and public Savant publication occur.

Rollback: first restore `12!B5:B8` to `05!F5:F8`, then restore the exact 05 preimage. Revert the Savant snapshot separately if it was merged. Do not alter 01/KaihiPay or delete private overlay evidence.

## Remaining production gate

The full live GAS source and whether a sync rewrites these ranges are unverified. The canonical runner/ownership and overlay lifecycle (rule ID, effective dates, approval reference) must be approved before production wiring.
