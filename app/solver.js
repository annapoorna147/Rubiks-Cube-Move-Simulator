"use strict";

/*
 * RUBIX Ultimate Edition
 * Solver Engine
 *
 * Day 3:
 * - Solver state validation
 * - Pure solver move engine
 * - U/R/F/D/L/B move transitions
 *
 * The move tables were generated from the existing,
 * already-tested cube engine and verified with:
 * U4, R4, F4, D4, L4, B4
 * mixed move composition
 * inverse move sequence
 */

const RUBIX_SOLVER = (() => {

    const version = "1.1.0";

    const faces = ["U", "R", "F", "D", "L", "B"];

    const colors = {
        U: "W",
        R: "R",
        F: "G",
        D: "Y",
        L: "O",
        B: "B"
    };

    // ============================================================
    // SOLVED STATE
    // ============================================================

    function createSolvedState() {
        return {
            corners: [
                { position: "UFR", piece: 0, orientation: 0 },
                { position: "URB", piece: 1, orientation: 0 },
                { position: "UBL", piece: 2, orientation: 0 },
                { position: "ULF", piece: 3, orientation: 0 },
                { position: "DFR", piece: 4, orientation: 0 },
                { position: "DRB", piece: 5, orientation: 0 },
                { position: "DBL", piece: 6, orientation: 0 },
                { position: "DLF", piece: 7, orientation: 0 }
            ],

            edges: [
                { position: "UF", piece: 0, orientation: 0 },
                { position: "UR", piece: 1, orientation: 0 },
                { position: "UB", piece: 2, orientation: 0 },
                { position: "UL", piece: 3, orientation: 0 },
                { position: "FR", piece: 4, orientation: 0 },
                { position: "BR", piece: 5, orientation: 0 },
                { position: "BL", piece: 6, orientation: 0 },
                { position: "FL", piece: 7, orientation: 0 },
                { position: "DF", piece: 8, orientation: 0 },
                { position: "DR", piece: 9, orientation: 0 },
                { position: "DB", piece: 10, orientation: 0 },
                { position: "DL", piece: 11, orientation: 0 }
            ]
        };
    }

    // ============================================================
    // STATE VALIDATION
    // ============================================================

    function validateState(state) {
        if (!state || typeof state !== "object") {
            return {
                valid: false,
                error: "State must be an object."
            };
        }

        if (!Array.isArray(state.corners) || state.corners.length !== 8) {
            return {
                valid: false,
                error: "State must contain exactly 8 corners."
            };
        }

        if (!Array.isArray(state.edges) || state.edges.length !== 12) {
            return {
                valid: false,
                error: "State must contain exactly 12 edges."
            };
        }

        const cornerPieces = new Set();
        const edgePieces = new Set();

        for (const corner of state.corners) {
            if (
                !Number.isInteger(corner.piece) ||
                corner.piece < 0 ||
                corner.piece > 7
            ) {
                return {
                    valid: false,
                    error: `Invalid corner piece: ${corner.piece}`
                };
            }

            if (
                !Number.isInteger(corner.orientation) ||
                corner.orientation < 0 ||
                corner.orientation > 2
            ) {
                return {
                    valid: false,
                    error:
                        `Invalid corner orientation: ${corner.orientation}`
                };
            }

            if (cornerPieces.has(corner.piece)) {
                return {
                    valid: false,
                    error:
                        `Duplicate corner piece: ${corner.piece}`
                };
            }

            cornerPieces.add(corner.piece);
        }

        for (const edge of state.edges) {
            if (
                !Number.isInteger(edge.piece) ||
                edge.piece < 0 ||
                edge.piece > 11
            ) {
                return {
                    valid: false,
                    error: `Invalid edge piece: ${edge.piece}`
                };
            }

            if (
                !Number.isInteger(edge.orientation) ||
                edge.orientation < 0 ||
                edge.orientation > 1
            ) {
                return {
                    valid: false,
                    error:
                        `Invalid edge orientation: ${edge.orientation}`
                };
            }

            if (edgePieces.has(edge.piece)) {
                return {
                    valid: false,
                    error:
                        `Duplicate edge piece: ${edge.piece}`
                };
            }

            edgePieces.add(edge.piece);
        }

        return {
            valid: true,
            error: null
        };
    }

    // ============================================================
    // SERIALIZATION
    // ============================================================

    function serialize(state) {
        return JSON.stringify({
            corners: state.corners.map(c => [
                c.piece,
                c.orientation
            ]),
            edges: state.edges.map(e => [
                e.piece,
                e.orientation
            ])
        });
    }

    // ============================================================
    // PURE SOLVER MOVE ENGINE
    //
    // Format:
    // [source position, orientation change]
    //
    // Corners: orientation modulo 3
    // Edges:   orientation modulo 2
    // ============================================================

    const MOVE_TABLE = {

        U: {
            corners: [
                [3, 0],
                [0, 0],
                [1, 0],
                [2, 0],
                [4, 0],
                [5, 0],
                [6, 0],
                [7, 0]
            ],

            edges: [
                [3, 0],
                [0, 0],
                [1, 0],
                [2, 0],
                [4, 0],
                [5, 0],
                [6, 0],
                [7, 0],
                [8, 0],
                [9, 0],
                [10, 0],
                [11, 0]
            ]
        },

        R: {
            corners: [
                [1, 2],
                [5, 1],
                [2, 0],
                [3, 0],
                [0, 1],
                [4, 2],
                [6, 0],
                [7, 0]
            ],

            edges: [
                [0, 0],
                [5, 0],
                [2, 0],
                [3, 0],
                [1, 0],
                [9, 0],
                [6, 0],
                [7, 0],
                [8, 0],
                [4, 0],
                [10, 0],
                [11, 0]
            ]
        },

        F: {
            corners: [
                [3, 1],
                [1, 0],
                [2, 0],
                [7, 2],
                [0, 2],
                [5, 0],
                [6, 0],
                [4, 1]
            ],

            edges: [
                [7, 1],
                [1, 0],
                [2, 0],
                [3, 0],
                [0, 1],
                [5, 0],
                [6, 0],
                [8, 1],
                [4, 1],
                [9, 0],
                [10, 0],
                [11, 0]
            ]
        },

        D: {
            corners: [
                [0, 0],
                [1, 0],
                [2, 0],
                [3, 0],
                [5, 0],
                [6, 0],
                [7, 0],
                [4, 0]
            ],

            edges: [
                [0, 0],
                [1, 0],
                [2, 0],
                [3, 0],
                [4, 0],
                [5, 0],
                [6, 0],
                [7, 0],
                [9, 0],
                [10, 0],
                [11, 0],
                [8, 0]
            ]
        },

        L: {
            corners: [
                [0, 0],
                [1, 0],
                [3, 2],
                [7, 1],
                [4, 0],
                [5, 0],
                [2, 1],
                [6, 2]
            ],

            edges: [
                [0, 0],
                [1, 0],
                [2, 0],
                [7, 0],
                [4, 0],
                [5, 0],
                [3, 0],
                [11, 0],
                [8, 0],
                [9, 0],
                [10, 0],
                [6, 0]
            ]
        },

        B: {
            corners: [
                [0, 0],
                [5, 2],
                [1, 1],
                [3, 0],
                [4, 0],
                [6, 1],
                [2, 2],
                [7, 0]
            ],

            edges: [
                [0, 0],
                [1, 0],
                [5, 1],
                [3, 0],
                [4, 0],
                [10, 1],
                [2, 1],
                [7, 0],
                [8, 0],
                [9, 0],
                [6, 1],
                [11, 0]
            ]
        }
    };

    // ============================================================
    // CLONE SOLVER STATE
    // ============================================================

    function cloneSolverState(state) {
        return {
            corners: state.corners.map(c => ({
                position: c.position,
                piece: c.piece,
                orientation: c.orientation
            })),

            edges: state.edges.map(e => ({
                position: e.position,
                piece: e.piece,
                orientation: e.orientation
            }))
        };
    }

    // ============================================================
    // APPLY ONE BASIC MOVE
    // ============================================================

    function applySolverMove(state, face) {
        const table = MOVE_TABLE[face];

        if (!table) {
            throw new Error(`Invalid solver move: ${face}`);
        }

        const next = cloneSolverState(state);

        next.corners = table.corners.map(
            ([source, twist], position) => ({
                position: state.corners[position].position,
                piece: state.corners[source].piece,
                orientation:
                    (state.corners[source].orientation + twist) % 3
            })
        );

        next.edges = table.edges.map(
            ([source, flip], position) => ({
                position: state.edges[position].position,
                piece: state.edges[source].piece,
                orientation:
                    (state.edges[source].orientation + flip) % 2
            })
        );

        return next;
    }

    // ============================================================
    // APPLY STANDARD MOVE NOTATION
    //
    // R  = R
    // R' = R R R
    // R2 = R R
    // ============================================================

    function applyMove(state, notation) {
        if (typeof notation !== "string" || notation.length === 0) {
            throw new Error("Move notation must be a non-empty string.");
        }

        const face = notation[0].toUpperCase();

        if (!MOVE_TABLE[face]) {
            throw new Error(`Invalid move notation: ${notation}`);
        }

        let amount = 1;

        if (notation.endsWith("2")) {
            amount = 2;
        } else if (notation.endsWith("'")) {
            amount = 3;
        }

        let result = state;

        for (let i = 0; i < amount; i++) {
            result = applySolverMove(result, face);
        }

        return result;
    }

    // ============================================================
    // APPLY MOVE SEQUENCE
    // ============================================================

    function applyMoves(state, moves) {
        if (!Array.isArray(moves)) {
            throw new Error("Moves must be an array.");
        }

        let result = state;

        for (const move of moves) {
            result = applyMove(result, move);
        }

        return result;
    }

    // ============================================================
    // GENERATE NEIGHBOR STATES
    //
    // Creates every legal basic-turn successor from the current
    // state. The solver search will use these states later.
    // ============================================================

    function generateNeighbors(state) {
        const neighbors = [];
        const moveNotations = [];

        for (const face of faces) {
            moveNotations.push(face);
            moveNotations.push(face + "'");
            moveNotations.push(face + "2");
        }

        for (const move of moveNotations) {
            const nextState = applyMove(state, move);

            neighbors.push({
                move,
                state: nextState,
                fingerprint: fingerprint(nextState)
            });
        }

        return neighbors;
    }

    // ============================================================
    // CHECK SOLVED
    // ============================================================

    function fingerprint(state) {
        return state.corners.map(c => c.piece + ":" + c.orientation).join(",") +
            "|" +
            state.edges.map(e => e.piece + ":" + e.orientation).join(",");
    }

    function isSolved(state) {
        return fingerprint(state) ===
            fingerprint(createSolvedState());
    }

    // ============================================================
    // SOLVE
    //
    // Actual search algorithm will be added next.
    // ============================================================

    function solve(state, maxDepth = 7) {
        const validation = validateState(state);

        if (!validation.valid) {
            return {
                solved: false,
                moves: [],
                depth: null,
                searchedStates: 0,
                error: validation.error
            };
        }

        if (isSolved(state)) {
            return {
                solved: true,
                moves: [],
                depth: 0,
                searchedStates: 1,
                error: null
            };
        }

        if (
            !Number.isInteger(maxDepth) ||
            maxDepth < 1 ||
            maxDepth > 10
        ) {
            return {
                solved: false,
                moves: [],
                depth: null,
                searchedStates: 0,
                error: "maxDepth must be an integer between 1 and 10."
            };
        }

        const legalMoves = new Set([
            "U", "U'", "U2",
            "R", "R'", "R2",
            "F", "F'", "F2",
            "D", "D'", "D2",
            "L", "L'", "L2",
            "B", "B'", "B2"
        ]);

        const startFingerprint = fingerprint(state);

        const queue = [{
            state,
            moves: [],
            lastFace: null
        }];

        const visited = new Set([startFingerprint]);

        let head = 0;

        while (head < queue.length) {
            const current = queue[head++];

            if (current.moves.length >= maxDepth) {
                continue;
            }

            const neighbors = generateNeighbors(current.state);

            for (const neighbor of neighbors) {
                const face = neighbor.move[0];

                if (face === current.lastFace) {
                    continue;
                }

                if (!legalMoves.has(neighbor.move)) {
                    continue;
                }

                if (visited.has(neighbor.fingerprint)) {
                    continue;
                }

                const nextMoves = current.moves.concat(neighbor.move);

                if (isSolved(neighbor.state)) {
                    const verificationState =
                        applyMoves(state, nextMoves);

                    if (!isSolved(verificationState)) {
                        return {
                            solved: false,
                            moves: [],
                            depth: null,
                            searchedStates: visited.size,
                            error: "Internal error: returned solution failed verification."
                        };
                    }

                    if (nextMoves.length !== nextMoves.filter(
                        move => legalMoves.has(move)
                    ).length) {
                        return {
                            solved: false,
                            moves: [],
                            depth: null,
                            searchedStates: visited.size,
                            error: "Internal error: illegal move in solution."
                        };
                    }

                    return {
                        solved: true,
                        moves: nextMoves,
                        depth: nextMoves.length,
                        searchedStates: visited.size + 1,
                        error: null
                    };
                }

                visited.add(neighbor.fingerprint);

                queue.push({
                    state: neighbor.state,
                    moves: nextMoves,
                    lastFace: face
                });
            }
        }

        return {
            solved: false,
            moves: [],
            depth: null,
            searchedStates: visited.size,
            error: "No solution found within the maximum search depth."
        };
    }

    // ============================================================
    // SOLVE CURRENT CUBE
    // ============================================================

    function solveCurrentCube() {

        if (
            typeof RUBIX_CUBE_STATE === "undefined" ||
            typeof RUBIX_SOLVER_STATE === "undefined"
        ) {
            return {
                solved: false,
                moves: [],
                solverState: null,
                error: "Required cube state modules are unavailable."
            };
        }

        const stickerState = RUBIX_CUBE_STATE.readState();

        const solverState =
            RUBIX_SOLVER_STATE.createFromStickerState(stickerState);

        const validation = validateState(solverState);

        if (!validation.valid) {
            return {
                solved: false,
                moves: [],
                solverState,
                error: validation.error
            };
        }

        if (isSolved(solverState)) {
            return {
                solved: true,
                moves: [],
                solverState,
                error: null
            };
        }

        return {
            solved: false,
            moves: [],
            solverState,
            error: "Solver search algorithm not implemented yet."
        };
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    return {
        version,
        faces,
        colors,

        createSolvedState,
        validateState,
        serialize,
        fingerprint,
        generateNeighbors,

        MOVE_TABLE,

        cloneSolverState,
        applySolverMove,
        applyMove,
        applyMoves,

        isSolved,

        solve,
        solveCurrentCube
    };

})();

// ============================================================
// GLOBAL EXPORT
// ============================================================

window.RUBIX_SOLVER = RUBIX_SOLVER;
