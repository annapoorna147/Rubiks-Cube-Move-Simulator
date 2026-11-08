"use strict";

const { diagnoseCube } = require("./cubies");

function createDiagnosticReport(cube) {
  const diagnostic = diagnoseCube(cube);

  function createSection(name, result, details = []) {
    return {
      name,
      status: !result.checked
        ? "NOT_CHECKED"
        : result.valid
          ? "PASS"
          : "FAIL",
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
    summary: diagnostic.valid
      ? "The cube passed all validation checks."
      : "The cube has validation issues that must be resolved.",
    sections,
    errors: [...diagnostic.errors]
  };
}

module.exports = {
  createDiagnosticReport
};
