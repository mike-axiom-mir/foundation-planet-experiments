import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  createSampleReceiptMigration,
  describeMigrationCapability,
  verifySampleReceiptMigration,
} from '../packages/foundation-planet-sampler/migration.mjs';
import { canonicalJson, createSampleReceipt } from '../packages/foundation-planet-sampler/index.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixturePath = path.join(repositoryRoot, 'tests', 'fixtures', 'foundation-planet-sampler-v1.0-antimeridian.json');
const digest = value => createHash('sha256').update(canonicalJson(value)).digest('hex');

async function legacyFixture() {
  return JSON.parse(await readFile(fixturePath, 'utf8'));
}

test('migrates a verified legacy receipt without replacing its evidence', async () => {
  const legacy = await legacyFixture();
  const capsule = createSampleReceiptMigration(legacy);

  assert.equal(capsule.source.receipt.integrity.digest, legacy.integrity.digest);
  assert.deepEqual(capsule.source.receipt, legacy);
  assert.equal(capsule.target.receipt.capability.version, '1.1.0');
  assert.equal(capsule.target.receipt.request.coordinates[0].lon, -180);
  assert.deepEqual(capsule.coordinateChanges, [{
    index: 0,
    id: 'east-antimeridian',
    from: { lat: 0, lon: 180 },
    to: { lat: 0, lon: -180 },
  }]);
  assert.deepEqual(capsule.authority, {
    appliesState: false,
    replacesSourceEvidence: false,
    canonical: false,
  });

  const verification = verifySampleReceiptMigration(capsule, capsule.integrity.digest);
  assert.equal(verification.valid, true);
  assert.equal(verification.sourceReceiptDigest, legacy.integrity.digest);
  assert.equal(verification.targetReceiptDigest, capsule.target.receipt.integrity.digest);
  assert.equal(verification.coordinateChangeCount, 1);
  assert.deepEqual(
    verifySampleReceiptMigration(JSON.parse(JSON.stringify(capsule))),
    verification,
  );
});

test('migration is deterministic and needs no migration for canonical locations', async () => {
  const legacy = await legacyFixture();
  const first = createSampleReceiptMigration(legacy);
  const second = createSampleReceiptMigration(structuredClone(legacy));
  assert.deepEqual(first, second);

  const unchanged = createSampleReceipt({
    schema: 'axm.foundation-planet.sample-request/v1',
    profile: 'temperate',
    coordinates: [{ id: 'west-antimeridian', lat: 0, lon: -180 }],
  });
  unchanged.capability.version = '1.0.0';
  const { integrity: ignored, ...body } = unchanged;
  unchanged.integrity.digest = digest(body);
  const unchangedCapsule = createSampleReceiptMigration(unchanged);
  assert.deepEqual(unchangedCapsule.coordinateChanges, []);
});

test('holds tampering, re-sealed false legacy results, substitution, and authority escalation', async () => {
  const legacy = await legacyFixture();
  const capsule = createSampleReceiptMigration(legacy);

  const sourceTamper = structuredClone(legacy);
  sourceTamper.samples[0].sample.biome = 'invented';
  const { integrity: ignored, ...sourceBody } = sourceTamper;
  sourceTamper.integrity.digest = digest(sourceBody);
  assert.throws(() => createSampleReceiptMigration(sourceTamper), /deterministic replay/);

  const targetTamper = structuredClone(capsule);
  targetTamper.target.receipt.samples[0].sample.biome = 'invented';
  const { integrity: targetIntegrity, ...targetBody } = targetTamper;
  targetTamper.integrity.digest = digest(targetBody);
  assert.throws(() => verifySampleReceiptMigration(targetTamper), /deterministic migration/);

  const escalated = structuredClone(capsule);
  escalated.authority.appliesState = true;
  const { integrity: authorityIntegrity, ...authorityBody } = escalated;
  escalated.integrity.digest = digest(authorityBody);
  assert.throws(() => verifySampleReceiptMigration(escalated), /deterministic migration/);

  const substituteSource = createSampleReceipt({
    schema: 'axm.foundation-planet.sample-request/v1',
    profile: 'temperate',
    coordinates: [{ id: 'different-valid-source', lat: 0, lon: 0 }],
  });
  substituteSource.capability.version = '1.0.0';
  const { integrity: sourceIntegrity2, ...sourceBody2 } = substituteSource;
  substituteSource.integrity.digest = digest(sourceBody2);
  const substitute = createSampleReceiptMigration(substituteSource);
  assert.equal(verifySampleReceiptMigration(substitute).valid, true);
  assert.throws(
    () => verifySampleReceiptMigration(substitute, capsule.integrity.digest),
    /caller-pinned identity/,
  );
});

test('descriptor exposes bounded offline lineage-only authority', () => {
  const descriptor = describeMigrationCapability();
  assert.equal(descriptor.id, 'axm.foundation-planet.sample-receipt-migrator');
  assert.equal(descriptor.runtime.networkRequired, false);
  assert.deepEqual(descriptor.versions, { source: '1.0.0', target: '1.1.0' });
  assert.deepEqual(descriptor.authority, {
    appliesState: false,
    replacesSourceEvidence: false,
    canonical: false,
  });
});

test('CLI migrates and verifies the same exact lineage offline', async () => {
  const cli = path.join(repositoryRoot, 'packages', 'foundation-planet-sampler', 'cli.mjs');
  const migrated = spawnSync(process.execPath, [cli, 'migrate', fixturePath], { encoding: 'utf8' });
  assert.equal(migrated.status, 0, migrated.stderr);
  const capsule = JSON.parse(migrated.stdout);
  const verified = spawnSync(process.execPath, [cli, 'verify-migration', '-'], {
    encoding: 'utf8',
    input: JSON.stringify(capsule),
  });
  assert.equal(verified.status, 0, verified.stderr);
  assert.equal(JSON.parse(verified.stdout).migrationDigest, capsule.integrity.digest);
});
