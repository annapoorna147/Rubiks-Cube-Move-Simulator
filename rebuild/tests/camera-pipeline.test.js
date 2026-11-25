"use strict";

const assert = require("assert");

const {
  reconstructCube
} = require("../src/camera/cube-reconstructor");

const {
  buildCubeFromScans,
  scanCubeFace
} = require("../src/camera/camera-pipeline");

const { rotateFace } = require("../src/camera/face-orientation");

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

// Test 7: Pipeline supports 90-degree face rotation.
const originalGrid = [
  ["A", "B", "C"],
  ["D", "E", "F"],
  ["G", "H", "I"]
];

const rotatedGrid = rotateFace(originalGrid, 90);

assert.deepStrictEqual(rotatedGrid, [
  ["G", "D", "A"],
  ["H", "E", "B"],
  ["I", "F", "C"]
]);
console.log("PASS: 90-degree face rotation");

// Test 8: Pipeline supports 180-degree face rotation.
assert.deepStrictEqual(rotateFace(originalGrid, 180), [
  ["I", "H", "G"],
  ["F", "E", "D"],
  ["C", "B", "A"]
]);
console.log("PASS: 180-degree face rotation");

// Test 9: Pipeline supports 270-degree face rotation.
assert.deepStrictEqual(rotateFace(originalGrid, 270), [
  ["C", "F", "I"],
  ["B", "E", "H"],
  ["A", "D", "G"]
]);
console.log("PASS: 270-degree face rotation");

// Test 10: Reject an invalid face rotation.
assert.throws(
  () => rotateFace(originalGrid, 45),
  /Rotation must be/
);
console.log("PASS: Invalid face rotation rejection");

// Test 11: Scan API records the requested rotation.
const imageData = {
  width: 30,
  height: 30,
  data: new Uint8ClampedArray(30 * 30 * 4)
};

const scanResult = scanCubeFace(imageData, "U", 90);

assert.strictEqual(scanResult.face, "U");
assert.strictEqual(scanResult.rotation, 90);
assert.strictEqual(scanResult.colors.length, 3);
assert.strictEqual(scanResult.colors[0].length, 3);
console.log("PASS: Scan API accepts rotation parameter");

console.log("\nAll 11 camera pipeline tests passed.");
