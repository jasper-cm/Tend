# =============================================================================
# Tend Web Application Dockerfile
# =============================================================================
# Multi-stage build for Angular web application
#
# Build: docker build -f docker/web/Dockerfile -t tend-web .
# Run:   docker run -p 4200:80 tend-web
#
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source files
COPY apps/web ./apps/web
COPY libs ./libs
COPY prisma ./prisma

# Generate Prisma client (needed for shared types)
RUN npx prisma generate

# Build the web application
ARG API_URL=http://localhost:3000
ENV API_URL=${API_URL}

RUN npx nx build web --configuration=production

# -----------------------------------------------------------------------------
# Stage 2: Production
# -----------------------------------------------------------------------------
FROM nginx:1.25-alpine AS runner

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup -g 1001 -S nginx-group && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-group nginx-user

# Copy custom nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist/apps/web/browser /usr/share/nginx/html

# Create health check endpoint
RUN echo "OK" > /usr/share/nginx/html/health

# Set ownership
RUN chown -R nginx-user:nginx-group /usr/share/nginx/html && \
    chown -R nginx-user:nginx-group /var/cache/nginx && \
    chown -R nginx-user:nginx-group /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-group /var/run/nginx.pid

# Switch to non-root user
USER nginx-user

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O - http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
