# Savant external trigger (Cloudflare Cron → GitHub workflow_dispatch)

GitHub Actions `schedule` の起動は実測で公開workflowが約2時間、回復watchdogが約4〜6時間遅れています。
このWorkerはCloudflare Cron Triggers（時刻どおりに起動）から `daily-savant-recovery.yml` をdispatchします。
回復workflowは当日分が公開済みなら何もしません。未公開なら正規の公開workflowを起動し、`asOf` が当日になったことまで確認します。

このWorkerはGitHubのdispatch API以外に接続しません。Sheetsや会員データには触れません。予約Worker（prospect-line-webhook）とは別Workerにして、障害が波及しないようにしています。

## 必要なもの

1. GitHub fine-grained PAT
   - Repository access: `prospect-savant` のみ
   - Permissions: Actions = Read and write（Metadata readは自動付与）。それ以外は付与しない
   - 有効期限を設定し、期限をカレンダーに登録する
2. Cloudflareアカウント（予約Workerと同じアカウントで構いません）

## デプロイ

```bash
cd ops/external-trigger
npx wrangler secret put GITHUB_DISPATCH_TOKEN   # PATを入力（値はリポジトリに保存しない）
npx wrangler deploy
```

## 確認

- Cloudflare dashboard → Workers → prospect-savant-trigger → Cron events が指定時刻に実行されていること
- GitHub Actions に `Recover Prospect Savant Daily Publish`（event: workflow_dispatch）が同時刻に並ぶこと

## 停止・切り戻し

`npx wrangler delete` またはdashboardでCron Triggerを削除します。GitHub側の変更は不要です（既存のscheduleはそのまま残ります）。
