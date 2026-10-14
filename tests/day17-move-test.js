const fs = require("fs");
const vm = require("vm");

let source = fs.readFileSync("app/cube-engine.js", "utf8");

source = source.replace(/createSolvedCube\(\);\s*render\(\);/g, "");

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

const moves = vm.runInContext("MOVES", context);

function reset() {
    vm.runInContext("createSolvedCube()", context);
}

function state() {
    return JSON.stringify(vm.runInContext("stickers", context));
}

function apply(notation) {
    context.testNotation = notation;
    vm.runInContext("performNotation(testNotation)", context);
}

let passed = 0;
let total = 0;

function check(name, fn) {
    reset();
    const original = state();

    try {
        fn();
        const ok = state() === original;
        console.log(ok ? "PASS" : "FAIL", name);
        if (ok) passed++;
    } catch (error) {
        console.log("ERROR", name, error.message);
    }

    total++;
}

for (const face of moves) {
    check(`${face} followed by ${face}'`, () => {
        apply(face);
        apply(face + "'");
    });

    check(`${face}' followed by ${face}`, () => {
        apply(face + "'");
        apply(face);
    });

    check(`${face}2 applied twice`, () => {
        apply(face + "2");
        apply(face + "2");
    });
}

console.log(`\nDAY 17 MOVE TESTS: ${passed}/${total} PASSED`);

if (passed !== total) process.exitCode = 1;
