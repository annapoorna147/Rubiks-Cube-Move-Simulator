"use strict";

const { detectColor } = require("./color-detector");

const VALIDATION_ERROR = "Invalid image data.";

function validateImageData(imageData) {
  if (
    !imageData ||
    !Number.isInteger(imageData.width) ||
    !Number.isInteger(imageData.height) ||
    imageData.width < 3 ||
    imageData.height < 3 ||
    !imageData.data
  ) {
    throw new Error(VALIDATION_ERROR);
  }

  const { width, height, data } = imageData;

  if (data.length !== width * height * 4) {
    throw new Error("Pixel data length does not match image dimensions.");
  }
}

/**
 * Sample multiple pixels from the inner region of one sticker.
 * Unknown pixels are excluded from colour voting.
 */
function sampleSticker(imageData, row, col, options = {}) {
  const { width, height, data } = imageData;

  const sampleCount = options.sampleCount ?? 5;
  const sampleFraction = options.sampleFraction ?? 0.4;

  if (
    !Number.isInteger(sampleCount) ||
    sampleCount < 1 ||
    sampleCount > 15
  ) {
    throw new Error("sampleCount must be an integer between 1 and 15.");
  }

  if (
    !Number.isFinite(sampleFraction) ||
    sampleFraction <= 0 ||
    sampleFraction > 1
  ) {
    throw new Error("sampleFraction must be greater than 0 and at most 1.");
  }

  const cellWidth = width / 3;
  const cellHeight = height / 3;

  const centerX = (col + 0.5) * cellWidth;
  const centerY = (row + 0.5) * cellHeight;

  const halfWidth = cellWidth * sampleFraction / 2;
  const halfHeight = cellHeight * sampleFraction / 2;

  const counts = {
    white: 0,
    yellow: 0,
    orange: 0,
    red: 0,
    green: 0,
    blue: 0
  };

  let totalSamples = 0;
  let classifiedSamples = 0;

  for (let sampleRow = 0; sampleRow < sampleCount; sampleRow++) {
    for (let sampleCol = 0; sampleCol < sampleCount; sampleCol++) {
      const x = Math.min(
        width - 1,
        Math.max(
          0,
          Math.floor(
            centerX - halfWidth +
            (sampleCol + 0.5) * (2 * halfWidth) / sampleCount
          )
        )
      );

      const y = Math.min(
        height - 1,
        Math.max(
          0,
          Math.floor(
            centerY - halfHeight +
            (sampleRow + 0.5) * (2 * halfHeight) / sampleCount
          )
        )
      );

      const index = (y * width + x) * 4;

      const color = detectColor(
        data[index],
        data[index + 1],
        data[index + 2]
      );

      totalSamples++;

      if (color !== "unknown") {
        counts[color]++;
        classifiedSamples++;
      }
    }
  }

  let winningColor = "unknown";
  let winningCount = 0;
  let tied = false;

  for (const [color, count] of Object.entries(counts)) {
    if (count > winningCount) {
      winningColor = color;
      winningCount = count;
      tied = false;
    } else if (count > 0 && count === winningCount) {
      tied = true;
    }
  }

  if (tied || winningCount === 0) {
    winningColor = "unknown";
  }

  return {
    color: winningColor,
    confidence: classifiedSamples
      ? winningCount / classifiedSamples
      : 0,
    coverage: totalSamples
      ? classifiedSamples / totalSamples
      : 0,
    counts,
    totalSamples,
    classifiedSamples
  };
}

/**
 * Scan a 3x3 Rubik's Cube face and return detailed sampling results.
 *
 * confidence = winning colour votes / classified pixel votes.
 * coverage = classified pixel votes / all sampled pixels.
 */
function scanFaceDetailed(imageData, options = {}) {
  validateImageData(imageData);

  const colors = [];
  const confidence = [];
  const coverage = [];
  const details = [];

  for (let row = 0; row < 3; row++) {
    const colorRow = [];
    const confidenceRow = [];
    const coverageRow = [];
    const detailRow = [];

    for (let col = 0; col < 3; col++) {
      const result = sampleSticker(imageData, row, col, options);

      colorRow.push(result.color);
      confidenceRow.push(result.confidence);
      coverageRow.push(result.coverage);
      detailRow.push(result);
    }

    colors.push(colorRow);
    confidence.push(confidenceRow);
    coverage.push(coverageRow);
    details.push(detailRow);
  }

  return {
    colors,
    confidence,
    coverage,
    details
  };
}

/**
 * Preserve the original API: return only a 3x3 colour grid.
 */
function scanFace(imageData, options = {}) {
  return scanFaceDetailed(imageData, options).colors;
}

module.exports = {
  scanFace,
  scanFaceDetailed,
  sampleSticker
};
