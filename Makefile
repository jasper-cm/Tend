# =============================================================================
# Tend - Makefile
# =============================================================================
# Convenient commands for Docker operations
#
# Usage:
#   make help          # Show all available commands
#   make dev           # Start development environment
#   make prod          # Start production environment
#   make down          # Stop all services
#
# =============================================================================

.PHONY: help dev prod build up down logs shell migrate seed clean prune status restart test lint

# Default target
.DEFAULT_GOAL := help

# Colors for output
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# Docker Compose files
DC := docker compose
DC_DEV := $(DC) -f docker-compose.yml -f docker-compose.dev.yml

# =============================================================================
# Help
# =============================================================================

help: ## Show this help message
	@echo ""
	@echo "$(CYAN)Tend - Docker Management Commands$(RESET)"
	@echo ""
	@echo "$(GREEN)Development:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '(dev|watch|hot)' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-15s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Production:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '(prod|build|deploy)' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-15s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Database:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '(migrate|seed|db|prisma)' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-15s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Utilities:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -vE '(dev|watch|hot|prod|build|deploy|migrate|seed|db|prisma)' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-15s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# =============================================================================
# Development Commands
# =============================================================================

dev: ## Start development environment with hot reload
	@echo "$(GREEN)Starting Tend development environment...$(RESET)"
	@cp -n .env.example .env 2>/dev/null || true
	$(DC_DEV) up -d postgres redis
	@echo "$(YELLOW)Waiting for database to be ready...$(RESET)"
	@sleep 5
	$(DC_DEV) up -d api web mobile
	@echo ""
	@echo "$(GREEN)Development environment started!$(RESET)"
	@echo "  API:    http://localhost:3000"
	@echo "  Web:    http://localhost:4200"
	@echo "  Mobile: http://localhost:4201"
	@echo "  Docs:   http://localhost:3000/api/docs"

dev-all: ## Start development environment with all tools (pgAdmin, Prisma Studio)
	@echo "$(GREEN)Starting Tend development environment with tools...$(RESET)"
	@cp -n .env.example .env 2>/dev/null || true
	$(DC_DEV) --profile tools up -d
	@echo ""
	@echo "$(GREEN)Full development environment started!$(RESET)"
	@echo "  API:           http://localhost:3000"
	@echo "  Web:           http://localhost:4200"
	@echo "  Mobile:        http://localhost:4201"
	@echo "  Docs:          http://localhost:3000/api/docs"
	@echo "  pgAdmin:       http://localhost:5050"
	@echo "  Prisma Studio: http://localhost:5555"
	@echo "  MailHog:       http://localhost:8025"

dev-api: ## Start only API in development mode
	@cp -n .env.example .env 2>/dev/null || true
	$(DC_DEV) up -d postgres redis api

dev-web: ## Start only Web in development mode
	@cp -n .env.example .env 2>/dev/null || true
	$(DC_DEV) up -d postgres redis api web

dev-mobile: ## Start only Mobile in development mode
	@cp -n .env.example .env 2>/dev/null || true
	$(DC_DEV) up -d postgres redis api mobile

watch: dev ## Alias for dev

# =============================================================================
# Production Commands
# =============================================================================

prod: ## Start production environment
	@echo "$(GREEN)Starting Tend production environment...$(RESET)"
	@if [ ! -f .env ]; then \
		echo "$(RED)Error: .env file not found. Copy .env.example to .env and configure it.$(RESET)"; \
		exit 1; \
	fi
	$(DC) up -d
	@echo ""
	@echo "$(GREEN)Production environment started!$(RESET)"

prod-build: ## Build and start production environment
	@echo "$(GREEN)Building Tend production images...$(RESET)"
	$(DC) build --parallel
	$(DC) up -d

build: ## Build all Docker images
	@echo "$(GREEN)Building all Docker images...$(RESET)"
	$(DC) build --parallel

build-api: ## Build API Docker image
	$(DC) build api

build-web: ## Build Web Docker image
	$(DC) build web

build-mobile: ## Build Mobile Docker image
	$(DC) build mobile

build-no-cache: ## Build all images without cache
	$(DC) build --no-cache --parallel

# =============================================================================
# Docker Operations
# =============================================================================

up: ## Start all services
	$(DC) up -d

down: ## Stop all services
	$(DC) down

down-v: ## Stop all services and remove volumes
	@echo "$(YELLOW)Warning: This will delete all data!$(RESET)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	$(DC) down -v

restart: ## Restart all services
	$(DC) restart

restart-api: ## Restart API service
	$(DC) restart api

status: ## Show status of all services
	@echo "$(CYAN)Service Status:$(RESET)"
	$(DC) ps

logs: ## View logs for all services
	$(DC) logs -f

logs-api: ## View API logs
	$(DC) logs -f api

logs-web: ## View Web logs
	$(DC) logs -f web

logs-mobile: ## View Mobile logs
	$(DC) logs -f mobile

logs-db: ## View PostgreSQL logs
	$(DC) logs -f postgres

# =============================================================================
# Shell Access
# =============================================================================

shell-api: ## Open shell in API container
	$(DC) exec api sh

shell-web: ## Open shell in Web container
	$(DC) exec web sh

shell-db: ## Open PostgreSQL shell
	$(DC) exec postgres psql -U tend -d tend

shell-redis: ## Open Redis CLI
	$(DC) exec redis redis-cli

# =============================================================================
# Database Commands
# =============================================================================

migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(RESET)"
	$(DC) --profile migrations run --rm migrations

