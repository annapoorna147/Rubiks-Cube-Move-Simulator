"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/cube.js
  var require_cube = __commonJS({
    "src/cube.js"(exports, module) {
      "use strict";
      var FACE_NORMALS = {
        U: [0, 1, 0],
        D: [0, -1, 0],
        F: [0, 0, 1],
        B: [0, 0, -1],
        R: [1, 0, 0],
        L: [-1, 0, 0]
      };
      var FACE_COLORS = {
        U: "white",
        D: "yellow",
        F: "green",
        B: "blue",
        R: "red",
        L: "orange"
      };
      function dot(a, b) {
        return a.reduce((sum, value, i) => sum + value * b[i], 0);
      }
      function cross(a, b) {
        return [
          a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]
        ];
      }
      function rotateClockwise(vector, axis) {
        const crossed = cross(axis, vector);
        const projection = dot(axis, vector);
        return vector.map(
          (value, i) => -crossed[i] + axis[i] * projection
        );
      }
      function createSolvedCube2() {
        const stickers = [];
        for (const face of Object.keys(FACE_NORMALS)) {
          const normal = FACE_NORMALS[face];
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
              let position;
              switch (face) {
                case "U":
                  position = [col - 1, 1, row - 1];
                  break;
                case "D":
                  position = [col - 1, -1, 1 - row];
                  break;
                case "F":
                  position = [col - 1, 1 - row, 1];
                  break;
                case "B":
                  position = [1 - col, 1 - row, -1];
                  break;
                case "R":
                  position = [1, 1 - row, 1 - col];
                  break;
                case "L":
                  position = [-1, 1 - row, col - 1];
                  break;
              }
              stickers.push({
                position,
                normal: [...normal],
                color: FACE_COLORS[face]
              });
            }
          }
        }
        return { stickers };
      }
      function cloneCube(cube) {
        return {
          stickers: cube.stickers.map((sticker) => ({
            position: [...sticker.position],
            normal: [...sticker.normal],
            color: sticker.color
          }))
        };
      }
      function turn(cube, face, turns = 1) {
        if (!FACE_NORMALS[face]) {
          throw new Error(`Invalid face: ${face}`);
        }
        if (!Number.isInteger(turns)) {
          throw new Error("Turns must be an integer.");
        }
        const result = cloneCube(cube);
        const axis = FACE_NORMALS[face];
        const count = (turns % 4 + 4) % 4;
        for (let i = 0; i < count; i++) {
          for (const sticker of result.stickers) {
            if (dot(sticker.position, axis) === 1) {
              sticker.position = rotateClockwise(sticker.position, axis);
              sticker.normal = rotateClockwise(sticker.normal, axis);
            }
          }
        }
        return result;
      }
      function serializeCube(cube) {
        return cube.stickers.map((sticker) => [
          ...sticker.position,
          ...sticker.normal,
          sticker.color
        ].join(",")).sort().join("|");
      }
      function isSolved(cube) {
        return Object.keys(FACE_NORMALS).every((face) => {
          const normal = FACE_NORMALS[face];
          const faceStickers = cube.stickers.filter(
            (sticker) => dot(sticker.normal, normal) === 1
          );
          return faceStickers.length === 9 && faceStickers.every((sticker) => sticker.color === FACE_COLORS[face]);
        });
      }
      function validateCubeStructure(cube) {
        const errors = [];
        const validColors = new Set(Object.values(FACE_COLORS));
        if (!cube || !Array.isArray(cube.stickers)) {
          return { valid: false, errors: ["Cube must contain a stickers array."] };
        }
        const stickers = cube.stickers;
        if (stickers.length !== 54) {
          errors.push(`Expected 54 stickers; found ${stickers.length}.`);
        }
        const colorCounts = /* @__PURE__ */ new Map();
        const stickerKeys = /* @__PURE__ */ new Set();
        const centerCounts = /* @__PURE__ */ new Map();
        for (let i = 0; i < stickers.length; i++) {
          const s = stickers[i];
          if (!s || typeof s !== "object") {
            errors.push(`Sticker ${i} is not an object.`);
            continue;
          }
          const { position, normal, color } = s;
          const validVector = (v) => Array.isArray(v) && v.length === 3 && v.every((n) => Number.isInteger(n) && n >= -1 && n <= 1);
          if (!validVector(position) || !validVector(normal)) {
            errors.push(`Sticker ${i} has an invalid position or normal.`);
            continue;
          }
          if (normal.reduce((sum, n) => sum + n * n, 0) !== 1) {
            errors.push(`Sticker ${i} has a non-unit face normal.`);
            continue;
          }
          const dot2 = position.reduce((sum, n, j) => sum + n * normal[j], 0);
          if (dot2 !== 1) {
            errors.push(`Sticker ${i} is not on its indicated surface.`);
          }
          const key = [...position, ...normal].join(",");
          if (stickerKeys.has(key)) {
            errors.push(`Duplicate sticker location: ${key}.`);
          }
          stickerKeys.add(key);
          if (!validColors.has(color)) {
            errors.push(`Sticker ${i} has an unknown color.`);
          } else {
            colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
          }
          if (position.every((n, j) => n === normal[j])) {
            const centerKey = position.join(",");
            centerCounts.set(centerKey, (centerCounts.get(centerKey) || 0) + 1);
            const face = Object.keys(FACE_NORMALS).find(
              (f) => FACE_NORMALS[f].every((n, j) => n === normal[j])
            );
            if (face && color !== FACE_COLORS[face]) {
              errors.push(`Center at ${centerKey} has the wrong color.`);
            }
          }
        }
        for (const color of validColors) {
          if (colorCounts.get(color) !== 9) {
            errors.push(
              `Expected 9 ${color} stickers; found ${colorCounts.get(color) || 0}.`
            );
          }
        }
        if (centerCounts.size !== 6 || [...centerCounts.values()].some((count) => count !== 1)) {
          errors.push("Expected exactly one center sticker on each face.");
        }
        return { valid: errors.length === 0, errors };
      }
      module.exports = {
        createSolvedCube: createSolvedCube2,
        cloneCube,
        turn,
        serializeCube,
        isSolved,
        FACE_NORMALS,
        validateCubeStructure
      };
    }
  });

  // src/cubies.js
  var require_cubies = __commonJS({
    "src/cubies.js"(exports, module) {
      "use strict";
      var {
        createSolvedCube: createSolvedCube2,
        validateCubeStructure
      } = require_cube();
      var CORNER_FACE_ORDER = {
        "1,1,1": ["U", "R", "F"],
        "-1,1,1": ["U", "F", "L"],
        "-1,1,-1": ["U", "L", "B"],
        "1,1,-1": ["U", "B", "R"],
        "1,-1,1": ["D", "F", "R"],
        "-1,-1,1": ["D", "L", "F"],
        "-1,-1,-1": ["D", "B", "L"],
        "1,-1,-1": ["D", "R", "B"]
      };
      var EDGE_FACE_ORDER = {
        "1,1,0": ["U", "R"],
        "0,1,1": ["U", "F"],
        "-1,1,0": ["U", "L"],
        "0,1,-1": ["U", "B"],
        "1,-1,0": ["D", "R"],
        "0,-1,1": ["D", "F"],
        "-1,-1,0": ["D", "L"],
        "0,-1,-1": ["D", "B"],
        "1,0,1": ["F", "R"],
        "-1,0,1": ["F", "L"],
        "-1,0,-1": ["B", "L"],
        "1,0,-1": ["B", "R"]
      };
      var FACE_BY_NORMAL = {
        "0,1,0": "U",
        "0,-1,0": "D",
        "0,0,1": "F",
        "0,0,-1": "B",
        "1,0,0": "R",
        "-1,0,0": "L"
      };
      function groupStickersByPosition(cube) {
        const groups = /* @__PURE__ */ new Map();
        for (const sticker of cube.stickers) {
          const key = sticker.position.join(",");
          if (!groups.has(key)) {
            groups.set(key, {
              position: [...sticker.position],
              stickers: []
            });
          }
          groups.get(key).stickers.push(sticker);
        }
        return [...groups.values()];
      }
      function isCorner(position) {
        return position.every((value) => Math.abs(value) === 1);
      }
      function isEdge(position) {
        return position.filter((value) => Math.abs(value) === 1).length === 2 && position.includes(0);
      }
      function colorKey(stickers) {
        return stickers.map((sticker) => sticker.color).sort().join("+");
      }
      function inventoryFromSolvedCube(predicate) {
        return new Set(
          groupStickersByPosition(createSolvedCube2()).filter((group) => predicate(group.position)).map((group) => colorKey(group.stickers))
        );
      }
      function validatePieceType(groups, predicate, expectedStickerCount, expectedPieceCount, knownPieces, label, errors) {
        const pieces = groups.filter((group) => predicate(group.position));
        const seenPieces = /* @__PURE__ */ new Set();
        if (pieces.length !== expectedPieceCount) {
          errors.push(
            `Expected ${expectedPieceCount} ${label}; found ${pieces.length}.`
          );
        }
        for (const piece of pieces) {
          if (piece.stickers.length !== expectedStickerCount) {
            errors.push(
              `${label} at ${piece.position.join(",")} has ${piece.stickers.length} stickers; expected ${expectedStickerCount}.`
            );
            continue;
          }
          const key = colorKey(piece.stickers);
          if (!knownPieces.has(key)) {
            errors.push(
              `Unknown ${label} color combination at ${piece.position.join(",")}: ${key}.`
            );
            continue;
          }
          if (seenPieces.has(key)) {
            errors.push(`Duplicate ${label} piece: ${key}.`);
          }
          seenPieces.add(key);
        }
        return pieces;
      }
      function calculateCornerTwist(corner) {
        const order = CORNER_FACE_ORDER[corner.position.join(",")];
        if (!order || corner.stickers.length !== 3) {
          return null;
        }
        const udSticker = corner.stickers.find(
          (sticker) => sticker.color === "white" || sticker.color === "yellow"
        );
        if (!udSticker) {
          return null;
        }
        const face = FACE_BY_NORMAL[udSticker.normal.join(",")];
        const orientation = order.indexOf(face);
        return orientation === -1 ? null : orientation;
      }
      function calculateEdgeFlip(edge) {
        const order = EDGE_FACE_ORDER[edge.position.join(",")];
        if (!order || edge.stickers.length !== 2) {
          return null;
        }
        const referenceSticker = edge.stickers.find(
          (sticker) => sticker.color === "white" || sticker.color === "yellow"
        ) || edge.stickers.find(
          (sticker) => sticker.color === "green" || sticker.color === "blue"
        );
        if (!referenceSticker) {
          return null;
        }
        const face = FACE_BY_NORMAL[referenceSticker.normal.join(",")];
        const orientation = order.indexOf(face);
        return orientation === -1 ? null : orientation;
      }
      function permutationParity(groups, predicate) {
        const positions = groupStickersByPosition(createSolvedCube2()).filter((group) => predicate(group.position)).sort((a, b) => a.position.join(",").localeCompare(b.position.join(",")));
        const pieces = groups.filter((group) => predicate(group.position)).sort((a, b) => a.position.join(",").localeCompare(b.position.join(",")));
        if (pieces.length !== positions.length) return null;
        const identity = new Map(
          positions.map((piece, index) => [colorKey(piece.stickers), index])
        );
        const permutation = pieces.map((piece) => identity.get(colorKey(piece.stickers)));
        if (permutation.some((value) => value === void 0) || new Set(permutation).size !== permutation.length) return null;
        let inversions = 0;
        for (let i = 0; i < permutation.length; i++) {
          for (let j = i + 1; j < permutation.length; j++) {
            if (permutation[i] > permutation[j]) inversions++;
          }
        }
        return inversions % 2;
      }
      function validateCubies(cube) {
        const structure = validateCubeStructure(cube);
        if (!structure.valid) {
          return {
            valid: false,
            errors: structure.errors,
            corners: [],
            edges: []
          };
        }
        const groups = groupStickersByPosition(cube);
        const errors = [];
        const corners = validatePieceType(
          groups,
          isCorner,
          3,
          8,
          inventoryFromSolvedCube(isCorner),
          "corner",
          errors
        );
        const edges = validatePieceType(
          groups,
          isEdge,
          2,
          12,
          inventoryFromSolvedCube(isEdge),
          "edge",
          errors
        );
        const cornerParity = permutationParity(groups, isCorner);
        const edgeParity = permutationParity(groups, isEdge);
        if (cornerParity !== null && edgeParity !== null && cornerParity !== edgeParity) {
          errors.push("Corner and edge permutation parity must match.");
        }
        const cornerTwists = corners.map(calculateCornerTwist);
        const edgeFlips = edges.map(calculateEdgeFlip);
        if (cornerTwists.some((value) => value === null)) {
          errors.push("Could not determine the orientation of every corner.");
        } else {
          const twistSum = cornerTwists.reduce((sum, value) => sum + value, 0);
          if (twistSum % 3 !== 0) {
            errors.push("Corner twist sum must be divisible by 3.");
          }
        }
        if (edgeFlips.some((value) => value === null)) {
          errors.push("Could not determine the orientation of every edge.");
        } else {
          const flipSum = edgeFlips.reduce((sum, value) => sum + value, 0);
          if (flipSum % 2 !== 0) {
            errors.push("Edge flip sum must be even.");
          }
        }
        return {
          valid: errors.length === 0,
          errors,
          corners,
          edges,
          cornerTwists,
          edgeFlips
        };
      }
      function diagnoseCube(cube) {
        const structure = validateCubeStructure(cube);
        if (!structure.valid) {
          return {
            valid: false,
            structure: { valid: false, errors: [...structure.errors] },
            pieces: { valid: false, checked: false },
            orientation: { valid: false, checked: false },
            parity: { valid: false, checked: false },
            errors: [...structure.errors]
          };
        }
        const result = validateCubies(cube);
        const errors = result.errors;
        const parityErrors = errors.filter(
          (error) => error === "Corner and edge permutation parity must match."
        );
        const orientationErrors = errors.filter(
          (error) => error === "Could not determine the orientation of every corner." || error === "Corner twist sum must be divisible by 3." || error === "Could not determine the orientation of every edge." || error === "Edge flip sum must be even."
        );
        const pieceErrors = errors.filter(
          (error) => !parityErrors.includes(error) && !orientationErrors.includes(error)
        );
        return {
          valid: result.valid,
          structure: { valid: true, errors: [] },
          pieces: {
            valid: pieceErrors.length === 0,
            checked: true,
            corners: result.corners.length,
            edges: result.edges.length,
            errors: pieceErrors
          },
          orientation: {
            valid: orientationErrors.length === 0,
            checked: true,
            cornerTwists: result.cornerTwists,
            edgeFlips: result.edgeFlips,
            errors: orientationErrors
          },
          parity: {
            valid: parityErrors.length === 0,
            checked: true,
            errors: parityErrors
          },
          errors: [...errors]
        };
      }
      module.exports = {
        validateCubies,
        diagnoseCube
      };
    }
  });

  // src/diagnostic-report.js
  var require_diagnostic_report = __commonJS({
    "src/diagnostic-report.js"(exports, module) {
      "use strict";
      var { diagnoseCube } = require_cubies();
      function createDiagnosticReport2(cube) {
        const diagnostic = diagnoseCube(cube);
        function createSection(name, result, details = []) {
          return {
            name,
            status: !result.checked ? "NOT_CHECKED" : result.valid ? "PASS" : "FAIL",
            details
          };
        }
        const structure = createSection(
          "Cube Structure",
          { checked: true, valid: diagnostic.structure.valid },
          diagnostic.structure.errors
        );
        const pieces = createSection(
          "Piece Recognition",
          diagnostic.pieces,
          diagnostic.pieces.errors || []
        );
        const orientation = createSection(
          "Piece Orientation",
          diagnostic.orientation,
          diagnostic.orientation.errors || []
        );
        const parity = createSection(
          "Permutation Parity",
          diagnostic.parity,
          diagnostic.parity.errors || []
        );
        const sections = [structure, pieces, orientation, parity];
        return {
          valid: diagnostic.valid,
          status: diagnostic.valid ? "VALID" : "INVALID",
          summary: diagnostic.valid ? "The cube passed all validation checks." : "The cube has validation issues that must be resolved.",
          sections,
          errors: [...diagnostic.errors]
        };
      }
      module.exports = {
        createDiagnosticReport: createDiagnosticReport2
      };
    }
  });

  // src/moves.js
  var require_moves = __commonJS({
    "src/moves.js"(exports, module) {
      "use strict";
      var { turn, FACE_NORMALS } = require_cube();
      var MOVE_PATTERN = /^([UDFBRL])([2']?)$/;
      function parseMove(token) {
        if (typeof token !== "string") {
          throw new Error("Move must be a string.");
        }
        const match = MOVE_PATTERN.exec(token);
        if (!match || !FACE_NORMALS[match[1]]) {
          throw new Error(`Invalid move notation: ${token}`);
        }
        const face = match[1];
        const suffix = match[2];
        return {
          face,
          turns: suffix === "'" ? 3 : suffix === "2" ? 2 : 1
        };
      }
      function parseSequence(notation) {
        if (typeof notation !== "string") {
          throw new Error("Move sequence must be a string.");
        }
        const trimmed = notation.trim();
        if (!trimmed) return [];
        return trimmed.split(/\s+/).map(parseMove);
      }
      function applyMove(cube, move) {
        const parsed = typeof move === "string" ? parseMove(move) : move;
        if (!parsed || !FACE_NORMALS[parsed.face] || ![1, 2, 3].includes(parsed.turns)) {
          throw new Error("Invalid parsed move.");
        }
        return turn(cube, parsed.face, parsed.turns);
      }
      function applySequence2(cube, notation) {
        const moves = Array.isArray(notation) ? notation : parseSequence(notation);
        return moves.reduce((state, move) => applyMove(state, move), cube);
      }
      function invertMove(move) {
        const parsed = typeof move === "string" ? parseMove(move) : move;
        if (!parsed || !FACE_NORMALS[parsed.face]) {
          throw new Error("Invalid move.");
        }
        if (parsed.turns === 1) return { face: parsed.face, turns: 3 };
        if (parsed.turns === 3) return { face: parsed.face, turns: 1 };
        if (parsed.turns === 2) return { face: parsed.face, turns: 2 };
        throw new Error("Invalid turn count.");
      }
      function invertSequence(notation) {
        const moves = Array.isArray(notation) ? notation : parseSequence(notation);
        return moves.slice().reverse().map(invertMove);
      }
      function formatMove(move) {
        if (move.turns === 1) return move.face;
        if (move.turns === 2) return `${move.face}2`;
        if (move.turns === 3) return `${move.face}'`;
        throw new Error("Invalid turn count.");
      }
      module.exports = {
        parseMove,
        parseSequence,
        applyMove,
        applySequence: applySequence2,
        invertMove,
        invertSequence,
        formatMove
      };
    }
  });

  // dashboard/js/app.js
  var import_cube = __toESM(require_cube());
  var import_diagnostic_report = __toESM(require_diagnostic_report());
  var import_moves = __toESM(require_moves());
  var runButton = document.getElementById("run-diagnostic");
  var scrambleButton = document.getElementById("scramble-cube");
  var resetButton = document.getElementById("reset-cube");
  var scrambleNotation = document.getElementById("scramble-notation");
  var currentCube = (0, import_cube.createSolvedCube)();
  var currentScramble = "";
  var elements = {
    overallStatus: document.getElementById("overall-status"),
    overallSummary: document.getElementById("overall-summary"),
    healthCard: document.querySelector(".health-card"),
    healthSymbol: document.getElementById("health-symbol"),
    reportCount: document.getElementById("report-count"),
    reportMessages: document.getElementById("report-messages")
  };
  var cardIds = {
    "Cube Structure": "card-structure",
    "Piece Recognition": "card-pieces",
    "Piece Orientation": "card-orientation",
    "Permutation Parity": "card-parity"
  };
  function updateCard(section) {
    const card = document.getElementById(cardIds[section.name]);
    if (!card) return;
    const statusElement = card.querySelector(".card-status");
    card.classList.remove("pass", "fail", "not-checked");
    card.classList.add(section.status.toLowerCase().replace("_", "-"));
    statusElement.textContent = section.status.replace("_", " ");
  }
  function renderReport(report) {
    elements.healthCard.classList.remove("valid", "invalid");
    elements.healthCard.classList.add(report.valid ? "valid" : "invalid");
    elements.overallStatus.textContent = report.status;
    elements.overallSummary.textContent = report.summary;
    elements.healthSymbol.textContent = report.valid ? "\u2713" : "!";
    report.sections.forEach(updateCard);
    elements.reportCount.textContent = `${report.errors.length} ERROR${report.errors.length === 1 ? "" : "S"}`;
    elements.reportMessages.replaceChildren();
    if (report.errors.length === 0) {
      const message = document.createElement("p");
      message.className = "report-item";
      message.textContent = "All diagnostic checks passed successfully.";
      elements.reportMessages.appendChild(message);
      return;
    }
    report.errors.forEach((error) => {
      const message = document.createElement("p");
      message.className = "report-item fail";
      message.textContent = error;
      elements.reportMessages.appendChild(message);
    });
  }
  function runDiagnostic() {
    runButton.disabled = true;
    runButton.textContent = "ANALYZING...";
    try {
      const report = (0, import_diagnostic_report.createDiagnosticReport)(currentCube);
      renderReport(report);
    } catch (error) {
      console.error("Diagnostic failed:", error);
      elements.overallStatus.textContent = "ENGINE ERROR";
      elements.overallSummary.textContent = "An unexpected error occurred during cube analysis.";
      elements.reportMessages.textContent = error.message;
    } finally {
      runButton.disabled = false;
      runButton.innerHTML = "RUN DIAGNOSTIC <span>\u2192</span>";
    }
  }
  runButton.addEventListener("click", runDiagnostic);
  var FACES = ["U", "D", "F", "B", "R", "L"];
  var SUFFIXES = ["", "'", "2"];
  function generateScramble(length = 20) {
    const moves = [];
    let previousFace = "";
    while (moves.length < length) {
      const face = FACES[Math.floor(Math.random() * FACES.length)];
      if (face === previousFace) continue;
      const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
      moves.push(`${face}${suffix}`);
      previousFace = face;
    }
    return moves.join(" ");
  }
  function scrambleCube() {
    try {
      currentScramble = generateScramble();
      currentCube = (0, import_moves.applySequence)((0, import_cube.createSolvedCube)(), currentScramble);
      scrambleNotation.textContent = currentScramble;
      elements.overallStatus.textContent = "SCRAMBLED";
      elements.overallSummary.textContent = "A legal scramble has been generated. Run diagnostics to validate it.";
      elements.healthSymbol.textContent = "\u21BB";
    } catch (error) {
      console.error("Scramble failed:", error);
      elements.overallStatus.textContent = "SCRAMBLE ERROR";
      elements.overallSummary.textContent = error.message;
    }
  }
  scrambleButton.addEventListener("click", scrambleCube);
  function resetCube() {
    currentCube = (0, import_cube.createSolvedCube)();
    currentScramble = "";
    scrambleNotation.textContent = "NO SCRAMBLE GENERATED";
    runDiagnostic();
  }
  resetButton.addEventListener("click", resetCube);
})();
