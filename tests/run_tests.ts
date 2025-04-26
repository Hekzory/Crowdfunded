#!/usr/bin/env -S deno run --allow-read --allow-env

// Import all test files
import "./lib/utils.test.ts";
import "./lib/db.test.ts";
import "./components/ProjectCard.test.ts";

console.log("All tests have been imported and will run!"); 