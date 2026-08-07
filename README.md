# Prospect Savant｜チーム分析ダッシュボード

ProspectのA〜Dチームを、Baseball Savant風のパーセンタイル表示で比較するスタッフ共有用ページです。

## 公開データの範囲

- チーム単位の集計指標
- 会員数と前月差
- 定着・入会・イベント・成長・家庭継続の各スコア
- データ品質の集計値

会員個人情報、会場名、金額、請求明細、Google SheetsのURL、APIキーなどの内部情報は含みません。

## 更新方法

数値の更新は `data.js` のみを差し替えます。見た目は `index.html` で管理します。

## GitHub Pages

リポジトリの `Settings > Pages` で、`Deploy from a branch`、`main`、`/(root)` を選択すると公開できます。
