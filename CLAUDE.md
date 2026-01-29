# CLAUDE.md - AI Assistant Context for Tend

## Project Overview
Tend is a holistic personal development app that uses the metaphor of tending a garden to help users nurture every dimension of their life. Users maintain "life areas" (plots), perform "practices" (tending actions), and write "reflections" (journal entries). An AI "Garden Guide" provides personalized coaching.

## Tech Stack
- **Monorepo**: Nx 19
- **Backend**: NestJS 10 + Prisma 5 + PostgreSQL 16
- **Web**: Angular 18 + TailwindCSS (standalone components)
- **Mobile**: Ionic 8 + Capacitor 6 + Angular 18
- **AI**: MCP Server (TypeScript, @modelcontextprotocol/sdk)
- **Testing**: Jest (unit) + Playwright (e2e)
- **CI/CD**: GitHub Actions

## Project Structure
```
apps/api/          - NestJS REST API with Swagger docs
apps/web/          - Angular web application
apps/mobile/       - Ionic/Capacitor mobile app
apps/mcp-server/   - MCP server for Garden Guide AI
libs/shared/types/ - Shared TypeScript interfaces (@tend/shared/types)
libs/shared/utils/ - Utility functions (@tend/shared/utils)
libs/shared/constants/ - App constants and defaults (@tend/shared/constants)
libs/ui/           - Shared Angular UI components (@tend/ui)
prisma/            - Database schema, migrations, seed data
e2e/               - Playwright end-to-end tests
docs/              - Project documentation
```

## Key Commands
```bash
npm run start:api        # Start API server (port 3000)
npm run start:web        # Start web app (port 4200)
npm run start:mobile     # Start mobile app
npm run build            # Build all projects
npm run test             # Run all unit tests
npm run e2e              # Run all e2e tests
npm run lint             # Lint all projects
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with sample data
npm run prisma:studio    # Open Prisma Studio GUI
```

## Domain Model
- **User** - Application user
- **LifeArea** - A dimension of life to tend (health, career, mind, etc.)
- **Practice** - A habit/routine/ritual that nurtures a life area
- **PracticeLog** - A record of completing a practice
- **Reflection** - A journal entry with mood, gratitude, and insights
- **ReflectionLifeArea** - Links reflections to relevant life areas

## Architecture Notes
- All Angular components are standalone (no NgModules in frontend)
- API uses global validation pipe with whitelist + transform
- Swagger docs available at /api/docs
- Health scores are calculated algorithmically (see libs/shared/utils/health-score.ts)
- MCP server exposes tools (queries) and resources (data snapshots) for AI integration
- Path aliases: @tend/shared/types, @tend/shared/utils, @tend/shared/constants, @tend/ui

## Database
- PostgreSQL 16 with Prisma ORM
- Schema at prisma/schema.prisma
- Seed data creates a demo user with 8 life areas and sample practices
- Compound unique constraint: (userId, slug) on LifeArea
- All relations use cascade delete
