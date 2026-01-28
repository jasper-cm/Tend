export const APP_CONFIG = {
  name: 'Tend',
  tagline: 'Tend your life as the fruitful garden it is',
  version: '0.1.0',

  api: {
    defaultPort: 3000,
    prefix: 'api',
  },

  healthScore: {
    min: 0,
    max: 100,
    neutral: 50,
  },

  streaks: {
    /** Number of days to look back for streak calculations */
    lookbackDays: 365,
  },

  reflections: {
    /** Max length for reflection content */
    maxContentLength: 10000,
    /** Max number of gratitude items per reflection */
    maxGratitudeItems: 10,
    /** Max number of insight items per reflection */
    maxInsightItems: 10,
  },

  practices: {
    /** Quality rating range */
    minQuality: 1,
    maxQuality: 5,
  },
} as const;
