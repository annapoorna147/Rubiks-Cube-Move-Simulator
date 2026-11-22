"use strict";

const assert = require("assert");

const {
  scanFace,
  scanFaceDetailed
} = require("../src/camera/face-scanner");

function createImageData(width = 90, height = 90, rgb = [0, 255, 0]) {
  const data = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    data[i * 4] = rgb[0];
    data[i * 4 + 1] = rgb[1];
    data[i * 4 + 2] = rgb[2];
    data[i * 4 + 3] = 255;
  }

  return { width, height, data };
}

function setPixel(image, x, y, rgb) {
  const index = (y * image.width + x) * 4;

  image.data[index] = rgb[0];
  image.data[index + 1] = rgb[1];
  image.data[index + 2] = rgb[2];
}

function getCenterSampleCoordinates() {
  const coordinates = [];

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      coordinates.push({
        x: Math.floor(45 - 6 + (col + 0.5) * 12 / 5),
        y: Math.floor(45 - 6 + (row + 0.5) * 12 / 5)
      });
    }
  }

  return coordinates;
}

// Test 1: Uniform face produces a 3x3 colour grid.
const uniformImage = createImageData();
const uniformResult = scanFace(uniformImage);

assert.strictEqual(uniformResult.length, 3);
assert.strictEqual(uniformResult[0].length, 3);
assert.ok(uniformResult.flat().every(color => color === "green"));

console.log("PASS: Uniform face scanning");

// Test 2: Detailed scan returns confidence and coverage grids.
const detailedResult = scanFaceDetailed(uniformImage);

assert.strictEqual(detailedResult.colors.length, 3);
assert.strictEqual(detailedResult.confidence.length, 3);
assert.strictEqual(detailedResult.coverage.length, 3);
assert.strictEqual(detailedResult.confidence[1][1], 1);
assert.strictEqual(detailedResult.coverage[1][1], 1);

console.log("PASS: Confidence and coverage calculation");

// Test 3: Majority voting handles noisy pixels.
const noisyImage = createImageData(90, 90, [255, 0, 0]);
const coordinates = getCenterSampleCoordinates();

coordinates.slice(0, 15).forEach(({ x, y }) => {
  setPixel(noisyImage, x, y, [0, 255, 0]);
});

const noisyResult = scanFaceDetailed(noisyImage);

assert.strictEqual(noisyResult.colors[1][1], "green");
assert.strictEqual(noisyResult.confidence[1][1], 0.6);
assert.strictEqual(noisyResult.coverage[1][1], 1);

console.log("PASS: Majority voting handles noisy pixels");

// Test 4: Unknown pixels are excluded from colour voting.
const darkImage = createImageData(90, 90, [0, 0, 0]);
const darkResult = scanFaceDetailed(darkImage);

assert.strictEqual(darkResult.colors[1][1], "unknown");
assert.strictEqual(darkResult.confidence[1][1], 0);
assert.strictEqual(darkResult.coverage[1][1], 0);

console.log("PASS: Unknown pixel rejection");

// Test 5: Tied votes are not guessed.
const tiedImage = createImageData(90, 90, [255, 0, 0]);

coordinates.slice(0, 12).forEach(({ x, y }) => {
  setPixel(tiedImage, x, y, [0, 255, 0]);
});

setPixel(tiedImage, coordinates[24].x, coordinates[24].y, [0, 0, 0]);

const tiedResult = scanFaceDetailed(tiedImage);

assert.strictEqual(tiedResult.colors[1][1], "unknown");
assert.strictEqual(tiedResult.confidence[1][1], 0.5);
assert.strictEqual(tiedResult.coverage[1][1], 0.96);

console.log("PASS: Tied colour votes return unknown");

// Test 6: Invalid sample count is rejected.
assert.throws(
  () => scanFaceDetailed(uniformImage, { sampleCount: 0 }),
  /sampleCount/
);

console.log("PASS: Invalid sampling options rejected");

// Test 7: Invalid image dimensions are rejected.
assert.throws(
  () => scanFaceDetailed({ width: 2, height: 2, data: [] }),
  /Invalid image data/
);

console.log("PASS: Invalid image data rejected");

console.log("\nAll 7 face scanner tests passed.");
