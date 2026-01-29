---
layout: default
title: Shared Libraries
nav_order: 9
---

# Shared Libraries

Tend uses shared libraries to maintain consistency across applications and reduce code duplication. All libraries are published under the `@tend` scope.

---

## Library Overview

| Library | Import Path | Purpose |
|---------|-------------|---------|
| **Types** | `@tend/shared/types` | TypeScript interfaces and enums |
| **Utils** | `@tend/shared/utils` | Utility functions for dates, streaks, health scores |
| **Constants** | `@tend/shared/constants` | Application constants and defaults |
| **UI** | `@tend/ui` | Shared Angular components |

---

## @tend/shared/types

Type-safe interfaces and enums used across frontend and backend.

### Life Areas

```typescript
import { LifeArea, LifeAreaSlug } from '@tend/shared/types';

// Available life area slugs
enum LifeAreaSlug {
  Health = 'health',
  Relationships = 'relationships',
  Career = 'career',
  Finances = 'finances',
  Mind = 'mind',
  Spirit = 'spirit',
  Creativity = 'creativity',
  Environment = 'environment',
}

// Life area entity
interface LifeArea {
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

// DTOs for API requests
interface CreateLifeAreaDto {
  name: string;
  slug: LifeAreaSlug;
  description: string;
  icon?: string;
  color?: string;
}

interface UpdateLifeAreaDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  healthScore?: number;
}
```

### Practices

```typescript
import { Practice, PracticeLog, PracticeCategory, PracticeFrequency } from '@tend/shared/types';

enum PracticeFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  BiWeekly = 'bi-weekly',
  Monthly = 'monthly',
  AsNeeded = 'as-needed',
}

enum PracticeCategory {
  Habit = 'habit',
  Routine = 'routine',
  Ritual = 'ritual',
  Exercise = 'exercise',
  Reflection = 'reflection',
}

interface Practice {
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

interface PracticeLog {
  id: string;
  practiceId: string;
  completedAt: Date;
  durationMinutes: number | null;
  notes: string | null;
  quality: number | null; // 1-5 rating
}
```

### Reflections

```typescript
import { Reflection, ReflectionType, Mood } from '@tend/shared/types';

enum ReflectionType {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Milestone = 'milestone',
  Freeform = 'freeform',
}

enum Mood {
  Thriving = 'thriving',
  Good = 'good',
  Neutral = 'neutral',
  Struggling = 'struggling',
  Low = 'low',
}

interface Reflection {
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
```

---

## @tend/shared/utils

Utility functions for common calculations and transformations.

### Date Utilities

```typescript
import { startOfToday, daysAgo, isSameDay, relativeDay } from '@tend/shared/utils';

// Get start of today (UTC midnight)
startOfToday();
// Returns: 2024-03-15T00:00:00.000Z

// Get a date N days in the past
daysAgo(3);
// Returns: 2024-03-12T00:00:00.000Z

// Check if two dates are the same calendar day
isSameDay(date1, date2);
// Returns: true or false

// Format as relative string
relativeDay(new Date());        // "today"
relativeDay(daysAgo(1));        // "yesterday"
relativeDay(daysAgo(5));        // "5 days ago"
relativeDay(daysAgo(14));       // "2 weeks ago"
```

### Streak Calculator

```typescript
import { calculateStreak, calculateLongestStreak } from '@tend/shared/utils';

// Calculate current streak from completion dates
const completionDates = [new Date(), daysAgo(1), daysAgo(2)];
calculateStreak(completionDates);
// Returns: 3

// Calculate longest streak ever achieved
const allDates = [...historicalDates, ...recentDates];
calculateLongestStreak(allDates);
// Returns: maximum consecutive days
```

**Streak Rules:**
- A streak counts consecutive days with at least one completion
- Multiple completions on the same day count as 1
- Missing a day breaks the current streak
- Current streak requires activity today or yesterday

### Health Score Calculator

