# =============================================================================
# Tend Database Migrations Dockerfile
# =============================================================================
# One-shot container for running Prisma migrations
#
# Build: docker build -f docker/migrations/Dockerfile -t tend-migrations .
# Run:   docker run --rm tend-migrations
#
# =============================================================================

FROM node:20-alpine

WORKDIR /app

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Environment variables
ENV NODE_ENV=production

# Run migrations
CMD ["npx", "prisma", "migrate", "deploy"]
