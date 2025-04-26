# Crowdfunded Tests

This directory contains unit tests for the Crowdfunded application using Deno's built-in testing framework.

## Structure

- `lib/`: Tests for utility functions and libraries
- `components/`: Tests for React components
- `run_tests.ts`: A script that imports and runs all tests

## Running Tests

There are two ways to run the tests:

### 1. Using npm/yarn script

```bash
npm test
# or
yarn test
```

This will run all tests in the tests directory.

### 2. Using Deno directly

```bash
deno test --allow-read --allow-env
```

You can also run specific test files:

```bash
deno test --allow-read --allow-env tests/lib/utils.test.ts
```

## Writing New Tests

To add a new test:

1. Create a new file in the appropriate directory (lib, components, etc.)
2. Import Deno's testing utilities: `import { assertEquals } from "https://deno.land/std@0.211.0/assert/mod.ts";`
3. Write your test using `Deno.test()`:

```typescript
Deno.test("Your test description", () => {
  // Test code here
  assertEquals(actualValue, expectedValue);
});
```

4. Import your test file in `run_tests.ts` 