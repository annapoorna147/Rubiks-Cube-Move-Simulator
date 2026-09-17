/*
 * =========================================================
 * RUBIX ULTIMATE EDITION
 * SOLVER STATE
 * =========================================================
 */

const RUBIX_SOLVER_STATE = {

    /* =====================================================
       CORNER PIECES
       ===================================================== */

    corners: [
        "UFR",
        "URB",
        "UBL",
        "ULF",
        "DFR",
        "DRB",
        "DBL",
        "DLF"
    ],


    /* =====================================================
       EDGE PIECES
       ===================================================== */

    edges: [
        "UF",
        "UR",
        "UB",
        "UL",
        "FR",
        "BR",
        "BL",
        "FL",
        "DF",
        "DR",
        "DB",
        "DL"
    ],


    /* =====================================================
       PERMUTATION PARITY
       ===================================================== */

    permutationParity(pieces) {

        let inversions = 0;

        for (let i = 0; i < pieces.length; i++) {

            for (let j = i + 1; j < pieces.length; j++) {

                if (pieces[i] > pieces[j]) {
                    inversions++;
                }

            }

        }

        return inversions % 2;

    },


    /* =====================================================
       CREATE SOLVED STATE
       ===================================================== */

    createSolvedState() {

        return {

            corners: this.corners.map(
                (name, index) => ({
                    position: name,
                    piece: index,
                    orientation: 0
                })
            ),

            edges: this.edges.map(
                (name, index) => ({
                    position: name,
                    piece: index,
                    orientation: 0
                })
            )

        };

    },


    /* =====================================================
       VALIDATE SOLVER STATE
       ===================================================== */

    validate(state) {

        if (!state || typeof state !== "object") {

            return {
                valid: false,
                error: "Solver state is missing."
            };

        }


        if (
            !Array.isArray(state.corners) ||
            state.corners.length !== 8
        ) {

            return {
                valid: false,
                error: "Solver state must contain 8 corners."
            };

        }


        if (
            !Array.isArray(state.edges) ||
            state.edges.length !== 12
        ) {

            return {
                valid: false,
                error: "Solver state must contain 12 edges."
            };

        }


        /* =================================================
           CORNERS
           ================================================= */

        const cornerPieces = new Set();

        for (const corner of state.corners) {

            if (
                !corner ||
                !Number.isInteger(corner.piece) ||
                corner.piece < 0 ||
                corner.piece >= 8
            ) {

                return {
                    valid: false,
                    error: "Invalid corner piece."
                };

            }


            if (cornerPieces.has(corner.piece)) {

                return {
                    valid: false,
                    error: "Duplicate corner piece."
                };

            }


            cornerPieces.add(corner.piece);


            if (
                !Number.isInteger(corner.orientation) ||
                corner.orientation < 0 ||
                corner.orientation > 2
            ) {

                return {
                    valid: false,
                    error: "Invalid corner orientation."
                };

            }

        }


        const cornerOrientationSum =
            state.corners.reduce(
                (sum, corner) =>
                    sum + corner.orientation,
                0
            );


        if (cornerOrientationSum % 3 !== 0) {

            return {
                valid: false,
                error: "Invalid corner orientation sum."
            };

        }


        /* =================================================
           EDGES
           ================================================= */

        const edgePieces = new Set();

        for (const edge of state.edges) {

            if (
                !edge ||
                !Number.isInteger(edge.piece) ||
                edge.piece < 0 ||
                edge.piece >= 12
            ) {

                return {
                    valid: false,
                    error: "Invalid edge piece."
                };

            }


            if (edgePieces.has(edge.piece)) {

                return {
                    valid: false,
                    error: "Duplicate edge piece."
                };

            }


            edgePieces.add(edge.piece);


            if (
                !Number.isInteger(edge.orientation) ||
                edge.orientation < 0 ||
                edge.orientation > 1
            ) {

                return {
                    valid: false,
                    error: "Invalid edge orientation."
                };

            }

        }


        const edgeOrientationSum =
            state.edges.reduce(
                (sum, edge) =>
                    sum + edge.orientation,
                0
            );


        if (edgeOrientationSum % 2 !== 0) {

            return {
                valid: false,
                error: "Invalid edge orientation sum."
            };

        }


        /* =================================================
           PARITY
           ================================================= */

        const cornerParity =
            this.permutationParity(
                state.corners.map(
                    corner => corner.piece
                )
            );


        const edgeParity =
            this.permutationParity(
                state.edges.map(
                    edge => edge.piece
                )
            );


        if (cornerParity !== edgeParity) {

            return {
                valid: false,
                error: "Invalid permutation parity."
            };

        }


        return {
            valid: true,
            error: null
        };

    }

};


