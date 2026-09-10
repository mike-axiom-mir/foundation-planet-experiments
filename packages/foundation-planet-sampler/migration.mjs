import { createHash } from 'node:crypto';

import {
  canonicalJson,
  createSampleReceipt,
  verifyLegacySampleReceipt,
  verifySampleReceipt,
} from './index.mjs';

export const MIGRATION_SCHEMA = 'axm.foundation-planet.sample-receipt-migration/v1';
export const MIGRATION_VERIFICATION_SCHEMA = 'axm.foundation-planet.sample-receipt-migration-verification/v1';

const MIGRATION_CAPABILITY_ID = 'axm.foundation-planet.sample-receipt-migrator';
const MIGRATION_CAPABILITY_VERSION = '1.0.0';
const SOURCE_VERSION = '1.0.0';
const TARGET_VERSION = '1.1.0';
const AUTHORITY = Object.freeze({
  appliesState: false,
  replacesSourceEvidence: false,
  canonical: false,
});

const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const sha256 = value => createHash('sha256').update(canonicalJson(value)).digest('hex');

function assertPlainObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new TypeError(`${label} must be a plain object`);
  }
}

function assertExactKeys(value, allowed, label) {
  const unexpected = Object.keys(value).filter(key => !allowed.includes(key));
  if (unexpected.length > 0) throw new TypeError(`${label} contains unsupported fields: ${unexpected.join(', ')}`);
}

function coordinateChanges(source, target) {
  return source.coordinates.flatMap((coordinate, index) => {
    const migrated = target.coordinates[index];
    if (coordinate.lat === migrated.lat && coordinate.lon === migrated.lon) return [];
    const change = {
      index,
      from: { lat: coordinate.lat, lon: coordinate.lon },
      to: { lat: migrated.lat, lon: migrated.lon },
    };
    if (own(coordinate, 'id')) change.id = coordinate.id;
    return [change];
  });
}

export function describeMigrationCapability() {
  return {
    schema: 'axm.foundation-planet.sample-receipt-migrator-capability/v1',
    id: MIGRATION_CAPABILITY_ID,
    version: MIGRATION_CAPABILITY_VERSION,
    status: 'EXPERIMENTAL',
    runtime: { kind: 'node-esm', node: '>=20', networkRequired: false },
    operations: ['verify-legacy', 'describe-migration', 'migrate', 'verify-migration'],
    migrationSchema: MIGRATION_SCHEMA,
    verificationSchema: MIGRATION_VERIFICATION_SCHEMA,
    versions: { source: SOURCE_VERSION, target: TARGET_VERSION },
    authority: AUTHORITY,
  };
}

export function createSampleReceiptMigration(legacyReceipt) {
  const sourceVerification = verifyLegacySampleReceipt(legacyReceipt);
  const targetReceipt = createSampleReceipt(legacyReceipt.request);
  const body = {
    schema: MIGRATION_SCHEMA,
    capability: { id: MIGRATION_CAPABILITY_ID, version: MIGRATION_CAPABILITY_VERSION },
    source: {
      capabilityVersion: SOURCE_VERSION,
      receiptDigest: sourceVerification.receiptDigest,
      receipt: structuredClone(legacyReceipt),
    },
    target: {
      capabilityVersion: TARGET_VERSION,
      receiptDigest: targetReceipt.integrity.digest,
      receipt: targetReceipt,
    },
    coordinateChanges: coordinateChanges(legacyReceipt.request, targetReceipt.request),
    authority: AUTHORITY,
  };
  return {
    ...body,
    integrity: { algorithm: 'sha256', digest: sha256(body) },
  };
}

export function verifySampleReceiptMigration(value, expectedDigest) {
  assertPlainObject(value, 'migration');
  assertExactKeys(
    value,
    ['schema', 'capability', 'source', 'target', 'coordinateChanges', 'authority', 'integrity'],
    'migration',
  );
  if (value.schema !== MIGRATION_SCHEMA) throw new TypeError(`migration.schema must be ${MIGRATION_SCHEMA}`);
  assertPlainObject(value.integrity, 'migration.integrity');
  assertExactKeys(value.integrity, ['algorithm', 'digest'], 'migration.integrity');
  if (value.integrity.algorithm !== 'sha256' || !/^[a-f0-9]{64}$/.test(value.integrity.digest)) {
    throw new TypeError('migration.integrity must contain a lowercase SHA-256 digest');
  }
  if (expectedDigest !== undefined && value.integrity.digest !== expectedDigest) {
    throw new Error('migration digest does not match the caller-pinned identity');
  }
  const expected = createSampleReceiptMigration(value.source?.receipt);
  if (canonicalJson(expected) !== canonicalJson(value)) {
    throw new Error('migration does not match deterministic migration replay');
  }
  verifySampleReceipt(value.target.receipt);
  return {
    schema: MIGRATION_VERIFICATION_SCHEMA,
    valid: true,
    migrationDigest: value.integrity.digest,
    sourceReceiptDigest: expected.source.receiptDigest,
    targetReceiptDigest: expected.target.receiptDigest,
    coordinateChangeCount: expected.coordinateChanges.length,
    appliedState: false,
    replacedSourceEvidence: false,
    canonical: false,
  };
}
