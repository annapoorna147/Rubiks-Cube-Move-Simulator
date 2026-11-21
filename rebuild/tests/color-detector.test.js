"use strict";

const assert = require("assert");

const {
  rgbToHsv,
  detectColor
} = require("../src/camera/color-detector");

// Test 1: RGB to HSV conversion.
const redHSV = rgbToHsv(255, 0, 0);

assert.strictEqual(redHSV.h, 0);
assert.strictEqual(redHSV.s, 100);
assert.strictEqual(redHSV.v, 100);
console.log("PASS: RGB to HSV conversion");

// Test 2: Detect six standard Rubik's Cube colours.
const colorSamples = [
  [255, 255, 255, "white"],
  [255, 255, 0, "yellow"],
  [255, 128, 0, "orange"],
  [255, 0, 0, "red"],
  [0, 255, 0, "green"],
  [0, 0, 255, "blue"]
];

for (const [r, g, b, expected] of colorSamples) {
  assert.strictEqual(detectColor(r, g, b), expected);
}

console.log("PASS: Six standard cube colours");

// Test 3: Detect very dark pixels.
assert.strictEqual(detectColor(10, 10, 10), "unknown");
console.log("PASS: Very dark pixel rejection");

// Test 4: Reject invalid RGB values.
assert.throws(() => detectColor(-1, 0, 0));
assert.throws(() => detectColor(256, 0, 0));
assert.throws(() => detectColor(NaN, 0, 0));
console.log("PASS: Invalid RGB input rejection");

// Test 5: Convert black to HSV.
const blackHSV = rgbToHsv(0, 0, 0);

assert.strictEqual(blackHSV.s, 0);
assert.strictEqual(blackHSV.v, 0);
console.log("PASS: Black pixel HSV conversion");

// Test 6: Reject neutral grey pixels.
assert.strictEqual(detectColor(128, 128, 128), "unknown");
assert.strictEqual(detectColor(100, 100, 100), "unknown");
console.log("PASS: Neutral grey rejection");

// Test 7: Reject low-saturation coloured pixels.
assert.strictEqual(detectColor(180, 170, 170), "unknown");
console.log("PASS: Low-saturation pixel rejection");

console.log("\nAll 7 colour detector tests passed.");
