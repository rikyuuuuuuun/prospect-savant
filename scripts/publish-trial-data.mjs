import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { publishTrialData } from './trial-publication.mjs';

async function main() {
  const [inputPath, rootDir = process.cwd()] = process.argv.slice(2);
  if (!inputPath) throw new Error('usage: node scripts/publish-trial-data.mjs <private-aggregate.json> [root-dir]');
  const input = JSON.parse(await readFile(resolve(inputPath), 'utf8'));
  console.log(JSON.stringify(await publishTrialData({ rootDir, input }), null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
}
