export interface Milestone {
  id: string;
  days: number;
  title: string;
  description: string;
  earned: boolean;
}

export interface StatsData {
  totalCheckIns: number;
  currentStreak: number;
  milestones: Milestone[];
}
