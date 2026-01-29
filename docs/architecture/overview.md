# Architecture Overview

## Monorepo Structure

Tend uses an Nx monorepo with four applications and four shared libraries:

```
Tend/
├── apps/
│   ├── api/          # NestJS backend (REST API + Swagger)
│   ├── web/          # Angular web application
│   ├── mobile/       # Ionic/Capacitor mobile app
│   └── mcp-server/   # MCP server for Garden Guide AI
├── libs/
│   ├── shared/types/      # TypeScript interfaces & enums
│   ├── shared/utils/      # Date, streak, health-score utilities
│   ├── shared/constants/  # Life area defaults, app config
│   └── ui/                # Shared Angular components
├── prisma/           # Database schema, migrations, seed
└── e2e/              # Playwright end-to-end tests
```

## Domain Model

The application revolves around the **garden metaphor**:

- **Garden** - The holistic view of a user's life
- **Life Areas** - Individual plots to tend (health, relationships, career, etc.)
- **Practices** - Habits, routines, and rituals that nurture each area
- **Practice Logs** - Records of completing a practice
- **Reflections** - Journal entries with mood, gratitude, and insights

## Data Flow

```
User -> Angular/Ionic UI -> NestJS API -> Prisma -> PostgreSQL
                                |
                          MCP Server -> AI Model (Garden Guide)
```

## Key Design Decisions

1. **Shared types library** - Single source of truth for interfaces across frontend and backend
2. **Health scores** - Algorithmically calculated from practice completion rates, streaks, and reflection recency
3. **MCP integration** - Garden Guide AI accesses data through standardized MCP tools/resources
4. **Standalone components** - Angular 18 standalone components throughout (no NgModules in frontend)
