# Prospect Savant｜チーム分析ダッシュボード

ProspectのA〜Dチームを、Baseball Savant風のパーセンタイル表示で比較するスタッフ共有用ページです。

## 公開データの範囲

- チーム単位の集計指標
- 会員数と前月差
- 定着・入会・イベント・成長・家庭継続の各スコア
- 一般会員が参加できる合同練習会など、開催済み対象イベント6件のチーム別実参加人数・開催時点会員数・参加率
- イベント力は平均実参加率70％＋累積継続参加率30％を、対象実績のMAX＝100点で換算
- 大会参加者限定の大会用・大会特別練習は履歴を保持したまま、イベント力・参加率推移・開催回数から除外
- Dチームは2025年4月の発足後だけを評価し、2024夏合同練習会は「発足前・評価対象外」として表示
- 開催前イベントの「開催予定・暫定」表示（イベント力・実績ランキング・参加率・開催回数から除外）
- 前回公開時点から変化したチーム集計値
- データ品質の集計値

会員個人情報、会場名、金額、請求明細、Google SheetsのURL、APIキーなどの内部情報は含みません。

## 更新方法

通常の数値更新は次の4ファイルを差し替えます。見た目と操作は `index.html` で管理します。

- `data.js`: 主要指標、チーム比較、前回公開スナップショット
- `event-data.js`: 対象イベント履歴、開催予定イベントの暫定情報、A〜Dの実参加率
- `retention-data.js`: 入会後の定着曲線
- `school-age-data.js`: 学齢節目別の継続率

`event-data.js` のイベント名は、公開対象外の施設・会場名を除いた表示名を使用します。
`events` は開催済みかつ一般会員対象の正式集計だけ、`upcomingEvents` は開催前の暫定情報だけを保持します。開催前の申込数を実参加人数として扱いません。
イベント力は `scoringVersion: v6-event-eligibility-70-30` を使用し、`data.js` と `event-data.js` の版を一致させます。

## GitHub Pages

リポジトリの `Settings > Pages` で、`Deploy from a branch`、`main`、`/(root)` を選択すると公開できます。

## Atomic snapshot validation

Public data updates are treated as one snapshot. Every update must change these files together in one branch and one reviewed commit:

- `data.js`
- `event-data.js`
- `retention-data.js`
- `school-age-data.js`
- `snapshot-manifest.json`

Before opening or merging a pull request, run:

```bash
npm test
npm run validate:snapshot
```

`snapshot-manifest.json` records the snapshot ID, as-of date, score version, and Git blob hash of each public data file. CI rejects partial updates, cross-file score mismatches, event eligibility regressions, unreconciled participant totals, and prohibited private identifiers or URLs.

The first manifest is a baseline for the existing public files. It does not reclassify the 2026-08-13 retention-only commit as an atomic update; the next generated snapshot must update all four files and the manifest together.
