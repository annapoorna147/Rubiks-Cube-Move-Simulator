"use strict";

const { turn, FACE_NORMALS } = require("./cube");

const MOVE_PATTERN = /^([UDFBRL])([2']?)$/;

function parseMove(token) {
  if (typeof token !== "string") {
    throw new Error("Move must be a string.");
  }

  const match = MOVE_PATTERN.exec(token);

  if (!match || !FACE_NORMALS[match[1]]) {
    throw new Error(`Invalid move notation: ${token}`);
  }

  const face = match[1];
  const suffix = match[2];

  return {
    face,
    turns: suffix === "'" ? 3 : suffix === "2" ? 2 : 1
  };
}

function parseSequence(notation) {
  if (typeof notation !== "string") {
    throw new Error("Move sequence must be a string.");
  }

  const trimmed = notation.trim();

  if (!trimmed) return [];

  return trimmed.split(/\s+/).map(parseMove);
}

function applyMove(cube, move) {
  const parsed = typeof move === "string" ? parseMove(move) : move;

  if (
    !parsed ||
    !FACE_NORMALS[parsed.face] ||
    ![1, 2, 3].includes(parsed.turns)
  ) {
    throw new Error("Invalid parsed move.");
  }

  return turn(cube, parsed.face, parsed.turns);
}

function applySequence(cube, notation) {
  const moves = Array.isArray(notation)
    ? notation
    : parseSequence(notation);

  return moves.reduce((state, move) => applyMove(state, move), cube);
}

function invertMove(move) {
  const parsed = typeof move === "string" ? parseMove(move) : move;

  if (!parsed || !FACE_NORMALS[parsed.face]) {
    throw new Error("Invalid move.");
  }

  if (parsed.turns === 1) return { face: parsed.face, turns: 3 };
  if (parsed.turns === 3) return { face: parsed.face, turns: 1 };
  if (parsed.turns === 2) return { face: parsed.face, turns: 2 };

  throw new Error("Invalid turn count.");
}

function invertSequence(notation) {
  const moves = Array.isArray(notation)
    ? notation
    : parseSequence(notation);

  return moves.slice().reverse().map(invertMove);
}

function formatMove(move) {
  if (move.turns === 1) return move.face;
  if (move.turns === 2) return `${move.face}2`;
  if (move.turns === 3) return `${move.face}'`;

  throw new Error("Invalid turn count.");
}

module.exports = {
  parseMove,
  parseSequence,
  applyMove,
  applySequence,
  invertMove,
  invertSequence,
  formatMove
};
