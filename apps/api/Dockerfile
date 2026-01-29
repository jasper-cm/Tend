# =============================================================================
# Tend API - Production Dockerfile
# =============================================================================
# Multi-stage build for NestJS API application
#
# Build: docker build -f apps/api/Dockerfile -t tend-api .
# Run:   docker run -p 3000:3000 -e DATABASE_URL=... tend-api
#
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (need devDeps for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# -----------------------------------------------------------------------------
# Stage 2: Build
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma

# Copy source files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY apps/api ./apps/api
COPY libs ./libs
COPY prisma ./prisma

# Build the API
RUN npx nx build api --configuration=production

# -----------------------------------------------------------------------------
# Stage 3: Production
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

# Install wget for health checks and dumb-init for proper signal handling
RUN apk add --no-cache wget dumb-init

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Install production dependencies only
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && \
    npx prisma generate && \
    npm cache clean --force && \
    rm -rf /tmp/* /root/.npm

# Copy built application from builder
COPY --from=builder /app/dist/apps/api ./dist

# Set ownership
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check - uses the /api/health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main.js"]
