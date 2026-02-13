import { isNextDay } from "./dates";
import type { TreeStage, UserStats } from "./types";

export const BASE_POINTS = 10;

export const getLengthBonus = (chars: number): number => {
  let bonus = 0;
  if (chars >= 50) bonus += 5;
  if (chars >= 150) bonus += 10;
  if (chars >= 300) bonus += 15;
  return bonus;
};

export const getStageFromPoints = (points: number): TreeStage => {
  if (points >= 1000) return "flourishing";
  if (points >= 600) return "tree";
  if (points >= 300) return "young-tree";
  if (points >= 150) return "sapling";
  if (points >= 50) return "sprout";
  return "seed";
};

export const getLevelFromPoints = (points: number): number => {
  if (points >= 1000) return 6;
  if (points >= 600) return 5;
  if (points >= 300) return 4;
  if (points >= 150) return 3;
  if (points >= 50) return 2;
  return 1;
};

export const computeStreak = (
  previousDate: string | null,
  currentDate: string,
  previousStreak: number
): number => {
  if (!previousDate) return 1;
  if (previousDate === currentDate) return previousStreak;
  if (isNextDay(previousDate, currentDate)) return previousStreak + 1;
  return 1;
};

export const getStreakBonus = (streakCount: number): number =>
  Math.min(streakCount * 2, 14);

export const computeEntryPoints = (
  text: string,
  streakAfterEntry: number
): number => {
  return BASE_POINTS + getLengthBonus(text.length) + getStreakBonus(streakAfterEntry);
};

export const makeInitialStats = (): UserStats => ({
  totalPoints: 0,
  level: 1,
  stage: "seed",
  streakCount: 0,
  lastEntryDate: null,
  totalEntries: 0
});

export const applyGrowth = (
  stats: UserStats,
  todayKey: string,
  text: string
): { nextStats: UserStats; pointsGained: number } => {
  const streak = computeStreak(stats.lastEntryDate, todayKey, stats.streakCount);
  const pointsGained = computeEntryPoints(text, streak);
  const totalPoints = stats.totalPoints + pointsGained;

  const nextStats: UserStats = {
    ...stats,
    totalPoints,
    level: getLevelFromPoints(totalPoints),
    stage: getStageFromPoints(totalPoints),
    streakCount: streak,
    lastEntryDate: todayKey,
    totalEntries: stats.totalEntries + 1
  };

  return { nextStats, pointsGained };
};
