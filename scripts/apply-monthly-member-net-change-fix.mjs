import { readFile, writeFile } from 'node:fs/promises';

async function replaceOnce(path, oldText, newText) {
  const source = await readFile(path, 'utf8');
  const first = source.indexOf(oldText);
  if (first < 0) throw new Error(`${path}: replacement target not found`);
  if (source.indexOf(oldText, first + oldText.length) >= 0) throw new Error(`${path}: replacement target is not unique`);
  await writeFile(path, source.slice(0, first) + newText + source.slice(first + oldText.length), 'utf8');
}

await replaceOnce(
  'scripts/publish-private-savant-source.mjs',
  "import { fiscalYearFor, serialToIsoDate, trialPublicInput } from './private-trial-aggregate.mjs';\n",
  "import { fiscalYearFor, serialToIsoDate, trialPublicInput } from './private-trial-aggregate.mjs';\nimport { applyMemberMonthlyDelta, selectMemberMonthlyComparison } from './member-monthly-change.mjs';\n",
);

await replaceOnce(
  'scripts/publish-private-savant-source.mjs',
  "  data.headline.monthlyDelta = requiredNumber(dashboard[4]?.[1], 'DASHBOARD_MONTHLY_DELTA');",
  '  data.headline.monthlyDelta = null;',
);

await replaceOnce(
  'scripts/publish-private-savant-source.mjs',
  "    team.monthlyDelta = requiredNumber(source[2], `TEAM_MONTHLY_DELTA_${id}`);",
  '    team.monthlyDelta = null;',
);

await replaceOnce(
  'scripts/publish-private-savant-source.mjs',
  `  if (oldData.asOf < asOf && oldData.memberDefinition?.id === data.memberDefinition?.id) {
    data.comparison = {
      scoreVersion: oldData.scoreVersion,
      previousAsOf: oldData.asOf,
      previousAsOfLabel: oldData.asOfLabel,
      headline: oldData.headline,
      teams: oldData.teams.map((team) => ({ id: team.id, rank: team.rank, members: team.members, overall: team.overall, metrics: team.metrics })),
      memberDefinition: oldData.memberDefinition,
      ...(oldData.admissions ? { admissions: oldData.admissions } : {}),
    };
  }
  return annual;`,
  `  if (oldData.asOf < asOf && oldData.memberDefinition?.id === data.memberDefinition?.id) {
    data.comparison = {
      scoreVersion: oldData.scoreVersion,
      previousAsOf: oldData.asOf,
      previousAsOfLabel: oldData.asOfLabel,
      headline: oldData.headline,
      teams: oldData.teams.map((team) => ({ id: team.id, rank: team.rank, members: team.members, overall: team.overall, metrics: team.metrics })),
      memberDefinition: oldData.memberDefinition,
      ...(oldData.admissions ? { admissions: oldData.admissions } : {}),
    };
  }
  data.memberMonthlyComparison = selectMemberMonthlyComparison(oldData, asOf, data.memberDefinition?.id);
  applyMemberMonthlyDelta(data);
  return annual;`,
);

await replaceOnce(
  'scripts/publish-private-savant-with-explanations.mjs',
  "import { parsePublicSource, publishPrivateSavantSource } from './publish-private-savant-source.mjs';\n",
  "import { parsePublicSource, publishPrivateSavantSource } from './publish-private-savant-source.mjs';\nimport { applyMemberMonthlyDelta, buildMemberMonthlyComparison, previousMonthEnd } from './member-monthly-change.mjs';\n",
);

await replaceOnce(
  'scripts/publish-private-savant-with-explanations.mjs',
  `  return null;
}
function carryPreviousMetricEvidence(data, previousData) {`,
  `  return null;
}
function historicalMemberBaseline(root, targetAsOf) {
  const revisions = String(git(root, ['rev-list', '--max-count=250', 'HEAD']) || '').trim().split('\\n').filter(Boolean);
  for (const revision of revisions) {
    const data = gitPublic(root, revision, 'data.js');
    if (data?.asOf === targetAsOf) return { data, revision };
  }
  return null;
}
function carryPreviousMetricEvidence(data, previousData) {`,
);

