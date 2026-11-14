"use strict";

import { createSolvedCube } from "../../src/cube.js";
import { createDiagnosticReport } from "../../src/diagnostic-report.js";
import { applySequence } from "../../src/moves.js";
import { Cube3D } from "./visualizer/cube3d.js";

const runButton = document.getElementById("run-diagnostic");
const scrambleButton = document.getElementById("scramble-cube");
const resetButton = document.getElementById("reset-cube");
const scrambleNotation = document.getElementById("scramble-notation");

let currentCube = createSolvedCube();
let currentScramble = "";

const elements = {
  overallStatus: document.getElementById("overall-status"),
  overallSummary: document.getElementById("overall-summary"),
  healthCard: document.querySelector(".health-card"),
  healthSymbol: document.getElementById("health-symbol"),
  reportCount: document.getElementById("report-count"),
  reportMessages: document.getElementById("report-messages")
};

const cardIds = {
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
  elements.healthSymbol.textContent = report.valid ? "✓" : "!";

  report.sections.forEach(updateCard);

  elements.reportCount.textContent =
    `${report.errors.length} ERROR${report.errors.length === 1 ? "" : "S"}`;

  elements.reportMessages.replaceChildren();

  if (report.errors.length === 0) {
    const message = document.createElement("p");
    message.className = "report-item";
    message.textContent = "All diagnostic checks passed successfully.";
    elements.reportMessages.appendChild(message);
    return;
  }

  report.errors.forEach(error => {
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
    const report = createDiagnosticReport(currentCube);
    renderReport(report);
  } catch (error) {
    console.error("Diagnostic failed:", error);
    elements.overallStatus.textContent = "ENGINE ERROR";
    elements.overallSummary.textContent =
      "An unexpected error occurred during cube analysis.";
    elements.reportMessages.textContent = error.message;
  } finally {
    runButton.disabled = false;
    runButton.innerHTML = 'RUN DIAGNOSTIC <span>→</span>';
  }
}

runButton.addEventListener("click", runDiagnostic);

const FACES = ["U", "D", "F", "B", "R", "L"];
const SUFFIXES = ["", "'", "2"];

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
    currentCube = applySequence(createSolvedCube(), currentScramble);

    if (cube3D) {
      cube3D.playSequence(currentScramble).catch(error => {
        console.error("3D scramble playback failed:", error);
      });
    }

    scrambleNotation.textContent = currentScramble;
    elements.overallStatus.textContent = "SCRAMBLED";
    elements.overallSummary.textContent =
      "A legal scramble has been generated. Run diagnostics to validate it.";
    elements.healthSymbol.textContent = "↻";
  } catch (error) {
    console.error("Scramble failed:", error);
    elements.overallStatus.textContent = "SCRAMBLE ERROR";
    elements.overallSummary.textContent = error.message;
  }
}

scrambleButton.addEventListener("click", scrambleCube);

function resetCube() {
  currentCube = createSolvedCube();
  currentScramble = "";

  if (cube3D) {
    cube3D.resetToSolved().catch(error => {
      console.error("3D reset failed:", error);
    });
  }

  scrambleNotation.textContent = "NO SCRAMBLE GENERATED";

  runDiagnostic();
}

resetButton.addEventListener("click", resetCube);

// Initialize the 3D cube visualizer
const visualizerContainer = document.getElementById("cube-3d-viewer");

let cube3D = null;

if (visualizerContainer) {
  try {
    cube3D = new Cube3D(visualizerContainer);

    const loadingMessage = visualizerContainer.querySelector(
      ".visualizer-loading"
    );

    loadingMessage?.remove();

    console.log("RUBIX 3D visualizer initialized successfully.");

    document.querySelectorAll("[data-move]").forEach(button => {
      button.addEventListener("click", async () => {
        const move = button.dataset.move;
        const face = move[0];
        const suffix = move.slice(1);

        const turns = suffix === "'" ? 3 : suffix === "2" ? 2 : 1;

        try {
          await cube3D.turnFace(face, turns);
          console.log(`3D move completed: ${move}`);
        } catch (error) {
          console.error(`3D move failed: ${move}`, error);
        }
      });
    });
  } catch (error) {
    console.error("3D visualizer initialization failed:", error);

    visualizerContainer.innerHTML =
      '<div class="visualizer-loading">3D ENGINE UNAVAILABLE</div>';
  }
}
