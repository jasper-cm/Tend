import { LifeAreaSlug } from '@tend/shared/types';

export interface LifeAreaDefault {
  slug: LifeAreaSlug;
  name: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Default life areas seeded for every new user.
 * These represent the core dimensions of a well-tended life.
 */
export const DEFAULT_LIFE_AREAS: LifeAreaDefault[] = [
  {
    slug: LifeAreaSlug.Health,
    name: 'Health',
    description: 'Physical well-being, exercise, nutrition, sleep, and energy.',
    icon: 'heart',
    color: '#c07850', // terracotta — warm vitality
  },
  {
    slug: LifeAreaSlug.Relationships,
    name: 'Relationships',
    description: 'Family, friendships, romantic partnerships, and social connections.',
    icon: 'people',
    color: '#d4a843', // sun gold — warmth of connection
  },
  {
    slug: LifeAreaSlug.Career,
    name: 'Career',
    description: 'Professional growth, skills, purpose, and contribution.',
    icon: 'briefcase',
    color: '#5a7247', // fern — steady growth
  },
  {
    slug: LifeAreaSlug.Finances,
    name: 'Finances',
    description: 'Financial health, savings, investments, and security.',
    icon: 'wallet',
    color: '#4a7c59', // leaf green — flourishing
  },
  {
    slug: LifeAreaSlug.Mind,
    name: 'Mind',
    description: 'Mental health, learning, intellectual growth, and curiosity.',
    icon: 'bulb',
    color: '#6b9daa', // water — clarity and depth
  },
  {
    slug: LifeAreaSlug.Spirit,
    name: 'Spirit',
    description: 'Inner peace, meaning, values, meditation, and spiritual practices.',
    icon: 'leaf',
    color: '#87a878', // sage — calm wisdom
  },
  {
    slug: LifeAreaSlug.Creativity,
    name: 'Creativity',
    description: 'Creative expression, art, music, writing, and imagination.',
    icon: 'color-palette',
    color: '#c27ba0', // bloom — creative expression
  },
  {
    slug: LifeAreaSlug.Environment,
    name: 'Environment',
    description: 'Living space, nature connection, organization, and surroundings.',
    icon: 'home',
    color: '#7a8b5c', // moss — grounded in nature
  },
];
