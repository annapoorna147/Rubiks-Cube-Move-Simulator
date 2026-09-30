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
    "8 corner pieces created",
    Array.isArray(solved.corners) &&
    solved.corners.length === 8
);

test(
    "12 edge pieces created",
    Array.isArray(solved.edges) &&
    solved.edges.length === 12
);

test(
    "Solved state has valid fingerprint",
    typeof solver.fingerprint(solved) === "string" &&
    solver.fingerprint(solved).length > 0
);

test(
    "Solved state fingerprint is stable",
    solver.fingerprint(solved) ===
    solver.fingerprint(solver.createSolvedState())
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

// ============================================================
// SEARCH SOLVER REGRESSION TESTS
// ============================================================

const legalMoves = new Set([
    "U", "U'", "U2",
    "R", "R'", "R2",
    "F", "F'", "F2",
    "D", "D'", "D2",
    "L", "L'", "L2",
    "B", "B'", "B2"
]);

function testScramble(name, scramble, maxDepth) {
    const start = solver.applyMoves(
        solver.createSolvedState(),
        scramble
    );

    const result = solver.solve(start, maxDepth);

    test(
        `${name} — solver finds solution`,
        result.solved === true &&
        Array.isArray(result.moves) &&
        result.moves.length > 0
    );

    test(
        `${name} — depth matches moves`,
        result.solved === true &&
        result.depth === result.moves.length
    );

    test(
        `${name} — all moves are legal`,
        result.moves.every(move => legalMoves.has(move))
    );

    const verification = solver.applyMoves(
        start,
        result.moves
    );

    test(
        `${name} — returned solution solves cube`,
        solver.isSolved(verification) === true
    );
}

testScramble(
    "R scramble",
    ["R"],
    3
);

testScramble(
    "R U scramble",
    ["R", "U"],
    4
);

testScramble(
    "R U F scramble",
    ["R", "U", "F"],
    5
);

testScramble(
    "R U F L scramble",
    ["R", "U", "F", "L"],
    6
);

console.log("--------------------------------");
console.log(`SOLVER FOUNDATION: ${passed}/${total} TESTS PASSED`);
console.log("--------------------------------");

if (passed !== total) {
    process.exit(1);
}

console.log("🎉 Solver foundation is ready.");
