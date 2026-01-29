export enum PracticeFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  BiWeekly = 'bi-weekly',
  Monthly = 'monthly',
  AsNeeded = 'as-needed',
}

export enum PracticeCategory {
  Habit = 'habit',
  Routine = 'routine',
  Ritual = 'ritual',
  Exercise = 'exercise',
  Reflection = 'reflection',
}

export interface Practice {
  id: string;
  name: string;
  description: string;
  lifeAreaId: string;
  category: PracticeCategory;
  frequency: PracticeFrequency;
  durationMinutes: number | null;
  isActive: boolean;
  currentStreak: number;
  longestStreak: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PracticeLog {
  id: string;
  practiceId: string;
  completedAt: Date;
  durationMinutes: number | null;
  notes: string | null;
  quality: number | null; // 1-5 rating
}

export interface CreatePracticeDto {
  name: string;
  description: string;
  lifeAreaId: string;
  category: PracticeCategory;
  frequency: PracticeFrequency;
  durationMinutes?: number;
}

export interface LogPracticeDto {
  durationMinutes?: number;
  notes?: string;
  quality?: number;
}
