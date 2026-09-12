import assert from 'node:assert/strict';
import {
  COMPRESSED_WORLD_STATE_ENCODING,
  COMPRESSED_WORLD_STATE_STORAGE_SCHEMA,
  LEGACY_COMPRESSED_WORLD_STATE_ENCODING,
  WorldStateStore,
  decodeStoredEnvelope,
  encodeStoredEnvelope
} from './core/world-state.mjs';

const saveKey = 'AXM_FOUNDATION_PLANET_SAVE_V2_TEST';

// Chromium localStorage serializes each string with one format byte and then
// Latin-1 or UTF-16 bytes. This is the conservative comparison boundary.
function chromiumStorageBytes(value) {
  let latin1 = true;
  for (let index = 0; index < value.length; index++) {
    if (value.charCodeAt(index) > 0xff) {
      latin1 = false;
      break;
    }
  }
  return 1 + value.length * (latin1 ? 1 : 2);
}

function entryStorageBytes(key, value) {
  return chromiumStorageBytes(key) + chromiumStorageBytes(value);
}

class QuotaStorage {
  constructor(quotaBytes) {
    this.quotaBytes = quotaBytes;
    this.values = new Map();
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    const nextValue = String(value);
    let used = 0;
    for (const [storedKey, storedValue] of this.values) {
      if (storedKey !== key) used += entryStorageBytes(storedKey, storedValue);
    }
    used += entryStorageBytes(key, nextValue);
    if (used > this.quotaBytes) {
      const error = new Error(`quota exceeded: ${used} > ${this.quotaBytes}`);
      error.name = 'QuotaExceededError';
      throw error;
    }
    this.values.set(key, nextValue);
  }
}

const payload = {
  frame: 18_470,
  identity: 'Caelus 🌍 deterministic persistence fixture',
  climate: Array.from({ length: 4_096 }, (_, index) => ({
    cell: index,
    temperatureC: (index % 83) - 41,
    moisture: (index * 17) % 101,
    biome: ['ocean', 'coast', 'grassland', 'forest'][index % 4]
  })),
  basins: Array.from({ length: 2_048 }, (_, index) => ({
    id: `basin-${index}`,
    downstream: index === 0 ? null : Math.floor((index - 1) / 2),
    discharge: (index * 7919) % 65_521
  }))
};

const memoryStore = new WorldStateStore({ storage: null });
const envelope = memoryStore.commit(payload, {
  kind: 'persistence-selftest',
  actor: 'foundation-planet'
});
const compactRaw = encodeStoredEnvelope(envelope);
const compactWrapper = JSON.parse(compactRaw);
const decoded = decodeStoredEnvelope(compactWrapper);

assert.equal(compactWrapper.encoding, COMPRESSED_WORLD_STATE_ENCODING);
assert.deepEqual(decoded.envelope, envelope, 'compact save round-trips losslessly');
assert.equal(encodeStoredEnvelope(envelope), compactRaw,
  'compact encoding is deterministic');

const legacyBase64Characters = 4 * Math.ceil(compactWrapper.compressedBytes / 3);
const legacyRaw = JSON.stringify({
  schema: COMPRESSED_WORLD_STATE_STORAGE_SCHEMA,
  encoding: LEGACY_COMPRESSED_WORLD_STATE_ENCODING,
  uncompressedCharacters: compactWrapper.uncompressedCharacters,
  uncompressedBytes: compactWrapper.uncompressedBytes,
  data: 'A'.repeat(legacyBase64Characters)
});
const compactStorageBytes = entryStorageBytes(saveKey, compactRaw);
const legacyStorageBytes = entryStorageBytes(saveKey, legacyRaw);
const rawStorageBytes = entryStorageBytes(saveKey, JSON.stringify(envelope));

assert.ok(compactStorageBytes < legacyStorageBytes,
  'UTF-15 packing is smaller than the previous Base64 wrapper');
assert.ok(rawStorageBytes > compactStorageBytes,
  'uncompressed JSON remains larger than the compact fallback');

const quotaBytes = Math.floor((compactStorageBytes + legacyStorageBytes) / 2);
assert.ok(compactStorageBytes <= quotaBytes && legacyStorageBytes > quotaBytes,
  'fixture isolates a quota boundary where compact fits and Base64 does not');

const quotaStorage = new QuotaStorage(quotaBytes);
const quotaStore = new WorldStateStore({ storage: quotaStorage, key: saveKey });
const committed = quotaStore.commit(payload, {
  kind: 'persistence-selftest',
  actor: 'foundation-planet'
});
assert.equal(quotaStore.descriptor().storageEncoding,
  COMPRESSED_WORLD_STATE_ENCODING, 'quota fallback used compact storage');

const restoredStore = new WorldStateStore({ storage: quotaStorage, key: saveKey });
const restored = restoredStore.load();
assert.deepEqual(restored, committed, 'quota-bound save restores exactly');
assert.equal(restored.integrity.checksum, committed.integrity.checksum,
  'deterministic checksum survives save and restore');
assert.equal(restoredStore.descriptor().loadStatus, 'restored-v2-compressed');

const legacyFixture = {
  schema: COMPRESSED_WORLD_STATE_STORAGE_SCHEMA,
  encoding: LEGACY_COMPRESSED_WORLD_STATE_ENCODING,
  uncompressedCharacters: 2,
  uncompressedBytes: 2,
  data: 'AHsAfQ=='
};
assert.deepEqual(decodeStoredEnvelope(legacyFixture), {
  envelope: {},
  encoding: LEGACY_COMPRESSED_WORLD_STATE_ENCODING
}, 'previous Base64 saves remain readable');

const reductionPercent = Math.round(
  (1 - compactStorageBytes / legacyStorageBytes) * 1_000
) / 10;
console.log(
  'foundation planet storage selftest: PASS',
  `(compact ${compactStorageBytes} bytes; legacy ${legacyStorageBytes} bytes;`,
  `${reductionPercent}% smaller at the conservative encoded-storage boundary)`
);
