import { createHash } from 'node:crypto';

import {
  CONDITION_PROFILES,
  MODEL_SCHEMA,
  PLANET_DEFAULTS,
  modelDescription,
  sampleLatLon,
} from './vendor/planet-model.mjs';

export const SAMPLE_REQUEST_SCHEMA = 'axm.foundation-planet.sample-request/v1';
export const SAMPLE_RECEIPT_SCHEMA = 'axm.foundation-planet.sample-receipt/v1';
export const SAMPLE_VERIFICATION_SCHEMA = 'axm.foundation-planet.sample-verification/v1';

const CAPABILITY_ID = 'axm.foundation-planet.coordinate-sampler';
const CAPABILITY_VERSION = '1.1.0';
const LEGACY_CAPABILITY_VERSION = '1.0.0';
const MAX_COORDINATES = 256;
const MAX_COORDINATE_ID_CHARACTERS = 128;

const COORDINATE_IDENTITY = Object.freeze({
  angularUnit: 'decimal-degrees',
  latitudeRange: '[-90, 90]',
  longitudeRange: '[-180, 180)',
  antimeridianLongitude: -180,
  poleLongitude: 0,
  signedZero: 'positive',
});

const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

function assertPlainObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new TypeError(`${label} must be a plain object`);
  }
}

function assertExactKeys(value, allowed, label) {
  const unexpected = Object.keys(value).filter(key => !allowed.includes(key));
  if (unexpected.length > 0) throw new TypeError(`${label} contains unsupported fields: ${unexpected.join(', ')}`);
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((result, key) => {
      if (value[key] !== undefined) result[key] = stableValue(value[key]);
      return result;
    }, {});
  }
  return value;
}

export function canonicalJson(value) {
  return JSON.stringify(stableValue(value));
}

function sha256(value) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

function normalizeCoordinate(value, index, canonicalIdentity = true) {
  assertPlainObject(value, `coordinates[${index}]`);
  assertExactKeys(value, ['id', 'lat', 'lon'], `coordinates[${index}]`);
  if (!Number.isFinite(value.lat) || value.lat < -90 || value.lat > 90) {
    throw new RangeError(`coordinates[${index}].lat must be finite and between -90 and 90`);
  }
  if (!Number.isFinite(value.lon) || value.lon < -180 || value.lon > 180) {
    throw new RangeError(`coordinates[${index}].lon must be finite and between -180 and 180`);
  }
  const lat = canonicalIdentity && Object.is(value.lat, -0) ? 0 : value.lat;
  let lon = canonicalIdentity && Object.is(value.lon, -0) ? 0 : value.lon;
  if (canonicalIdentity && lon === 180) lon = -180;
  if (canonicalIdentity && Math.abs(lat) === 90) lon = 0;
  const coordinate = { lat, lon };
  if (own(value, 'id')) {
    if (typeof value.id !== 'string' || value.id.length < 1 || value.id.length > MAX_COORDINATE_ID_CHARACTERS || /[\u0000-\u001f\u007f]/.test(value.id)) {
      throw new TypeError(`coordinates[${index}].id must be 1-${MAX_COORDINATE_ID_CHARACTERS} printable characters`);
    }
    coordinate.id = value.id;
  }
  return coordinate;
}

function normalizeRequest(value, canonicalIdentity) {
  assertPlainObject(value, 'request');
  assertExactKeys(value, ['schema', 'profile', 'coordinates'], 'request');
  if (value.schema !== SAMPLE_REQUEST_SCHEMA) throw new TypeError(`request.schema must be ${SAMPLE_REQUEST_SCHEMA}`);
  if (typeof value.profile !== 'string' || !own(CONDITION_PROFILES, value.profile)) {
    throw new TypeError(`request.profile must be one of ${Object.keys(CONDITION_PROFILES).join(', ')}`);
  }
  if (!Array.isArray(value.coordinates) || value.coordinates.length < 1 || value.coordinates.length > MAX_COORDINATES) {
    throw new RangeError(`request.coordinates must contain 1-${MAX_COORDINATES} entries`);
  }
  return {
    schema: SAMPLE_REQUEST_SCHEMA,
    profile: value.profile,
    coordinates: value.coordinates.map((coordinate, index) => normalizeCoordinate(coordinate, index, canonicalIdentity)),
  };
}

export function normalizeSampleRequest(value) {
  return normalizeRequest(value, true);
}

function normalizeLegacySampleRequest(value) {
  return normalizeRequest(value, false);
}

