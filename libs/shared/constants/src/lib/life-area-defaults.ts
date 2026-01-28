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
    color: '#ef4444',
  },
  {
    slug: LifeAreaSlug.Relationships,
    name: 'Relationships',
    description: 'Family, friendships, romantic partnerships, and social connections.',
    icon: 'people',
    color: '#f97316',
  },
  {
    slug: LifeAreaSlug.Career,
    name: 'Career',
    description: 'Professional growth, skills, purpose, and contribution.',
    icon: 'briefcase',
    color: '#3b82f6',
  },
  {
    slug: LifeAreaSlug.Finances,
    name: 'Finances',
    description: 'Financial health, savings, investments, and security.',
    icon: 'wallet',
    color: '#22c55e',
  },
  {
    slug: LifeAreaSlug.Mind,
    name: 'Mind',
    description: 'Mental health, learning, intellectual growth, and curiosity.',
    icon: 'bulb',
    color: '#a855f7',
  },
  {
    slug: LifeAreaSlug.Spirit,
    name: 'Spirit',
    description: 'Inner peace, meaning, values, meditation, and spiritual practices.',
    icon: 'leaf',
    color: '#65a30d',
  },
  {
    slug: LifeAreaSlug.Creativity,
    name: 'Creativity',
    description: 'Creative expression, art, music, writing, and imagination.',
    icon: 'color-palette',
    color: '#e879f9',
  },
  {
    slug: LifeAreaSlug.Environment,
    name: 'Environment',
    description: 'Living space, nature connection, organization, and surroundings.',
    icon: 'home',
    color: '#78716c',
  },
];
