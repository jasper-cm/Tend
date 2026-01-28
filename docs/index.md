# Tend Documentation

> Tend your life as the fruitful garden it is.

Tend is a holistic personal development application that helps you nurture every dimension of your life through consistent practices, mindful reflection, and AI-powered guidance.

## Contents

- [Architecture](architecture/overview.md) - System design and technical decisions
- [Features](features/) - Detailed feature documentation
  - [Life Garden](features/life-garden.md) - Your holistic life overview
  - [Garden Guide](features/garden-guide.md) - AI-powered personal guidance
- [API Reference](api/) - Backend API documentation

## Quick Start

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev
npx prisma db seed

# Start development servers
npm run start:api   # Backend on :3000
npm run start:web   # Frontend on :4200
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | Ionic 8 + Capacitor 6 + Angular 18 |
| Web | Angular 18 + TailwindCSS |
| Backend | NestJS 10 + Prisma 5 |
| Database | PostgreSQL 16 |
| AI Integration | MCP Server (TypeScript) |
| Monorepo | Nx 19 |
| Testing | Jest (unit) + Playwright (e2e) |
| Docs | Markdown + GitHub Pages |
| CI/CD | GitHub Actions |
