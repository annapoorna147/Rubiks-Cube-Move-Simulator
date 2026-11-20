"use strict";

const assert = require("node:assert/strict");
const {
  createSolvedCube,
  turn,
  serializeCube,
  isSolved,
  FACE_NORMALS
} = require("../src/cube");

const {
  applySequence,
  invertSequence
} = require("../src/moves");

const solved = createSolvedCube();
const original = serializeCube(solved);

function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

// Independently check the rotation rule currently used by cube.js.
// Positive face turns are clockwise when viewed from outside the face.
function expectedRotate(vector, axis) {
  const c = cross(axis, vector);
  const d = dot(axis, vector);
  return vector.map((v, i) => -c[i] + axis[i] * d);
}

function expectedTurn(cube, face) {
  const axis = FACE_NORMALS[face];

  return {
    stickers: cube.stickers.map(s => {
      if (dot(s.position, axis) !== 1) {
        return {
          position: [...s.position],
          normal: [...s.normal],
          color: s.color
        };
      }

      return {
        position: expectedRotate(s.position, axis),
        normal: expectedRotate(s.normal, axis),
        color: s.color
      };
    })
  };
}

for (const face of Object.keys(FACE_NORMALS)) {
  assert.equal(
    serializeCube(turn(solved, face)),
    serializeCube(expectedTurn(solved, face)),
    `${face}: rotation matches the geometric rule`
  );
  console.log(`PASS ${face}: geometric rotation consistency`);
}

const scramble = "R U F' L2 D B' U2 R' F D2";
const scrambled = applySequence(solved, scramble);
const restored = applySequence(scrambled, invertSequence(scramble));

assert.equal(isSolved(scrambled), false);
assert.equal(serializeCube(restored), original);
assert.equal(isSolved(restored), true);
console.log("PASS scramble followed by inverse restores solved cube");

console.log("\nAll validation checks passed.");
