export enum LifeAreaSlug {
  Health = 'health',
  Relationships = 'relationships',
  Career = 'career',
  Finances = 'finances',
  Mind = 'mind',
  Spirit = 'spirit',
  Creativity = 'creativity',
  Environment = 'environment',
}

export interface LifeArea {
  id: string;
  name: string;
  slug: LifeAreaSlug;
  description: string;
  icon: string;
  color: string;
  healthScore: number; // 0-100
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLifeAreaDto {
  name: string;
  slug: LifeAreaSlug;
  description: string;
  icon?: string;
  color?: string;
}

export interface UpdateLifeAreaDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  healthScore?: number;
}
