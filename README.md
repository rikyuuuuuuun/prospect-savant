# Prospect Savant｜チーム分析ダッシュボード

ProspectのA〜Dチームを、Baseball Savant風のパーセンタイル表示で比較するスタッフ共有用ページです。

## 公開データの範囲

- チーム単位の集計指標
- 会員数と前月差
- 定着・入会・イベント・成長・家庭継続の各スコア
- 一般会員が参加できる合同練習会など、開催済み対象イベント6件のチーム別実参加人数・開催日時点の人物単位運用会員数・参加率
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
- `trial-data.js`: 当日の体験予約人数と年度入会率の分子・分母（A〜Dの匿名集計のみ）

`event-data.js` のイベント名は、公開対象外の施設・会場名を除いた表示名を使用します。
`events` は開催済みかつ一般会員対象の正式集計だけ、`upcomingEvents` は開催前の暫定情報だけを保持します。開催前の申込数を実参加人数として扱いません。
会員数は人物単位運用会員（在籍・休会・退会予定を含み、退会・削除を除外）です。イベント参加率の分母も現在値を遡及せず、各開催日時点の同じ人物単位運用会員を再構成します。B/C競合はBへ一意化し、承認済みの会費ペイ外例外は有効期間だけを反映します。

イベント力は `scoringVersion: v7-operational-member-denominator` を使用し、`data.js` と `event-data.js` の版を一致させます。前回が別スコア版の場合、前回差・総合点差は比較対象外です。

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

## 体験集計の更新

`trial-data.js` は既存4ファイルのスナップショットとは独立した、当日性が必要な匿名集計です。公開ファイルに含めてよいのは A〜D の人数、合計、年度の入会数・体験数だけです。会場名、氏名、行情報、Google Sheets URL / ID、認証情報は入力・出力ともにリポジトリへ置きません。

非公開の定期ジョブで各チームの体験管理シートを読み、`Asia/Tokyo` の当日について各会場タブの `体験予約日` を集計した後、次の最小入力だけを渡します。0人は `status: "ok"` と明示し、取得失敗は `status: "unavailable"` として `teams: null` にします。失敗時に 0 を出力してはいけません。

```bash
node scripts/publish-trial-data.mjs <private-aggregate.json>
```

年度の各チーム `admissions / trials` は、既存 `data.js` の年度入会率と小数1桁まで一致しなければ公開処理を停止します。生成後は `trial-manifest.json` のハッシュと、公開ファイルにURL・シートID・会場・個人情報がないことも `npm run validate:snapshot` で検証します。

既存の人物単位運用会員スナップショットも同時に更新する非公開の定期ジョブは、次を使えます。両方の入力は最小の匿名集計だけに限定し、ジョブ設定・OAuth・Sheets ID はリポジトリ外の秘密管理に置きます。

```bash
node scripts/publish-daily-savant-snapshot.mjs <private-operational.json> <private-trial-aggregate.json>
```

The first manifest is a baseline for the existing public files. It does not reclassify the 2026-08-13 retention-only commit as an atomic update; the next generated snapshot must update all four files and the manifest together.

## Operational-member snapshot generation

The public operational-member count is generated from a private, normalized canonical roster. The private input is not committed and contains opaque person keys only; names, contact details, Workspace URLs, and membership-source credentials are never accepted by this repository.

The generator enforces one person per final team, includes only `在籍` / `休会` / `退会予定`, excludes `退会` / `削除`, requires an explicit active approval for team conflicts and non-source exceptions, and fails closed on unknown states or ambiguous teams.

```bash
node scripts/publish-operational-member-snapshot.mjs <private-input.json>
```

It updates the public aggregate in `data.js`, stamps all four public data files with one snapshot ID, and refreshes `snapshot-manifest.json`. A definition change deliberately marks member deltas as not comparable until a prior snapshot generated under the same definition is available.
