import { describe, expect, it } from "vitest";
import {
  applyGrowth,
  computeEntryPoints,
  computeStreak,
  getLengthBonus,
  getStageFromPoints,
  makeInitialStats
} from "@/lib/growth";

describe("growth calculation", () => {
  it("applies length bonuses by threshold", () => {
    expect(getLengthBonus(49)).toBe(0);
    expect(getLengthBonus(50)).toBe(5);
    expect(getLengthBonus(150)).toBe(15);
    expect(getLengthBonus(300)).toBe(30);
  });

  it("computes streaks across calendar days", () => {
    expect(computeStreak(null, "2026-02-01", 0)).toBe(1);
    expect(computeStreak("2026-02-01", "2026-02-01", 2)).toBe(2);
    expect(computeStreak("2026-02-01", "2026-02-02", 2)).toBe(3);
    expect(computeStreak("2026-02-01", "2026-02-05", 4)).toBe(1);
  });

  it("caps streak bonus and computes entry points", () => {
    expect(computeEntryPoints("a".repeat(300), 9)).toBe(54);
  });

  it("maps stage thresholds deterministically", () => {
    expect(getStageFromPoints(0)).toBe("seed");
    expect(getStageFromPoints(50)).toBe("sprout");
    expect(getStageFromPoints(150)).toBe("sapling");
    expect(getStageFromPoints(300)).toBe("young-tree");
    expect(getStageFromPoints(600)).toBe("tree");
    expect(getStageFromPoints(1000)).toBe("flourishing");
  });

  it("updates stats and total entries", () => {
    const initial = makeInitialStats();
    const { nextStats, pointsGained } = applyGrowth(initial, "2026-02-01", "Today was hard but I kept going.");

    expect(pointsGained).toBeGreaterThan(0);
    expect(nextStats.totalEntries).toBe(1);
    expect(nextStats.lastEntryDate).toBe("2026-02-01");
    expect(nextStats.totalPoints).toBe(pointsGained);
  });
});
