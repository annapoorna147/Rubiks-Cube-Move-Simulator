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
