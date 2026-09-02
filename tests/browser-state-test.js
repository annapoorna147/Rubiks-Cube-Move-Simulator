/*
 * RUBIX Ultimate Edition
 * Browser Cube State Test
 */

window.runCubeStateTest = function(){

    const results = [];

    results.push([
        "Cube State Adapter loaded",
        typeof window.RUBIX_CUBE_STATE === "object"
    ]);

    results.push([
        "Solver loaded",
        typeof window.RUBIX_SOLVER === "object"
    ]);

    results.push([
        "Solved state available",
        typeof window.RUBIX_CUBE_STATE?.createSolvedState === "function"
    ]);

    results.push([
        "Solver validation available",
        typeof window.RUBIX_SOLVER?.validateState === "function"
    ]);

    const state =
        window.RUBIX_CUBE_STATE?.createSolvedState();

    const validation =
        window.RUBIX_SOLVER?.validateState(state);

    results.push([
        "Solved state validates",
        validation?.valid === true
    ]);

    const passed =
        results.filter(result => result[1]).length;

    const total = results.length;

    const message = results
        .map(result =>
            `${result[1] ? "✅" : "❌"} ${result[0]}`
        )
        .join("\n");

    alert(
`🧊 RUBIX STATE TEST

${message}

----------------
${passed}/${total} TESTS PASSED
----------------`
    );
};

console.log("RUBIX browser state test loaded.");

window.runRealCubeStateTest = function(){

    const results = [];

    if (typeof window.RUBIX_CUBE_STATE?.readState !== "function") {
        alert("❌ readState() is not available.");
        return;
    }

    if (typeof window.move !== "function") {
        alert("❌ Cube move function is not available.");
        return;
    }

    createCube();

    const solvedState =
        window.RUBIX_CUBE_STATE.readState();

    const solvedValidation =
        window.RUBIX_SOLVER.validateState(solvedState);

    results.push([
        "Solved cube produces 54 stickers",
        solvedState &&
        Object.values(solvedState).every(face =>
            Array.isArray(face) &&
            face.length === 9 &&
            face.every(Boolean)
        )
    ]);

    results.push([
        "Solved state validates",
        solvedValidation.valid === true
    ]);

    const original =
        window.RUBIX_SOLVER.serialize(solvedState);

    move("R");

    const afterR =
        window.RUBIX_CUBE_STATE.readState();

    results.push([
        "R changes cube state",
        window.RUBIX_SOLVER.serialize(afterR) !== original
    ]);

    move("R", 3);

    const afterRPrime =
        window.RUBIX_CUBE_STATE.readState();

    results.push([
        "R followed by R' restores state",
        window.RUBIX_SOLVER.serialize(afterRPrime) === original
    ]);

    move("F");

    const afterF =
        window.RUBIX_CUBE_STATE.readState();

    results.push([
        "F changes cube state",
        window.RUBIX_SOLVER.serialize(afterF) !== original
    ]);

    move("F", 3);

    const afterFPrime =
        window.RUBIX_CUBE_STATE.readState();

    results.push([
        "F followed by F' restores state",
        window.RUBIX_SOLVER.serialize(afterFPrime) === original
    ]);

    move("U");

    const afterU =
        window.RUBIX_CUBE_STATE.readState();

    results.push([
        "U changes cube state",
        window.RUBIX_SOLVER.serialize(afterU) !== original
    ]);

    move("U", 3);

    const afterUPrime =
        window.RUBIX_CUBE_STATE.readState();

    results.push([
        "U followed by U' restores state",
        window.RUBIX_SOLVER.serialize(afterUPrime) === original
    ]);

    const passed =
        results.filter(result => result[1]).length;

    const total = results.length;

    const message = results
        .map(result =>
            `${result[1] ? "✅" : "❌"} ${result[0]}`
        )
        .join("\n");

    alert(
`🧊 REAL CUBE STATE TEST

${message}

----------------
${passed}/${total} TESTS PASSED
----------------`
    );

    createCube();
    updateUI();
};

