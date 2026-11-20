"use strict";

const assert = require("node:assert/strict");

const { createSolvedCube, validateCubeStructure } = require("../src/cube");
const { applySequence } = require("../src/moves");
const { validateCubies } = require("../src/cubies");

function cloneCube(cube) {
  return {
    stickers: cube.stickers.map(sticker => ({
      ...sticker,
      position: [...sticker.position],
      normal: [...sticker.normal]
    }))
  };
}

function findSticker(cube, position, normal) {
  return cube.stickers.find(sticker =>
    sticker.position.every((n, i) => n === position[i]) &&
    sticker.normal.every((n, i) => n === normal[i])
  );
}

function swapColors(cube, first, second) {
  const a = findSticker(cube, first.position, first.normal);
  const b = findSticker(cube, second.position, second.normal);

  assert.ok(a, "First target sticker must exist");
  assert.ok(b, "Second target sticker must exist");

  [a.color, b.color] = [b.color, a.color];
}

const solved = createSolvedCube();

const solvedResult = validateCubies(solved);
assert.equal(solvedResult.valid, true, solvedResult.errors.join("\n"));
assert.equal(solvedResult.corners.length, 8);
assert.equal(solvedResult.edges.length, 12);
console.log("PASS solved cube has 8 valid corners and 12 valid edges");

const scrambled = applySequence(
  solved,
  "R U F' L2 D B' U2 R' F D2"
);
const scrambledResult = validateCubies(scrambled);

assert.equal(
  scrambledResult.valid,
  true,
  scrambledResult.errors.join("\n")
);
assert.equal(scrambledResult.corners.length, 8);
assert.equal(scrambledResult.edges.length, 12);
console.log("PASS legal move sequence preserves known cubies");

const badCorner = cloneCube(solved);

swapColors(badCorner, {
  position: [1, 1, 1],
  normal: [0, 0, 1]
}, {
  position: [-1, 1, -1],
  normal: [0, 0, -1]
});

assert.equal(validateCubeStructure(badCorner).valid, true);
assert.equal(validateCubies(badCorner).valid, false);
console.log("PASS impossible corner color combination is rejected");

const badEdge = cloneCube(solved);

swapColors(badEdge, {
  position: [1, 0, 1],
  normal: [0, 0, 1]
}, {
  position: [-1, 0, -1],
  normal: [0, 0, -1]
});

assert.equal(validateCubeStructure(badEdge).valid, true);
assert.equal(validateCubies(badEdge).valid, false);
console.log("PASS impossible edge color combination is rejected");

console.log("\nAll cubie validation tests passed.");
