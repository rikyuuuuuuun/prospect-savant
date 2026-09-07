import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { PUBLIC_FILES, stagePublicSnapshot } from '../scripts/stage-public-snapshot.mjs';

for (const mode of ['dry-run', 'failed-validation', 'publish']) {
  test(`candidate isolation: ${mode} retains or replaces the whole bundle`, async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'savant-stage-test-'));
    let candidatePath;
    try {
      for (const file of PUBLIC_FILES) await writeFile(join(rootDir, file), `old ${file}`);
      const run = () => stagePublicSnapshot({ rootDir, dryRun: mode === 'dry-run', generate: async candidate => {
        candidatePath = candidate;
        for (const file of PUBLIC_FILES) await writeFile(join(candidate, file), `new ${file}`);
        if (mode === 'failed-validation') throw new Error('LATE_VALIDATION_FAILED');
        return { ok: true };
      } });
      if (mode === 'failed-validation') await assert.rejects(run, /LATE_VALIDATION_FAILED/);
      else assert.deepEqual(await run(), { ok: true, dryRun: mode === 'dry-run' });
      for (const file of PUBLIC_FILES) assert.equal(await readFile(join(rootDir, file), 'utf8'), `${mode === 'publish' ? 'new' : 'old'} ${file}`);
      await assert.rejects(() => access(candidatePath));
    } finally { await rm(rootDir, { recursive: true, force: true }); }
  });
}
