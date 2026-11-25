"use strict";

const {
  scanFace,
  scanFaceDetailed
} = require("./face-scanner");

const { rotateFace } = require("./face-orientation");
const { reconstructCube } = require("./cube-reconstructor");

const REQUIRED_FACES = ["U", "D", "F", "B", "R", "L"];

function validateFace(face) {
  if (!REQUIRED_FACES.includes(face)) {
    throw new Error(`Invalid face: ${face}`);
  }
}

function scanCubeFace(imageData, face, rotation = 0) {
  validateFace(face);

  const colors = rotateFace(scanFace(imageData), rotation);

  return {
    face,
    rotation,
    colors
  };
}

function scanCubeFaceDetailed(imageData, face, rotation = 0) {
  validateFace(face);

  const result = scanFaceDetailed(imageData);

  return {
    face,
    rotation,
    ...result,
    colors: rotateFace(result.colors, rotation),
    confidence: rotateFace(result.confidence, rotation),
    coverage: rotateFace(result.coverage, rotation),
    details: rotateFace(result.details, rotation)
  };
}

function buildCubeFromScans(scannedFaces) {
  if (!scannedFaces || typeof scannedFaces !== "object") {
    return {
      valid: false,
      cube: null,
      errors: ["Scanned faces must be provided."]
    };
  }

  const faces = {};

  for (const face of REQUIRED_FACES) {
    if (!scannedFaces[face]) {
      return {
        valid: false,
        cube: null,
        errors: [`Please scan the ${face} face.`]
      };
    }

    faces[face] = scannedFaces[face];
  }

  return reconstructCube(faces);
}

module.exports = {
  scanCubeFace,
  scanCubeFaceDetailed,
  buildCubeFromScans
};
