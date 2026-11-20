const assert = require("node:assert/strict");
const { createSolvedCube } = require("../src/cube");
const { applySequence } = require("../src/moves");
const { validateCubies } = require("../src/cubies");

const FACES = ["U", "D", "F", "B", "R", "L"];
const SUFFIXES = ["", "'", "2"];
const TRIALS = 500;
const MOVES_PER_TRIAL = 40;

function createRandomIndex(seed) {
  let state = seed >>> 0;

  return function randomIndex(max) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state % max;
  };
}

function runRandomizedCubieTests() {
  const randomIndex = createRandomIndex(20261101);

  for (let trial = 1; trial <= TRIALS; trial++) {
    const moves = [];

    for (let i = 0; i < MOVES_PER_TRIAL; i++) {
      moves.push(
        FACES[randomIndex(FACES.length)] +
        SUFFIXES[randomIndex(SUFFIXES.length)]
      );
    }

    const sequence = moves.join(" ");
    const cube = applySequence(createSolvedCube(), sequence);
    const result = validateCubies(cube);

    assert.equal(
      result.valid,
      true,
      `Trial ${trial} rejected legal sequence: ${sequence}`
    );

    const cornerSum = result.cornerTwists.reduce((sum, value) => sum + value, 0);
    const edgeSum = result.edgeFlips.reduce((sum, value) => sum + value, 0);

    assert.equal(
      cornerSum % 3,
      0,
      `Trial ${trial} has invalid corner-twist sum: ${sequence}`
    );

    assert.equal(
      edgeSum % 2,
      0,
      `Trial ${trial} has invalid edge-flip sum: ${sequence}`
    );
  }

  console.log(
    `PASS: ${TRIALS} randomized sequences (${TRIALS * MOVES_PER_TRIAL} moves)`
  );
}

runRandomizedCubieTests();
