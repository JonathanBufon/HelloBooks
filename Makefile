COMPOSE := docker compose -f docker/docker-compose.yml
BACKEND := $(COMPOSE) exec backend
FRONTEND := $(COMPOSE) exec frontend
POSTGRES := $(COMPOSE) exec postgres

.PHONY: help up down restart ps logs logs-backend logs-frontend build pull shell-backend shell-frontend shell-postgres shell-redis artisan composer npm migrate seed migrate-fresh test-backend test-frontend pint frontend-build clean

help:
	@printf "HelloBooks dev commands:\n"
	@printf "  make up              Start all containers\n"
	@printf "  make down            Stop containers\n"
	@printf "  make restart         Restart containers\n"
	@printf "  make ps              Show container status\n"
	@printf "  make logs            Follow all logs\n"
	@printf "  make logs-backend    Follow backend logs\n"
	@printf "  make logs-frontend   Follow frontend logs\n"
	@printf "  make build           Build containers\n"
	@printf "  make shell-backend   Open sh in backend container\n"
	@printf "  make shell-frontend  Open sh in frontend container\n"
	@printf "  make shell-postgres  Open psql in postgres container\n"
	@printf "  make shell-redis     Open redis-cli in redis container\n"
	@printf "  make artisan CMD='route:list'\n"
	@printf "  make composer CMD='install'\n"
	@printf "  make npm CMD='run build'\n"
	@printf "  make migrate         Run migrations\n"
	@printf "  make seed            Run seeders\n"
	@printf "  make migrate-fresh   Recreate DB and seed\n"
	@printf "  make test-backend    Run Laravel tests\n"
	@printf "  make test-frontend   Run frontend tests\n"
	@printf "  make pint            Run Laravel Pint\n"
	@printf "  make frontend-build  Build frontend\n"

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f

logs-backend:
	$(COMPOSE) logs -f backend

logs-frontend:
	$(COMPOSE) logs -f frontend

build:
	$(COMPOSE) build

pull:
	$(COMPOSE) pull

shell-backend:
	$(BACKEND) sh

shell-frontend:
	$(FRONTEND) sh

shell-postgres:
	$(POSTGRES) psql -U hellobooks -d hellobooks

shell-redis:
	$(COMPOSE) exec redis redis-cli

artisan:
	$(BACKEND) php artisan $(CMD)

composer:
	$(BACKEND) composer $(CMD)

npm:
	$(FRONTEND) npm $(CMD)

migrate:
	$(BACKEND) php artisan migrate

seed:
	$(BACKEND) php artisan db:seed

migrate-fresh:
	$(BACKEND) php artisan migrate:fresh --seed

test-backend:
	$(BACKEND) php artisan test

test-frontend:
	$(FRONTEND) npm run test

pint:
	$(BACKEND) ./vendor/bin/pint

frontend-build:
	$(FRONTEND) npm run build

clean:
	$(COMPOSE) down -v
