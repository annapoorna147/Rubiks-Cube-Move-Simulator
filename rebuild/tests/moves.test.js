"use strict";

const assert = require("node:assert/strict");
const {
  createSolvedCube,
  serializeCube,
  isSolved
} = require("../src/cube");

const {
  parseMove,
  parseSequence,
  applySequence,
  invertMove,
  invertSequence,
  formatMove
} = require("../src/moves");

let passed = 0;

function test(name, fn) {
  fn();
  passed++;
  console.log(`PASS ${name}`);
}

test("parse a clockwise move", () => {
  assert.deepEqual(parseMove("R"), { face: "R", turns: 1 });
});

test("parse an inverse move", () => {
  assert.deepEqual(parseMove("U'"), { face: "U", turns: 3 });
});

test("parse a half-turn", () => {
  assert.deepEqual(parseMove("F2"), { face: "F", turns: 2 });
});

test("parse a sequence", () => {
  assert.equal(parseSequence("U F R' D2").length, 4);
});

test("allow an empty sequence", () => {
  assert.deepEqual(parseSequence("  "), []);
});

test("reject invalid move notation", () => {
  for (const move of ["X", "R3", "R''", "u", "R2'"]) {
    assert.throws(() => parseMove(move), /Invalid move notation/);
  }
});

test("reject non-string move notation", () => {
  assert.throws(() => parseMove(5), /must be a string/);
});

test("reject non-string sequences", () => {
  assert.throws(() => parseSequence(null), /must be a string/);
});

test("a move followed by its inverse restores the cube", () => {
  const solved = createSolvedCube();

  for (const move of ["U", "D", "F", "B", "R", "L"]) {
    const inverse = invertMove(move);
    const result = applySequence(
      applySequence(solved, [move]),
      [inverse]
    );

    assert.equal(serializeCube(result), serializeCube(solved));
  }
});

test("a sequence followed by its inverse restores the cube", () => {
  const solved = createSolvedCube();
  const sequence = "R U F' L2 D B'";
  const scrambled = applySequence(solved, sequence);
  const restored = applySequence(scrambled, invertSequence(sequence));

  assert.equal(serializeCube(restored), serializeCube(solved));
  assert.equal(isSolved(restored), true);
});

test("format moves back into standard notation", () => {
  assert.equal(formatMove(parseMove("R")), "R");
  assert.equal(formatMove(parseMove("R'")), "R'");
  assert.equal(formatMove(parseMove("R2")), "R2");
});

test("empty sequence leaves the cube unchanged", () => {
  const solved = createSolvedCube();
  assert.equal(
    serializeCube(applySequence(solved, "")),
    serializeCube(solved)
  );
});

console.log(`\n${passed} move tests passed.`);