/* =========================================================
   EXPORT
   ========================================================= */

window.RUBIX_SOLVER_STATE =
    RUBIX_SOLVER_STATE;


/* =========================================================
   CORNER COLORS
   ========================================================= */

RUBIX_SOLVER_STATE.cornerColors = {

    UFR: ["white", "red", "green"],

    URB: ["white", "red", "blue"],

    UBL: ["white", "blue", "orange"],

    ULF: ["white", "orange", "green"],

    DFR: ["yellow", "red", "green"],

    DRB: ["yellow", "red", "blue"],

    DBL: ["yellow", "blue", "orange"],

    DLF: ["yellow", "orange", "green"]

};


/* =========================================================
   CORNER STICKER LOCATIONS
   ========================================================= */

RUBIX_SOLVER_STATE.cornerSlots = {

    UFR: [
        ["U", 8],
        ["R", 0],
        ["F", 2]
    ],

    URB: [
        ["U", 2],
        ["R", 2],
        ["B", 0]
    ],

    UBL: [
        ["U", 0],
        ["B", 2],
        ["L", 0]
    ],

    ULF: [
        ["U", 6],
        ["L", 2],
        ["F", 0]
    ],

    DFR: [
        ["D", 2],
        ["R", 6],
        ["F", 8]
    ],

    DRB: [
        ["D", 8],
        ["R", 8],
        ["B", 6]
    ],

    DBL: [
        ["D", 6],
        ["B", 8],
        ["L", 6]
    ],

    DLF: [
        ["D", 0],
        ["L", 8],
        ["F", 6]
    ]

};


/* =========================================================
   CORNER ORIENTATION
   ========================================================= */

function getCornerOrientation(
    colors,
    slot,
    piece
) {

    const referenceIndex =
        colors.findIndex(
            color =>
                color === "white" ||
                color === "yellow"
        );


    if (referenceIndex === -1) {
        return null;
    }


    const referenceFace =
        slot[referenceIndex][0];


    /*
     * U-layer corner pieces
     */

    if (
        piece === "UFR" ||
        piece === "URB" ||
        piece === "UBL" ||
        piece === "ULF"
    ) {

        if (
            referenceFace === "U" ||
            referenceFace === "D"
        ) {
            return 0;
        }


        if (
            referenceFace === "R" ||
            referenceFace === "L"
        ) {
            return 1;
        }


        if (
            referenceFace === "F" ||
            referenceFace === "B"
        ) {
            return 2;
        }

    }


    /*
     * D-layer corner pieces
     */

    if (
        piece === "DFR" ||
        piece === "DRB" ||
        piece === "DBL" ||
        piece === "DLF"
    ) {

        if (
            referenceFace === "U" ||
            referenceFace === "D"
        ) {
            return 0;
        }


        if (
            referenceFace === "F" ||
            referenceFace === "B"
        ) {
            return 1;
        }


        if (
            referenceFace === "R" ||
            referenceFace === "L"
        ) {
            return 2;
        }

    }


    return null;

}


/* =========================================================
   IDENTIFY CORNERS
   ========================================================= */

RUBIX_SOLVER_STATE.identifyCornerPieces =
function(state) {

    if (!state || typeof state !== "object") {
        return null;
    }


    const faces = [
        "U",
        "R",
        "F",
        "D",
        "L",
        "B"
    ];


    for (const face of faces) {

        if (
            !Array.isArray(state[face]) ||
            state[face].length !== 9
        ) {

            console.error(
                "Invalid face:",
                face
            );

            return null;
        }

    }


    const result = [];


    for (const position of this.corners) {

        const slot =
            this.cornerSlots[position];


        const colors =
            slot.map(
                ([face, index]) =>
                    state[face][index]
            );


        if (
            colors.some(
                color => !color
            )
        ) {

            console.error(
                "Missing corner sticker:",
                position,
                colors
            );

            return null;
        }


        const sortedColors =
            [...colors].sort();


        let piecePosition = null;


        for (
            const [name, pieceColors]
            of Object.entries(
                this.cornerColors
            )
        ) {

            const sortedPieceColors =
                [...pieceColors].sort();


            if (
                JSON.stringify(sortedColors) ===
                JSON.stringify(sortedPieceColors)
            ) {

                piecePosition = name;
                break;

            }

        }


        if (!piecePosition) {

            console.error(
                "Unknown corner piece:",
                position,
                colors
            );

            return null;
        }


        const orientation =
            getCornerOrientation(
                colors,
                slot,
                piecePosition
            );


        if (orientation === null) {

            console.error(
                "Could not determine corner orientation:",
                position,
                colors,
                piecePosition
            );

            return null;
        }


        result.push({

            position: position,

            colors: colors,

            piece: piecePosition,

            orientation: orientation

        });

    }


    return result;

};


