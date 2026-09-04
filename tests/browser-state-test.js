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


window.runAllFaceMoveTest = function(){

    const faces = ["R", "L", "F", "B", "U", "D"];
    const results = [];

    createCube();

    const original =
        window.RUBIX_SOLVER.serialize(
            window.RUBIX_CUBE_STATE.readState()
        );

    for (const face of faces) {

        createCube();

        const before =
            window.RUBIX_SOLVER.serialize(
                window.RUBIX_CUBE_STATE.readState()
            );

        move(face);

        const after =
            window.RUBIX_SOLVER.serialize(
                window.RUBIX_CUBE_STATE.readState()
            );

        results.push([
            `${face} changes cube state`,
            after !== before
        ]);

        move(face, 3);

        const restored =
            window.RUBIX_SOLVER.serialize(
                window.RUBIX_CUBE_STATE.readState()
            );

        results.push([
            `${face} followed by ${face}' restores state`,
            restored === before
        ]);
    }

    createCube();
    updateUI();

    const passed =
        results.filter(result => result[1]).length;

    const total = results.length;

    const message = results
        .map(result =>
            `${result[1] ? "✅" : "❌"} ${result[0]}`
        )
        .join("\n");

    alert(
`🧊 ALL SIX FACE MOVE TEST

${message}

----------------
${passed}/${total} TESTS PASSED
----------------`
    );
};

console.log("RUBIX all-six-face move test loaded.");

window.runDoubleMoveTest = function(){

    const faces = ["R", "L", "F", "B", "U", "D"];
    const results = [];

    for (const face of faces) {

        createCube();

        const original =
            window.RUBIX_SOLVER.serialize(
                window.RUBIX_CUBE_STATE.readState()
            );

        move(face, 2);

        const afterDouble =
            window.RUBIX_SOLVER.serialize(
                window.RUBIX_CUBE_STATE.readState()
            );

        results.push([
            `${face}2 changes cube state`,
            afterDouble !== original
        ]);

        move(face, 2);

        const restored =
            window.RUBIX_SOLVER.serialize(
                window.RUBIX_CUBE_STATE.readState()
            );

        results.push([
            `${face}2 followed by ${face}2 restores state`,
            restored === original
        ]);
    }

    createCube();
    updateUI();

    const passed =
        results.filter(result => result[1]).length;

    const total = results.length;

    const message = results
        .map(result =>
            `${result[1] ? "✅" : "❌"} ${result[0]}`
        )
        .join("\n");

    alert(
`🔄 DOUBLE MOVE TEST

${message}

----------------
${passed}/${total} TESTS PASSED
----------------`
    );
};

console.log("RUBIX double-move test loaded.");

window.runSequenceTest = function(){

    createCube();

    const original =
        window.RUBIX_SOLVER.serialize(
            window.RUBIX_CUBE_STATE.readState()
        );

    const sequence = [
        ["R", 1],
        ["U", 1],
        ["F", 1],
        ["L", 1],
        ["D", 1],
        ["B", 1]
    ];

    const inverse = [
        ["B", 3],
        ["D", 3],
        ["L", 3],
        ["F", 3],
        ["U", 3],
        ["R", 3]
    ];

    const results = [];

    for (const [face, amount] of sequence) {
        move(face, amount);
    }

    const scrambled =
        window.RUBIX_SOLVER.serialize(
            window.RUBIX_CUBE_STATE.readState()
        );

    results.push([
        "Mixed sequence changes cube state",
        scrambled !== original
    ]);

    for (const [face, amount] of inverse) {
        move(face, amount);
    }

    const restored =
        window.RUBIX_SOLVER.serialize(
            window.RUBIX_CUBE_STATE.readState()
        );

    results.push([
        "Exact inverse sequence restores state",
        restored === original
    ]);

    createCube();
    updateUI();

    const passed =
        results.filter(result => result[1]).length;

    const total = results.length;

    const message = results
        .map(result =>
            `${result[1] ? "✅" : "❌"} ${result[0]}`
        )
        .join("\n");

    alert(
`🔀 MOVE SEQUENCE TEST

${message}

----------------
${passed}/${total} TESTS PASSED
----------------`
    );
};

