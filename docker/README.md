# Tend - Docker Infrastructure

This directory contains all Docker-related configurations for running the Tend application stack locally.

## Quick Start

```bash
# Start development environment
make dev

# Or manually:
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Docker Network (tend-network)                    │
│                           Subnet: 172.28.0.0/16                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │   Web App   │    │ Mobile App  │    │   Traefik   │  (Optional)     │
│  │  (nginx)    │    │  (nginx)    │    │   Proxy     │                 │
│  │  Port 4200  │    │  Port 4201  │    │  Port 80    │                 │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                 │
│         │                  │                  │                         │
│         └────────────┬─────┴─────────────────┘                         │
│                      │                                                  │
│                      ▼                                                  │
│              ┌─────────────┐                                           │
│              │  NestJS API │                                           │
│              │  Port 3000  │                                           │
│              └──────┬──────┘                                           │
│                     │                                                   │
│         ┌───────────┴───────────┐                                      │
│         ▼                       ▼                                      │
│  ┌─────────────┐        ┌─────────────┐                                │
│  │ PostgreSQL  │        │    Redis    │                                │
│  │  Port 5432  │        │  Port 6379  │                                │
│  └─────────────┘        └─────────────┘                                │
│                                                                         │
│  ┌─────────────┐        ┌─────────────┐                                │
│  │ MCP Server  │        │  pgAdmin    │  (Optional)                    │
│  │   (stdio)   │        │  Port 5050  │                                │
│  └─────────────┘        └─────────────┘                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
docker/
├── api/
│   └── Dockerfile.dev      # Development API Dockerfile
├── web/
│   ├── Dockerfile          # Production web Dockerfile
│   └── Dockerfile.dev      # Development web Dockerfile
├── mobile/
│   ├── Dockerfile          # Production mobile Dockerfile
│   └── Dockerfile.dev      # Development mobile Dockerfile
├── mcp-server/
│   ├── Dockerfile          # Production MCP server Dockerfile
│   └── Dockerfile.dev      # Development MCP server Dockerfile
├── migrations/
│   └── Dockerfile          # Database migrations runner
├── seeder/
│   └── Dockerfile          # Database seeder
├── prisma-studio/
│   └── Dockerfile          # Prisma Studio GUI
├── nginx/
│   ├── nginx.conf          # Main nginx configuration
│   ├── default.conf        # Web app server block
│   └── mobile.conf         # Mobile app server block
├── postgres/
│   └── init/
│       └── 01-init.sql     # Database initialization script
├── pgadmin/
│   └── servers.json        # pgAdmin server configuration
└── README.md               # This file
```

## Services

### Core Services

| Service | Port | Description |
|---------|------|-------------|
| postgres | 5432 | PostgreSQL 16 database |
| redis | 6379 | Redis cache/session store |
| api | 3000 | NestJS REST API |
| web | 4200 | Angular web application |
| mobile | 4201 | Ionic mobile application |
| mcp-server | - | MCP Server (stdio) |

### Optional Services (Profiles)

| Service | Port | Profile | Description |
|---------|------|---------|-------------|
| pgadmin | 5050 | tools | Database management UI |
| prisma-studio | 5555 | tools | Prisma database browser |
| mailhog | 8025 | tools | Email testing tool |
| traefik | 80/8080 | proxy | Reverse proxy |
| migrations | - | migrations | Database migrations |
| seeder | - | seed | Database seeding |

## Usage

### Development

```bash
# Start basic development environment
make dev

# Start with all tools (pgAdmin, Prisma Studio, MailHog)
make dev-all

# Start only specific services
make dev-api      # API + database only
make dev-web      # API + Web
make dev-mobile   # API + Mobile
```

### Production

```bash
# Build and start production environment
make prod-build

# Or build images separately
make build
make prod
```

### Database Operations

```bash
# Run migrations
make migrate

# Seed database
make seed

# Reset database
make db-reset

# Open Prisma Studio
make db-studio

# Backup database
make db-backup

# Restore from backup
make db-restore FILE=backups/tend-20240101-120000.sql
```

### Maintenance

```bash
# View logs
make logs         # All services
make logs-api     # API only
make logs-db      # PostgreSQL only

# Check health
make health

# View resource usage
make stats

# Clean up
make clean        # Remove containers
make clean-all    # Remove containers + volumes
make prune        # Remove unused Docker resources
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| POSTGRES_USER | tend | Database username |
| POSTGRES_PASSWORD | tendpassword | Database password |
| POSTGRES_DB | tend | Database name |
| JWT_SECRET | - | JWT signing secret (change in production!) |
| CORS_ORIGINS | localhost:4200,4201 | Allowed CORS origins |

## Networking

The Docker network uses a custom bridge network with:
- **Subnet**: 172.28.0.0/16
- **Gateway**: 172.28.5.254
- **Service Discovery**: Services can reach each other by name (e.g., `postgres`, `redis`, `api`)

### DNS Resolution

Within the Docker network:
- `postgres` → PostgreSQL container
- `redis` → Redis container
- `api` → API container
- `web` → Web container
- `mobile` → Mobile container

### Traefik (Optional)

For local domain routing, add to `/etc/hosts`:

```
127.0.0.1 tend.local api.tend.local mobile.tend.local
```

Then start with Traefik:

```bash
make proxy
```

Access via:
- http://tend.local → Web app
- http://api.tend.local → API
- http://mobile.tend.local → Mobile app
- http://localhost:8080 → Traefik dashboard

## Health Checks

All services include health checks:

| Service | Endpoint | Interval |
|---------|----------|----------|
| postgres | `pg_isready` | 10s |
| redis | `redis-cli ping` | 10s |
| api | `GET /api/health` | 30s |
| web | `GET /health` | 30s |
| mobile | `GET /health` | 30s |

## Security

- All production containers run as non-root users
- Secrets are passed via environment variables (never baked into images)
- Network isolation via Docker bridge network
- Resource limits applied to prevent runaway containers

## Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs <service-name>

# Check container status
docker compose ps -a
```

### Database connection issues

```bash
# Verify database is running
docker compose exec postgres pg_isready -U tend

# Check connection string
docker compose exec api printenv DATABASE_URL
```

### Hot reload not working

For development, ensure:
1. Using `docker-compose.dev.yml` overlay
2. Volume mounts are correct
3. File polling is enabled (--poll=2000)

### Out of disk space

```bash
# Clean up unused resources
make prune-all

# Remove all volumes
make down-v
```

### Port conflicts

Check if ports are in use:

```bash
lsof -i :3000  # API
lsof -i :4200  # Web
lsof -i :5432  # PostgreSQL
```

Change ports in `.env` if needed:

```env
API_PORT=3001
WEB_PORT=4300
POSTGRES_PORT=5433
```
