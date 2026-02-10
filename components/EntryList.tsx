"use client";

import { useState } from "react";
import type { Entry } from "@/lib/types";

export function EntryList({ entries }: { entries: Entry[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <section className="rounded-2xl border border-stroke bg-card p-4">
      <h2 className="mb-3 text-lg font-medium text-slate-100">Journal Entries</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-muted">Your garden is waiting for its first entry.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => {
            const isOpen = Boolean(expanded[entry.id]);
            return (
              <li key={entry.id} className="rounded-xl border border-stroke/70 bg-ink/60 p-3">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((state) => ({
                      ...state,
                      [entry.id]: !state[entry.id]
                    }))
                  }
                  className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  aria-label="Expand entry"
                >
                  <div className="text-xs text-muted">{new Date(entry.createdAt).toLocaleString()}</div>
                  <div className="mt-1 text-sm text-slate-200">
                    {isOpen ? entry.text : `${entry.text.slice(0, 120)}${entry.text.length > 120 ? "…" : ""}`}
                  </div>
                </button>
                <div className="mt-2 text-xs text-slate-400">+{entry.computedPoints} growth points</div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
