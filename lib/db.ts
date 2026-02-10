import type { Entry, UserStats } from "./types";
import { makeInitialStats } from "./growth";

const DB_NAME = "seed-journal";
const DB_VERSION = 1;
const ENTRIES_STORE = "entries";
const STATS_STORE = "stats";
const STATS_KEY = "singleton";

interface JournalDB {
  getEntries: () => Promise<Entry[]>;
  getStats: () => Promise<UserStats>;
  saveEntryAndStats: (entry: Entry, stats: UserStats) => Promise<void>;
  importAll: (entries: Entry[], stats: UserStats) => Promise<void>;
  resetAll: () => Promise<void>;
}

class MemoryDB implements JournalDB {
  private entries: Entry[] = [];
  private stats: UserStats = makeInitialStats();

  async getEntries(): Promise<Entry[]> {
    return [...this.entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getStats(): Promise<UserStats> {
    return { ...this.stats };
  }

  async saveEntryAndStats(entry: Entry, stats: UserStats): Promise<void> {
    this.entries.unshift(entry);
    this.stats = { ...stats };
  }

  async importAll(entries: Entry[], stats: UserStats): Promise<void> {
    this.entries = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    this.stats = { ...stats };
  }

  async resetAll(): Promise<void> {
    this.entries = [];
    this.stats = makeInitialStats();
  }
}

const openIndexedDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
        db.createObjectStore(ENTRIES_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STATS_STORE)) {
        db.createObjectStore(STATS_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

class IndexedJournalDB implements JournalDB {
  constructor(private db: IDBDatabase) {}

  async getEntries(): Promise<Entry[]> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(ENTRIES_STORE, "readonly");
      const store = tx.objectStore(ENTRIES_STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const entries = (req.result as Entry[]).sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt)
        );
        resolve(entries);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getStats(): Promise<UserStats> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STATS_STORE, "readonly");
      const req = tx.objectStore(STATS_STORE).get(STATS_KEY);
      req.onsuccess = () => resolve((req.result as UserStats | undefined) ?? makeInitialStats());
      req.onerror = () => reject(req.error);
    });
  }

  async saveEntryAndStats(entry: Entry, stats: UserStats): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([ENTRIES_STORE, STATS_STORE], "readwrite");
      tx.objectStore(ENTRIES_STORE).put(entry);
      tx.objectStore(STATS_STORE).put(stats, STATS_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async importAll(entries: Entry[], stats: UserStats): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([ENTRIES_STORE, STATS_STORE], "readwrite");
      const entryStore = tx.objectStore(ENTRIES_STORE);
      const clearReq = entryStore.clear();
      clearReq.onerror = () => reject(clearReq.error);
      clearReq.onsuccess = () => {
        entries.forEach((entry) => entryStore.put(entry));
        tx.objectStore(STATS_STORE).put(stats, STATS_KEY);
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async resetAll(): Promise<void> {
    return this.importAll([], makeInitialStats());
  }
}

let singleton: JournalDB | null = null;

export const getDB = async (): Promise<JournalDB> => {
  if (singleton) return singleton;
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    singleton = new MemoryDB();
    return singleton;
  }

  try {
    const db = await openIndexedDB();
    singleton = new IndexedJournalDB(db);
    return singleton;
  } catch (error) {
    console.error("IndexedDB unavailable, falling back to memory", error);
    singleton = new MemoryDB();
    return singleton;
  }
};
