import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { canonicalJson } from '../packages/foundation-planet-sampler/index.mjs';
import { createSampleReceiptMigration } from '../packages/foundation-planet-sampler/migration.mjs';
import { renderSampleReceiptMigrationReview } from '../packages/foundation-planet-sampler/review.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixturePath = path.join(repositoryRoot, 'tests', 'fixtures', 'foundation-planet-sampler-v1.0-antimeridian.json');
const cli = path.join(repositoryRoot, 'packages', 'foundation-planet-sampler', 'cli.mjs');
const digest = value => createHash('sha256').update(canonicalJson(value)).digest('hex');

async function fixture() {
  return JSON.parse(await readFile(fixturePath, 'utf8'));
}

function runCli(args, options = {}) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    input: options.input,
  });
}

test('review turns a verified migration into a bounded human-readable lineage surface', async () => {
  const migration = createSampleReceiptMigration(await fixture());
  const html = renderSampleReceiptMigrationReview(migration, migration.integrity.digest);

  assert.match(html, /^<!doctype html>/);
  assert.match(html, /DETERMINISTIC LINEAGE PASS/);
  assert.match(html, /1\.0\.0/);
  assert.match(html, /1\.1\.0/);
  assert.match(html, /east-antimeridian/);
  assert.match(html, /0°, 180°/);
  assert.match(html, /0°, -180°/);
  assert.match(html, /LOCAL \/ OFFLINE/);
  assert.match(html, /DISPLAY ≠ MIGRATION AUTHORITY/);
  assert.match(html, /SOURCE RETAINED/);
  assert.match(html, /STATE NOT APPLIED/);
  assert.match(html, /NOT CANON/);
  assert.match(html, new RegExp(migration.integrity.digest));
  assert.match(html, new RegExp(migration.source.receipt.integrity.digest));
  assert.match(html, new RegExp(migration.target.receipt.integrity.digest));
  assert.equal((html.match(/data-coordinate-change=/g) || []).length, 1);
  assert.doesNotMatch(html, /https?:\/\//);
  assert.ok(Buffer.byteLength(html, 'utf8') < 180_000, 'review HTML should stay bounded');

  assert.throws(
    () => renderSampleReceiptMigrationReview(migration, '0'.repeat(64)),
    /caller-pinned identity/,
  );
});

test('review escapes receipt-authored labels before HTML realization', async () => {
  const legacy = await fixture();
  const hostile = '</pre><script>globalThis.pwned=true</script>';
  legacy.request.coordinates[0].id = hostile;
  legacy.samples[0].coordinate.id = hostile;
  const { integrity: ignored, ...body } = legacy;
  legacy.integrity.digest = digest(body);

  const migration = createSampleReceiptMigration(legacy);
  const html = renderSampleReceiptMigrationReview(migration);

  assert.doesNotMatch(html, /<script>globalThis\.pwned=true<\/script>/);
  assert.match(html, /&lt;\/pre&gt;&lt;script&gt;globalThis\.pwned=true&lt;\/script&gt;/);
});

test('review-migration CLI verifies before emitting HTML and rejects altered capsules', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'foundation-planet-migration-review-'));
  const migrationPath = path.join(root, 'migration.json');
  const alteredPath = path.join(root, 'altered.json');
  const migration = createSampleReceiptMigration(await fixture());
  await writeFile(migrationPath, JSON.stringify(migration));

  const reviewed = runCli(['review-migration', migrationPath]);
  assert.equal(reviewed.status, 0, reviewed.stderr);
  assert.match(reviewed.stdout, /^<!doctype html>/);
  assert.match(reviewed.stdout, new RegExp(migration.integrity.digest));

  const altered = structuredClone(migration);
  altered.coordinateChanges[0].to.lon = 42;
  const { integrity: ignored, ...alteredBody } = altered;
  altered.integrity.digest = digest(alteredBody);
  await writeFile(alteredPath, JSON.stringify(altered));

  const rejected = runCli(['review-migration', alteredPath]);
  assert.notEqual(rejected.status, 0);
  const error = JSON.parse(rejected.stderr);
  assert.equal(error.schema, 'axm.foundation-planet.sampler-error/v1');
  assert.match(error.message, /deterministic migration/);
  assert.equal(rejected.stdout, '');
});
