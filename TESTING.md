# Testing Crowdfunded

This document outlines how to run tests for the Crowdfunded application, both locally and with Docker.

## Test Structure

- **Unit Tests**: Located in `tests/` directory
  - `lib/`: Tests for utility functions and libraries
  - `components/`: Tests for React components

## Running Tests with Docker (Recommended)

The project includes Docker Compose configurations for running tests with a PostgreSQL database.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Make](https://www.gnu.org/software/make/)

### Commands

All test commands are available through the Makefile:

```bash
# Run all tests and automatically tear down containers afterward
make test

# Run tests and keep containers running (useful for debugging)
make test-dev

# Build the test Docker image
make test-build

# Start the test database
make test-up

# Stop and remove test containers
make test-down

# Initialize the test database
make test-db-init

# Run tests in watch mode for development
make test-watch
```

### How It Works

1. A separate `docker-compose.test.yml` file configures the testing environment
2. Tests run in an isolated container with its own PostgreSQL database
3. Unit tests automatically adapt to run with the real database when available

## Running Tests Locally

If you prefer to run tests without Docker:

```bash
# Run all tests
deno test --allow-read
```

To run tests with a real database locally:

```bash
# Set up DATABASE_URL environment variable
export DATABASE_URL="postgresql://username:password@localhost:5432/crowdfunded_test"

# Run tests with network access allowed
deno test --allow-read --allow-env --allow-net
```

## Writing Tests

- Unit tests use Deno's built-in test runner and assertions
- Example:

```typescript
import { assertEquals } from "https://deno.land/std@0.211.0/assert/mod.ts";

Deno.test("my test", () => {
  assertEquals(2 + 2, 4);
});
```

## Mocking and Stubbing

For mocking and stubbing, we use Deno's standard library tools:

```typescript
import { stub, spy } from "https://deno.land/std@0.211.0/testing/mock.ts";

Deno.test("test with spy", () => {
  const mySpy = spy(console, "log");
  try {
    console.log("test message");
    // Assert spy was called
    assertEquals(mySpy.calls.length, 1);
  } finally {
    // Always restore spies
    mySpy.restore();
  }
});
```

## Database Tests

Database tests will automatically:
- Use a real PostgreSQL database when run with Docker
- Fall back to mocks when run without Docker or DATABASE_URL 