"use strict";

import { createSolvedCube } from "../../src/cube.js";
import { createDiagnosticReport } from "../../src/diagnostic-report.js";
import { applySequence } from "../../src/moves.js";
import {
  scanCubeFace,
  buildCubeFromScans
} from "../../src/camera/camera-pipeline.js";
import { Cube3D } from "./visualizer/cube3d.js";

// Existing dashboard controls
const runButton = document.getElementById("run-diagnostic");
const scrambleButton = document.getElementById("scramble-cube");
const resetButton = document.getElementById("reset-cube");
const scrambleNotation = document.getElementById("scramble-notation");

// Camera scanner elements
const video = document.getElementById("camera-preview");
const cameraPlaceholder = document.getElementById("camera-placeholder");
const faceSelector = document.getElementById("face-selector");
const startCameraButton = document.getElementById("start-camera");
const captureFaceButton = document.getElementById("capture-face");
const scannerStatus = document.getElementById("scanner-status");
const faceProgress = document.getElementById("face-progress");

const progressItems = document.querySelectorAll(".face-progress-item");

const FACES = ["U", "D", "F", "B", "R", "L"];
const SUFFIXES = ["", "'", "2"];

let currentCube = createSolvedCube();
let currentScramble = "";
let cube3D = null;

let cameraStream = null;
const scannedFaces = Object.create(null);

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

// --------------------------------------------------
// DIAGNOSTIC ENGINE
// --------------------------------------------------

function updateCard(section) {
  const card = document.getElementById(cardIds[section.name]);
  if (!card) return;

  const statusElement = card.querySelector(".card-status");

  card.classList.remove("pass", "fail", "not-checked");
  card.classList.add(section.status.toLowerCase().replace("_", "-"));

  if (statusElement) {
    statusElement.textContent = section.status.replace("_", " ");
  }
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

// --------------------------------------------------
// SCRAMBLE AND RESET
// --------------------------------------------------

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

// --------------------------------------------------
// CAMERA MANAGEMENT
// --------------------------------------------------

function setScannerStatus(message) {
  if (scannerStatus) {
    scannerStatus.textContent = message;
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  if (video) {
    video.pause();
    video.srcObject = null;
    video.style.display = "none";
  }

  if (cameraPlaceholder) {
    cameraPlaceholder.hidden = false;
  }

  if (captureFaceButton) {
    captureFaceButton.disabled = true;
  }

  if (startCameraButton) {
    startCameraButton.textContent = "START CAMERA";
  }

  setScannerStatus("Camera stopped.");
}

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    setScannerStatus(
      "Camera unavailable. Use HTTPS or localhost and a supported browser."
    );
    return;
  }

  try {
    setScannerStatus("Requesting camera permission...");

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    video.srcObject = cameraStream;
    video.muted = true;
    video.playsInline = true;

    await video.play();

    video.style.display = "block";

    if (cameraPlaceholder) {
      cameraPlaceholder.hidden = true;
    }

    captureFaceButton.disabled = false;
    startCameraButton.textContent = "STOP CAMERA";

    setScannerStatus(
      "Camera ready. Centre one cube face and select its face label."
    );
  } catch (error) {
    console.error("Camera initialization failed:", error);

    stopCamera();

    if (error.name === "NotAllowedError") {
      setScannerStatus(
        "Camera permission denied. Allow camera access in your browser."
      );
    } else if (error.name === "NotFoundError") {
      setScannerStatus("No camera was detected on this device.");
    } else {
      setScannerStatus(`Camera error: ${error.message}`);
    }
  }
}

if (startCameraButton) {
  startCameraButton.addEventListener("click", () => {
    if (cameraStream) {
      stopCamera();
    } else {
      startCamera();
    }
  });
}

// --------------------------------------------------
// SIX-FACE SCANNING
// --------------------------------------------------

function updateFaceProgress() {
  const count = Object.keys(scannedFaces).length;

  faceProgress.textContent = `${count} / 6 FACES CAPTURED`;

  progressItems.forEach(item => {
    const face = item.dataset.face;
    item.classList.toggle("captured", Boolean(scannedFaces[face]));
  });
}

function captureFace() {
  if (!cameraStream || !video.videoWidth || !video.videoHeight) {
    setScannerStatus("Start the camera before capturing a face.");
    return;
  }

  const selectedFace = faceSelector.value;

  if (!FACES.includes(selectedFace)) {
    setScannerStatus("Please select a valid cube face.");
    return;
  }

  try {
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Crop a centred square from the camera image.
    const cropSize = Math.min(videoWidth, videoHeight);

    const sourceX = (videoWidth - cropSize) / 2;
    const sourceY = (videoHeight - cropSize) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;

    const context = canvas.getContext("2d", {
      willReadFrequently: true
    });

    if (!context) {
      throw new Error("Unable to create image processing canvas.");
    }

    context.drawImage(
      video,
      sourceX,
      sourceY,
      cropSize,
      cropSize,
      0,
      0,
      300,
      300
    );

    const imageData = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const scanResult = scanCubeFace(imageData, selectedFace);

    scannedFaces[selectedFace] = scanResult.colors;

    updateFaceProgress();

    setScannerStatus(
      `${selectedFace} face captured successfully.`
    );

    console.log(`RUBIX face scan completed: ${selectedFace}`, scanResult);

    if (Object.keys(scannedFaces).length === 6) {
      reconstructScannedCube();
    }
  } catch (error) {
    console.error("Face capture failed:", error);
    setScannerStatus(`Capture failed: ${error.message}`);
  }
}

if (captureFaceButton) {
  captureFaceButton.addEventListener("click", captureFace);
}

// --------------------------------------------------
// CUBE RECONSTRUCTION
// --------------------------------------------------

function reconstructScannedCube() {
  setScannerStatus("All six faces captured. Reconstructing cube...");

  try {
    const result = buildCubeFromScans(scannedFaces);

    if (!result.valid) {
      currentCube = null;

      setScannerStatus(
        `Cube reconstruction failed: ${result.errors.join(" ")}`
      );

      elements.healthCard.classList.remove("valid");
      elements.healthCard.classList.add("invalid");
      elements.overallStatus.textContent = "SCAN INVALID";
      elements.overallSummary.textContent =
        "The latest camera scan could not be reconstructed. Please review the scanning errors.";
      elements.healthSymbol.textContent = "!";
      elements.reportCount.textContent =
        `${result.errors.length} ERROR${result.errors.length === 1 ? "" : "S"}`;
      elements.reportMessages.replaceChildren();

      result.errors.forEach(error => {
        const message = document.createElement("p");
        message.className = "report-item fail";
        message.textContent = error;
        elements.reportMessages.appendChild(message);
      });

      console.error("Cube reconstruction errors:", result.errors);
      return;
    }

    currentCube = result.cube;
    currentScramble = "";

    scrambleNotation.textContent = "CUBE LOADED FROM CAMERA SCAN";

    runDiagnostic();

    setScannerStatus(
      "Cube reconstructed successfully! Diagnostic analysis completed."
    );

    console.log("RUBIX cube reconstructed successfully.", result);
  } catch (error) {
    console.error("Cube reconstruction failed:", error);

    setScannerStatus(
      `Reconstruction error: ${error.message}`
    );
  }
}

// --------------------------------------------------
// CAMERA CLEANUP
// --------------------------------------------------

window.addEventListener("pagehide", stopCamera);

// --------------------------------------------------
// 3D VISUALIZER
// --------------------------------------------------

const visualizerContainer = document.getElementById("cube-3d-viewer");

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

console.log("RUBIX camera integration initialized.");
