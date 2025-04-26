import { assertEquals } from "https://deno.land/std@0.211.0/assert/mod.ts";
import { formatCurrency, getStatusDisplay } from "../lib/utils.test.ts";

// Test the formatCurrency function extracted from ProjectCard
Deno.test("ProjectCard formatCurrency handles different amounts correctly", () => {
  // Test integer values
  assertEquals(formatCurrency(1000), "$1,000");
  assertEquals(formatCurrency(0), "$0");
  
  // Test decimal values (should round to whole dollars)
  assertEquals(formatCurrency(999.99), "$1,000");
  assertEquals(formatCurrency(999.49), "$999");
  
  // Test edge cases
  assertEquals(formatCurrency(-1000), "-$1,000"); // Negative values
  assertEquals(formatCurrency(0.25), "$0"); // Small decimals
});

// Test the getStatusDisplay function extracted from ProjectCard
Deno.test("ProjectCard getStatusDisplay returns correct display values", () => {
  // Test known status values
  const draftStatus = getStatusDisplay("draft");
  assertEquals(draftStatus.text, "Draft");
  assertEquals(
    draftStatus.color,
    "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  );
  
  const activeStatus = getStatusDisplay("active");
  assertEquals(activeStatus.text, "Active");
  assertEquals(
    activeStatus.color,
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
  );
  
  // Test unknown status values (should capitalize first letter)
  const customStatus = getStatusDisplay("completed");
  assertEquals(customStatus.text, "Completed");
  assertEquals(
    customStatus.color,
    "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  );
  
  // Test empty status (should still work)
  const emptyStatus = getStatusDisplay("");
  assertEquals(emptyStatus.text, "");
}); 