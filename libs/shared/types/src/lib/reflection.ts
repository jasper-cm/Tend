export enum ReflectionType {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Milestone = 'milestone',
  Freeform = 'freeform',
}

export enum Mood {
  Thriving = 'thriving',
  Good = 'good',
  Neutral = 'neutral',
  Struggling = 'struggling',
  Low = 'low',
}

export interface Reflection {
  id: string;
  type: ReflectionType;
  title: string;
  content: string;
  mood: Mood | null;
  lifeAreaIds: string[];
  gratitude: string[];
  insights: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReflectionDto {
  type: ReflectionType;
  title: string;
  content: string;
  mood?: Mood;
  lifeAreaIds?: string[];
  gratitude?: string[];
  insights?: string[];
}

export interface UpdateReflectionDto {
  title?: string;
  content?: string;
  mood?: Mood;
  lifeAreaIds?: string[];
  gratitude?: string[];
  insights?: string[];
}
