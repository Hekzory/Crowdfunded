import { initDatabase } from "../app/lib/db.ts";

console.log("Initializing test database...");

try {
  await initDatabase();
  console.log("Test database initialized successfully!");
} catch (error) {
  console.error("Failed to initialize test database:", error);
  Deno.exit(1);
} 