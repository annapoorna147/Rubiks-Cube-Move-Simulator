
"use strict";

const { detectColor } = require("./color-detector");

/**
 * Scan a 3x3 Rubik's Cube face from image pixel data.
 *
 * @param {Object} imageData - ImageData-like object.
 * @param {number} imageData.width - Image width.
 * @param {number} imageData.height - Image height.
 * @param {Uint8ClampedArray|Array} imageData.data - RGBA pixels.
 * @returns {string[][]} A 3x3 grid of detected colors.
 */
function scanFace(imageData) {
  if (
    !imageData ||
    !Number.isInteger(imageData.width) ||
    !Number.isInteger(imageData.height) ||
    imageData.width < 3 ||
    imageData.height < 3 ||
    !imageData.data
  ) {
    throw new Error("Invalid image data.");
  }

  const { width, height, data } = imageData;

  if (data.length !== width * height * 4) {
    throw new Error("Pixel data length does not match image dimensions.");
  }

  const face = [];

  for (let row = 0; row < 3; row++) {
    const faceRow = [];

    for (let col = 0; col < 3; col++) {
      // Sample the center of each cell.
      const x = Math.min(
        width - 1,
        Math.floor((col + 0.5) * width / 3)
      );

      const y = Math.min(
        height - 1,
        Math.floor((row + 0.5) * height / 3)
      );

      const index = (y * width + x) * 4;

      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];

      faceRow.push(detectColor(r, g, b));
    }

    face.push(faceRow);
  }

  return face;
}

module.exports = {
  scanFace
};
