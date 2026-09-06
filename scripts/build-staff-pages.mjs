import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { validateSnapshot } from './validate-snapshot.mjs';
import { validatePublishedTrialData } from './trial-publication.mjs';

export const STAFF_SAVANT_URL = 'https://prospect-portal.rikuhirata713.chatgpt.site/savant/';
const scripts = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'trial-data.js'];
const publicFiles = [...scripts, 'snapshot-manifest.json', 'trial-manifest.json', 'robots.txt', '.nojekyll'];

export async function buildSavantBundle(root) {
  const [snapshot, trial] = await Promise.all([validateSnapshot(root), validatePublishedTrialData(root)]);
  if (!snapshot.ok || !trial.ok) throw Error('Snapshot validation failed before staff bundle generation');
  let html = await readFile(join(root, 'index.html'), 'utf8');
  for (const file of scripts) {
    const tag = `<script src="./${file}"></script>`;
    if (html.split(tag).length !== 2) throw Error(`Missing or repeated data script: ${file}`);
    const source = (await readFile(join(root, file), 'utf8')).replace(/<\/script/gi, '<\\/script');
    html = html.replace(tag, () => `<script>${source}</script>`);
  }
  if (/<script\b[^>]*\bsrc\s*=/i.test(html)) throw Error('Unexpected external dashboard script');
  if (Buffer.byteLength(html, 'utf8') > 1_800_000) throw Error('Dashboard exceeds staff bundle size limit');
  const manifest = JSON.parse(await readFile(join(root, 'snapshot-manifest.json'), 'utf8'));
  return { schemaVersion: 1, snapshotId: manifest.snapshotId, asOf: manifest.asOf, html, sha256: createHash('sha256').update(html).digest('hex') };
}

export function staffRedirectHtml() {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"><title>Prospect Savant</title><script>location.replace(${JSON.stringify(STAFF_SAVANT_URL)}+location.hash);</script><noscript><meta http-equiv="refresh" content="0;url=${STAFF_SAVANT_URL}"></noscript><style>body{font-family:system-ui,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#f3f6f9;color:#142235}main{padding:2rem}a{color:#173957}</style></head><body><main><h1>Prospect Savant</h1><p>サバントへ移動しています。</p><a href="${STAFF_SAVANT_URL}">サバントを開く</a></main></body></html>`;
}

export async function stageStaffPages(root, output) {
  if (resolve(root) === resolve(output)) throw Error('Use a separate Pages staging directory');
  const bundle = await buildSavantBundle(root);
  await mkdir(output, { recursive: true });
  await writeFile(join(output, 'index.html'), staffRedirectHtml());
  await writeFile(join(output, 'savant-bundle.json'), JSON.stringify(bundle));
  for (const file of publicFiles) await copyFile(join(root, file), join(output, file));
  return bundle;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  stageStaffPages(resolve(process.argv[2] || '.'), resolve(process.argv[3] || '_site'))
    .then(bundle => console.log(`Staff Pages staged: ${bundle.snapshotId}`))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
