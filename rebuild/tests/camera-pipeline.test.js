"use strict";

const assert = require("assert");

const {
  reconstructCube
} = require("../src/camera/cube-reconstructor");

const {
  buildCubeFromScans
} = require("../src/camera/camera-pipeline");

const COLORS = {
  U: "white",
  D: "yellow",
  F: "green",
  B: "blue",
  R: "red",
  L: "orange"
};

function createSolvedFaces() {
  const faces = {};

  for (const [face, color] of Object.entries(COLORS)) {
    faces[face] = Array(3)
      .fill(null)
      .map(() => Array(3).fill(color));
  }

  return faces;
}

// Test 1: Reconstruct a solved cube.
const solvedResult = reconstructCube(createSolvedFaces());

assert.strictEqual(solvedResult.valid, true);
console.log("PASS: Solved cube reconstruction");

// Test 2: Verify exactly 54 stickers.
assert.strictEqual(solvedResult.cube.stickers.length, 54);
console.log("PASS: 54 stickers reconstructed");

// Test 3: Reject an invalid color.
const invalidFaces = createSolvedFaces();
invalidFaces.U[0][0] = "purple";

const invalidResult = reconstructCube(invalidFaces);

assert.strictEqual(invalidResult.valid, false);
assert.ok(invalidResult.errors.length > 0);
console.log("PASS: Invalid color rejection");

// Test 4: Detect a missing face.
const incompleteFaces = createSolvedFaces();
delete incompleteFaces.B;

const missingResult = buildCubeFromScans(incompleteFaces);

assert.strictEqual(missingResult.valid, false);
assert.ok(missingResult.errors[0].includes("B face"));
console.log("PASS: Missing face detection");

// Test 5: Reject an incorrectly sized face grid.
const malformedFaces = createSolvedFaces();
malformedFaces.F = [["green", "green", "green"]];

const malformedResult = reconstructCube(malformedFaces);

assert.strictEqual(malformedResult.valid, false);
assert.ok(malformedResult.errors.length > 0);
console.log("PASS: Invalid face dimensions");

// Test 6: Verify physical cube diagnosis.
assert.strictEqual(solvedResult.structure.valid, true);
assert.strictEqual(solvedResult.diagnosis.valid, true);
console.log("PASS: Physical cube validation");

console.log("\nAll 6 camera pipeline tests passed.");