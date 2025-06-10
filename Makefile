.PHONY:
		build up upd down restart reup reupd clean test test-up test-down test-db-init

build:
		COMPOSE_BAKE=true docker-compose build

up:
		COMPOSE_BAKE=true docker-compose up

upd:
		COMPOSE_BAKE=true docker-compose up -d

down:
		COMPOSE_BAKE=true docker-compose down

restart:
		COMPOSE_BAKE=true docker-compose stop
		COMPOSE_BAKE=true docker-compose up -d

reup:
		COMPOSE_BAKE=true docker-compose down
		COMPOSE_BAKE=true docker-compose build
		COMPOSE_BAKE=true docker-compose up

reupd:
		COMPOSE_BAKE=true docker-compose down
		COMPOSE_BAKE=true docker-compose build
		COMPOSE_BAKE=true docker-compose up -d

clean:
		COMPOSE_BAKE=true docker-compose down
		docker system prune -a

# Test commands
test-build:
		docker-compose -f docker-compose.test.yml build

test-up:
		docker-compose -f docker-compose.test.yml up -d db_test
		sleep 2 # Give the database time to initialize

test-down:
		docker-compose -f docker-compose.test.yml down

test-db-init:
		docker-compose -f docker-compose.test.yml run --rm app_test deno run --allow-net src/scripts/init-test-db.ts

# Main test command - builds, sets up DB, runs tests, tears down
test: test-build test-up
		docker-compose -f docker-compose.test.yml run --rm app_test deno test --allow-read --allow-env --allow-net --no-check
		$(MAKE) test-down

# Run tests and keep containers running
test-dev: test-build test-up
		docker-compose -f docker-compose.test.yml run --rm app_test

# Run watch mode for tests during development
test-watch: test-build test-up
		docker-compose -f docker-compose.test.yml run --rm app_test deno test --watch --allow-read --allow-env --allow-net --no-check