/* =========================================================
   EDGE COLORS
   ========================================================= */

RUBIX_SOLVER_STATE.edgeColors = {

    UF: ["white", "green"],

    UR: ["white", "red"],

    UB: ["white", "blue"],

    UL: ["white", "orange"],

    FR: ["green", "red"],

    BR: ["blue", "red"],

    BL: ["blue", "orange"],

    FL: ["green", "orange"],

    DF: ["yellow", "green"],

    DR: ["yellow", "red"],

    DB: ["yellow", "blue"],

    DL: ["yellow", "orange"]

};


/* =========================================================
   EDGE STICKER LOCATIONS
   ========================================================= */

RUBIX_SOLVER_STATE.edgeSlots = {

    UF: [
        ["U", 7],
        ["F", 1]
    ],

    UR: [
        ["U", 5],
        ["R", 1]
    ],

    UB: [
        ["U", 1],
        ["B", 1]
    ],

    UL: [
        ["U", 3],
        ["L", 1]
    ],

    FR: [
        ["F", 5],
        ["R", 3]
    ],

    BR: [
        ["B", 3],
        ["R", 5]
    ],

    BL: [
        ["B", 5],
        ["L", 3]
    ],

    FL: [
        ["F", 3],
        ["L", 5]
    ],

    DF: [
        ["D", 1],
        ["F", 7]
    ],

    DR: [
        ["D", 5],
        ["R", 7]
    ],

    DB: [
        ["D", 7],
        ["B", 7]
    ],

    DL: [
        ["D", 3],
        ["L", 7]
    ]

};


/* =========================================================
   EDGE ORIENTATION
   ========================================================= */

function getEdgeOrientation(
    colors,
    slot
) {

    let referenceColor = null;


    if (colors.includes("white")) {

        referenceColor = "white";

    }
    else if (colors.includes("yellow")) {

        referenceColor = "yellow";

    }


    /*
     * White/yellow edge
     */

    if (referenceColor !== null) {

        const referenceIndex =
            colors.indexOf(
                referenceColor
            );


        const referenceFace =
            slot[referenceIndex][0];


        if (
            referenceFace === "U" ||
            referenceFace === "D"
        ) {

            return 0;

        }


        return 1;

    }


    /*
     * Middle-layer edge
     */

    const referenceIndex =
        colors.findIndex(
            color =>
                color === "green" ||
                color === "blue"
        );


    if (referenceIndex === -1) {
        return null;
    }


    const referenceFace =
        slot[referenceIndex][0];


    if (
        referenceFace === "F" ||
        referenceFace === "B"
    ) {

        return 0;

    }


    return 1;

}


/* =========================================================
   IDENTIFY EDGES
   ========================================================= */

RUBIX_SOLVER_STATE.identifyEdgePieces =
function(state) {

    if (!state || typeof state !== "object") {
        return null;
    }


    const faces = [
        "U",
        "R",
        "F",
        "D",
        "L",
        "B"
    ];


    for (const face of faces) {

        if (
            !Array.isArray(state[face]) ||
            state[face].length !== 9
        ) {

            console.error(
                "Invalid face:",
                face
            );

            return null;
        }

    }


    const result = [];


    for (const position of this.edges) {

        const slot =
            this.edgeSlots[position];


        const colors =
            slot.map(
                ([face, index]) =>
                    state[face][index]
            );


        if (
            colors.some(
                color => !color
            )
        ) {

            console.error(
                "Missing edge sticker:",
                position,
                colors
            );

            return null;
        }


        const actual =
            [...colors]
                .sort()
                .join("|");


        let piecePosition = null;


        for (
            const [name, pieceColors]
            of Object.entries(
                this.edgeColors
            )
        ) {

            const expected =
                [...pieceColors]
                    .sort()
                    .join("|");


            if (actual === expected) {

                piecePosition = name;
                break;

            }

        }


        if (!piecePosition) {

            console.error(
                "Unknown edge piece:",
                position,
                colors
            );

            return null;
        }


        const orientation =
            getEdgeOrientation(
                colors,
                slot
            );


        if (orientation === null) {

            console.error(
                "Could not determine edge orientation:",
                position,
                colors
            );

            return null;
        }


        result.push({

            position: position,

            colors: colors,

            piece: piecePosition,

            orientation: orientation

        });

    }


    return result;

};


