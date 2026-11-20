"use strict";

const assert = require("node:assert/strict");
const { createSolvedCube, validateCubeStructure } = require("../src/cube");
const { applySequence } = require("../src/moves");
const { diagnoseCube } = require("../src/cubies");

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
  const a = stickersAt(cube, positionA);
  const b = stickersAt(cube, positionB);

  assert.equal(a.length, 2);
  assert.equal(b.length, 2);

  const colorsA = a.map(sticker => sticker.color);
  const colorsB = b.map(sticker => sticker.color);

  a.forEach((sticker, i) => { sticker.color = colorsB[i]; });
  b.forEach((sticker, i) => { sticker.color = colorsA[i]; });
}

function rotateCornerStickerNormals(cube, position) {
  const stickers = stickersAt(cube, position);
  assert.equal(stickers.length, 3);

  const normals = stickers.map(sticker => [...sticker.normal]);

  stickers.forEach((sticker, i) => {
    sticker.normal = [...normals[(i + 1) % normals.length]];
  });
}

function flipEdge(cube, position) {
  const stickers = stickersAt(cube, position);
  assert.equal(stickers.length, 2);

  const normal = [...stickers[0].normal];
  stickers[0].normal = [...stickers[1].normal];
  stickers[1].normal = normal;
}

const solvedCube = createSolvedCube();
const solved = diagnoseCube(solvedCube);

assert.equal(solved.valid, true);
assert.equal(solved.structure.valid, true);
assert.equal(solved.pieces.valid, true);
assert.equal(solved.orientation.valid, true);
assert.equal(solved.parity.valid, true);
assert.equal(solved.pieces.corners, 8);
assert.equal(solved.pieces.edges, 12);
console.log("PASS solved cube diagnostic");

const legalCube = applySequence(
  solvedCube,
  "R U F' L2 D B' U2 R' F D2"
);
assert.equal(diagnoseCube(legalCube).valid, true);
console.log("PASS legal scramble diagnostic");

const malformedCube = cloneCube(solvedCube);
malformedCube.stickers.pop();

const malformed = diagnoseCube(malformedCube);
assert.equal(malformed.valid, false);
assert.equal(malformed.structure.valid, false);
assert.equal(malformed.pieces.checked, false);
assert.equal(malformed.orientation.checked, false);
assert.equal(malformed.parity.checked, false);
console.log("PASS malformed cube diagnostic");

const twistedCube = cloneCube(solvedCube);
rotateCornerStickerNormals(twistedCube, [1, 1, 1]);
assert.equal(validateCubeStructure(twistedCube).valid, true);

const twisted = diagnoseCube(twistedCube);
assert.equal(twisted.valid, false);
assert.equal(twisted.pieces.valid, true, twisted.errors.join("\n"));
assert.equal(twisted.orientation.valid, false, twisted.errors.join("\n"));
assert.equal(twisted.parity.valid, true, twisted.errors.join("\n"));
console.log("PASS twisted corner classified as orientation failure");

const flippedCube = cloneCube(solvedCube);
flipEdge(flippedCube, [1, 1, 0]);
assert.equal(validateCubeStructure(flippedCube).valid, true);

const flipped = diagnoseCube(flippedCube);
assert.equal(flipped.valid, false);
assert.equal(flipped.pieces.valid, true, flipped.errors.join("\n"));
assert.equal(flipped.orientation.valid, false, flipped.errors.join("\n"));
assert.equal(flipped.parity.valid, true, flipped.errors.join("\n"));
console.log("PASS flipped edge classified as orientation failure");

const parityCube = cloneCube(solvedCube);
swapEdgePieces(parityCube, [1, 1, 0], [-1, 1, 0]);
assert.equal(validateCubeStructure(parityCube).valid, true);

const parity = diagnoseCube(parityCube);
assert.equal(parity.valid, false);
assert.equal(parity.pieces.valid, true, parity.errors.join("\n"));
assert.equal(parity.orientation.valid, true, parity.errors.join("\n"));
assert.equal(parity.parity.valid, false, parity.errors.join("\n"));
console.log("PASS parity mismatch classified correctly");

console.log("\nAll diagnostic tests passed.");
