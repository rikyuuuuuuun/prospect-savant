import { copyFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const PUBLIC_FILES = ['data.js', 'event-data.js', 'retention-data.js', 'school-age-data.js', 'snapshot-manifest.json', 'trial-data.js', 'trial-manifest.json'];

// Keep all generation and validation isolated until every stage has succeeded.
// The workflow publishes this complete bundle in one Git commit / Pages artifact.
export async function stagePublicSnapshot({ rootDir, dryRun = false, generate }) {
  const candidate = await mkdtemp(join(tmpdir(), 'prospect-savant-candidate-'));
  try {
    for (const file of PUBLIC_FILES) await copyFile(join(rootDir, file), join(candidate, file));
    const result = await generate(candidate);
    if (!dryRun) for (const file of PUBLIC_FILES) await copyFile(join(candidate, file), join(rootDir, file));
    return { ...result, dryRun };
  } finally {
    await rm(candidate, { recursive: true, force: true });
  }
}
