/*
 * RUBIX Ultimate Edition
 * Solver Foundation V1
 *
 * Purpose:
 * - Read cube state
 * - Validate cube state
 * - Prepare solver pipeline
 * - Generate solution moves later
 */

const RUBIX_SOLVER = {

    version: "1.0.0",

    /*
     * Standard face order used by the solver.
     */
    faces: ["U", "R", "F", "D", "L", "B"],

    /*
     * Standard color scheme.
     */
    colors: {
        U: "white",
        R: "red",
        F: "green",
        D: "yellow",
        L: "orange",
        B: "blue"
    },

    /*
     * Return an empty 54-sticker state.
     */
    createSolvedState() {

        const state = {};

        for (const face of this.faces) {
            state[face] = Array(9).fill(this.colors[face]);
        }

        return state;
    },

    /*
     * Check that a state contains all six faces
     * and exactly nine stickers per face.
     */
    validateState(state) {

        if (!state || typeof state !== "object") {
            return {
                valid: false,
                error: "Cube state is missing."
            };
        }

        for (const face of this.faces) {

            if (!Array.isArray(state[face])) {
                return {
                    valid: false,
                    error: `Face ${face} is missing.`
                };
            }

            if (state[face].length !== 9) {
                return {
                    valid: false,
                    error: `Face ${face} must contain 9 stickers.`
                };
            }
        }

        const counts = {};

        for (const face of this.faces) {

            for (const color of state[face]) {
                counts[color] = (counts[color] || 0) + 1;
            }
        }

        for (const face of this.faces) {

            const color = this.colors[face];

            if (counts[color] !== 9) {
                return {
                    valid: false,
                    error: `${color} appears ${counts[color] || 0} times.`
                };
            }
        }

        return {
            valid: true,
            error: null
        };
    },

    /*
     * Convert a state into a compact string.
     * Useful later for search algorithms and caching.
     */
    serialize(state) {

        const validation = this.validateState(state);

        if (!validation.valid) {
            throw new Error(validation.error);
        }

        return this.faces
            .map(face => state[face].join(""))
            .join("");
    },

    /*
     * Basic solver entry point.
     *
     * The actual solving algorithm will be added
     * in the next stages.
     */
    solve(state) {

        const validation = this.validateState(state);

        if (!validation.valid) {
            return {
                solved: false,
                moves: [],
                error: validation.error
            };
        }

        const solvedState = this.createSolvedState();

        if (this.serialize(state) === this.serialize(solvedState)) {
            return {
                solved: true,
                moves: [],
                error: null
            };
        }

        return {
            solved: false,
            moves: [],
            error: "Solver algorithm not implemented yet."
        };
    }
};

/*
 * Public browser API.
 */
window.RUBIX_SOLVER = RUBIX_SOLVER;

console.log("RUBIX Solver Foundation V1 loaded.");
console.log("54-sticker state model ready.");
console.log("State validation ready.");
console.log("State serialization ready.");
