COMPOSE := docker compose -f docker/docker-compose.yml
BACKEND := $(COMPOSE) exec backend
POSTGRES := $(COMPOSE) exec postgres

.PHONY: help up down restart ps logs logs-backend build pull shell-backend shell-postgres shell-redis artisan composer migrate seed migrate-fresh token test-backend pint clean

help:
	@printf "HelloBooks dev commands:\n"
	@printf "  make up              Start all containers\n"
	@printf "  make down            Stop containers\n"
	@printf "  make restart         Restart containers\n"
	@printf "  make ps              Show container status\n"
	@printf "  make logs            Follow all logs\n"
	@printf "  make logs-backend    Follow backend PHP-FPM and Nginx logs\n"
	@printf "  make build           Build containers\n"
	@printf "  make shell-backend   Open sh in backend container\n"
	@printf "  make shell-postgres  Open psql in postgres container\n"
	@printf "  make shell-redis     Open redis-cli in redis container\n"
	@printf "  make artisan CMD='route:list'\n"
	@printf "  make composer CMD='install'\n"
	@printf "  make migrate         Run migrations\n"
	@printf "  make seed            Run seeders\n"
	@printf "  make migrate-fresh   Recreate DB and seed\n"
	@printf "  make token           Print JWT for biblio@hello.local\n"
	@printf "  make test-backend    Run Laravel tests\n"
	@printf "  make pint            Run Laravel Pint\n"

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
	$(COMPOSE) logs -f backend backend-web

build:
	$(COMPOSE) build

pull:
	$(COMPOSE) pull

shell-backend:
	$(BACKEND) sh

shell-postgres:
	$(POSTGRES) psql -U hellobooks -d hellobooks

shell-redis:
	$(COMPOSE) exec redis redis-cli

artisan:
	$(BACKEND) php artisan $(CMD)

composer:
	$(BACKEND) composer $(CMD)

migrate:
	$(BACKEND) php artisan migrate

seed:
	$(BACKEND) php artisan db:seed

migrate-fresh:
	$(BACKEND) php artisan migrate:fresh --seed

token:
	@$(BACKEND) php artisan tinker --execute='$$user = App\Models\Usuario::where("email", "biblio@hello.local")->firstOrFail(); echo auth("api")->login($$user).PHP_EOL;'

test-backend:
	$(BACKEND) php artisan test

pint:
	$(BACKEND) ./vendor/bin/pint

clean:
	$(COMPOSE) down -v
