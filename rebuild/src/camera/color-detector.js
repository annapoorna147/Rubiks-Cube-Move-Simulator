"use strict";

// Convert RGB values (0–255) into HSV.
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  const s = max === 0 ? 0 : delta / max;
  const v = max;

  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }

  if (h < 0) h += 360;

  return {
    h,
    s: s * 100,
    v: v * 100
  };
}

// Detect one of the six Rubik's Cube colors.
function detectColor(r, g, b) {
  if (![r, g, b].every(
    value => Number.isFinite(value) && value >= 0 && value <= 255
  )) {
    throw new Error("RGB values must be between 0 and 255.");
  }

  const { h, s, v } = rgbToHsv(r, g, b);

  // Very dark pixels.
  if (v < 15) return "unknown";

  // Conservative white detection.
  if (s < 15 && v > 80) return "white";

  // Reject grey and low-saturation pixels.
  // Their hue is unreliable for colour classification.
  if (s < 25) return "unknown";

  // Yellow.
  if (h >= 40 && h < 75) return "yellow";

  // Orange.
  if (h >= 15 && h < 40) return "orange";

  // Red.
  if (h >= 345 || h < 15) return "red";

  // Green.
  if (h >= 75 && h < 170) return "green";

  // Blue.
  if (h >= 170 && h < 270) return "blue";

  return "unknown";
}

module.exports = {
  rgbToHsv,
  detectColor
};
