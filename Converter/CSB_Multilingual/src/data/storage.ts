import type { DocumentRecord } from '../types';

const databaseName = 'csb-multilingual';
const storeName = 'documents';

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open local document storage.'));
  });
}

async function requestResult<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  return new Promise<T>((resolve, reject) => {
    const request = action(db.transaction(storeName, mode).objectStore(storeName));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Local document storage is unavailable.'));
  }).finally(() => db.close());
}

export const documentStore = {
  async all(): Promise<DocumentRecord[]> {
    const records = await requestResult<DocumentRecord[]>('readonly', (store) => store.getAll());
    return records.sort((a, b) => b.updatedAt - a.updatedAt);
  },
  save(record: DocumentRecord): Promise<IDBValidKey> {
    return requestResult('readwrite', (store) => store.put(record));
  },
  remove(id: string): Promise<undefined> {
    return requestResult('readwrite', (store) => store.delete(id));
  },
};

const preferenceKey = 'csb-multilingual:preferences';

export function readPreferences<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(preferenceKey);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function savePreferences(value: unknown): void {
  try { localStorage.setItem(preferenceKey, JSON.stringify(value)); } catch { /* Preferences are optional. */ }
}
