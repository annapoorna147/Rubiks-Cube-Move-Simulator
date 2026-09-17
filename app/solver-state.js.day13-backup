/*
 * RUBIX Ultimate Edition
 * Solver Cubie State Foundation
 *
 * Represents the cube as:
 * 8 corner pieces
 * 12 edge pieces
 */

const RUBIX_SOLVER_STATE = {

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

    createSolvedState() {

        return {
            corners: this.corners.map((name, index) => ({
                position: name,
                piece: index,
                orientation: 0
            })),

            edges: this.edges.map((name, index) => ({
                position: name,
                piece: index,
                orientation: 0
            }))
        };
    },

    validate(state) {

        if (!state || typeof state !== "object") {
            return {
                valid: false,
                error: "Solver state is missing."
            };
        }

        if (!Array.isArray(state.corners) || state.corners.length !== 8) {
            return {
                valid: false,
                error: "Solver state must contain 8 corners."
            };
        }

        if (!Array.isArray(state.edges) || state.edges.length !== 12) {
            return {
                valid: false,
                error: "Solver state must contain 12 edges."
            };
        }

        return {
            valid: true,
            error: null
        };
    }
};

window.RUBIX_SOLVER_STATE = RUBIX_SOLVER_STATE;

console.log("RUBIX solver cubie state foundation loaded.");

/*
 * Convert the 54-sticker face state into the 8 corner pieces.
 *
 * Corner order:
 * UFR, URB, UBL, ULF,
 * DFR, DRB, DBL, DLF
 */

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

RUBIX_SOLVER_STATE.identifyCornerPieces = function(state) {

    if (!state) {
        return null;
    }

    return this.corners.map(position => ({
        position: position,
        colors: [...this.cornerColors[position]],
        piece: null,
        orientation: null
    }));
};

console.log("RUBIX corner identification foundation loaded.");

/*
 * Corner color definitions
 */
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

/*
 * Sticker locations for each physical corner slot.
 */
RUBIX_SOLVER_STATE.cornerSlots = {
    UFR: [["U", 8], ["R", 0], ["F", 2]],
    URB: [["U", 2], ["R", 2], ["B", 0]],
    UBL: [["U", 0], ["B", 2], ["L", 0]],
    ULF: [["U", 6], ["L", 2], ["F", 0]],

    DFR: [["D", 2], ["R", 6], ["F", 8]],
    DRB: [["D", 8], ["R", 8], ["B", 6]],
    DBL: [["D", 6], ["B", 8], ["L", 6]],
    DLF: [["D", 0], ["L", 8], ["F", 6]]
};

/*
 * Identify the corner piece occupying every corner slot.
 */
RUBIX_SOLVER_STATE.identifyCornerPieces = function(state) {

    if (!state || typeof state !== "object") {
        return null;
    }

    const faces = ["U", "R", "F", "D", "L", "B"];

    for (const face of faces) {
        if (
            !Array.isArray(state[face]) ||
            state[face].length !== 9
        ) {
            return null;
        }
    }

    const result = [];

    for (const position of this.corners) {

        const slot = this.cornerSlots[position];

        const colors = slot.map(([face, index]) =>
            state[face][index]
        );

        if (colors.some(color => !color)) {
            return null;
        }

        const sortedColors = [...colors].sort();

        let piecePosition = null;

        for (const [name, pieceColors] of Object.entries(this.cornerColors)) {

            if (
                JSON.stringify([...pieceColors].sort()) ===
                JSON.stringify(sortedColors)
            ) {
                piecePosition = name;
                break;
            }
        }

        if (!piecePosition) {
            return null;
        }

        const referenceColor =
            colors.find(
                color =>
                    color === "white" ||
                    color === "yellow"
            );

        let orientation = null;

        if (referenceColor) {

            const referenceIndex =
                colors.indexOf(referenceColor);

            const referenceFace =
                slot[referenceIndex][0];

            if (
                referenceFace === "U" ||
                referenceFace === "D"
            ) {
                orientation = 0;
            } else if (
                referenceFace === "R" ||
                referenceFace === "L"
            ) {
                orientation = 1;
            } else if (
                referenceFace === "F" ||
                referenceFace === "B"
            ) {
                orientation = 2;
            }
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

console.log("RUBIX corner recognition loaded.");

/*
 * Edge color definitions
 */
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

console.log("RUBIX edge color definitions loaded.");

/*
 * Sticker locations for each physical edge slot.
 */
RUBIX_SOLVER_STATE.edgeSlots = {
    UF: [["U", 7], ["F", 1]],
    UR: [["U", 5], ["R", 1]],
    UB: [["U", 1], ["B", 1]],
    UL: [["U", 3], ["L", 1]],

    FR: [["F", 5], ["R", 3]],
    BR: [["B", 3], ["R", 5]],
    BL: [["B", 5], ["L", 3]],
    FL: [["F", 3], ["L", 5]],

    DF: [["D", 1], ["F", 7]],
    DR: [["D", 5], ["R", 7]],
    DB: [["D", 7], ["B", 7]],
    DL: [["D", 3], ["L", 7]]
};

console.log("RUBIX edge slot mapping loaded.");

/*
 * Identify the edge piece occupying every edge slot.
 */
RUBIX_SOLVER_STATE.identifyEdgePieces = function(state) {

    if (!state) {
        return null;
    }

    const result = [];

    for (const position of this.edges) {

        const slot = this.edgeSlots[position];

        const colors = slot.map(([face, index]) =>
            state[face][index]
        );

        let piecePosition = null;

        for (const [name, pieceColors] of Object.entries(this.edgeColors)) {

            const actual = [...colors].sort().join("|");
            const expected = [...pieceColors].sort().join("|");

            if (actual === expected) {
                piecePosition = name;
                break;
            }
        }

        let orientation = 0;

        const referenceColor =
            colors.includes("white") ? "white" :
            colors.includes("yellow") ? "yellow" :
            colors.includes("green") ? "green" :
            colors.includes("blue") ? "blue" :
            null;

        if (referenceColor === "white" || referenceColor === "yellow") {

            const referenceIndex =
                colors.indexOf(referenceColor);

            const referenceFace =
                slot[referenceIndex][0];

            orientation =
                (referenceFace === "U" ||
                 referenceFace === "D")
                    ? 0
                    : 1;

        } else {

            const greenBlueIndex =
                colors.findIndex(color =>
                    color === "green" ||
                    color === "blue"
                );

            const referenceFace =
                slot[greenBlueIndex][0];

            orientation =
                (referenceFace === "F" ||
                 referenceFace === "B")
                    ? 0
                    : 1;
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

console.log("RUBIX edge recognition loaded.");