console.log("RUBIX sequence test loaded.");

window.runSolvedStateTest = function(){

    const results = [];

    createCube();

    results.push([
        "Fresh cube is solved",
        window.RUBIX_CUBE_STATE.isSolved() === true
    ]);

    move("R");

    results.push([
        "R move makes cube unsolved",
        window.RUBIX_CUBE_STATE.isSolved() === false
    ]);

    move("R", 3);

    results.push([
        "R followed by R' makes cube solved",
        window.RUBIX_CUBE_STATE.isSolved() === true
    ]);

    move("F");
    move("U");
    move("L");

    results.push([
        "Mixed sequence makes cube unsolved",
        window.RUBIX_CUBE_STATE.isSolved() === false
    ]);

    move("L", 3);
    move("U", 3);
    move("F", 3);

    results.push([
        "Exact inverse restores solved state",
        window.RUBIX_CUBE_STATE.isSolved() === true
    ]);

    createCube();
    updateUI();

    const passed =
        results.filter(result => result[1]).length;

    const total = results.length;

    const message = results
        .map(result =>
            `${result[1] ? "✅" : "❌"} ${result[0]}`
        )
        .join("\n");

    alert(
`🧊 SOLVED STATE TEST

${message}

----------------
${passed}/${total} TESTS PASSED
----------------`
    );
};

console.log("RUBIX solved-state test loaded.");

window.runSolverStateTest = function(){

    const results = [];

    const solverState = window.RUBIX_SOLVER_STATE;

    results.push([
        "Solver-state module loaded",
        typeof solverState === "object"
    ]);

    results.push([
        "8 corner positions defined",
        Array.isArray(solverState?.corners) &&
        solverState.corners.length === 8
    ]);

    results.push([
        "12 edge positions defined",
        Array.isArray(solverState?.edges) &&
        solverState.edges.length === 12
    ]);

    const solved =
        solverState?.createSolvedState();

    results.push([
        "Solved state contains 8 corners",
        solved?.corners?.length === 8
    ]);

    results.push([
        "Solved state contains 12 edges",
        solved?.edges?.length === 12
    ]);

    results.push([
        "All corner orientations are 0",
        solved?.corners?.every(
            corner => corner.orientation === 0
        ) === true
    ]);

    results.push([
        "All edge orientations are 0",
        solved?.edges?.every(
            edge => edge.orientation === 0
        ) === true
    ]);

    const validation =
        solverState?.validate(solved);

    results.push([
        "Solved cubie state validates",
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
`🧩 SOLVER STATE TEST

${message}

----------------
${passed}/${total} TESTS PASSED
----------------`
    );
};

console.log("RUBIX solver-state test loaded.");



window.runCornerMappingTest = function(){

    const solverState = window.RUBIX_SOLVER_STATE;
    const results = [];

    results.push([
        "Corner color map loaded",
        typeof solverState?.cornerColors === "object"
    ]);

    const expectedCorners = {
        UFR: ["white", "red", "green"],
        URB: ["white", "red", "blue"],
        UBL: ["white", "blue", "orange"],
        ULF: ["white", "orange", "green"],
        DFR: ["yellow", "red", "green"],
        DRB: ["yellow", "red", "blue"],
        DBL: ["yellow", "blue", "orange"],
        DLF: ["yellow", "orange", "green"]
    };

    for (const [position, colors] of Object.entries(expectedCorners)) {
        results.push([
            `${position} corner colors defined`,
            JSON.stringify(solverState?.cornerColors?.[position]) ===
            JSON.stringify(colors)
        ]);
    }

    const solved =
        solverState?.identifyCornerPieces(
            solverState?.createSolvedState()
        );

    results.push([
        "8 corner entries returned",
        Array.isArray(solved) && solved.length === 8
    ]);

    results.push([
        "All corner positions returned",
        solved?.every(corner =>
            expectedCorners[corner.position] !== undefined
        ) === true
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
`📐 CORNER MAPPING TEST

${message}

----------------
${passed}/${total} TESTS PASSED
----------------`
    );
};

console.log("RUBIX corner mapping test loaded.");
