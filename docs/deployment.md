---
layout: default
title: Deployment
nav_order: 11
---

# Deployment Guide

This guide covers deploying Tend to production environments, including the API, web application, mobile apps, and documentation.

---

## Overview

| Component | Recommended Platform | Alternatives |
|-----------|---------------------|--------------|
| API | AWS ECS Fargate | Railway, Render, Fly.io |
| Web | AWS S3 + CloudFront | Vercel, Netlify, Cloudflare |
| Mobile | App Store, Google Play | Enterprise distribution |
| Database | AWS RDS PostgreSQL | Railway PostgreSQL, Supabase |
| Documentation | GitHub Pages | Netlify, Vercel |

---

## AWS Deployment (Recommended)

Tend includes complete AWS infrastructure defined as code using AWS CDK. See [`infra/README.md`](https://github.com/your-org/tend/tree/main/infra) for detailed documentation.

### Architecture

```
Users -> CloudFront -> S3 (Web)
Users -> ALB -> ECS Fargate (API) -> RDS PostgreSQL
```

### Security Features

- **VPC Isolation**: API and database in private subnets
- **No Public Database**: RDS only accessible from within VPC
- **HTTPS Everywhere**: TLS 1.2+ enforced
- **IAM Least Privilege**: Minimal permissions per component
- **Secrets Manager**: Secure credential storage

### Quick Deploy

```bash
# Navigate to infrastructure directory
cd infra

# Install dependencies
npm install

# Bootstrap CDK (first time only)
cdk bootstrap aws://ACCOUNT_ID/REGION

# Deploy all stacks
npm run deploy
```

### Cost Control

The infrastructure includes a Lambda function to start/stop resources:

```bash
# Stop infrastructure (save costs)
aws lambda invoke --function-name tend-infrastructure-control \
  --payload '{"action":"stop"}' /dev/stdout

# Start infrastructure
aws lambda invoke --function-name tend-infrastructure-control \
  --payload '{"action":"start"}' /dev/stdout
```

### Estimated Costs

| Configuration | Monthly Cost |
|---------------|-------------|
| Development (stopped at night) | ~$50-70 |
| Development (always on) | ~$100-110 |
| Production (multi-AZ) | ~$300-400 |

---

## CI/CD Pipeline

Tend uses GitHub Actions for continuous integration and deployment.

### Pipeline Stages

```
┌─────────┐     ┌──────┐     ┌───────┐     ┌─────┐     ┌────────┐
│  Lint   │ --> │ Test │ --> │ Build │ --> │ E2E │ --> │ Deploy │
└─────────┘     └──────┘     └───────┘     └─────┘     └────────┘
```

### CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - uses: nrwl/nx-set-shas@v4
      - run: npx nx affected --target=lint

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - uses: nrwl/nx-set-shas@v4
      - run: npx nx affected --target=test --coverage

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - uses: nrwl/nx-set-shas@v4
      - run: npx nx affected --target=build

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx nx affected --target=e2e
```

---

## API Deployment

### Prerequisites

- Node.js 20.x runtime
- PostgreSQL 16 database
- Environment variables configured

### Environment Variables

```bash
# Required
DATABASE_URL="postgresql://user:password@host:5432/tend?schema=public"
NODE_ENV="production"
PORT="3000"

# Optional
CORS_ORIGINS="https://tend.app,https://www.tend.app"
LOG_LEVEL="info"
```

### Build for Production

```bash
# Build the API
npx nx build api --configuration=production

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Output is in dist/apps/api/
```

### Railway Deployment

1. **Create a Railway project**
   ```bash
   railway init
   ```

2. **Add PostgreSQL**
   - Add PostgreSQL plugin from Railway dashboard
   - Copy `DATABASE_URL` to environment variables

3. **Configure deployment**
   ```toml
   # railway.toml
   [build]
   builder = "nixpacks"
   buildCommand = "npm ci && npx nx build api --configuration=production && npx prisma generate"

   [deploy]
   startCommand = "npx prisma migrate deploy && node dist/apps/api/main.js"
   healthcheckPath = "/health"
   healthcheckTimeout = 300
   ```

4. **Deploy**
   ```bash
   railway up
   ```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nx build api --configuration=production
RUN npx prisma generate

FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist/apps/api ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
```

```bash
# Build and push
docker build -t tend-api .
docker tag tend-api your-registry/tend-api:latest
docker push your-registry/tend-api:latest
```

---

## Web Application Deployment

### Build for Production

```bash
npx nx build web --configuration=production
# Output is in dist/apps/web/
```

### Vercel Deployment

1. **Import project**
   - Connect GitHub repository
   - Select `apps/web` as root directory

2. **Configure build**
   ```json
   // vercel.json
   {
     "buildCommand": "npx nx build web --configuration=production",
     "outputDirectory": "dist/apps/web",
     "installCommand": "npm ci"
   }
   ```

3. **Environment variables**
   ```
   API_URL=https://api.tend.app
   ```

### Netlify Deployment

```toml
# netlify.toml
[build]
  base = "."
  command = "npx nx build web --configuration=production"
  publish = "dist/apps/web"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Cloudflare Pages

1. **Connect repository** in Cloudflare dashboard
2. **Build settings:**
   - Build command: `npx nx build web --configuration=production`
   - Output directory: `dist/apps/web`
   - Root directory: `/`

---

## Mobile App Deployment

### Building for Release

```bash
# Build web assets
npx nx build mobile --configuration=production

# Sync to native projects
npx cap sync

# Open native IDEs
npx cap open ios
npx cap open android
```

### iOS (App Store)

1. **Configure signing** in Xcode
   - Select your Apple Developer Team
   - Create provisioning profiles

2. **Archive the app**
   - Product > Archive
   - Validate archive
   - Upload to App Store Connect

3. **Submit for review**
   - Complete App Store listing
   - Submit for review
   - Typical review time: 1-3 days

### Android (Google Play)

1. **Generate signed APK/AAB**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. **Sign the bundle**
   ```bash
   jarsigner -verbose -sigalg SHA256withRSA \
     -digestalg SHA-256 \
     -keystore my-release-key.jks \
     app/build/outputs/bundle/release/app-release.aab \
     alias_name
   ```

3. **Upload to Play Console**
   - Create release in Play Console
   - Upload AAB file
   - Complete store listing
   - Submit for review

---

## Database Management

### Migrations

```bash
# Create a new migration
npx prisma migrate dev --name add_feature

# Apply migrations in production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

### Seeding

```bash
# Seed development data
npx prisma db seed

# Reset database (development only)
npx prisma migrate reset
```

### Backups

For production PostgreSQL:

```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

---

## Documentation Deployment

Documentation is automatically deployed to GitHub Pages when changes are pushed to `docs/`.

### Automatic Deployment

```yaml
# .github/workflows/deploy-docs.yml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Manual Deployment

```bash
# Test locally with Jekyll
cd docs
bundle install
bundle exec jekyll serve
# Opens at http://localhost:4000
```

### Enable GitHub Pages

1. Go to repository Settings > Pages
2. Set source to "GitHub Actions"
3. Documentation will be available at `https://username.github.io/tend/`

---

## Environment Configuration

### Development

```bash
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tend_dev"
NODE_ENV="development"
PORT="3000"
```

### Staging

```bash
DATABASE_URL="postgresql://user:pass@staging-db.example.com:5432/tend_staging"
NODE_ENV="staging"
API_URL="https://staging-api.tend.app"
```

### Production

```bash
DATABASE_URL="postgresql://user:pass@prod-db.example.com:5432/tend_prod"
NODE_ENV="production"
API_URL="https://api.tend.app"
CORS_ORIGINS="https://tend.app"
```

---

## Monitoring

### Health Checks

The API provides a health endpoint:

```bash
curl https://api.tend.app/health
# {"status":"ok","service":"tend-api","timestamp":"2024-01-15T10:30:00Z"}
```

### Logging

Production logs use structured JSON format:

```json
{
  "level": "info",
  "timestamp": "2024-01-15T10:30:00Z",
  "message": "Request completed",
  "method": "GET",
  "path": "/api/life-areas",
  "statusCode": 200,
  "duration": 45
}
```

### Recommended Services

| Service | Purpose |
|---------|---------|
| **Sentry** | Error tracking |
| **Datadog** | APM and metrics |
| **LogTail** | Log aggregation |
| **Uptime Robot** | Availability monitoring |

---

## Rollback Procedures

### API Rollback

```bash
# Railway
railway rollback

# Docker/Kubernetes
kubectl rollout undo deployment/tend-api

# Database (if migration failed)
npx prisma migrate resolve --rolled-back add_feature
```

### Web Rollback

Most static hosting platforms support instant rollbacks:
- **Vercel**: Deployments > Previous deployment > Promote
- **Netlify**: Deploys > Previous deploy > Publish
- **Cloudflare Pages**: View deployments > Roll back

---

## Security Checklist

Before deploying to production:

- [ ] Environment variables secured (not in code)
- [ ] Database credentials rotated
- [ ] CORS configured for allowed origins only
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Dependency vulnerabilities checked (`npm audit`)
- [ ] Secrets not committed to repository

---

## Scaling Considerations

### Horizontal Scaling

- API: Stateless design allows multiple instances
- Database: Use connection pooling (e.g., PgBouncer)
- Assets: CDN for static files

### Performance Optimization

```bash
# Analyze bundle size
npx nx build web --configuration=production --stats-json
npx webpack-bundle-analyzer dist/apps/web/stats.json

# Database query optimization
npx prisma format
# Review slow query logs
```