export function describeCapability() {
  const model = modelDescription();
  return {
    schema: 'axm.foundation-planet.sampler-capability/v1',
    id: CAPABILITY_ID,
    version: CAPABILITY_VERSION,
    status: 'EXPERIMENTAL',
    runtime: { kind: 'node-esm', node: '>=20', networkRequired: false },
    operations: ['describe', 'sample', 'verify'],
    requestSchema: SAMPLE_REQUEST_SCHEMA,
    receiptSchema: SAMPLE_RECEIPT_SCHEMA,
    verificationSchema: SAMPLE_VERIFICATION_SCHEMA,
    world: {
      id: PLANET_DEFAULTS.id,
      seed: PLANET_DEFAULTS.seed,
      modelSchema: MODEL_SCHEMA,
      profiles: Object.keys(CONDITION_PROFILES),
    },
    model: {
      coordinateSystem: model.coordinateSystem,
      coordinateIdentity: COORDINATE_IDENTITY,
      deterministic: model.deterministic,
      procedural: model.procedural,
      scientificModel: model.scientificModel,
    },
    limits: {
      maxInputBytes: 1_048_576,
      maxCoordinates: MAX_COORDINATES,
      maxCoordinateIdCharacters: MAX_COORDINATE_ID_CHARACTERS,
    },
    authority: {
      appliesState: false,
      createsHostedWorld: false,
      canonical: false,
      scientificModel: false,
    },
  };
}

function receiptBody(request, capabilityVersion = CAPABILITY_VERSION) {
  const samples = request.coordinates.map(coordinate => ({
    coordinate,
    sample: sampleLatLon(coordinate.lat, coordinate.lon, {
      profile: request.profile,
      seed: PLANET_DEFAULTS.seed,
    }),
  }));
  return {
    schema: SAMPLE_RECEIPT_SCHEMA,
    capability: { id: CAPABILITY_ID, version: capabilityVersion },
    world: { id: PLANET_DEFAULTS.id, seed: PLANET_DEFAULTS.seed, modelSchema: MODEL_SCHEMA },
    request,
    samples,
    authority: { appliedState: false, canonical: false, scientificModel: false },
  };
}

export function createSampleReceipt(value) {
  const request = normalizeSampleRequest(value);
  const body = receiptBody(request);
  return {
    ...body,
    integrity: { algorithm: 'sha256', digest: sha256(body) },
  };
}

function createLegacySampleReceipt(value) {
  const request = normalizeLegacySampleRequest(value);
  const body = receiptBody(request, LEGACY_CAPABILITY_VERSION);
  return {
    ...body,
    integrity: { algorithm: 'sha256', digest: sha256(body) },
  };
}

function verifyReceipt(value, normalizeRequestForVersion, createReceiptForVersion) {
  assertPlainObject(value, 'receipt');
  assertExactKeys(value, ['schema', 'capability', 'world', 'request', 'samples', 'authority', 'integrity'], 'receipt');
  if (value.schema !== SAMPLE_RECEIPT_SCHEMA) throw new TypeError(`receipt.schema must be ${SAMPLE_RECEIPT_SCHEMA}`);
  assertPlainObject(value.integrity, 'receipt.integrity');
  assertExactKeys(value.integrity, ['algorithm', 'digest'], 'receipt.integrity');
  if (value.integrity.algorithm !== 'sha256' || !/^[a-f0-9]{64}$/.test(value.integrity.digest)) {
    throw new TypeError('receipt.integrity must contain a lowercase SHA-256 digest');
  }
  const request = normalizeRequestForVersion(value.request);
  if (canonicalJson(request) !== canonicalJson(value.request)) throw new Error('receipt request is not canonical');
  const expected = createReceiptForVersion(request);
  if (canonicalJson(expected) !== canonicalJson(value)) {
    throw new Error('receipt does not match deterministic replay');
  }
  return expected;
}

export function verifySampleReceipt(value) {
  const expected = verifyReceipt(value, normalizeSampleRequest, createSampleReceipt);
  return {
    schema: SAMPLE_VERIFICATION_SCHEMA,
    valid: true,
    receiptDigest: value.integrity.digest,
    sampleCount: expected.samples.length,
    worldId: PLANET_DEFAULTS.id,
    appliedState: false,
    canonical: false,
  };
}

export function verifyLegacySampleReceipt(value) {
  const expected = verifyReceipt(value, normalizeLegacySampleRequest, createLegacySampleReceipt);
  return {
    schema: SAMPLE_VERIFICATION_SCHEMA,
    valid: true,
    receiptDigest: value.integrity.digest,
    sampleCount: expected.samples.length,
    worldId: PLANET_DEFAULTS.id,
    capabilityVersion: LEGACY_CAPABILITY_VERSION,
    appliedState: false,
    canonical: false,
  };
}
