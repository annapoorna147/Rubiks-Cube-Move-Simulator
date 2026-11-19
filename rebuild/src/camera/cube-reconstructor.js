"use strict";

const {
  FACE_NORMALS,
  validateCubeStructure
} = require("../cube");

const { diagnoseCube } = require("../cubies");

const FACE_KEYS = ["U", "D", "F", "B", "R", "L"];

function getStickerPosition(face, row, col) {
  switch (face) {
    case "U":
      return [col - 1, 1, row - 1];

    case "D":
      return [col - 1, -1, 1 - row];

    case "F":
      return [col - 1, 1 - row, 1];

    case "B":
      return [1 - col, 1 - row, -1];

    case "R":
      return [1, 1 - row, 1 - col];

    case "L":
      return [-1, 1 - row, col - 1];

    default:
      throw new Error(`Invalid face: ${face}`);
  }
}

function validateFaceGrids(faces) {
  const errors = [];

  if (!faces || typeof faces !== "object" || Array.isArray(faces)) {
    return {
      valid: false,
      errors: ["Faces must be an object containing six face grids."]
    };
  }

  for (const face of FACE_KEYS) {
    const grid = faces[face];

    if (!Array.isArray(grid) || grid.length !== 3) {
      errors.push(`${face} must contain exactly 3 rows.`);
      continue;
    }

    for (let row = 0; row < 3; row++) {
      if (!Array.isArray(grid[row]) || grid[row].length !== 3) {
        errors.push(`${face} row ${row + 1} must contain exactly 3 colors.`);
        continue;
      }

      for (let col = 0; col < 3; col++) {
        if (typeof grid[row][col] !== "string" ||
            grid[row][col].length === 0) {
          errors.push(
            `${face} sticker at row ${row + 1}, column ${col + 1} is invalid.`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function reconstructCube(faces) {
  const faceValidation = validateFaceGrids(faces);

  if (!faceValidation.valid) {
    return {
      valid: false,
      cube: null,
      structure: null,
      diagnosis: null,
      errors: faceValidation.errors
    };
  }

  const stickers = [];

  for (const face of FACE_KEYS) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        stickers.push({
          position: getStickerPosition(face, row, col),
          normal: [...FACE_NORMALS[face]],
          color: faces[face][row][col]
        });
      }
    }
  }

  const cube = { stickers };
  const structure = validateCubeStructure(cube);

  if (!structure.valid) {
    return {
      valid: false,
      cube,
      structure,
      diagnosis: null,
      errors: [...structure.errors]
    };
  }

  const diagnosis = diagnoseCube(cube);

  return {
    valid: diagnosis.valid,
    cube,
    structure,
    diagnosis,
    errors: [...diagnosis.errors]
  };
}

module.exports = {
  reconstructCube,
  validateFaceGrids,
  getStickerPosition
};