await replaceOnce(
  'scripts/publish-private-savant-with-explanations.mjs',
  `  const [data, retentionCurve, eventHistory] = await Promise.all([
    readPublic(root, 'data.js'),
    readPublic(root, 'retention-data.js'),
    readPublic(root, 'event-data.js'),
  ]);

  const previousAsOf = data.comparison?.previousAsOf;`,
  `  const [data, retentionCurve, eventHistory] = await Promise.all([
    readPublic(root, 'data.js'),
    readPublic(root, 'retention-data.js'),
    readPublic(root, 'event-data.js'),
  ]);

  if (!data.memberMonthlyComparison) {
    const baseline = historicalMemberBaseline(root, previousMonthEnd(data.asOf));
    if (baseline?.data?.memberDefinition?.id === data.memberDefinition?.id) {
      data.memberMonthlyComparison = buildMemberMonthlyComparison(baseline.data);
    }
  }
  applyMemberMonthlyDelta(data);

  const previousAsOf = data.comparison?.previousAsOf;`,
);

await replaceOnce(
  'scripts/publish-operational-member-snapshot.mjs',
  "import { MEMBER_DEFINITION, createCanonicalOperationalMemberOutput, japaneseDateLabel } from './operational-member-canonical.mjs';\n",
  "import { MEMBER_DEFINITION, createCanonicalOperationalMemberOutput, japaneseDateLabel } from './operational-member-canonical.mjs';\nimport { applyMemberMonthlyDelta, selectMemberMonthlyComparison } from './member-monthly-change.mjs';\n",
);

await replaceOnce(
  'scripts/publish-operational-member-snapshot.mjs',
  "  const data = frozenJson(await readFile(dataPath, 'utf8'), 'data.js');\n  const teamIds = Object.keys(canonical.finalCounts).sort();",
  "  const data = frozenJson(await readFile(dataPath, 'utf8'), 'data.js');\n  const oldData = clonePublicAggregate(data);\n  const teamIds = Object.keys(canonical.finalCounts).sort();",
);

await replaceOnce(
  'scripts/publish-operational-member-snapshot.mjs',
  `  data.comparison = comparison;
  const comparable = comparison?.memberDefinition?.id === canonical.definitionId;
  if (comparable) {
    const previousTeams = validateComparison(comparison, canonical.snapshot.asOf, teamIds);
    data.headline.monthlyDelta = data.headline.members - comparison.headline.members;
    for (const team of data.teams) team.monthlyDelta = team.members - previousTeams.get(team.id).members;
  } else {
    data.headline.monthlyDelta = null;
    for (const team of data.teams) team.monthlyDelta = null;
  }`,
  `  data.comparison = comparison;
  data.memberMonthlyComparison = selectMemberMonthlyComparison(oldData, canonical.snapshot.asOf, canonical.definitionId);
  applyMemberMonthlyDelta(data);`,
);

await replaceOnce(
  'scripts/validate-snapshot.mjs',
  "import { validateAdmissions } from './admission-notices.mjs';\n",
  "import { validateAdmissions } from './admission-notices.mjs';\nimport { MEMBER_DELTA_DEFINITION, assertMemberMonthlyState } from './member-monthly-change.mjs';\n",
);

