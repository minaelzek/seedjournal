export type TreeStage =
  | "seed"
  | "sprout"
  | "sapling"
  | "young-tree"
  | "tree"
  | "flourishing";

export interface Entry {
  id: string;
  createdAt: string;
  text: string;
  computedPoints: number;
  tags?: string[];
  mood?: string;
}

export interface UserStats {
  totalPoints: number;
  level: number;
  stage: TreeStage;
  streakCount: number;
  lastEntryDate: string | null;
  totalEntries: number;
}

export interface Reflection {
  validation: string;
  theme: string;
  nextStep: string;
}
