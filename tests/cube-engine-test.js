/*
 * RUBIX Ultimate Edition
 * Cube Engine Verification
 */

const fs = require("fs");

let source = fs.readFileSync("app/cube-engine.js", "utf8");

/*
 * Remove browser-only startup calls so the engine
 * can be evaluated for mathematical testing.
 */
source = source
    .replace(/createSolvedCube\(\);\s*render\(\);/g, "")
    .replace(/console\.log\(.*?\);/g, "");

global.window = {};

eval(source);

function state() {
    return JSON.stringify(stickers);
}

function test(name, fn) {

    createSolvedCube();

    const original = state();

    fn();

    const passed = state() === original;

    console.log(
        passed ? "✅ PASS" : "❌ FAIL",
        name
    );

    return passed;
}

let passed = 0;
let total = 0;


/* Four identical turns = solved */

for (const face of MOVES) {

    total++;

    if (test(`${face} × 4`, () => {

        for (let i = 0; i < 4; i++) {
            quarterTurn(face);
        }

    })) {
        passed++;
    }
}


/* Move + inverse = solved */

for (const face of MOVES) {

    total++;

    if (test(`${face} + ${face}′`, () => {

        quarterTurn(face);

        quarterTurn(face);
        quarterTurn(face);
        quarterTurn(face);

    })) {
        passed++;
    }
}


/* Double turn twice = solved */

for (const face of MOVES) {

    total++;

    if (test(`${face}2 + ${face}2`, () => {

        quarterTurn(face);
        quarterTurn(face);
        quarterTurn(face);
        quarterTurn(face);

    })) {
        passed++;
    }
}


console.log("");
console.log("================================");
console.log(`RUBIX ENGINE: ${passed}/${total} TESTS PASSED`);
console.log("================================");

if (passed !== total) {
    process.exit(1);
}