```typescript
import {
  calculateHealthScore,
  calculateHealthScoreWithBreakdown,
  determineTrend,
  HealthScoreParams,
  HealthScoreBreakdown,
  HealthTrend
} from '@tend/shared/utils';

// Input parameters
interface HealthScoreParams {
  weeklyCompletionRate: number;      // 0.0 to 1.0
  activeStreaks: number;             // Practices with active streaks
  totalPractices: number;            // Total practices in area
  daysSinceLastReflection: number | null;
}

// Calculate health score (0-100)
const score = calculateHealthScore({
  weeklyCompletionRate: 0.8,
  activeStreaks: 3,
  totalPractices: 3,
  daysSinceLastReflection: 0
});
// Returns: 86

// Get detailed breakdown
const breakdown = calculateHealthScoreWithBreakdown(params);
// Returns: { total: 86, completionScore: 56, streakBonus: 20, reflectionBonus: 10 }

// Determine trend direction
determineTrend(75, 60);  // 'improving'
determineTrend(70, 72);  // 'stable'
determineTrend(45, 65);  // 'declining'
```

**Score Composition:**
- **Completion Score** (0-70 pts): `weeklyCompletionRate * 70`
- **Streak Bonus** (0-20 pts): Based on ratio of active streaks
- **Reflection Bonus** (0-10 pts): Based on recency of last reflection
  - 0-1 days: 10 pts
  - 2-3 days: 7 pts
  - 4-7 days: 4 pts
  - 8+ days: 1 pt
  - Never: 0 pts

---

## @tend/shared/constants

Application configuration and default values.

### Life Area Defaults

```typescript
import { DEFAULT_LIFE_AREAS, LifeAreaDefault } from '@tend/shared/constants';

interface LifeAreaDefault {
  slug: LifeAreaSlug;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// Default life areas for new users
const DEFAULT_LIFE_AREAS: LifeAreaDefault[] = [
  {
    slug: LifeAreaSlug.Health,
    name: 'Health',
    description: 'Physical well-being, exercise, nutrition, sleep, and energy.',
    icon: 'heart',
    color: '#c07850', // terracotta
  },
  {
    slug: LifeAreaSlug.Relationships,
    name: 'Relationships',
    description: 'Family, friendships, romantic partnerships, and social connections.',
    icon: 'people',
    color: '#d4a843', // sun gold
  },
  // ... 6 more areas
];
```

### Color Palette

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **soil** | `#3d2e1f` | `--color-soil` | Primary text |
| **soil-light** | `#5c4033` | `--color-soil-light` | Secondary text |
| **bark** | `#8b7355` | `--color-bark` | Muted text |
| **leaf** | `#4a7c59` | `--color-leaf` | Primary brand |
| **leaf-light** | `#6b9e7a` | `--color-leaf-light` | Accents |
| **leaf-dark** | `#2f5738` | `--color-leaf-dark` | Headers |
| **sage** | `#87a878` | `--color-sage` | Spirit area |
| **fern** | `#5a7247` | `--color-fern` | Career area |
| **moss** | `#7a8b5c` | `--color-moss` | Environment area |
| **bloom** | `#c27ba0` | `--color-bloom` | Creativity area |
| **water** | `#6b9daa` | `--color-water` | Mind area |
| **sun** | `#d4a843` | `--color-sun` | Relationships area |
| **terracotta** | `#c07850` | `--color-terracotta` | Health area |
| **parchment** | `#f5f0e8` | `--color-parchment` | Cards |
| **cream** | `#faf6ee` | `--color-cream` | Background |

---

## @tend/ui

Shared Angular standalone components for consistent UI across web and mobile.

### HealthBadgeComponent

Displays health scores with color-coded backgrounds.

```typescript
import { HealthBadgeComponent } from '@tend/ui';

// Usage
<tend-health-badge [score]="75" />
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `score` | number | 0 | Health score (0-100) |

**Color Thresholds:**
- 75-100: Green (`bg-leaf-light`)
- 50-74: Yellow (`bg-sun-light`)
- 25-49: Orange (`bg-terracotta`)
- 0-24: Red (`bg-soil`)

### StreakIndicatorComponent

Shows practice streak counts with visual indicators.

```typescript
import { StreakIndicatorComponent } from '@tend/ui';

// Usage
<tend-streak-indicator
  [currentStreak]="5"
  [longestStreak]="12"
