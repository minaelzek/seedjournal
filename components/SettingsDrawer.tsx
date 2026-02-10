"use client";

import { useRef, useState } from "react";
import type { Entry, UserStats } from "@/lib/types";

interface SettingsDrawerProps {
  entries: Entry[];
  stats: UserStats;
  persistenceMode: "indexeddb" | "memory";
  onImport: (data: { entries: Entry[]; stats: UserStats }) => Promise<void>;
  onReset: () => Promise<void>;
}

export function SettingsDrawer({
  entries,
  stats,
  persistenceMode,
  onImport,
  onReset
}: SettingsDrawerProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const exportJSON = () => {
    const payload = JSON.stringify({ entries, stats }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `seed-journal-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text) as { entries: Entry[]; stats: UserStats };
    await onImport(parsed);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-stroke bg-card px-3 py-2 text-sm text-slate-200 hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        aria-label="Open settings"
      >
        Settings
      </button>

      {open && (
        <div className="fixed inset-0 z-20 flex justify-end bg-black/50">
          <aside className="h-full w-full max-w-sm border-l border-stroke bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">Settings</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close settings"
                className="rounded border border-stroke px-2 py-1 text-sm text-slate-200"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <p>Storage mode: {persistenceMode === "indexeddb" ? "IndexedDB" : "In-memory fallback"}</p>
              <button
                type="button"
                onClick={exportJSON}
                className="w-full rounded-lg border border-stroke px-3 py-2 text-left hover:border-slate-500"
                aria-label="Export data as JSON"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-lg border border-stroke px-3 py-2 text-left hover:border-slate-500"
                aria-label="Import data from JSON"
              >
                Import JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void importJSON(file);
                }}
              />
              <button
                type="button"
                onClick={() => void onReset()}
                className="w-full rounded-lg border border-rose-500/60 px-3 py-2 text-left text-rose-200 hover:border-rose-400"
                aria-label="Reset all data"
              >
                Reset all data
              </button>
              <p className="pt-4 text-xs text-muted">Not a substitute for professional care.</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
