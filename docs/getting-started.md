---
layout: default
title: Getting Started
nav_order: 2
---

# Getting Started

This guide will help you set up Tend for local development.

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20.x LTS | JavaScript runtime |
| npm | 10.x | Package manager |
| PostgreSQL | 16.x | Database |
| Git | 2.x | Version control |

### Optional Tools

- **Prisma Studio** - Visual database browser (`npx prisma studio`)
- **Docker** - For containerized PostgreSQL
- **VS Code** - Recommended editor with Nx Console extension

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/tend.git
cd tend
```

### 2. Install Dependencies

```bash
npm install
```

This installs all dependencies for the monorepo, including:
- Angular 18 and related packages
- NestJS 10 and Prisma 5
- Ionic 8 and Capacitor 6
- Testing libraries (Jest, Playwright)

### 3. Configure Environment

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/tend?schema=public"
```

### 4. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev

# Seed with demo data
npx prisma db seed
```

The seed creates:
- A demo user (`demo@tend.app`)
- 8 default life areas
- Sample practices for each area
- Example reflections

---

## Running the Application

### Start the API Server

```bash
npm run start:api
```

The API runs on `http://localhost:3000`:
- Swagger docs: `http://localhost:3000/api/docs`
- Health check: `http://localhost:3000/api/health`

### Start the Web Application

```bash
npm run start:web
```

The web app runs on `http://localhost:4200`.

### Start the Mobile Application

```bash
npm run start:mobile
```

Opens the Ionic development server. For device testing:

```bash
# iOS (requires macOS with Xcode)
npx nx run mobile:build
npx cap sync ios
npx cap open ios

# Android (requires Android Studio)
npx nx run mobile:build
npx cap sync android
npx cap open android
```

### Start the MCP Server

```bash
npm run start:mcp
```

The MCP server runs on stdio for AI client integration.

---

## Development Commands

### Building

```bash
# Build all projects
npm run build

# Build specific project
npx nx run api:build
npx nx run web:build
npx nx run mobile:build
```

### Testing

```bash
# Run all unit tests
npm run test

# Run tests for specific project
npx nx run api:test
npx nx run web:test

# Run with coverage
npx nx run api:test --coverage

# Run E2E tests
npm run e2e
```

### Linting

```bash
# Lint all projects
npm run lint

# Lint specific project
npx nx run api:lint
```

### Database Commands

```bash
# Generate Prisma client after schema changes
npm run prisma:generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npm run prisma:studio

# Reset database (CAUTION: destroys data)
npx prisma migrate reset
```

---

## Project Structure Deep Dive

```
Tend/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── app/            # Root module and health endpoint
│   │   │   ├── modules/        # Feature modules
│   │   │   │   ├── life-areas/
│   │   │   │   ├── practices/
│   │   │   │   ├── reflections/
│   │   │   │   ├── garden-guide/
│   │   │   │   └── auth/
│   │   │   └── prisma/         # Database service
│   │   └── project.json        # Nx project config
│   │
│   ├── web/                    # Angular web app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── pages/      # Route components
│   │   │   │   └── app.component.ts
│   │   │   ├── styles.scss     # Global styles
│   │   │   └── index.html
│   │   ├── tailwind.config.js
│   │   └── project.json
│   │
│   ├── mobile/                 # Ionic mobile app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── tabs/       # Tab navigation
│   │   │   │   └── pages/      # Feature pages
│   │   │   └── theme/          # Ionic theming
│   │   ├── capacitor.config.ts
│   │   └── project.json
│   │
│   └── mcp-server/             # MCP AI server
│       ├── src/
│       │   ├── index.ts        # Server entry point
│       │   ├── tools/          # MCP tool definitions
│       │   └── resources/      # MCP resource definitions
│       └── project.json
│
├── libs/
│   ├── shared/
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Utility functions
│   │   └── constants/          # App constants
│   └── ui/                     # Shared Angular components
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Seed data script
│   └── migrations/             # Database migrations
│
├── e2e/                        # Playwright E2E tests
├── docs/                       # This documentation
├── .github/workflows/          # CI/CD pipelines
├── nx.json                     # Nx workspace config
├── tsconfig.base.json          # Base TypeScript config
└── package.json                # Root dependencies
```

---

## IDE Setup

### VS Code Extensions

We recommend installing:

- **Nx Console** - Visual interface for Nx commands
- **Angular Language Service** - Angular intellisense
- **Prisma** - Schema syntax highlighting
- **Tailwind CSS IntelliSense** - CSS class completion
- **ESLint** - Linting support
- **Prettier** - Code formatting

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## Troubleshooting

### Common Issues

**Prisma client not generated**
```bash
npx prisma generate
```

**Database connection refused**
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`

**Port already in use**
```bash
# Find process on port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

**Node modules issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

- [Architecture Overview](architecture/overview) - Understand the system design
- [Domain Model](domain/model) - Learn about data structures
- [API Reference](api/) - Explore the REST API
