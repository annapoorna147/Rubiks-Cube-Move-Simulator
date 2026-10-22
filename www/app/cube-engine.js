
/*
 * RUBIX Ultimate Edition
 * Cube Engine V2
 *
 * Coordinate system:
 * X = right
 * Y = up
 * Z = front
 */

const FACE_INFO = {
    U: { normal:[0,1,0],  right:[1,0,0],  down:[0,0,-1], color:"white" },
    R: { normal:[1,0,0],  right:[0,0,-1], down:[0,-1,0], color:"red" },
    F: { normal:[0,0,1],  right:[1,0,0],  down:[0,-1,0], color:"green" },
    D: { normal:[0,-1,0], right:[1,0,0],  down:[0,0,1],  color:"yellow" },
    L: { normal:[-1,0,0],right:[0,0,1],  down:[0,-1,0], color:"orange" },
    B: { normal:[0,0,-1],right:[-1,0,0], down:[0,-1,0], color:"blue" }
};

const COLORS = {
    white:"white",
    red:"red",
    green:"green",
    yellow:"yellow",
    orange:"orange",
    blue:"blue"
};

const MOVES = ["U","R","F","D","L","B"];

let stickers = [];
let history = [];

/* --------------------------------------------------
   CREATE SOLVED CUBE
-------------------------------------------------- */

function createSolvedCube() {
    stickers = [];

    for (const face of Object.keys(FACE_INFO)) {
        const info = FACE_INFO[face];

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {

                const x =
                    info.normal[0] +
                    info.right[0] * (col - 1) +
                    info.down[0] * (row - 1);

                const y =
                    info.normal[1] +
                    info.right[1] * (col - 1) +
                    info.down[1] * (row - 1);

                const z =
                    info.normal[2] +
                    info.right[2] * (col - 1) +
                    info.down[2] * (row - 1);

                stickers.push({
                    position:[x,y,z],
                    normal:[...info.normal],
                    color:info.color
                });
            }
        }
    }

    history = [];
}

/* --------------------------------------------------
   VECTOR ROTATION
-------------------------------------------------- */

function rotateVector(vector, axis, clockwise) {

    const [x,y,z] = vector;
    const [ax,ay,az] = axis;

    /*
     * All cube rotations are ±90 degrees.
     * Rodrigues simplified for integer coordinates.
     */

    const cross = [
        ay*z - az*y,
        az*x - ax*z,
        ax*y - ay*x
    ];

    const dot = ax*x + ay*y + az*z;

    if (clockwise) {
        return [
            cross[0] + ax*dot,
            cross[1] + ay*dot,
            cross[2] + az*dot
        ];
    }

    return [
        -cross[0] + ax*dot,
        -cross[1] + ay*dot,
        -cross[2] + az*dot
    ];
}

/* --------------------------------------------------
   APPLY SINGLE QUARTER TURN
-------------------------------------------------- */

function quarterTurn(face) {

    const axis = FACE_INFO[face].normal;

    for (const sticker of stickers) {

        const layer =
            sticker.position[0] * axis[0] +
            sticker.position[1] * axis[1] +
            sticker.position[2] * axis[2];

        if (layer === 1) {

            sticker.position =
                rotateVector(sticker.position, axis, true);

            sticker.normal =
                rotateVector(sticker.normal, axis, true);
        }
    }
}

/* --------------------------------------------------
   MOVE
-------------------------------------------------- */

function applyMove(face, amount = 1, record = true) {

    amount = ((amount % 4) + 4) % 4;

    for (let i = 0; i < amount; i++) {
        quarterTurn(face);
    }

    if (record && amount !== 0) {

        let notation = face;

        if (amount === 2) notation += "2";
        if (amount === 3) notation += "'";

        history.push(notation);
    }

    render();
}

/* --------------------------------------------------
   PARSE NOTATION
-------------------------------------------------- */

function performNotation(moveNotation) {

    const face = moveNotation[0];

    if (!MOVES.includes(face)) return;

    let amount = 1;

    if (moveNotation.includes("2")) {
        amount = 2;
    } else if (moveNotation.includes("'")) {
        amount = 3;
    }

    applyMove(face, amount);
}

/* --------------------------------------------------
   SCRAMBLE
-------------------------------------------------- */

function scramble() {

    const sequence = [];
    let previous = "";

    for (let i = 0; i < 20; i++) {

        let face;

        do {
            face =
                MOVES[Math.floor(Math.random() * MOVES.length)];
        } while (face === previous);

        previous = face;

        const random = Math.floor(Math.random() * 3);

        const notation =
            random === 0 ? face :
            random === 1 ? face + "'" :
            face + "2";

        sequence.push(notation);

        performNotation(notation);
    }

    document.getElementById("scramble").textContent =
        sequence.join(" ");
}

/* --------------------------------------------------
   UNDO
-------------------------------------------------- */

function undo() {

    if (history.length === 0) return;

    const last = history.pop();

    const face = last[0];

    let amount;

    if (last.includes("2")) {
        amount = 2;
    } else if (last.includes("'")) {
        amount = 1;
    } else {
        amount = 3;
    }

    applyMove(face, amount, false);

    render();
}

/* --------------------------------------------------
   RESET
-------------------------------------------------- */

function resetCube() {

    createSolvedCube();

    const scrambleDisplay =
        document.getElementById("scramble");

    if (scrambleDisplay) {
        scrambleDisplay.textContent = "Solved";
    }

    render();
}

/* --------------------------------------------------
   FIND STICKER INDEX
-------------------------------------------------- */

function faceIndex(face, position) {

    const info = FACE_INFO[face];

    const col =
        position[0] * info.right[0] +
        position[1] * info.right[1] +
        position[2] * info.right[2];

    const row =
        position[0] * info.down[0] +
        position[1] * info.down[1] +
        position[2] * info.down[2];

    return (row + 1) * 3 + (col + 1);
}

/* --------------------------------------------------
   RENDER
-------------------------------------------------- */

function renderFace(face) {

    const info = FACE_INFO[face];

    const faceStickers = Array(9).fill(null);

    for (const sticker of stickers) {

        if (
            sticker.normal[0] === info.normal[0] &&
            sticker.normal[1] === info.normal[1] &&
            sticker.normal[2] === info.normal[2]
        ) {

            const index =
                faceIndex(face, sticker.position);

            faceStickers[index] = sticker.color;
        }
    }

    return faceStickers
        .map(color =>
            `<span class="sticker ${color}"></span>`
        )
        .join("");
}

function render() {

    for (const face of Object.keys(FACE_INFO)) {

        const element =
            document.getElementById(face);

        if (element) {
            element.innerHTML = renderFace(face);
        }
    }

    const historyElement =
        document.getElementById("history");

    if (historyElement) {
        historyElement.textContent =
            history.length
                ? history.join(" ")
                : "No moves yet";
    }
}

/* --------------------------------------------------
   PUBLIC API
-------------------------------------------------- */

window.moveCube = function(face, prime = false) {

    if (prime) {
        applyMove(face, 3);
    } else {
        applyMove(face, 1);
    }
};

window.scrambleCube = scramble;
window.undoCube = undo;
window.resetCube = resetCube;

/* --------------------------------------------------
   START
-------------------------------------------------- */

createSolvedCube();
render();

console.log("RUBIX Cube Engine V2 loaded.");
console.log("54 stickers initialized.");
console.log("6 faces available.");
console.log("18 basic moves supported.");