migrate-dev: ## Run database migrations (development)
	@echo "$(GREEN)Running database migrations...$(RESET)"
	$(DC_DEV) exec api npx prisma migrate dev

seed: ## Seed the database with sample data
	@echo "$(GREEN)Seeding database...$(RESET)"
	$(DC) --profile seed run --rm seeder

seed-dev: ## Seed database (development)
	$(DC_DEV) exec api npx ts-node prisma/seed.ts

db-reset: ## Reset database (drop, migrate, seed)
	@echo "$(YELLOW)Warning: This will reset all database data!$(RESET)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	$(DC_DEV) exec api npx prisma migrate reset --force

db-studio: ## Open Prisma Studio
	$(DC_DEV) --profile tools up -d prisma-studio
	@echo "$(GREEN)Prisma Studio: http://localhost:5555$(RESET)"

db-backup: ## Backup database to file
	@mkdir -p backups
	@echo "$(GREEN)Backing up database...$(RESET)"
	$(DC) exec -T postgres pg_dump -U tend tend > backups/tend-$$(date +%Y%m%d-%H%M%S).sql
	@echo "$(GREEN)Backup saved to backups/$(RESET)"

db-restore: ## Restore database from backup (usage: make db-restore FILE=backups/file.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)Error: Specify backup file with FILE=path/to/backup.sql$(RESET)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Warning: This will overwrite the database!$(RESET)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	$(DC) exec -T postgres psql -U tend tend < $(FILE)

# =============================================================================
# Testing & Quality
# =============================================================================

test: ## Run all tests
	@echo "$(GREEN)Running tests...$(RESET)"
	$(DC_DEV) exec api npm run test

test-api: ## Run API tests
	$(DC_DEV) exec api npx nx test api

test-web: ## Run Web tests
	$(DC_DEV) exec web npx nx test web

test-e2e: ## Run end-to-end tests
	$(DC_DEV) exec api npx nx run-many --target=e2e

lint: ## Run linter on all projects
	$(DC_DEV) exec api npm run lint

typecheck: ## Run TypeScript type checking
	$(DC_DEV) exec api npx nx run-many --target=typecheck

# =============================================================================
# Cleanup Commands
# =============================================================================

clean: ## Remove all containers and networks (keeps volumes)
	$(DC) down --remove-orphans

clean-all: ## Remove all containers, networks, and volumes
	@echo "$(YELLOW)Warning: This will delete all data!$(RESET)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	$(DC) down -v --remove-orphans
	docker network rm tend-network 2>/dev/null || true

prune: ## Remove unused Docker resources
	@echo "$(YELLOW)Pruning unused Docker resources...$(RESET)"
	docker system prune -f
	docker volume prune -f

prune-all: ## Remove ALL unused Docker resources (including images)
	@echo "$(YELLOW)Warning: This will remove all unused images!$(RESET)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	docker system prune -a -f
	docker volume prune -f

# =============================================================================
# Utility Commands
# =============================================================================

env: ## Create .env file from template
	@if [ -f .env ]; then \
		echo "$(YELLOW).env file already exists$(RESET)"; \
	else \
		cp .env.example .env; \
		echo "$(GREEN).env file created from template$(RESET)"; \
	fi

hosts: ## Add local domains to /etc/hosts
	@echo "$(YELLOW)Adding local domains to /etc/hosts (requires sudo)...$(RESET)"
	@echo "127.0.0.1 tend.local api.tend.local mobile.tend.local" | sudo tee -a /etc/hosts
	@echo "$(GREEN)Done! Access via:$(RESET)"
	@echo "  http://tend.local"
	@echo "  http://api.tend.local"
	@echo "  http://mobile.tend.local"

health: ## Check health of all services
	@echo "$(CYAN)Checking service health...$(RESET)"
	@echo ""
	@echo -n "PostgreSQL: " && ($(DC) exec -T postgres pg_isready -U tend -d tend > /dev/null 2>&1 && echo "$(GREEN)OK$(RESET)" || echo "$(RED)FAILED$(RESET)")
	@echo -n "Redis:      " && ($(DC) exec -T redis redis-cli ping > /dev/null 2>&1 && echo "$(GREEN)OK$(RESET)" || echo "$(RED)FAILED$(RESET)")
	@echo -n "API:        " && (curl -sf http://localhost:3000/api/health > /dev/null 2>&1 && echo "$(GREEN)OK$(RESET)" || echo "$(RED)FAILED$(RESET)")
	@echo -n "Web:        " && (curl -sf http://localhost:4200/health > /dev/null 2>&1 && echo "$(GREEN)OK$(RESET)" || echo "$(RED)FAILED$(RESET)")
	@echo -n "Mobile:     " && (curl -sf http://localhost:4201/health > /dev/null 2>&1 && echo "$(GREEN)OK$(RESET)" || echo "$(RED)FAILED$(RESET)")

stats: ## Show resource usage statistics
	@echo "$(CYAN)Container Resource Usage:$(RESET)"
	docker stats --no-stream $(shell docker compose ps -q 2>/dev/null)

pull: ## Pull latest base images
	$(DC) pull

# =============================================================================
# Traefik (Reverse Proxy)
# =============================================================================

proxy: ## Start with Traefik reverse proxy
	$(DC) --profile proxy up -d
	@echo ""
	@echo "$(GREEN)Services available via Traefik:$(RESET)"
	@echo "  Web:       http://tend.local"
	@echo "  Mobile:    http://mobile.tend.local"
	@echo "  API:       http://api.tend.local"
	@echo "  Dashboard: http://localhost:8080"

proxy-stop: ## Stop Traefik
	$(DC) --profile proxy down
