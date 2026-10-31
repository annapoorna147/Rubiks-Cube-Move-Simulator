"use strict";

const {
  createSolvedCube,
  validateCubeStructure
} = require("./cube");

const CORNER_FACE_ORDER = {
  "1,1,1": ["U", "R", "F"],
  "-1,1,1": ["U", "F", "L"],
  "-1,1,-1": ["U", "L", "B"],
  "1,1,-1": ["U", "B", "R"],
  "1,-1,1": ["D", "F", "R"],
  "-1,-1,1": ["D", "L", "F"],
  "-1,-1,-1": ["D", "B", "L"],
  "1,-1,-1": ["D", "R", "B"]
};

const EDGE_FACE_ORDER = {
  "1,1,0": ["U", "R"],
  "0,1,1": ["U", "F"],
  "-1,1,0": ["U", "L"],
  "0,1,-1": ["U", "B"],
  "1,-1,0": ["D", "R"],
  "0,-1,1": ["D", "F"],
  "-1,-1,0": ["D", "L"],
  "0,-1,-1": ["D", "B"],
  "1,0,1": ["F", "R"],
  "-1,0,1": ["F", "L"],
  "-1,0,-1": ["B", "L"],
  "1,0,-1": ["B", "R"]
};

const FACE_BY_NORMAL = {
  "0,1,0": "U",
  "0,-1,0": "D",
  "0,0,1": "F",
  "0,0,-1": "B",
  "1,0,0": "R",
  "-1,0,0": "L"
};

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

function calculateCornerTwist(corner) {
  const order = CORNER_FACE_ORDER[corner.position.join(",")];

  if (!order || corner.stickers.length !== 3) {
    return null;
  }

  const udSticker = corner.stickers.find(sticker =>
    sticker.color === "white" || sticker.color === "yellow"
  );

  if (!udSticker) {
    return null;
  }

  const face = FACE_BY_NORMAL[udSticker.normal.join(",")];
  const orientation = order.indexOf(face);

  return orientation === -1 ? null : orientation;
}

function calculateEdgeFlip(edge) {
  const order = EDGE_FACE_ORDER[edge.position.join(",")];

  if (!order || edge.stickers.length !== 2) {
    return null;
  }

  // Use U/D-colored stickers when available.
  // Otherwise use the F/B-colored sticker.
  const referenceSticker =
    edge.stickers.find(sticker =>
      sticker.color === "white" || sticker.color === "yellow"
    ) ||
    edge.stickers.find(sticker =>
      sticker.color === "green" || sticker.color === "blue"
    );

  if (!referenceSticker) {
    return null;
  }

  const face = FACE_BY_NORMAL[referenceSticker.normal.join(",")];
  const orientation = order.indexOf(face);

  return orientation === -1 ? null : orientation;
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

  const cornerTwists = corners.map(calculateCornerTwist);
  const edgeFlips = edges.map(calculateEdgeFlip);

  if (cornerTwists.some(value => value === null)) {
    errors.push("Could not determine the orientation of every corner.");
  } else {
    const twistSum = cornerTwists.reduce((sum, value) => sum + value, 0);

    if (twistSum % 3 !== 0) {
      errors.push("Corner twist sum must be divisible by 3.");
    }
  }

  if (edgeFlips.some(value => value === null)) {
    errors.push("Could not determine the orientation of every edge.");
  } else {
    const flipSum = edgeFlips.reduce((sum, value) => sum + value, 0);

    if (flipSum % 2 !== 0) {
      errors.push("Edge flip sum must be even.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    corners,
    edges,
    cornerTwists,
    edgeFlips
  };
}

module.exports = {
  validateCubies
};
