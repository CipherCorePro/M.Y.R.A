import { TextChunk } from '../types';

const DB_NAME = 'MyraKnowledgeBase';
const DB_VERSION = 2; // Incremented DB_VERSION due to schema change (new index)
const CHUNK_STORE_NAME = 'textChunks';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) {
    return dbPromise;
  }
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject(request.error);
      dbPromise = null; // Reset promise on error
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      let store;
      if (!db.objectStoreNames.contains(CHUNK_STORE_NAME)) {
        store = db.createObjectStore(CHUNK_STORE_NAME, { keyPath: 'id' });
      } else {
        // Ensured transaction is available, which it always is in onupgradeneeded
        const transaction = (event.target as IDBOpenDBRequest).transaction;
        if (!transaction) {
            console.error("Transaction not available during DB upgrade for store access.");
            dbPromise = null; // Reset promise
            reject(new Error("Transaction not available during upgrade for store access"));
            return;
        }
        store = transaction.objectStore(CHUNK_STORE_NAME);
      }
      
      // Add 'source' index if it doesn't exist
      if (store && !store.indexNames.contains('source')) {
        store.createIndex('source', 'source', { unique: false });
        console.log("Created 'source' index on textChunks store.");
      }
    };
  });
  return dbPromise;
}

export async function addChunksToDB(chunks: TextChunk[]): Promise<void> {
  if (!chunks || chunks.length === 0) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHUNK_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(CHUNK_STORE_NAME);

    chunks.forEach(chunk => {
      try {
        store.put(chunk); // Use put to add or update
      } catch (e) {
        console.error("Error putting chunk in DB:", e, chunk);
        // Optionally, try to recover or skip this chunk
      }
    });

    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      console.error('Transaction error on addChunksToDB:', transaction.error);
      reject(transaction.error);
    };
  });
}

export async function getAllChunksFromDB(): Promise<TextChunk[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHUNK_STORE_NAME, 'readonly');
    const store = transaction.objectStore(CHUNK_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => {
      console.error('Error fetching all chunks:', request.error);
      reject(request.error);
    };
  });
}

export async function clearAllChunksFromDB(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHUNK_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(CHUNK_STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      console.error('Error clearing chunk store:', request.error);
      reject(request.error);
    };
  });
}

export async function clearChunksBySourceFromDB(sourceName: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHUNK_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(CHUNK_STORE_NAME);
    
    if (!store.indexNames.contains('source')) {
      console.warn(`'source' index not found on ${CHUNK_STORE_NAME}. Skipping clearChunksBySourceFromDB for ${sourceName}.`);
      resolve(); // Resolve an empty promise or reject if this is critical
      return;
    }
    const index = store.index('source');
    const request = index.openCursor(IDBKeyRange.only(sourceName));

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      console.error(`Transaction error on clearChunksBySourceFromDB for ${sourceName}:`, transaction.error);
      reject(transaction.error);
    };
  });
}