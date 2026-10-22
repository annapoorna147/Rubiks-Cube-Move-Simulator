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

        return {
            corners: table.corners.map(
                ([source, twist], position) => ({
                    position: state.corners[position].position,
                    piece: state.corners[source].piece,
                    orientation:
                        (state.corners[source].orientation + twist) % 3
                })
            ),

            edges: table.edges.map(
                ([source, flip], position) => ({
                    position: state.edges[position].position,
                    piece: state.edges[source].piece,
                    orientation:
                        (state.edges[source].orientation + flip) % 2
                })
            )
        };
    }

    // ============================================================
    // APPLY STANDARD MOVE NOTATION
    //
    // R  = R
    // R' = R R R
    // R2 = R R
    // ============================================================

    // ============================================================
    // PRECOMPUTED MOVE TABLES
    //
    // Build direct transition tables for all 18 legal moves.
    // This preserves the existing MOVE_TABLE as the source of truth
    // while avoiding repeated applySolverMove() calls for R2/R'/etc.
    // ============================================================

    function composeMoveTables(first, second) {
        return {
            corners: first.corners.map(
                ([source, twist], position) => {
                    const [secondSource, secondTwist] =
                        second.corners[source];

                    return [
                        secondSource,
                        (twist + secondTwist) % 3
                    ];
                }
            ),

            edges: first.edges.map(
                ([source, flip], position) => {
                    const [secondSource, secondFlip] =
                        second.edges[source];

                    return [
                        secondSource,
                        (flip + secondFlip) % 2
                    ];
                }
            )
        };
    }

    function buildMoveTables() {
        const tables = {};

        for (const face of faces) {
            const base = MOVE_TABLE[face];

            const doubleMove =
                composeMoveTables(base, base);

            const tripleMove =
                composeMoveTables(doubleMove, base);

            tables[face] = base;
            tables[face + "2"] = doubleMove;
            tables[face + "'"] = tripleMove;
        }

        return tables;
    }

    const ALL_MOVE_TABLES = buildMoveTables();

    function applyMoveWithTable(state, table) {
        return {
            corners: table.corners.map(
                ([source, twist], position) => ({
                    position: state.corners[position].position,
                    piece: state.corners[source].piece,
                    orientation:
                        (state.corners[source].orientation + twist) % 3
                })
            ),

            edges: table.edges.map(
                ([source, flip], position) => ({
                    position: state.edges[position].position,
                    piece: state.edges[source].piece,
                    orientation:
                        (state.edges[source].orientation + flip) % 2
                })
            )
        };
    }

    function applyMove(state, notation) {
        if (typeof notation !== "string" || notation.length === 0) {
            throw new Error("Move notation must be a non-empty string.");
        }

        const table = ALL_MOVE_TABLES[notation];

        if (!table) {
            throw new Error(`Invalid move notation: ${notation}`);
        }

        return applyMoveWithTable(state, table);
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
                error:
                    "maxDepth must be an integer between 1 and 10."
            };
        }

        const legalMoves = [
            "U", "U'", "U2",
            "R", "R'", "R2",
            "F", "F'", "F2",
            "D", "D'", "D2",
            "L", "L'", "L2",
            "B", "B'", "B2"
        ];

        const legalMoveSet =
            new Set(legalMoves);

        function inverseMove(move) {
            if (move.endsWith("2")) {
                return move;
            }

            if (move.endsWith("'")) {
                return move[0];
            }

            return move + "'";
        }

        function inverseMoves(moves) {
            return moves
                .slice()
                .reverse()
                .map(inverseMove);
        }

        function reconstructMoves(entry) {
            const moves = [];
            let current = entry;

            while (current.parent) {
                moves.push(current.move);
                current = current.parent;
            }

            return moves.reverse();
        }

        function createProgressiveFrontier(
            startState
        ) {
            const root = {
                state: startState,
                parent: null,
                move: null,
                lastFace: null
            };

            return {
                entries: new Map([
                    [
                        fingerprint(startState),
                        root
                    ]
                ]),
                layers: [[root]]
            };
        }

        function extendFrontier(
            frontier,
            targetDepth
        ) {
            while (
                frontier.layers.length <=
                targetDepth
            ) {
                const previousLayer =
                    frontier.layers[
                        frontier.layers.length - 1
                    ];

                const currentLayer = [];

                for (const current of previousLayer) {
                    for (const move of legalMoves) {
                        const face = move[0];

                        if (
                            face ===
                            current.lastFace
                        ) {
                            continue;
                        }

                        const nextState =
                            applyMove(
                                current.state,
                                move
                            );

                        const nextFingerprint =
                            fingerprint(
                                nextState
                            );

                        if (
                            frontier.entries.has(
                                nextFingerprint
                            )
                        ) {
                            continue;
                        }

                        const entry = {
                            state: nextState,
                            parent: current,
                            move,
                            lastFace: face
                        };

                        frontier.entries.set(
                            nextFingerprint,
                            entry
                        );

                        currentLayer.push(entry);
                    }
                }

                frontier.layers.push(
                    currentLayer
                );
            }
        }

        const forward =
            createProgressiveFrontier(
                state
            );

        const backward =
            createProgressiveFrontier(
                createSolvedState()
            );

        let searchedStates = 1;

        for (
            let targetDepth = 1;
            targetDepth <= maxDepth;
            targetDepth++
        ) {
            const forwardDepth =
                Math.floor(
                    targetDepth / 2
                );

            const backwardDepth =
                targetDepth -
                forwardDepth;

            extendFrontier(
                forward,
                forwardDepth
            );

            extendFrontier(
                backward,
                backwardDepth
            );

            searchedStates =
                forward.entries.size +
                backward.entries.size -
                1;

            const forwardLayer =
                forward.layers[
                    forwardDepth
                ];

            const backwardLayer =
                backward.layers[
                    backwardDepth
                ];

            const backwardLookup =
                new Map();

            for (const entry of backwardLayer) {
                backwardLookup.set(
                    fingerprint(entry.state),
                    entry
                );
            }

            for (const forwardEntry of forwardLayer) {
                const meetingFingerprint =
                    fingerprint(
                        forwardEntry.state
                    );

                const backwardEntry =
                    backwardLookup.get(
                        meetingFingerprint
                    );

                if (!backwardEntry) {
                    continue;
                }

                const forwardMoves =
                    reconstructMoves(
                        forwardEntry
                    );

                const backwardMoves =
                    reconstructMoves(
                        backwardEntry
                    );

                const candidateMoves =
                    forwardMoves.concat(
                        inverseMoves(
                            backwardMoves
                        )
                    );

                if (
                    candidateMoves.length !==
                    targetDepth
                ) {
                    continue;
                }

                if (
                    !candidateMoves.every(
                        move =>
                            legalMoveSet.has(move)
                    )
                ) {
                    continue;
                }

                const verificationState =
                    applyMoves(
                        state,
                        candidateMoves
                    );

                if (
                    !isSolved(
                        verificationState
                    )
                ) {
                    continue;
                }

                return {
                    solved: true,
                    moves: candidateMoves,
                    depth: candidateMoves.length,
                    searchedStates,
                    error: null
                };
            }
        }

        return {
            solved: false,
            moves: [],
            depth: null,
            searchedStates,
            error:
                "No solution found within the maximum search depth."
        };
    }

    function solveCurrentCube(maxDepth = 7) {

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

        if (!solverState) {
            return {
                solved: false,
                moves: [],
                solverState: null,
                error: "Could not create solver state from cube."
            };
        }

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
                depth: 0,
                searchedStates: 1,
                error: null
            };
        }

        const result = solve(
            solverState,
            maxDepth
        );

        return {
            ...result,
            solverState
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
