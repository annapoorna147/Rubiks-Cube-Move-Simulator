"use strict";

const assert = require("assert");

const {
  rotateFace,
  rotateFaceClockwise
} = require("../src/camera/face-orientation");

const original = [
  ["A", "B", "C"],
  ["D", "E", "F"],
  ["G", "H", "I"]
];

// Test 1: Zero-degree rotation.
assert.deepStrictEqual(
  rotateFace(original, 0),
  [
    ["A", "B", "C"],
    ["D", "E", "F"],
    ["G", "H", "I"]
  ]
);

// Test 2: 90-degree clockwise rotation.
assert.deepStrictEqual(
  rotateFace(original, 90),
  [
    ["G", "D", "A"],
    ["H", "E", "B"],
    ["I", "F", "C"]
  ]
);

// Test 3: 180-degree rotation.
assert.deepStrictEqual(
  rotateFace(original, 180),
  [
    ["I", "H", "G"],
    ["F", "E", "D"],
    ["C", "B", "A"]
  ]
);

// Test 4: 270-degree clockwise rotation.
assert.deepStrictEqual(
  rotateFace(original, 270),
  [
    ["C", "F", "I"],
    ["B", "E", "H"],
    ["A", "D", "G"]
  ]
);

// Test 5: Clockwise helper.
assert.deepStrictEqual(
  rotateFaceClockwise(original),
  rotateFace(original, 90)
);

// Test 6: Invalid rotation.
assert.throws(
  () => rotateFace(original, 45),
  /Rotation must be/
);

// Test 7: Invalid grid.
assert.throws(
  () => rotateFace([["A", "B"], ["C", "D"]]),
  /3x3/
);

// Test 8: Original grid remains unchanged.
assert.deepStrictEqual(original, [
  ["A", "B", "C"],
  ["D", "E", "F"],
  ["G", "H", "I"]
]);

console.log("PASS: 0-degree rotation");
console.log("PASS: 90-degree clockwise rotation");
console.log("PASS: 180-degree rotation");
console.log("PASS: 270-degree clockwise rotation");
console.log("PASS: Clockwise helper");
console.log("PASS: Invalid rotation rejection");
console.log("PASS: Invalid grid rejection");
console.log("PASS: Original grid preservation");

console.log("\nAll 8 face orientation tests passed.");
