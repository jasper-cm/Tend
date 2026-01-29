# =============================================================================
# Tend Database Seeder Dockerfile
# =============================================================================
# One-shot container for seeding the database with initial data
#
# Build: docker build -f docker/seeder/Dockerfile -t tend-seeder .
# Run:   docker run --rm tend-seeder
#
# =============================================================================

FROM node:20-alpine

WORKDIR /app

# Copy package files and Prisma schema
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies for ts-node)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Environment variables
ENV NODE_ENV=production

# Run seed script
CMD ["npx", "ts-node", "prisma/seed.ts"]
