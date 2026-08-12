# Prospect Savant｜チーム分析ダッシュボード

ProspectのA〜Dチームを、Baseball Savant風のパーセンタイル表示で比較するスタッフ共有用ページです。

## 公開データの範囲

- チーム単位の集計指標
- 会員数と前月差
- 定着・入会・イベント・成長・家庭継続の各スコア
- 直近および過去イベントのチーム別実参加人数・開催時点会員数・参加率
- 前回公開時点から変化したチーム集計値
- データ品質の集計値

会員個人情報、会場名、金額、請求明細、Google SheetsのURL、APIキーなどの内部情報は含みません。

## 更新方法

通常の数値更新は次の4ファイルを差し替えます。見た目と操作は `index.html` で管理します。

- `data.js`: 主要指標、チーム比較、前回公開スナップショット
- `event-data.js`: イベント履歴とA〜Dの実参加率
- `retention-data.js`: 入会後の定着曲線
- `school-age-data.js`: 学齢節目別の継続率

`event-data.js` のイベント名は、公開対象外の施設・会場名を除いた表示名を使用します。

## GitHub Pages

リポジトリの `Settings > Pages` で、`Deploy from a branch`、`main`、`/(root)` を選択すると公開できます。
