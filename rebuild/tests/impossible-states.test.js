"use strict";

const assert = require("node:assert/strict");
const {
  createSolvedCube,
  validateCubeStructure
} = require("../src/cube");
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

function stickersAt(cube, position) {
  return cube.stickers.filter(sticker =>
    sticker.position.every((value, i) => value === position[i])
  );
}

function swapEdgePieces(cube, positionA, positionB) {
  const stickersA = stickersAt(cube, positionA);
  const stickersB = stickersAt(cube, positionB);

  assert.equal(stickersA.length, 2);
  assert.equal(stickersB.length, 2);

  const colorsA = stickersA.map(sticker => sticker.color);
  const colorsB = stickersB.map(sticker => sticker.color);

  stickersA.forEach((sticker, i) => {
    sticker.color = colorsB[i];
  });

  stickersB.forEach((sticker, i) => {
    sticker.color = colorsA[i];
  });
}

const solved = createSolvedCube();

assert.equal(validateCubies(solved).valid, true);
console.log("PASS solved cube is accepted");

const legalCube = applySequence(
  solved,
  "R U F' L2 D B' U2 R' F D2"
);

const legalResult = validateCubies(legalCube);

assert.equal(legalResult.valid, true, legalResult.errors.join("\n"));
console.log("PASS legal sequence is accepted");

const swappedEdges = cloneCube(solved);

swapEdgePieces(swappedEdges, [1, 1, 0], [-1, 1, 0]);

assert.equal(validateCubeStructure(swappedEdges).valid, true);

const swappedResult = validateCubies(swappedEdges);

assert.equal(swappedResult.valid, false);
assert.ok(
  swappedResult.errors.includes(
    "Corner and edge permutation parity must match."
  ),
  swappedResult.errors.join("\n")
);

console.log("PASS impossible two-edge swap is rejected");
console.log("\nAll impossible-state tests passed.");
