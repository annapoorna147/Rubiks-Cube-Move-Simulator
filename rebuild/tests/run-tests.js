"use strict";

const { spawnSync } = require("node:child_process");

const suites = [
  "tests/cube.test.js",
  "tests/moves.test.js"
];

for (const suite of suites) {
  console.log(`\n===== ${suite} =====`);

  const result = spawnSync(
    process.execPath,
    [suite],
    { stdio: "inherit" }
  );

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log("\nALL TEST SUITES PASSED.");
