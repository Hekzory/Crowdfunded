import { assertEquals, assertExists, assertRejects } from "https://deno.land/std@0.211.0/assert/mod.ts";
import { stub, spy, assertSpyCall } from "https://deno.land/std@0.211.0/testing/mock.ts";

// Choose between using real database or mocking it
const USE_REAL_DB = Deno.env.get("DATABASE_URL") ? true : false;

// Mock Pool for when we're not using a real database
class MockPool {
  query() {
    return Promise.resolve({
      rows: [],
      rowCount: 0
    });
  }
}

// Mock environment variables if needed
if (!USE_REAL_DB) {
  globalThis.process = {
    env: {
      DATABASE_URL: "postgresql://user:password@localhost:5432/testdb"
    }
  } as any;
}

// Test with mocked database
Deno.test("db query executes sql and returns results - mocked", async () => {
  if (USE_REAL_DB) {
    // Skip this test when using a real database
    return;
  }

  // Create a spy on the MockPool.query method
  const querySpy = spy(MockPool.prototype, "query");
  
  try {
    // Import the module with mocked dependencies
    const { query } = await import("../../src/app/lib/db.ts");
    
    // Execute the query function
    const sql = "SELECT * FROM test_table WHERE id = $1";
    const params = [1];
    const result = await query(sql, params);
    
    // Verify the query was called with correct parameters
    assertSpyCall(querySpy, 0, {
      args: [sql, params]
    });
    
    // Verify result structure
    assertExists(result);
    assertEquals(result.rowCount, 0);
    assertEquals(result.rows.length, 0);
  } finally {
    // Clean up
    querySpy.restore();
  }
});

// Test error handling with mocked database
Deno.test("db query handles errors correctly - mocked", async () => {
  if (USE_REAL_DB) {
    // Skip this test when using a real database
    return;
  }

  // Create a stub implementation that throws an error
  const errorStub = stub(MockPool.prototype, "query", () => {
    throw new Error("Database error");
  });
  
  try {
    // Import the module with mocked dependencies
    const { query } = await import("../../src/app/lib/db.ts");
    
    // Verify the query function rejects with the error
    await assertRejects(
      async () => {
        await query("SELECT * FROM test_table");
      },
      Error,
      "Database error"
    );
  } finally {
    // Clean up
    errorStub.restore();
  }
});

// Test with real database connection
Deno.test("db query works with real database", { sanitizeOps: false, sanitizeResources: false }, async () => {
  if (!USE_REAL_DB) {
    // Skip this test when not using a real database
    return;
  }

  try {
    // Import database module
    const { query, initDatabase } = await import("../../src/app/lib/db.ts");
    
    // Initialize database and create test table if needed
    await initDatabase();
    
    // Run a simple query
    const result = await query("SELECT 1 as test");
    
    // Verify result
    assertEquals(result.rows[0].test, 1);
    assertEquals(result.rowCount, 1);
  } catch (error) {
    console.error("Database test failed:", error);
    throw error;
  }
}); 