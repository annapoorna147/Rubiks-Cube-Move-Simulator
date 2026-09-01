global.window = global;

require("../app/solver.js");

const solver = global.RUBIX_SOLVER;

let passed = 0;
let total = 0;

function test(name, condition) {
    total++;

    if (condition) {
        console.log(`✅ ${name}`);
        passed++;
    } else {
        console.log(`❌ ${name}`);
    }
}

console.log("");
console.log("================================");
console.log("   RUBIX SOLVER FOUNDATION TEST");
console.log("================================");

const solved = solver.createSolvedState();

test(
    "54 stickers created",
    solver.serialize(solved).length === 54
);

test(
    "6 faces created",
    solver.faces.length === 6
);

test(
    "9 stickers per face",
    solver.faces.every(face => solved[face].length === 9)
);

const validation = solver.validateState(solved);

test(
    "Solved state is valid",
    validation.valid === true
);

const result = solver.solve(solved);

test(
    "Solved cube returns zero moves",
    result.solved === true &&
    result.moves.length === 0
);

console.log("--------------------------------");
console.log(`SOLVER FOUNDATION: ${passed}/${total} TESTS PASSED`);
console.log("--------------------------------");

if (passed !== total) {
    process.exit(1);
}

console.log("🎉 Solver foundation is ready.");
