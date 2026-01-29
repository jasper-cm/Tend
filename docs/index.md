---
layout: default
title: Home
nav_order: 1
---

# Tend Documentation

> **Tend your life as the fruitful garden it is.**

Tend is a holistic personal development application that helps you nurture every dimension of your life through consistent practices, mindful reflection, and AI-powered guidance.

---

## What is Tend?

Tend uses the metaphor of tending a garden to help users cultivate a balanced, fulfilling life. Just as a gardener tends different plots in their garden, users maintain different **life areas** (health, relationships, career, etc.) through regular **practices** (habits, routines, rituals) and **reflections** (journaling).

### Key Features

- **Life Garden Dashboard** - Visualize all your life areas with health scores
- **Practice Tracking** - Log daily habits and maintain streaks
- **Journaling** - Reflect on your progress with mood tracking and gratitude
- **Garden Guide AI** - Get personalized coaching powered by MCP

---

## Quick Navigation

| Section | Description |
|---------|-------------|
| [Getting Started](getting-started) | Setup guide and first steps |
| [Architecture](architecture/overview) | System design and tech stack |
| [Domain Model](domain/model) | Data structures and relationships |
| [API Reference](api/) | REST API documentation |
| [Web App](apps/web) | Angular web application |
| [Mobile App](apps/mobile) | Ionic mobile application |
| [MCP Server](mcp/overview) | AI integration with Model Context Protocol |
| [Shared Libraries](libs/overview) | Reusable code across apps |
| [Testing](testing) | Unit and E2E testing guide |
| [Deployment](deployment) | CI/CD and production deployment |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Monorepo** | Nx 19 | Workspace management, build caching |
| **Backend** | NestJS 10 | REST API with Swagger docs |
| **Database** | PostgreSQL 16 + Prisma 5 | Data persistence with type-safe ORM |
| **Web** | Angular 18 + TailwindCSS | Standalone component architecture |
| **Mobile** | Ionic 8 + Capacitor 6 | Cross-platform iOS/Android |
| **AI** | MCP Server (TypeScript) | Garden Guide AI integration |
| **Testing** | Jest + Playwright | Unit and E2E testing |
| **CI/CD** | GitHub Actions | Automated testing and deployment |

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/tend.git
cd tend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Set up database
npx prisma migrate dev
npx prisma db seed

# Start development servers
npm run start:api   # Backend on http://localhost:3000
npm run start:web   # Frontend on http://localhost:4200
```

See the [Getting Started](getting-started) guide for detailed instructions.

---

## Project Structure

```
Tend/
├── apps/
│   ├── api/              # NestJS REST API
│   ├── web/              # Angular web application
│   ├── mobile/           # Ionic mobile application
│   └── mcp-server/       # MCP server for AI integration
├── libs/
│   ├── shared/types/     # TypeScript interfaces
│   ├── shared/utils/     # Utility functions
│   ├── shared/constants/ # App constants
│   └── ui/               # Shared UI components
├── prisma/               # Database schema and migrations
├── e2e/                  # End-to-end tests
└── docs/                 # This documentation
```

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](contributing) for details on how to get involved.

---

## License

MIT License - See [LICENSE](https://github.com/your-org/tend/blob/main/LICENSE) for details.
