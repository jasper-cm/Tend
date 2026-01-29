# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production=false

# Generate Prisma client
RUN npx prisma generate

# Copy source and build
COPY . .
RUN npx nx build api --configuration=production

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Install production dependencies only
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && \
    npx prisma generate && \
    npm cache clean --force

# Copy built application
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

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -q -O - http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]
