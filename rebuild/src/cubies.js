"use strict";

const {
  createSolvedCube,
  validateCubeStructure
} = require("./cube");

function groupStickersByPosition(cube) {
  const groups = new Map();

  for (const sticker of cube.stickers) {
    const key = sticker.position.join(",");

    if (!groups.has(key)) {
      groups.set(key, {
        position: [...sticker.position],
        stickers: []
      });
    }

    groups.get(key).stickers.push(sticker);
  }

  return [...groups.values()];
}

function isCorner(position) {
  return position.every(value => Math.abs(value) === 1);
}

function isEdge(position) {
  return position.filter(value => Math.abs(value) === 1).length === 2 &&
    position.includes(0);
}

function colorKey(stickers) {
  return stickers
    .map(sticker => sticker.color)
    .sort()
    .join("+");
}

function inventoryFromSolvedCube(predicate) {
  return new Set(
    groupStickersByPosition(createSolvedCube())
      .filter(group => predicate(group.position))
      .map(group => colorKey(group.stickers))
  );
}

function validatePieceType(
  groups,
  predicate,
  expectedStickerCount,
  expectedPieceCount,
  knownPieces,
  label,
  errors
) {
  const pieces = groups.filter(group => predicate(group.position));
  const seenPieces = new Set();

  if (pieces.length !== expectedPieceCount) {
    errors.push(
      `Expected ${expectedPieceCount} ${label}; found ${pieces.length}.`
    );
  }

  for (const piece of pieces) {
    if (piece.stickers.length !== expectedStickerCount) {
      errors.push(
        `${label} at ${piece.position.join(",")} has ` +
        `${piece.stickers.length} stickers; expected ${expectedStickerCount}.`
      );
      continue;
    }

    const key = colorKey(piece.stickers);

    if (!knownPieces.has(key)) {
      errors.push(
        `Unknown ${label} color combination at ${piece.position.join(",")}: ${key}.`
      );
      continue;
    }

    if (seenPieces.has(key)) {
      errors.push(`Duplicate ${label} piece: ${key}.`);
    }

    seenPieces.add(key);
  }

  return pieces;
}

function validateCubies(cube) {
  const structure = validateCubeStructure(cube);

  if (!structure.valid) {
    return {
      valid: false,
      errors: structure.errors,
      corners: [],
      edges: []
    };
  }

  const groups = groupStickersByPosition(cube);
  const errors = [];

  const corners = validatePieceType(
    groups,
    isCorner,
    3,
    8,
    inventoryFromSolvedCube(isCorner),
    "corner",
    errors
  );

  const edges = validatePieceType(
    groups,
    isEdge,
    2,
    12,
    inventoryFromSolvedCube(isEdge),
    "edge",
    errors
  );

  return {
    valid: errors.length === 0,
    errors,
    corners,
    edges
  };
}

module.exports = {
  validateCubies
};
