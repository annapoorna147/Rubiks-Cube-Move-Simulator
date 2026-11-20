"use strict";

const assert = require("node:assert/strict");
const {
  createSolvedCube,
  turn,
  serializeCube,
  isSolved,
  FACE_NORMALS
} = require("../src/cube");

let passed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const solved = createSolvedCube();
const original = serializeCube(solved);

test("solved cube contains 54 stickers", () => {
  assert.equal(solved.stickers.length, 54);
});

test("initial cube is solved", () => {
  assert.equal(isSolved(solved), true);
});

for (const face of Object.keys(FACE_NORMALS)) {
  test(`${face} followed by ${face}' restores the cube`, () => {
    const moved = turn(turn(solved, face), face, 3);
    assert.equal(serializeCube(moved), original);
  });

  test(`${face} four times restores the cube`, () => {
    let moved = solved;
    for (let i = 0; i < 4; i++) moved = turn(moved, face);
    assert.equal(serializeCube(moved), original);
  });

  test(`${face} changes the cube state`, () => {
    assert.notEqual(serializeCube(turn(solved, face)), original);
  });
}

console.log(`\n${passed} tests passed.`);
