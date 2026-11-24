"use strict";

const {
  scanFace,
  scanFaceDetailed
} = require("./face-scanner");

const { reconstructCube } = require("./cube-reconstructor");

const REQUIRED_FACES = ["U", "D", "F", "B", "R", "L"];

function scanCubeFace(imageData, face) {
  if (!REQUIRED_FACES.includes(face)) {
    throw new Error(`Invalid face: ${face}`);
  }

  const colors = scanFace(imageData);

  return {
    face,
    colors
  };
}

function scanCubeFaceDetailed(imageData, face) {
  if (!REQUIRED_FACES.includes(face)) {
    throw new Error(`Invalid face: ${face}`);
  }

  const result = scanFaceDetailed(imageData);

  return {
    face,
    ...result
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
