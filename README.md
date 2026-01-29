# Tend

> Tend your life as the fruitful garden it is.

Tend is a holistic personal development application that helps you nurture every dimension of your life through consistent practices, mindful reflection, and AI-powered guidance.

## Concept

Your life is a garden with many plots to tend. Each **life area** (health, relationships, career, finances, mind, spirit, creativity, environment) is a plot that needs consistent care. **Practices** are the daily actions that nurture each area. **Reflections** help you observe what's growing. The **Garden Guide** AI offers personalized coaching based on your unique garden.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | Ionic 8 + Capacitor 6 + Angular 18 |
| Web | Angular 18 + TailwindCSS |
| Backend | NestJS 10 + Prisma 5 |
| Database | PostgreSQL 16 |
| AI | MCP Server (TypeScript) |
| Monorepo | Nx 19 |
| Testing | Jest + Playwright |
| CI/CD | GitHub Actions |

## Project Structure

```
apps/
  api/            NestJS backend (REST API + Swagger)
  web/            Angular web application
  mobile/         Ionic/Capacitor mobile app
  mcp-server/     MCP server for Garden Guide AI
libs/
  shared/types/   Shared TypeScript interfaces
  shared/utils/   Date, streak, health-score utilities
  shared/constants/ Life area defaults, app config
  ui/             Shared Angular UI components
prisma/           Database schema, migrations, seed
e2e/              Playwright end-to-end tests
docs/             Project documentation
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev
npx prisma db seed

# Start development
npm run start:api   # Backend on http://localhost:3000
npm run start:web   # Frontend on http://localhost:4200
```

## Documentation

See the [docs/](docs/index.md) directory for detailed documentation on architecture, features, and API reference.

## License

MIT
