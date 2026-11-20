"use strict";

const assert = require("node:assert/strict");
const {
  createSolvedCube,
  turn,
  validateCubeStructure
} = require("../src/cube");

const solved = createSolvedCube();

function check(cube, expected, label) {
  const result = validateCubeStructure(cube);
  assert.equal(result.valid, expected, result.errors.join("\n"));
  console.log(`PASS ${label}`);
}

check(solved, true, "solved cube is structurally valid");

let scrambled = solved;
for (const face of ["R", "U", "F", "L", "D", "B"]) {
  scrambled = turn(scrambled, face);
}
check(scrambled, true, "turned cube remains structurally valid");

check({ stickers: solved.stickers.slice(0, 53) },
      false, "missing sticker is rejected");

const badColor = {
  stickers: solved.stickers.map((s, i) =>
    i === 0 ? { ...s, color: "purple" } : { ...s }
  )
};
check(badColor, false, "invalid color is rejected");

const duplicate = {
  stickers: solved.stickers.map(s => ({
    ...s, position: [...s.position], normal: [...s.normal]
  }))
};
duplicate.stickers[1] = {
  ...duplicate.stickers[0],
  position: [...duplicate.stickers[0].position],
  normal: [...duplicate.stickers[0].normal]
};
check(duplicate, false, "duplicate sticker location is rejected");

console.log("\nAll cube structural validation tests passed.");
