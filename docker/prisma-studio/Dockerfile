# =============================================================================
# Prisma Studio Dockerfile
# =============================================================================
# Development tool for database management
#
# =============================================================================

FROM node:20-alpine

WORKDIR /app

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Expose Prisma Studio port
EXPOSE 5555

# Start Prisma Studio
CMD ["npx", "prisma", "studio", "--port", "5555", "--browser", "none"]
