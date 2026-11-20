"use strict";

const assert = require("node:assert/strict");

const {
  createSolvedCube,
  turn,
  serializeCube,
  FACE_NORMALS
} = require("../src/cube");

function dot(a, b) {
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

// Explicit coordinate transformations for clockwise turns,
// viewed from outside the corresponding face.
function rotateExpected(v, face) {
  const [x, y, z] = v;

  switch (face) {
    case "U": return [-z, y, x];
    case "D": return [z, y, -x];
    case "F": return [y, -x, z];
    case "B": return [-y, x, z];
    case "R": return [x, z, -y];
    case "L": return [x, -z, y];
    default: throw new Error(`Unknown face: ${face}`);
  }
}

function expectedTurn(cube, face) {
  const axis = FACE_NORMALS[face];

  return {
    stickers: cube.stickers.map(sticker => {
      if (dot(sticker.position, axis) !== 1) {
        return {
          position: [...sticker.position],
          normal: [...sticker.normal],
          color: sticker.color
        };
      }

      return {
        position: rotateExpected(sticker.position, face),
        normal: rotateExpected(sticker.normal, face),
        color: sticker.color
      };
    })
  };
}

const solved = createSolvedCube();

for (const face of Object.keys(FACE_NORMALS)) {
  assert.equal(
    serializeCube(turn(solved, face)),
    serializeCube(expectedTurn(solved, face)),
    `${face} clockwise turn must match explicit coordinates`
  );

  console.log(`PASS ${face}: explicit coordinate orientation`);
}

console.log("\nAll independent orientation tests passed.");
