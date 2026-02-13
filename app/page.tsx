"use client";

import { useEffect, useState } from "react";
import { GrowthCard } from "@/components/GrowthCard";
import { EntryComposer } from "@/components/EntryComposer";
import { EntryList } from "@/components/EntryList";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { promptSuggestions } from "@/lib/templates";
import { useJournalStore } from "@/store/journalStore";

export default function HomePage() {
  const { entries, stats, reflection, loading, hydrate, addEntry, importData, reset, persistenceMode } =
    useJournalStore();
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (loading) {
    return <main className="mx-auto min-h-screen max-w-2xl px-4 py-10 text-slate-300">Loading garden…</main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-4 px-4 py-6">
      <div className="flex justify-end">
        <SettingsDrawer
          entries={entries}
          stats={stats}
          persistenceMode={persistenceMode}
          onImport={importData}
          onReset={reset}
        />
      </div>

      <GrowthCard stats={stats} pulseKey={pulseKey} />

      {reflection && (
        <section className="rounded-2xl border border-stroke bg-card p-4 text-sm text-slate-200">
          <p>{reflection.validation}</p>
          <p className="mt-2 text-slate-300">{reflection.theme}</p>
          <p className="mt-2 text-slate-300">Tiny next step: {reflection.nextStep}</p>
        </section>
      )}

      <EntryComposer
        onSubmit={async (text) => {
          await addEntry(text);
          setPulseKey((value) => value + 1);
        }}
        prompts={promptSuggestions}
      />

      <EntryList entries={entries} />
    </main>
  );
}
