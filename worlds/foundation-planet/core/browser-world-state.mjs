import {
  LEGACY_SAVE_SCHEMA,
  WorldStateStore,
  decodeStoredEnvelope,
  migrateLegacySave,
  validateSaveEnvelope
} from './world-state.mjs';

export const INDEXED_DB_WORLD_STATE_STORAGE_SCHEMA =
  'axm.foundation-planet.indexeddb-world-state-storage/v1';

const DEFAULT_DATABASE = 'AXM_FOUNDATION_PLANET_STATE';
const DEFAULT_OBJECT_STORE = 'checkpoints';

function requestResult(request, label) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error(`${label} failed`));
  });
}

export class IndexedDbKeyValueStorage {
  constructor(options = {}) {
    if (!options.indexedDB) throw new Error('IndexedDB is unavailable');
    this.indexedDB = options.indexedDB;
    this.databaseName = options.databaseName || DEFAULT_DATABASE;
    this.objectStoreName = options.objectStoreName || DEFAULT_OBJECT_STORE;
    this.databaseVersion = 1;
    this.databasePromise = null;
  }

  open() {
    if (this.databasePromise) return this.databasePromise;
    this.databasePromise = new Promise((resolve, reject) => {
      const request = this.indexedDB.open(this.databaseName, this.databaseVersion);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(this.objectStoreName)) {
          request.result.createObjectStore(this.objectStoreName);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
      request.onblocked = () => reject(new Error('IndexedDB upgrade blocked'));
    });
    return this.databasePromise;
  }

  async getItem(key) {
    const database = await this.open();
    const transaction = database.transaction(this.objectStoreName, 'readonly');
    const value = await requestResult(
      transaction.objectStore(this.objectStoreName).get(String(key)),
      'IndexedDB read'
    );
    return value === undefined ? null : String(value);
  }

  async setItem(key, value) {
    const database = await this.open();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(this.objectStoreName, 'readwrite');
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(
        transaction.error || new Error('IndexedDB write aborted')
      );
      transaction.onerror = () => reject(
        transaction.error || new Error('IndexedDB write failed')
      );
      transaction.objectStore(this.objectStoreName).put(String(value), String(key));
    });
  }
}

class AsyncStorageAdapter {
  constructor(storage) {
    if (!storage) throw new Error('browser key-value storage is unavailable');
    this.storage = storage;
  }
  async getItem(key) { return this.storage.getItem(key); }
  async setItem(key, value) { this.storage.setItem(key, value); }
}

function decodeAndValidate(raw) {
  const parsed = JSON.parse(raw);
  const decoded = decodeStoredEnvelope(parsed);
  const validation = validateSaveEnvelope(decoded.envelope);
  if (!validation.valid) {
    const error = new Error(`invalid world-state checkpoint: ${validation.reason}`);
    error.code = 'INVALID_WORLD_STATE';
    error.reason = validation.reason;
    throw error;
  }
  return decoded;
}

export class AsyncWorldStateStore {
  constructor(options = {}) {
    if (!options.storage) throw new Error('async world-state storage is required');
    this.storage = options.storage;
    this.legacyStorage = options.legacyStorage || null;
    this.key = options.key || 'AXM_FOUNDATION_PLANET_SAVE_V2';
    this.legacyKey = options.legacyKey || 'AXM_FOUNDATION_PLANET_SAVE_V1';
    this.backend = options.backend || 'async-key-value-v1';
    this.delegate = new WorldStateStore({
      storage: null,
      key: this.key,
      legacyKey: this.legacyKey,
      maxJournal: options.maxJournal
    });
    this.loadStatus = 'empty';
    this.storageEncoding = 'json';
    this.held = false;
    this.loadError = null;
  }

  get envelope() { return this.delegate.envelope; }

  hold(error) {
    this.held = true;
    this.loadStatus = 'held-invalid';
    this.loadError = {
      code: error?.code || error?.name || 'INVALID_WORLD_STATE',
      reason: error?.reason || error?.message || 'invalid checkpoint'
    };
    return null;
  }

