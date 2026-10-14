/*
 * RUBIX Ultimate Edition
 * Day 17 - Cube Engine Verification
 */

const fs = require("fs");
const vm = require("vm");

let source = fs.readFileSync("app/cube-engine.js", "utf8");

source = source
    .replace(/createSolvedCube\(\);\s*render\(\);/g, "")
    .replace(/console\.log\(.*?\);/g, "");

const context = {
    console,
    window: {},
    document: {
        getElementById() {
            return null;
        }
    }
};

vm.createContext(context);
vm.runInContext(source, context);

const MOVES = vm.runInContext("MOVES", context);

function resetCube() {
    vm.runInContext("createSolvedCube()", context);
}

function turn(face) {
    context.testFace = face;
    vm.runInContext("quarterTurn(testFace)", context);
}

function getState() {
    return JSON.stringify(vm.runInContext("stickers", context));
}

let passed = 0;
let total = 0;

function test(name, fn) {
    resetCube();
    const original = getState();

    try {
        fn();
        const success = getState() === original;

        console.log(success ? "✅ PASS" : "❌ FAIL", name);

        if (success) passed++;
    } catch (error) {
        console.log("❌ ERROR", name, error.message);
    }

    total++;
}

console.log("\nRUBIX DAY 17 - CUBE ENGINE TESTS\n");

for (const face of MOVES) {
    test(`${face}: four quarter-turns`, () => {
        for (let i = 0; i < 4; i++) turn(face);
    });
}

for (const face of MOVES) {
    test(`${face}: turn plus inverse`, () => {
        turn(face);
        for (let i = 0; i < 3; i++) turn(face);
    });
}

for (const face of MOVES) {
    test(`${face}: four turns restore state`, () => {
        turn(face);
        turn(face);
        turn(face);
        turn(face);
    });
}

console.log(`\nRUBIX ENGINE: ${passed}/${total} TESTS PASSED`);

if (passed !== total) process.exitCode = 1;