await replaceOnce(
  'scripts/validate-snapshot.mjs',
  `    const memberComparable = data.memberDefinition?.id === comparison.memberDefinition?.id;
    if (memberComparable && comparisonTeams.size === teamIds.length) {
      add(errors, Number.isSafeInteger(data.headline?.monthlyDelta),
        'headline monthlyDelta must be an integer');
      for (const teamId of teamIds) {
        const current = dataTeams.get(teamId);
        add(errors, Number.isSafeInteger(current?.monthlyDelta),
          \`team \${teamId}: monthlyDelta must be an integer\`);
      }
    } else {
      add(errors, data.headline?.monthlyDelta === null,
        'headline monthlyDelta must be null when member definitions differ');
      for (const teamId of teamIds) {
        add(errors, dataTeams.get(teamId)?.monthlyDelta === null,
          \`team \${teamId}: monthlyDelta must be null when member definitions differ\`);
      }
    }`,
  `    if (data.memberDeltaDefinition !== MEMBER_DELTA_DEFINITION) {
      const memberComparable = data.memberDefinition?.id === comparison.memberDefinition?.id;
      if (memberComparable && comparisonTeams.size === teamIds.length) {
        add(errors, Number.isSafeInteger(data.headline?.monthlyDelta),
          'headline monthlyDelta must be an integer');
        for (const teamId of teamIds) {
          const current = dataTeams.get(teamId);
          add(errors, Number.isSafeInteger(current?.monthlyDelta),
            \`team \${teamId}: monthlyDelta must be an integer\`);
        }
      } else {
        add(errors, data.headline?.monthlyDelta === null,
          'headline monthlyDelta must be null when member definitions differ');
        for (const teamId of teamIds) {
          add(errors, dataTeams.get(teamId)?.monthlyDelta === null,
            \`team \${teamId}: monthlyDelta must be null when member definitions differ\`);
        }
      }
    }`,
);

await replaceOnce(
  'scripts/validate-snapshot.mjs',
  `  add(errors,
    events.events?.length === manifest.invariants?.expectedEligibleEventCount,`,
  `  if (data.memberDeltaDefinition === MEMBER_DELTA_DEFINITION) {
    try { assertMemberMonthlyState(data); } catch (error) { add(errors, false, error.message); }
  } else if (data.memberDeltaDefinition !== undefined) {
    add(errors, false, 'memberDeltaDefinition is unsupported');
  }

  add(errors,
    events.events?.length === manifest.invariants?.expectedEligibleEventCount,`,
);

await replaceOnce(
  'index.html',
  '        const formatDelta = (value) => Number.isFinite(value) ? (value > 0 ? `+${value}` : `${value}`) : "比較対象外";\n',
  '        const formatDelta = (value) => Number.isFinite(value) ? (value > 0 ? `+${value}` : `${value}`) : "比較対象外";\n        const memberDeltaComparable = data.memberDeltaDefinition === "previous-month-end-v1";\n',
);

await replaceOnce(
  'index.html',
  '        const headlineMemberDeltaComparable = Number.isFinite(data.headline.monthlyDelta);',
  '        const headlineMemberDeltaComparable = memberDeltaComparable && Number.isFinite(data.headline.monthlyDelta);',
);

await replaceOnce(
  'index.html',
  '[headlineMemberDeltaComparable ? "前月差（参考）" : "前月差（比較対象外）", formatDelta(data.headline.monthlyDelta), headlineMemberDeltaComparable ? "名" : "", ""],',
  '[headlineMemberDeltaComparable ? "前月末比 純増減" : "前月末比 純増減（比較対象外）", formatDelta(headlineMemberDeltaComparable ? data.headline.monthlyDelta : null), headlineMemberDeltaComparable ? "名" : "", ""],',
);

await replaceOnce(
  'index.html',
  '          const deltaClass = Number.isFinite(team.monthlyDelta) ? (team.monthlyDelta >= 0 ? "delta-positive" : "delta-negative") : "";',
  '          const deltaClass = memberDeltaComparable && Number.isFinite(team.monthlyDelta) ? (team.monthlyDelta >= 0 ? "delta-positive" : "delta-negative") : "";',
);

