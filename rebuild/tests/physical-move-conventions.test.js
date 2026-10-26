"use strict";

const assert = require("node:assert/strict");
const { createSolvedCube, turn } = require("../src/cube");

function findSticker(cube, position, normal) {
  return cube.stickers.find(sticker =>
    sticker.position.every((n, i) => n === position[i]) &&
    sticker.normal.every((n, i) => n === normal[i])
  );
}

// Each case records a concrete sticker movement for a clockwise
// face turn, viewed from outside that face.
const cases = [
  {
    face: "U",
    fromPosition: [0, 1, 1],
    fromNormal: [0, 0, 1],
    toPosition: [-1, 1, 0],
    toNormal: [-1, 0, 0],
    color: "green"
  },
  {
    face: "D",
    fromPosition: [0, -1, 1],
    fromNormal: [0, 0, 1],
    toPosition: [1, -1, 0],
    toNormal: [1, 0, 0],
    color: "green"
  },
  {
    face: "F",
    fromPosition: [0, 1, 1],
    fromNormal: [0, 1, 0],
    toPosition: [1, 0, 1],
    toNormal: [1, 0, 0],
    color: "white"
  },
  {
    face: "B",
    fromPosition: [0, 1, -1],
    fromNormal: [0, 1, 0],
    toPosition: [-1, 0, -1],
    toNormal: [-1, 0, 0],
    color: "white"
  },
  {
    face: "R",
    fromPosition: [1, 1, 0],
    fromNormal: [0, 1, 0],
    toPosition: [1, 0, -1],
    toNormal: [0, 0, -1],
    color: "white"
  },
  {
    face: "L",
    fromPosition: [-1, 1, 0],
    fromNormal: [0, 1, 0],
    toPosition: [-1, 0, 1],
    toNormal: [0, 0, 1],
    color: "white"
  }
];

for (const testCase of cases) {
  const solved = createSolvedCube();

  const source = findSticker(
    solved,
    testCase.fromPosition,
    testCase.fromNormal
  );

  assert.ok(source, `${testCase.face}: source sticker must exist`);
  assert.equal(source.color, testCase.color);

  const result = turn(solved, testCase.face);

  const destination = findSticker(
    result,
    testCase.toPosition,
    testCase.toNormal
  );

  assert.ok(
    destination,
    `${testCase.face}: destination sticker must exist`
  );

  assert.equal(
    destination.color,
    testCase.color,
    `${testCase.face}: sticker must move to the expected position`
  );

  console.log(`PASS ${testCase.face}: concrete sticker movement`);
}

console.log("\nAll physical move convention checks passed.");
