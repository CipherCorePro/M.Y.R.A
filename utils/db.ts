import { TextChunk } from '../types';

const DB_NAME = 'MyraKnowledgeBase';
const DB_VERSION = 1;
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
      if (!db.objectStoreNames.contains(CHUNK_STORE_NAME)) {
        const store = db.createObjectStore(CHUNK_STORE_NAME, { keyPath: 'id' });
        store.createIndex('source', 'source', { unique: false });
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
