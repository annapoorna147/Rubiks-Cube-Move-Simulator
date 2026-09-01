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
