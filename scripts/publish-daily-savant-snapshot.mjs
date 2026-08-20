import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { publishOperationalMemberSnapshot } from './publish-operational-member-snapshot.mjs';
import { publishTrialData } from './trial-publication.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(resolve(path), 'utf8'));
}

async function main() {
  const [operationalInputPath, trialInputPath, rootDir = process.cwd()] = process.argv.slice(2);
  if (!operationalInputPath || !trialInputPath) {
    throw new Error('usage: node scripts/publish-daily-savant-snapshot.mjs <private-operational.json> <private-trial-aggregate.json> [root-dir]');
  }
  const operational = await publishOperationalMemberSnapshot({ rootDir, input: await readJson(operationalInputPath) });
  const trial = await publishTrialData({ rootDir, input: await readJson(trialInputPath) });
  console.log(JSON.stringify({ operational, trial }, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
}
