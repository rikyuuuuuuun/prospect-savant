# Savant UIの改修・確認手順

スタッフ画面の正本はこのリポジトリの `index.html`。認証付き入口は https://prospect-portal.rikuhirata713.chatgpt.site/savant/ 。ポータルの別画面を作り直さず、検証済みSavant bundleの既存更新経路を使う。

## 表示の条件

- 紺のヘッダー、明るい本文、赤青の比較指数、A〜Eのチーム色、既存フォントと背景を保持する。Baseball Savant風の情報密度を保つ。
- 情報は実数・率・比較指数・前回差を区別する。比較指数の基準は60。未確定・対象外を0や推定値で埋めない。
- スタッフ画面には数値の判断に必要な対象・期間・比較基準を短く表示する。退会日の補完順や連携状況などの内部運用説明、各カードで繰り返す長文注記は表示しない。数値は最初から確定値を表示する。
- 総合順位、入会累計、月別の体験→入会率、退会比較に置いていた長文の補足・注意書きは、2026-11-14のユーザー指示で削除した。確認用の見出し・表・グラフを保ち、これらの説明段落を再追加しない。
- 実数4項目のbenchmark欄は従来のコンパクトな中央揃えを維持する。PCは4列、640px以下は2列。2026-11-14のユーザー指摘により、大きな2列表示から元に戻した。
- 体験人数はチーム数と列数を一致させる。カード内の補足、表、グラフの軸も読める大きさにする。
- スマホでは操作部分44px、入力16pxを基本とする。大きい表・グラフだけを横スクロールさせ、ページ全体の横はみ出しを防ぐ。grid内のスクロール領域はminmax(0,1fr)とmin-width:0を確認する。
- 動きは操作への短い反応を中心とし、prefers-reduced-motionを尊重する。

## 作業と確認

1. 共通PROTOCOLの対象Taskと既存保留条件を読み、repoとTaskのロックを取得する。最新mainから独立branchで作業し、未コミット変更を保持する。
2. 改修前のPC・スマホ画面を確認する。配色変数を控え、同じ基準日のデータを比較に使う。
3. `npm test` と `npm run validate:snapshot` を実行する。Windowsではcheckout改行をLFにする。CRLFのままだと既存のLF前提テスト2件が失敗する。
4. `node scripts/build-staff-pages.mjs . <別の作業ディレクトリ>` で実際の表示bundleを生成し、JSONのhtmlを作業用HTMLに書き出してローカル表示する。rootのindex.htmlを直接開くだけではreference-index投影を確認できない。
5. PC・390pxのスマホで7つの分析メニュー、A/E/全チーム切り替え、集計条件と内訳、比較表、入会推移のグラフを確認する。必要なら320pxで長いラベルも確認する。ページ全体のscrollWidthがviewportを超えないこと、Eの対象外指標を確認する。
6. データ・集計スクリプト・認証・公開workflowの差分がないことを確認し、最終テスト・構文検査・bundle生成を行う。
7. PT-24のPR・merge・本番配備の承認条件を維持する。承認後は既存Deploy Savant display workflowとportal snapshot更新を待ち、bundle hashと認証付き保存画面を別に確認する。保存・本番反映・スタッフ実運用確認は区別して記録する。

## 今回使用した設計スキル

- [unslop](https://github.com/heydamir/unslop) — Damir Sokolovsky (@heydamir), CC BY 4.0。既存ブランドを保ったpolish modeを使用。
- [tactile-design](https://github.com/kosta4a/tactile-design) — kosta4a, MIT。既存配色に合わせ、情報の階層、表面、操作の反応、モバイルの規則を適用。

本書は今回の実装・検証手順をまとめたもの。業務定義と公開処理は各スクリプト・既存docsを正本とする。
