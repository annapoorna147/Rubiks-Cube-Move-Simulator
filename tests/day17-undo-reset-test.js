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

function reset() {
    vm.runInContext("resetCube()", context);
}

function state() {
    return JSON.stringify(vm.runInContext("stickers", context));
}

function apply(notation) {
    context.testNotation = notation;
    vm.runInContext("performNotation(testNotation)", context);
}

function undo() {
    vm.runInContext("undo()", context);
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

for (const face of ["U", "R", "F", "D", "L", "B"]) {
    check(`${face}: move then undo`, () => {
        apply(face);
        undo();
    });

    check(`${face}': inverse move then undo`, () => {
        apply(face + "'");
        undo();
    });

    check(`${face}2: double turn then undo`, () => {
        apply(face + "2");
        undo();
    });
}

check("Reset restores cube after multiple moves", () => {
    apply("R");
    apply("U");
    apply("F2");
    reset();
});

check("Undo with empty history leaves cube unchanged", () => {
    undo();
});

console.log(`\nDAY 17 UNDO/RESET: ${passed}/${total} TESTS PASSED`);

if (passed !== total) process.exitCode = 1;
