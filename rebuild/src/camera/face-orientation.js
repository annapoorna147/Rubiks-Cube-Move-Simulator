"use strict";

const VALID_ROTATIONS = [0, 90, 180, 270];

function validateGrid(grid) {
  if (
    !Array.isArray(grid) ||
    grid.length !== 3 ||
    !grid.every(row => Array.isArray(row) && row.length === 3)
  ) {
    throw new Error("Face grid must be a 3x3 array.");
  }
}

function rotateFace(grid, degrees = 0) {
  validateGrid(grid);

  if (!VALID_ROTATIONS.includes(degrees)) {
    throw new Error("Rotation must be 0, 90, 180, or 270 degrees.");
  }

  let result = grid.map(row => [...row]);

  const turns = degrees / 90;

  for (let turn = 0; turn < turns; turn++) {
    const rotated = Array.from(
      { length: 3 },
      () => Array(3)
    );

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        rotated[col][2 - row] = result[row][col];
      }
    }

    result = rotated;
  }

  return result;
}

function rotateFaceClockwise(grid) {
  return rotateFace(grid, 90);
}

module.exports = {
  rotateFace,
  rotateFaceClockwise
};
