# =============================================================================
# Tend MCP Server Dockerfile
# =============================================================================
# Multi-stage build for Model Context Protocol server (Garden Guide AI)
#
# Build: docker build -f docker/mcp-server/Dockerfile -t tend-mcp-server .
# Run:   docker run -it tend-mcp-server
#
# Note: MCP Server uses stdio transport, not HTTP
#
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source files
COPY apps/mcp-server ./apps/mcp-server
COPY libs ./libs
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build the MCP server
RUN npx nx build mcp-server --configuration=production

# -----------------------------------------------------------------------------
# Stage 2: Production
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 mcpserver

# Install production dependencies only
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --only=production && \
    npx prisma generate && \
    npm cache clean --force

# Copy built application
COPY --from=builder /app/dist/apps/mcp-server ./dist

# Set ownership
RUN chown -R mcpserver:nodejs /app

# Switch to non-root user
USER mcpserver

# Environment variables
ENV NODE_ENV=production
ENV MCP_SERVER_NAME=tend-garden-guide
ENV MCP_SERVER_VERSION=1.0.0

# MCP Server uses stdio transport - no port to expose
# The server communicates via stdin/stdout

# Start the MCP server
CMD ["node", "dist/index.js"]
