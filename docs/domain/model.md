---
layout: default
title: Domain Model
nav_order: 4
parent: Domain
---

# Domain Model

Tend's domain model is built around the **garden metaphor**, where your life is a garden with different plots (life areas) that you tend through practices and reflection.

---

## Entity Relationship Diagram

```
┌─────────────┐      ┌─────────────────────┐      ┌─────────────┐
│    User     │      │      LifeArea       │      │  Practice   │
├─────────────┤      ├─────────────────────┤      ├─────────────┤
│ id          │──┐   │ id                  │──┐   │ id          │
│ email       │  │   │ name                │  │   │ name        │
│ displayName │  │   │ slug                │  │   │ description │
│ avatarUrl   │  └──<│ userId              │  │   │ category    │
│ createdAt   │      │ description         │  │   │ frequency   │
│ updatedAt   │      │ icon                │  └──<│ lifeAreaId  │
└─────────────┘      │ color               │      │ userId      │
       │             │ healthScore         │      │ isActive    │
       │             │ createdAt           │      │ currentStreak│
       │             │ updatedAt           │      │ longestStreak│
       │             └─────────────────────┘      │ durationMin │
       │                      │                   │ createdAt   │
       │                      │                   │ updatedAt   │
       │                      │                   └─────────────┘
       │                      │                          │
       │             ┌────────┴────────┐                 │
       │             │                 │                 │
       │             ▼                 │                 ▼
       │   ┌─────────────────┐        │        ┌─────────────┐
       │   │ReflectionLifeArea│        │        │ PracticeLog │
       │   ├─────────────────┤        │        ├─────────────┤
       │   │ reflectionId    │        │        │ id          │
       │   │ lifeAreaId      │        │        │ practiceId  │
       │   └─────────────────┘        │        │ completedAt │
       │             ▲                 │        │ durationMin │
       │             │                 │        │ notes       │
       │             │                 │        │ quality     │
       │   ┌─────────────────┐        │        └─────────────┘
       │   │   Reflection    │        │
       │   ├─────────────────┤        │
       └──>│ id              │        │
           │ userId          │        │
           │ type            │        │
           │ title           │        │
           │ content         │        │
           │ mood            │        │
           │ gratitude[]     │<───────┘
           │ insights[]      │
           │ createdAt       │
           │ updatedAt       │
           └─────────────────┘
```

---

## Core Entities

### User

The application user who owns all life areas, practices, and reflections.

| Field | Type | Description |
|-------|------|-------------|
| `id` | CUID | Primary key |
| `email` | String | Unique email address |
| `displayName` | String | User's display name |
| `avatarUrl` | String? | Optional profile image URL |
| `createdAt` | DateTime | Account creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

### LifeArea

A dimension of life that the user wants to nurture and track.

| Field | Type | Description |
|-------|------|-------------|
| `id` | CUID | Primary key |
| `name` | String | Display name (e.g., "Health") |
| `slug` | String | URL-friendly identifier (e.g., "health") |
| `description` | String | Brief description of this area |
| `icon` | String | Ionicon name (default: "leaf") |
| `color` | String | Hex color code (default: "#4a7c59") |
| `healthScore` | Int | Calculated score 0-100 (default: 50) |
| `userId` | String | Owner reference |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Constraints:**
- `@@unique([userId, slug])` - Each user can only have one area per slug

**Default Life Areas:**

| Slug | Name | Icon | Color |
|------|------|------|-------|
| health | Health | heart | #c07850 (terracotta) |
| relationships | Relationships | people | #d4a843 (sun) |
| career | Career | briefcase | #5a7247 (fern) |
| finances | Finances | wallet | #4a7c59 (leaf) |
| mind | Mind | bulb | #6b9daa (water) |
| spirit | Spirit | leaf | #87a878 (sage) |
| creativity | Creativity | color-palette | #c27ba0 (bloom) |
| environment | Environment | home | #7a8b5c (moss) |

### Practice

A habit, routine, or ritual that nurtures a life area.

| Field | Type | Description |
|-------|------|-------------|
| `id` | CUID | Primary key |
| `name` | String | Practice name |
| `description` | String | What this practice involves |
| `category` | String | Type: habit, ritual, routine, exercise, meditation, learning |
| `frequency` | String | How often: daily, weekly, biweekly, monthly |
| `durationMinutes` | Int? | Expected duration |
| `isActive` | Boolean | Whether currently tracking (default: true) |
| `currentStreak` | Int | Current consecutive completions (default: 0) |
| `longestStreak` | Int | Best streak ever achieved (default: 0) |
| `lifeAreaId` | String | Parent life area |
| `userId` | String | Owner reference |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Categories:**

| Category | Description | Example |
|----------|-------------|---------|
| habit | Regular repeated action | Daily exercise |
| ritual | Meaningful ceremonial practice | Morning gratitude |
| routine | Structured sequence of actions | Bedtime routine |
| exercise | Physical activity | 30-min run |
| meditation | Mindfulness practice | 10-min breathing |
| learning | Educational activity | Read 20 pages |

### PracticeLog

A record of completing a practice.

| Field | Type | Description |
|-------|------|-------------|
| `id` | CUID | Primary key |
| `practiceId` | String | Parent practice |
| `completedAt` | DateTime | When completed (default: now) |
| `durationMinutes` | Int? | Actual duration |
| `notes` | String? | Session notes |
| `quality` | Int? | Quality rating 1-5 |

### Reflection

A journal entry for self-examination and growth tracking.

