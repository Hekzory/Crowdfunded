import { assertEquals } from "https://deno.land/std@0.211.0/assert/mod.ts";

// A simple formatter utility we can test
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// A simple status display utility we can test
export function getStatusDisplay(statusValue: string): { text: string; color: string } {
  switch (statusValue) {
    case 'draft':
      return { text: 'Draft', color: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    case 'active':
      return { text: 'Active', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' };
    default:
      return { 
        text: statusValue.charAt(0).toUpperCase() + statusValue.slice(1), 
        color: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300' 
      };
  }
}

Deno.test("formatCurrency formats numbers correctly", () => {
  assertEquals(formatCurrency(1000), "$1,000");
  assertEquals(formatCurrency(0), "$0");
  assertEquals(formatCurrency(1000000), "$1,000,000");
  assertEquals(formatCurrency(1234.56), "$1,235"); // Should round to nearest dollar
});

Deno.test("getStatusDisplay returns correct values for known statuses", () => {
  const draftResult = getStatusDisplay('draft');
  assertEquals(draftResult.text, 'Draft');
  assertEquals(draftResult.color, 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300');
  
  const activeResult = getStatusDisplay('active');
  assertEquals(activeResult.text, 'Active');
  assertEquals(activeResult.color, 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400');
});

Deno.test("getStatusDisplay capitalizes unknown statuses", () => {
  const customResult = getStatusDisplay('pending');
  assertEquals(customResult.text, 'Pending');
  assertEquals(customResult.color, 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300');
}); 