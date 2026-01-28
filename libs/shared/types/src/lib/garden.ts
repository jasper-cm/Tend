import { LifeArea } from './life-area';

/**
 * The Garden is the holistic view of a user's life —
 * a metaphorical space where each life area is a plot to tend.
 */
export interface GardenOverview {
  userId: string;
  overallHealth: number; // 0-100 average across life areas
  lifeAreas: LifeAreaSummary[];
  recentActivity: ActivityEntry[];
  currentStreaks: StreakSummary[];
}

export interface LifeAreaSummary {
  lifeArea: LifeArea;
  activePracticeCount: number;
  completedToday: number;
  weeklyCompletionRate: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
}

export interface ActivityEntry {
  type: 'practice_logged' | 'reflection_added' | 'life_area_updated';
  description: string;
  timestamp: Date;
  lifeAreaId: string | null;
}

export interface StreakSummary {
  practiceId: string;
  practiceName: string;
  currentStreak: number;
  longestStreak: number;
}
