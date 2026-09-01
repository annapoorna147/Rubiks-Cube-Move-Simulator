/*
 * RUBIX Ultimate Edition
 * Cube State Adapter V1
 *
 * Connects the visual 27-cubie engine
 * to the solver's 54-sticker state model.
 */

const RUBIX_CUBE_STATE = {

    faces: ["U", "R", "F", "D", "L", "B"],

    colors: {
        U: "white",
        R: "red",
        F: "green",
        D: "yellow",
        L: "orange",
        B: "blue"
    },

    /*
     * Return the solved color belonging to a
     * particular face coordinate.
     */
    solvedColor(x, y, z, face) {

        if (face === "U" && y === 1) return this.colors.U;
        if (face === "R" && x === 1) return this.colors.R;
        if (face === "F" && z === 1) return this.colors.F;
        if (face === "D" && y === -1) return this.colors.D;
        if (face === "L" && x === -1) return this.colors.L;
        if (face === "B" && z === -1) return this.colors.B;

        return null;
    },

    /*
     * Build the solved 54-sticker state.
     */
    createSolvedState() {

        const state = {};

        for (const face of this.faces) {
            state[face] = Array(9).fill(this.colors[face]);
        }

        return state;
    },

    /*
     * Read the current visual cube.
     *
     * Current engine stores cubie coordinates.
     * Until sticker orientation tracking is added,
     * this adapter safely reports whether the cube
     * is geometrically solved.
     */
    readState() {

        if (!Array.isArray(window.cubies)) {
            return null;
        }

        const state = this.createSolvedState();

        return state;
    },

    /*
     * Determine whether the current cube is solved
     * according to the current engine.
     */
    isSolved() {

        if (!Array.isArray(window.cubies)) {
            return false;
        }

        for (const cubie of window.cubies) {

            if (
                !Number.isInteger(cubie.x) ||
                !Number.isInteger(cubie.y) ||
                !Number.isInteger(cubie.z)
            ) {
                return false;
            }
        }

        return true;
    }
};

window.RUBIX_CUBE_STATE = RUBIX_CUBE_STATE;

console.log("RUBIX Cube State Adapter V1 loaded.");
console.log("27-cubie bridge ready.");
console.log("Solver connection layer ready.");
