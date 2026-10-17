// Reliable morning trigger for the Savant recovery watchdog.
// GitHub scheduled workflows start ~2h (publish) to ~5h (watchdog) late under load.
// Cloudflare Cron Triggers fire on time, so this Worker dispatches the existing
// recovery workflow, which is a no-op when today's snapshot is already published
// and otherwise dispatches the canonical publisher and verifies the result.
// It only calls one GitHub endpoint and never touches Sheets or member data.
export const TARGET = Object.freeze({ owner: 'rikyuuuuuuun', repo: 'prospect-savant', workflow: 'daily-savant-recovery.yml' });

export async function dispatchRecovery(env, fetchImpl = fetch) {
  if (!env.GITHUB_DISPATCH_TOKEN) throw new Error('dispatch_token_missing');
  const url = `https://api.github.com/repos/${TARGET.owner}/${TARGET.repo}/actions/workflows/${TARGET.workflow}/dispatches`;
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.GITHUB_DISPATCH_TOKEN}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'prospect-savant-external-trigger',
      'content-type': 'application/json',
    },
    // No inputs: force stays false, so an already-current day is never republished.
    body: JSON.stringify({ ref: 'main' }),
  });
  if (response.status !== 204) throw new Error(`dispatch_failed_${response.status}`);
  return { ok: true };
}

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(dispatchRecovery(env).then(
      () => console.log(JSON.stringify({ event: 'savant_recovery_dispatched', cron: controller.cron })),
      (error) => { console.error(JSON.stringify({ event: 'savant_recovery_dispatch_failed', cron: controller.cron, message: error.message })); throw error; },
    ));
  },
  async fetch() {
    return new Response('not found', { status: 404 });
  },
};
