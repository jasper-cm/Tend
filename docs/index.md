---
layout: default
title: Home
nav_order: 1
---

# Welcome to Tend

> **Tend your life as the fruitful garden it is.**

Tend is a holistic personal development application that helps you nurture every dimension of your life through consistent practices, mindful reflection, and AI-powered guidance.

---

## What is Tend?

Tend uses the metaphor of tending a garden to help users cultivate a balanced, fulfilling life. Just as a gardener tends different plots in their garden, users maintain different **life areas** (health, relationships, career, etc.) through regular **practices** (habits, routines, rituals) and **reflections** (journaling).

<div class="feature-grid">
  <div class="feature-card">
    <h3>🌻 Life Garden</h3>
    <p>Visualize all your life areas as plots in a garden, each with health scores that reflect your nurturing efforts.</p>
  </div>
  <div class="feature-card">
    <h3>🌿 Practice Tracking</h3>
    <p>Build lasting habits with streak tracking, reminders, and visual progress indicators for your daily practices.</p>
  </div>
  <div class="feature-card">
    <h3>📝 Reflections</h3>
    <p>Journal your journey with mood tracking, gratitude logs, and insights connected to your life areas.</p>
  </div>
  <div class="feature-card">
    <h3>🤖 Garden Guide AI</h3>
    <p>Get personalized coaching and recommendations powered by the Model Context Protocol (MCP).</p>
  </div>
</div>

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

<div class="tip">
Make sure you have Node.js 20+ and PostgreSQL 16+ installed before proceeding.
</div>

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

<div class="note">
The API includes Swagger documentation at <a href="http://localhost:3000/api/docs">http://localhost:3000/api/docs</a> once running.
</div>

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
├── infra/                # AWS CDK infrastructure
└── docs/                 # This documentation
```

---

## Key Concepts

<div class="info">
Understanding these core concepts will help you navigate the codebase and documentation.
</div>

### Life Areas
The dimensions of life you want to nurture: Health, Relationships, Career, Finance, Mind, Creativity, Environment, and Purpose.

### Practices
Recurring actions that nurture your life areas. Can be daily, weekly, or custom frequency. Examples: "Morning meditation", "Weekly meal prep", "Daily exercise".

### Reflections
Journal entries that capture your thoughts, mood, gratitude, and insights. Linked to relevant life areas for tracking growth patterns.

### Health Score
A calculated metric (0-100) for each life area based on practice completion rates, streaks, and reflection sentiment.

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](contributing) for details on how to get involved.

<div class="warning">
Before submitting a PR, ensure all tests pass by running <code>npm run test</code> and <code>npm run lint</code>.
</div>

---

## License

MIT License - See [LICENSE](https://github.com/your-org/tend/blob/main/LICENSE) for details.

---

<p style="text-align: center; color: #87a878; font-style: italic; margin-top: 2rem;">
  🌱 Happy tending! May your life garden flourish. 🌱
</p>
