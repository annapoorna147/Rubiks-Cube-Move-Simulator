"use strict";

const FACE_NORMALS = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
  R: [1, 0, 0],
  L: [-1, 0, 0]
};

const FACE_COLORS = {
  U: "white",
  D: "yellow",
  F: "green",
  B: "blue",
  R: "red",
  L: "orange"
};

function dot(a, b) {
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function rotateClockwise(vector, axis) {
  const crossed = cross(axis, vector);
  const projection = dot(axis, vector);

  return vector.map((value, i) =>
    -crossed[i] + axis[i] * projection
  );
}

function createSolvedCube() {
  const stickers = [];

  for (const face of Object.keys(FACE_NORMALS)) {
    const normal = FACE_NORMALS[face];

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        let position;

        switch (face) {
          case "U":
            position = [col - 1, 1, row - 1];
            break;
          case "D":
            position = [col - 1, -1, 1 - row];
            break;
          case "F":
            position = [col - 1, 1 - row, 1];
            break;
          case "B":
            position = [1 - col, 1 - row, -1];
            break;
          case "R":
            position = [1, 1 - row, 1 - col];
            break;
          case "L":
            position = [-1, 1 - row, col - 1];
            break;
        }

        stickers.push({
          position,
          normal: [...normal],
          color: FACE_COLORS[face]
        });
      }
    }
  }

  return { stickers };
}

function cloneCube(cube) {
  return {
    stickers: cube.stickers.map(sticker => ({
      position: [...sticker.position],
      normal: [...sticker.normal],
      color: sticker.color
    }))
  };
}

function turn(cube, face, turns = 1) {
  if (!FACE_NORMALS[face]) {
    throw new Error(`Invalid face: ${face}`);
  }

  if (!Number.isInteger(turns)) {
    throw new Error("Turns must be an integer.");
  }

  const result = cloneCube(cube);
  const axis = FACE_NORMALS[face];
  const count = ((turns % 4) + 4) % 4;

  for (let i = 0; i < count; i++) {
    for (const sticker of result.stickers) {
      if (dot(sticker.position, axis) === 1) {
        sticker.position = rotateClockwise(sticker.position, axis);
        sticker.normal = rotateClockwise(sticker.normal, axis);
      }
    }
  }

  return result;
}

function serializeCube(cube) {
  return cube.stickers
    .map(sticker => [
      ...sticker.position,
      ...sticker.normal,
      sticker.color
    ].join(","))
    .sort()
    .join("|");
}

function isSolved(cube) {
  return Object.keys(FACE_NORMALS).every(face => {
    const normal = FACE_NORMALS[face];
    const faceStickers = cube.stickers.filter(
      sticker => dot(sticker.normal, normal) === 1
    );

    return faceStickers.length === 9 &&
      faceStickers.every(sticker => sticker.color === FACE_COLORS[face]);
  });
}

module.exports = {
  createSolvedCube,
  cloneCube,
  turn,
  serializeCube,
  isSolved,
  FACE_NORMALS
};