await replaceOnce(
  'index.html',
  '                  <p class="team-meta">前月差 <span class="${deltaClass}">${formatDelta(team.monthlyDelta)}${Number.isFinite(team.monthlyDelta) ? "名" : ""}</span></p>',
  '                  <p class="team-meta">前月末比 純増減 <span class="${deltaClass}">${formatDelta(memberDeltaComparable ? team.monthlyDelta : null)}${memberDeltaComparable && Number.isFinite(team.monthlyDelta) ? "名" : ""}</span></p>',
);

await replaceOnce('README.md', '- 会員数と前月差', '- 会員数と前月末比の純増減');
await replaceOnce(
  'README.md',
  'It updates the public aggregate in `data.js`, stamps all four public data files with one snapshot ID, and refreshes `snapshot-manifest.json`. A definition change deliberately marks member deltas as not comparable until a prior snapshot generated under the same definition is available.',
  'It updates the public aggregate in `data.js`, stamps all four public data files with one snapshot ID, and refreshes `snapshot-manifest.json`. Member net change is calculated only from the exact previous calendar month-end snapshot under the same member definition; otherwise it fails closed as not comparable. The daily `comparison` remains independent so new-admission notices and previous-public movement continue to use the prior publication.',
);

await replaceOnce(
  'test/publish-operational-member-snapshot.test.mjs',
  "test('same-definition next snapshot rolls current into comparison and calculates deltas', async () => {",
  "test('same-definition next snapshot rolls current into publication comparison and fails closed without a month-end baseline', async () => {",
);

await replaceOnce(
  'test/publish-operational-member-snapshot.test.mjs',
  `    assert.equal(data.headline.members, 1061);
    assert.equal(data.headline.monthlyDelta, 3);
    assert.deepEqual(Object.fromEntries(data.teams.map((team) => [team.id, team.monthlyDelta])), { A: 2, B: -2, C: 2, D: 1 });`,
  `    assert.equal(data.headline.members, 1061);
    assert.equal(data.memberDeltaDefinition, 'previous-month-end-v1');
    assert.equal(data.memberMonthlyComparison, null);
    assert.equal(data.headline.monthlyDelta, null);
    assert(data.teams.every((team) => team.monthlyDelta === null));`,
);

await replaceOnce(
  'test/publish-operational-member-snapshot.test.mjs',
  `    assert.notEqual(data.comparison.previousAsOf, data.asOf);
    assert.equal(data.headline.monthlyDelta, 3);`,
  `    assert.notEqual(data.comparison.previousAsOf, data.asOf);
    assert.equal(data.memberMonthlyComparison, null);
    assert.equal(data.headline.monthlyDelta, null);`,
);

await replaceOnce(
  'test/publish-operational-member-snapshot.test.mjs',
  `test('rejects an older asOf before changing public files', async () => {`,
  `test('previous month-end baseline stays fixed while publication comparison rolls daily', async () => {
  const augustEnd = { A: 333, B: 309, C: 224, D: 192 };
  const root = await fixture(publicSnapshot({ asOf: '2026-08-31', definition: 'operational-person-v1', counts: augustEnd }));
  try {
    await publishOperationalMemberSnapshot({
      rootDir: root,
      input: inputForCounts('2026-09-01', { A: 333, B: 308, C: 224, D: 191 }),
    });
    await publishOperationalMemberSnapshot({
      rootDir: root,
      input: inputForCounts('2026-09-02', { A: 332, B: 307, C: 223, D: 190 }),
    });
    const data = parseFrozenJson(await readFile(join(root, 'data.js'), 'utf8'));
    assert.equal(data.comparison.previousAsOf, '2026-09-01');
    assert.equal(data.memberMonthlyComparison.previousAsOf, '2026-08-31');
    assert.equal(data.headline.monthlyDelta, -6);
    assert.deepEqual(Object.fromEntries(data.teams.map((team) => [team.id, team.monthlyDelta])), { A: -1, B: -2, C: -1, D: -2 });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects an older asOf before changing public files', async () => {`,
);

console.log('monthly member net change patch applied');
