"use strict";

const assert = require("node:assert/strict");
const { createSolvedCube } = require("../src/cube");
const { applySequence } = require("../src/moves");
const { createDiagnosticReport } = require("../src/diagnostic-report");

const solved = createDiagnosticReport(createSolvedCube());

assert.equal(solved.valid, true);
assert.equal(solved.status, "VALID");
assert.equal(solved.sections.length, 4);
assert.ok(solved.sections.every(section => section.status === "PASS"));
assert.deepEqual(solved.errors, []);
console.log("PASS solved cube report");

const legalCube = applySequence(
  createSolvedCube(),
  "R U F' L2 D B' U2"
);

const legal = createDiagnosticReport(legalCube);
assert.equal(legal.valid, true);
assert.equal(legal.status, "VALID");
console.log("PASS legal scramble report");

const malformedCube = createSolvedCube();
malformedCube.stickers.pop();

const malformed = createDiagnosticReport(malformedCube);

assert.equal(malformed.valid, false);
assert.equal(malformed.status, "INVALID");
assert.equal(malformed.sections[0].status, "FAIL");
assert.equal(malformed.sections[1].status, "NOT_CHECKED");
assert.equal(malformed.sections[2].status, "NOT_CHECKED");
assert.equal(malformed.sections[3].status, "NOT_CHECKED");
assert.ok(malformed.errors.length > 0);
console.log("PASS malformed cube report");

console.log("\nAll diagnostic report tests passed.");
