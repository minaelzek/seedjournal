"use client";

import { create } from "zustand";
import { applyGrowth, makeInitialStats } from "@/lib/growth";
import { dateKeyFrom } from "@/lib/dates";
import { getDB } from "@/lib/db";
import { buildReflection } from "@/lib/templates";
import type { Entry, Reflection, UserStats } from "@/lib/types";

interface JournalState {
  entries: Entry[];
  stats: UserStats;
  reflection: Reflection | null;
  loading: boolean;
  persistenceMode: "indexeddb" | "memory";
  hydrate: () => Promise<void>;
  addEntry: (text: string) => Promise<void>;
  importData: (payload: { entries: Entry[]; stats: UserStats }) => Promise<void>;
  reset: () => Promise<void>;
}

const createEntryId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  stats: makeInitialStats(),
  reflection: null,
  loading: true,
  persistenceMode: "indexeddb",

  hydrate: async () => {
    set({ loading: true });
    const db = await getDB();
    const [entries, stats] = await Promise.all([db.getEntries(), db.getStats()]);
    const persistenceMode = db.constructor.name.includes("Memory") ? "memory" : "indexeddb";
    set({ entries, stats, loading: false, persistenceMode });
  },

  addEntry: async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const now = new Date();
    const dateKey = dateKeyFrom(now);
    const { nextStats, pointsGained } = applyGrowth(get().stats, dateKey, cleanText);

    const entry: Entry = {
      id: createEntryId(),
      createdAt: now.toISOString(),
      text: cleanText,
      computedPoints: pointsGained
    };

    const db = await getDB();
    await db.saveEntryAndStats(entry, nextStats);

    set((state) => ({
      entries: [entry, ...state.entries],
      stats: nextStats,
      reflection: buildReflection(cleanText)
    }));
  },

  importData: async (payload) => {
    const db = await getDB();
    await db.importAll(payload.entries, payload.stats);
    set({ entries: payload.entries, stats: payload.stats });
  },

  reset: async () => {
    const db = await getDB();
    await db.resetAll();
    set({ entries: [], stats: makeInitialStats(), reflection: null });
  }
}));