| Field | Type | Description |
|-------|------|-------------|
| `id` | CUID | Primary key |
| `type` | String | Type: freeform, gratitude, weekly-review, monthly-review, goal-setting |
| `title` | String | Entry title |
| `content` | String | Main journal content |
| `mood` | String? | Current mood: great, good, okay, low, struggling |
| `gratitude` | String[] | List of gratitude items |
| `insights` | String[] | Key realizations |
| `userId` | String | Author reference |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Reflection Types:**

| Type | Purpose |
|------|---------|
| freeform | Open-ended journaling |
| gratitude | Focus on things to be thankful for |
| weekly-review | Review the past week |
| monthly-review | Monthly progress check-in |
| goal-setting | Define objectives and intentions |

### ReflectionLifeArea

Junction table linking reflections to multiple life areas.

| Field | Type | Description |
|-------|------|-------------|
| `reflectionId` | String | Reflection reference |
| `lifeAreaId` | String | Life area reference |

**Constraints:**
- `@@id([reflectionId, lifeAreaId])` - Composite primary key

---

## Relationships

| From | To | Type | Description |
|------|-----|------|-------------|
| User | LifeArea | 1:N | User owns many life areas |
| User | Practice | 1:N | User owns many practices |
| User | Reflection | 1:N | User owns many reflections |
| LifeArea | Practice | 1:N | Life area contains many practices |
| LifeArea | ReflectionLifeArea | 1:N | Life area linked to many reflections |
| Practice | PracticeLog | 1:N | Practice has many log entries |
| Reflection | ReflectionLifeArea | 1:N | Reflection linked to many life areas |

**Cascade Deletes:**
- Deleting a User cascades to all their LifeAreas, Practices, and Reflections
- Deleting a LifeArea cascades to its Practices and ReflectionLifeArea links
- Deleting a Practice cascades to its PracticeLogs
- Deleting a Reflection cascades to its ReflectionLifeArea links

---

## Calculated Fields

### Health Score

Each life area has a health score (0-100) calculated from:

```typescript
interface HealthScoreParams {
  weeklyCompletionRate: number;    // 0.0 to 1.0
  activeStreaks: number;           // Practices with active streaks
  totalPractices: number;          // Total practices in area
  daysSinceLastReflection: number | null;
}
```

**Formula:**
- **Completion Score** (0-70 points): `weeklyCompletionRate * 70`
- **Streak Bonus** (0-20 points): `(activeStreaks / totalPractices) * 20`
- **Reflection Bonus** (0-10 points):
  - 0-1 days: 10 points
  - 2-3 days: 7 points
  - 4-7 days: 4 points
  - 8+ days: 1 point
  - No reflection: 0 points

### Streaks

Streaks track consecutive days of practice completion:

- **Current Streak**: Days in a row with at least one completion, counting from today/yesterday
- **Longest Streak**: Historical best streak for motivation

A streak is broken if a day is missed (no completion recorded).

---

## Prisma Schema

The complete schema is defined in `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  displayName String
  avatarUrl   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  lifeAreas   LifeArea[]
  practices   Practice[]
  reflections Reflection[]
}

model LifeArea {
  id          String   @id @default(cuid())
  name        String
  slug        String
  description String
  icon        String   @default("leaf")
  color       String   @default("#4a7c59")
  healthScore Int      @default(50)
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  practices   Practice[]
  reflections ReflectionLifeArea[]

  @@unique([userId, slug])
  @@index([userId])
}

model Practice {
  id              String   @id @default(cuid())
  name            String
  description     String
  category        String   @default("habit")
  frequency       String   @default("daily")
  durationMinutes Int?
  isActive        Boolean  @default(true)
  currentStreak   Int      @default(0)
  longestStreak   Int      @default(0)
  lifeAreaId      String
  userId          String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  lifeArea LifeArea      @relation(fields: [lifeAreaId], references: [id], onDelete: Cascade)
  user     User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  logs     PracticeLog[]

  @@index([userId])
  @@index([lifeAreaId])
}

model PracticeLog {
  id              String   @id @default(cuid())
  practiceId      String
  completedAt     DateTime @default(now())
  durationMinutes Int?
  notes           String?
  quality         Int?

  practice Practice @relation(fields: [practiceId], references: [id], onDelete: Cascade)

  @@index([practiceId])
}

model Reflection {
  id        String   @id @default(cuid())
  type      String   @default("freeform")
  title     String
  content   String
  mood      String?
  gratitude String[] @default([])
  insights  String[] @default([])
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  lifeAreas ReflectionLifeArea[]

  @@index([userId])
}

model ReflectionLifeArea {
  reflectionId String
  lifeAreaId   String

  reflection Reflection @relation(fields: [reflectionId], references: [id], onDelete: Cascade)
  lifeArea   LifeArea   @relation(fields: [lifeAreaId], references: [id], onDelete: Cascade)

  @@id([reflectionId, lifeAreaId])
  @@index([lifeAreaId])
}
```

---

## TypeScript Interfaces

The shared types library (`@tend/shared/types`) provides TypeScript interfaces:

```typescript
// Life Area
export interface LifeArea {
  id: string;
  name: string;
  slug: LifeAreaSlug;
  description: string;
  icon: string;
  color: string;
  healthScore: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

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

// Practice
export interface Practice {
  id: string;
  name: string;
  description: string;
  category: PracticeCategory;
  frequency: PracticeFrequency;
  durationMinutes?: number;
  isActive: boolean;
  currentStreak: number;
  longestStreak: number;
  lifeAreaId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Reflection
export interface Reflection {
  id: string;
  type: ReflectionType;
  title: string;
  content: string;
  mood?: Mood;
  gratitude: string[];
  insights: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```
