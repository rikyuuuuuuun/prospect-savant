import { pathToFileURL } from 'node:url';
import { validatePublishedTrialData } from './trial-publication.mjs';

async function main() {
  const result = await validatePublishedTrialData(process.argv[2] || process.cwd());
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
}