  accept(decoded, loadStatus) {
    this.delegate.envelope = decoded.envelope;
    this.delegate.storageEncoding = decoded.encoding;
    this.storageEncoding = decoded.encoding;
    this.loadStatus = loadStatus;
    return this.delegate.envelope;
  }

  async load() {
    let raw;
    try {
      raw = await this.storage.getItem(this.key);
    } catch (error) {
      const readError = new Error(error?.message || 'world-state read failed');
      readError.code = 'WORLD_STATE_READ_FAILED';
      return this.hold(readError);
    }
    if (raw !== null) {
      try {
        return this.accept(decodeAndValidate(raw), 'restored-indexeddb-v1');
      } catch (error) {
        return this.hold(error);
      }
    }

    if (!this.legacyStorage) return null;
    try {
      const currentRaw = this.legacyStorage.getItem(this.key);
      if (currentRaw !== null) {
        const decoded = decodeAndValidate(currentRaw);
        await this.storage.setItem(this.key, JSON.stringify(decoded.envelope));
        return this.accept(
          { envelope: decoded.envelope, encoding: 'json' },
          'migrated-browser-local-v2'
        );
      }

      const legacy = JSON.parse(this.legacyStorage.getItem(this.legacyKey) || 'null');
      const migrated = migrateLegacySave(legacy);
      if (!migrated) return null;
      await this.commit(migrated.payload, {
        kind: 'migrate-save',
        actor: 'foundation-planet',
        details: { ...migrated.migration, sourceSchema: LEGACY_SAVE_SCHEMA }
      }, { expectedRevision: 0 });
      this.loadStatus = 'migrated-v1-to-indexeddb-v1';
      return this.envelope;
    } catch (error) {
      return this.hold(error);
    }
  }

  async commit(payload, action = {}, options = {}) {
    if (this.held) {
      const error = new Error('world-state checkpoint is held after an invalid load');
      error.code = 'WORLD_STATE_HELD';
      throw error;
    }
    const previous = this.delegate.envelope;
    const previousEncoding = this.delegate.storageEncoding;
    const next = this.delegate.commit(payload, action, options);
    try {
      await this.storage.setItem(this.key, JSON.stringify(next));
    } catch (error) {
      this.delegate.envelope = previous;
      this.delegate.storageEncoding = previousEncoding;
      throw error;
    }
    this.storageEncoding = 'json';
    if (previous === null && this.loadStatus === 'empty') {
      this.loadStatus = 'created-indexeddb-v1';
    }
    return next;
  }

  payload() { return this.delegate.payload(); }

  descriptor() {
    return {
      ...this.delegate.descriptor(),
      storageSchema: INDEXED_DB_WORLD_STATE_STORAGE_SCHEMA,
      backend: this.backend,
      storageEncoding: this.storageEncoding,
      loadStatus: this.loadStatus,
      held: this.held,
      loadError: this.loadError
    };
  }
}

export function createBrowserWorldStateStore(options = {}) {
  const indexedDB = options.indexedDB === undefined
    ? globalThis.indexedDB
    : options.indexedDB;
  const legacyStorage = options.legacyStorage === undefined
    ? globalThis.localStorage
    : options.legacyStorage;
  if (indexedDB) {
    return new AsyncWorldStateStore({
      ...options,
      storage: new IndexedDbKeyValueStorage({
        indexedDB,
        databaseName: options.databaseName,
        objectStoreName: options.objectStoreName
      }),
      legacyStorage,
      backend: 'browser-indexeddb-v1'
    });
  }
  return new AsyncWorldStateStore({
    ...options,
    storage: new AsyncStorageAdapter(legacyStorage),
    legacyStorage,
    backend: 'browser-localstorage-v2'
  });
}

export function browserWorldStateDescription() {
  return {
    schema: INDEXED_DB_WORLD_STATE_STORAGE_SCHEMA,
    canonicalEnvelope: 'axm.foundation-planet.world-state/v2',
    backend: 'browser-indexeddb-v1',
    atomicRecordWrite: true,
    legacySources: [
      'axm.foundation-planet.world-state/v2',
      LEGACY_SAVE_SCHEMA
    ],
    invalidPrimaryHeld: true,
    authoritativeSharedHost: false,
    localOnly: true
  };
}
