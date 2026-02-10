"use client";

import { useMemo } from "react";
import { TreeVisual } from "./TreeVisual";
import type { UserStats } from "@/lib/types";

interface GrowthCardProps {
  stats: UserStats;
  pulseKey: number;
}

const stageLabel: Record<UserStats["stage"], string> = {
  seed: "Seed",
  sprout: "Sprout",
  sapling: "Sapling",
  "young-tree": "Young Tree",
  tree: "Tree",
  flourishing: "Flourishing"
};

export function GrowthCard({ stats, pulseKey }: GrowthCardProps) {
  const lastEntryDate = useMemo(() => {
    if (!stats.lastEntryDate) return "No entries yet";
    return stats.lastEntryDate;
  }, [stats.lastEntryDate]);

  return (
    <section className="rounded-2xl border border-stroke bg-card/90 p-5 shadow-xl shadow-black/30">
      <h1 className="text-center text-2xl font-semibold text-slate-100">Growth Garden</h1>
      <p className="mt-1 text-center text-sm text-muted">Your journal grows a living tree, one entry at a time.</p>
      <TreeVisual stage={stats.stage} pulseKey={pulseKey} />

      <div className="grid grid-cols-2 gap-3 rounded-xl bg-ink/50 p-4 text-sm sm:grid-cols-4">
        <Stat label="Level" value={String(stats.level)} />
        <Stat label="Stage" value={stageLabel[stats.stage]} />
        <Stat label="Streak" value={`${stats.streakCount} day${stats.streakCount === 1 ? "" : "s"}`} />
        <Stat label="Entries" value={String(stats.totalEntries)} />
      </div>
      <div className="mt-3 text-center text-xs text-muted">Last entry: {lastEntryDate}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stroke/60 bg-card px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-base text-slate-100">{value}</div>
    </div>
  );
}