/* =========================================================
   CREATE SOLVER STATE FROM STICKER STATE
   ========================================================= */

RUBIX_SOLVER_STATE.createFromStickerState =
function(state) {

    console.log(
        "=== RUBIX SOLVER STATE CONVERSION ==="
    );


    if (!state || typeof state !== "object") {

        console.error(
            "ERROR: Missing sticker state."
        );

        return null;
    }


    /* -----------------------------------------------------
       RECOGNIZE CORNERS
       ----------------------------------------------------- */

    const recognizedCorners =
        this.identifyCornerPieces(
            state
        );


    console.log(
        "Recognized corners:",
        recognizedCorners
    );


    if (
        !recognizedCorners ||
        recognizedCorners.length !== 8
    ) {

        console.error(
            "ERROR: Corner recognition failed."
        );

        return null;
    }


    /* -----------------------------------------------------
       RECOGNIZE EDGES
       ----------------------------------------------------- */

    const recognizedEdges =
        this.identifyEdgePieces(
            state
        );


    console.log(
        "Recognized edges:",
        recognizedEdges
    );


    if (
        !recognizedEdges ||
        recognizedEdges.length !== 12
    ) {

        console.error(
            "ERROR: Edge recognition failed."
        );

        return null;
    }


    /* -----------------------------------------------------
       CONVERT CORNERS TO NUMERIC IDS
       ----------------------------------------------------- */

    const corners =
        recognizedCorners.map(
            corner => {

                const pieceId =
                    this.corners.indexOf(
                        corner.piece
                    );


                console.log(
                    "Corner:",
                    corner.piece,
                    "=> ID:",
                    pieceId,
                    "orientation:",
                    corner.orientation
                );


                if (pieceId === -1) {

                    console.error(
                        "ERROR: Unknown corner piece:",
                        corner.piece
                    );

                    return null;
                }


                return {

                    position:
                        corner.position,

                    piece:
                        pieceId,

                    orientation:
                        corner.orientation

                };

            }
        );


    /* -----------------------------------------------------
       CONVERT EDGES TO NUMERIC IDS
       ----------------------------------------------------- */

    const edges =
        recognizedEdges.map(
            edge => {

                const pieceId =
                    this.edges.indexOf(
                        edge.piece
                    );


                console.log(
                    "Edge:",
                    edge.piece,
                    "=> ID:",
                    pieceId,
                    "orientation:",
                    edge.orientation
                );


                if (pieceId === -1) {

                    console.error(
                        "ERROR: Unknown edge piece:",
                        edge.piece
                    );

                    return null;
                }


                return {

                    position:
                        edge.position,

                    piece:
                        pieceId,

                    orientation:
                        edge.orientation

                };

            }
        );


    /* -----------------------------------------------------
       CHECK CONVERSION
       ----------------------------------------------------- */

    if (
        corners.some(
            corner => corner === null
        )
    ) {

        console.error(
            "ERROR: Corner conversion failed."
        );

        return null;
    }


    if (
        edges.some(
            edge => edge === null
        )
    ) {

        console.error(
            "ERROR: Edge conversion failed."
        );

        return null;
    }


    /* -----------------------------------------------------
       BUILD SOLVER STATE
       ----------------------------------------------------- */

    const solverState = {

        corners: corners,

        edges: edges

    };


    console.log(
        "Numeric solver state:",
        solverState
    );


    /* -----------------------------------------------------
       VALIDATE
       ----------------------------------------------------- */

    const validation =
        this.validate(
            solverState
        );


    console.log(
        "Validation result:",
        validation
    );


    if (!validation.valid) {

        console.error(
            "SOLVER VALIDATION FAILED:",
            validation.error
        );

        return null;
    }


    /* -----------------------------------------------------
       SUCCESS
       ----------------------------------------------------- */

    console.log(
        "SUCCESS: VALID SOLVER STATE"
    );


    return solverState;

};


/* =========================================================
   FINAL LOAD MESSAGE
   ========================================================= */

console.log(
    "RUBIX solver-state.js loaded successfully."
);