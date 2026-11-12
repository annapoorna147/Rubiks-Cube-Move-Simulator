"use strict";

import { createSolvedCube } from "../../src/cube.js";
import { createDiagnosticReport } from "../../src/diagnostic-report.js";

const runButton = document.getElementById("run-diagnostic");

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
    const cube = createSolvedCube();
    const report = createDiagnosticReport(cube);
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