/>
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `currentStreak` | number | 0 | Current consecutive days |
| `longestStreak` | number | 0 | Best streak ever achieved |

### LifeAreaCardComponent

Card component for displaying life areas in grids.

```typescript
import { LifeAreaCardComponent } from '@tend/ui';

// Usage
<tend-life-area-card
  [name]="'Health'"
  [description]="'Physical well-being'"
  [color]="'#c07850'"
  [healthScore]="75"
  [activePractices]="3"
  (selected)="onAreaClick()"
/>
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | string | '' | Life area name |
| `description` | string | '' | Brief description |
| `color` | string | '#4a7c59' | Border accent color |
| `healthScore` | number | 50 | Current health score |
| `activePractices` | number | 0 | Number of active practices |

| Output | Type | Description |
|--------|------|-------------|
| `selected` | EventEmitter<void> | Emitted when card is clicked |

---

## Using Libraries in Applications

### Import in Angular Components

```typescript
import { Component } from '@angular/core';
import { LifeAreaCardComponent, HealthBadgeComponent } from '@tend/ui';
import { LifeArea } from '@tend/shared/types';
import { calculateHealthScore } from '@tend/shared/utils';

@Component({
  selector: 'tend-garden',
  standalone: true,
  imports: [LifeAreaCardComponent, HealthBadgeComponent],
  template: `...`,
})
export class GardenComponent {
  score = calculateHealthScore({ ... });
}
```

### Import in NestJS Services

```typescript
import { Injectable } from '@nestjs/common';
import { LifeArea, Practice } from '@tend/shared/types';
import { calculateStreak, calculateHealthScore } from '@tend/shared/utils';
import { DEFAULT_LIFE_AREAS } from '@tend/shared/constants';

@Injectable()
export class LifeAreasService {
  getDefaults(): LifeArea[] {
    return DEFAULT_LIFE_AREAS.map(area => ({
      ...area,
      id: generateId(),
      healthScore: 50,
      // ...
    }));
  }
}
```

---

## Development

### Building Libraries

```bash
# Build all libraries
npx nx run-many -t build --projects=shared-types,shared-utils,shared-constants,ui

# Build specific library
npx nx run shared-utils:build
```

### Running Tests

```bash
# Test all libraries
npx nx run-many -t test --projects=shared-types,shared-utils,shared-constants,ui

# Test specific library with coverage
npx nx run shared-utils:test --coverage
```

### Adding New Functions

1. Add the function to the appropriate library
2. Export from the library's `index.ts`
3. Add JSDoc documentation with `@param`, `@returns`, and `@example`
4. Add unit tests covering edge cases
5. Update this documentation

---

## Project Structure

```
libs/
├── shared/
│   ├── types/
│   │   └── src/
│   │       ├── index.ts                 # Public exports
│   │       └── lib/
│   │           ├── life-area.ts         # Life area interfaces
│   │           ├── practice.ts          # Practice interfaces
│   │           ├── reflection.ts        # Reflection interfaces
│   │           ├── user.ts              # User interface
│   │           └── garden.ts            # Garden overview types
│   ├── utils/
│   │   └── src/
│   │       ├── index.ts                 # Public exports
│   │       └── lib/
│   │           ├── date-utils.ts        # Date manipulation
│   │           ├── date-utils.spec.ts   # Date tests
│   │           ├── streak-calculator.ts # Streak calculations
│   │           ├── streak-calculator.spec.ts
│   │           ├── health-score.ts      # Health score algorithm
│   │           └── health-score.spec.ts
│   └── constants/
│       └── src/
│           ├── index.ts                 # Public exports
│           └── lib/
│               ├── app-config.ts        # App configuration
│               └── life-area-defaults.ts # Default life areas
└── ui/
    └── src/
        ├── index.ts                     # Public exports
        └── lib/
            └── components/
                ├── health-badge/
                │   ├── health-badge.component.ts
                │   └── health-badge.component.spec.ts
                ├── streak-indicator/
                │   ├── streak-indicator.component.ts
                │   └── streak-indicator.component.spec.ts
                └── life-area-card/
                    ├── life-area-card.component.ts
                    └── life-area-card.component.spec.ts
```
