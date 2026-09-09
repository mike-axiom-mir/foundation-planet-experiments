import assert from 'node:assert/strict';
import {
  AsyncWorldStateStore,
  INDEXED_DB_WORLD_STATE_STORAGE_SCHEMA,
  createBrowserWorldStateStore
} from './core/browser-world-state.mjs';
import { encodeStoredEnvelope } from './core/world-state.mjs';

class MemoryStorage {
  constructor(values = new Map()) {
    this.values = values;
    this.failRead = false;
    this.failWrite = false;
  }

  getItem(key) {
    if (this.failRead) throw new Error('injected read failure');
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    if (this.failWrite) throw new Error('injected write failure');
    this.values.set(key, String(value));
  }
}

class AsyncMemoryStorage extends MemoryStorage {
  async getItem(key) { return super.getItem(key); }
  async setItem(key, value) { super.setItem(key, value); }
}

const key = 'foundation-planet-selftest-v2';
const payload = {
  profileId: 'temperate',
  day: 118.5,
  canonicalCells: Array.from({ length: 128 }, (_, index) => ({
    id: `cell-${index}`,
    waterKg: index * 17,
    carbonKg: index * 3
  }))
};

const primary = new AsyncMemoryStorage();
const store = new AsyncWorldStateStore({
  storage: primary,
  legacyStorage: new MemoryStorage(),
  key,
  backend: 'test-indexeddb-v1'
});

assert.equal(await store.load(), null, 'fresh async store is empty');
const revisionOne = await store.commit(payload, {
  kind: 'create-world', actor: 'selftest'
}, { expectedRevision: 0 });
assert.equal(revisionOne.revision, 1, 'first durable commit advances revision');
assert.equal(store.descriptor().backend, 'test-indexeddb-v1');
assert.equal(
  store.descriptor().storageSchema,
  INDEXED_DB_WORLD_STATE_STORAGE_SCHEMA,
  'descriptor declares the transport schema'
);

const restoredStore = new AsyncWorldStateStore({
  storage: primary,
  legacyStorage: new MemoryStorage(),
  key,
  backend: 'test-indexeddb-v1'
});
const restored = await restoredStore.load();
assert.deepEqual(restored, revisionOne, 'async checkpoint round-trips exactly');
assert.equal(restoredStore.descriptor().loadStatus, 'restored-indexeddb-v1');
assert.equal(restoredStore.descriptor().held, false);

await assert.rejects(
  restoredStore.commit({ ...payload, day: 119 }, { kind: 'stale' }, {
    expectedRevision: 0
  }),
  error => error.code === 'REVISION_CONFLICT',
  'optimistic concurrency survives the async adapter'
);

primary.failWrite = true;
await assert.rejects(
  restoredStore.commit({ ...payload, day: 119 }, { kind: 'injected-failure' }, {
    expectedRevision: 1
  }),
  /injected write failure/,
  'failed durable writes surface to the caller'
);
assert.equal(
  restoredStore.descriptor().revision,
  1,
  'failed durable writes do not advance in-memory canonical state'
);
assert.deepEqual(restoredStore.envelope, revisionOne);
primary.failWrite = false;

const legacyTransport = new MemoryStorage(new Map([
  [key, encodeStoredEnvelope(revisionOne)]
]));
const migratedPrimary = new AsyncMemoryStorage();
const migratedStore = new AsyncWorldStateStore({
  storage: migratedPrimary,
  legacyStorage: legacyTransport,
  key,
  backend: 'test-indexeddb-v1'
});
assert.deepEqual(
  await migratedStore.load(),
  revisionOne,
  'valid localStorage v2 checkpoint migrates without a new revision'
);
assert.equal(migratedStore.descriptor().revision, 1);
assert.equal(migratedStore.descriptor().loadStatus, 'migrated-browser-local-v2');
assert.deepEqual(
  JSON.parse(migratedPrimary.values.get(key)),
  revisionOne,
  'migration writes the same canonical envelope to the new backend'
);
assert.ok(
  legacyTransport.getItem(key),
  'migration preserves the legacy source bytes as recovery evidence'
);

const tamperedPrimary = new AsyncMemoryStorage(new Map(primary.values));
const tampered = JSON.parse(tamperedPrimary.values.get(key));
tampered.payload.day = 999;
tamperedPrimary.values.set(key, JSON.stringify(tampered));
const heldStore = new AsyncWorldStateStore({
  storage: tamperedPrimary,
  legacyStorage: legacyTransport,
  key
});
assert.equal(await heldStore.load(), null, 'tampered primary checkpoint is rejected');
assert.equal(heldStore.descriptor().loadStatus, 'held-invalid');
assert.equal(heldStore.descriptor().held, true);
await assert.rejects(
  heldStore.commit(payload, { kind: 'overwrite-held-state' }),
  error => error.code === 'WORLD_STATE_HELD',
  'invalid primary state cannot be overwritten by a fresh lineage'
);

const unavailablePrimary = new AsyncMemoryStorage();
unavailablePrimary.failRead = true;
const unavailableStore = new AsyncWorldStateStore({
  storage: unavailablePrimary,
  legacyStorage: legacyTransport,
  key
});
assert.equal(await unavailableStore.load(), null);
assert.equal(unavailableStore.descriptor().held, true);
assert.equal(
  unavailableStore.descriptor().loadError.code,
  'WORLD_STATE_READ_FAILED',
  'backend failures remain distinct from empty state'
);

const legacyV1Storage = new MemoryStorage(new Map([
  ['legacy-v1', JSON.stringify({
    schema: 'axm.foundation-planet.save/v1',
    profileId: 'temperate',
    day: 42
  })]
]));
const legacyV1Store = new AsyncWorldStateStore({
  storage: new AsyncMemoryStorage(),
  legacyStorage: legacyV1Storage,
  key: 'migrated-v2',
  legacyKey: 'legacy-v1'
});
const migratedV1 = await legacyV1Store.load();
assert.equal(migratedV1.revision, 1);
assert.equal(migratedV1.payload.day, 42);
assert.equal(
  legacyV1Store.descriptor().loadStatus,
  'migrated-v1-to-indexeddb-v1',
  'v1 payload migration lands in the durable backend'
);

const fallbackStorage = new MemoryStorage();
const fallbackStore = createBrowserWorldStateStore({
  indexedDB: null,
  legacyStorage: fallbackStorage,
  key: 'fallback-v2',
  legacyKey: 'fallback-v1'
});
assert.equal(await fallbackStore.load(), null);
await fallbackStore.commit(payload, { kind: 'fallback-create' }, {
  expectedRevision: 0
});
assert.equal(fallbackStore.descriptor().backend, 'browser-localstorage-v2');
assert.equal(fallbackStore.descriptor().revision, 1);
assert.ok(fallbackStorage.getItem('fallback-v2'));

console.log('foundation planet browser world-state selftest: PASS (30 assertions)');
