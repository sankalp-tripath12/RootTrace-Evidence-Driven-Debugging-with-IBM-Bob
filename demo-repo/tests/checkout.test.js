import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateSubtotal,
  calculateFinalPrice
} from "../src/pricing.js";

test("calculates subtotal correctly", () => {
  const items = [
    { name: "Keyboard", price: 100, quantity: 1 },
    { name: "Mouse", price: 50, quantity: 1 }
  ];

  assert.equal(calculateSubtotal(items), 150);
});

test("calculates final price without discount", () => {
  const items = [
    { name: "Keyboard", price: 100, quantity: 1 },
    { name: "Mouse", price: 50, quantity: 1 }
  ];

  assert.equal(calculateFinalPrice(items, 0), 150);
});

test("calculates final price with 20 percent discount", () => {
  const items = [
    { name: "Keyboard", price: 100, quantity: 1 },
    { name: "Mouse", price: 50, quantity: 1 }
  ];

  const result = calculateFinalPrice(items, 20);

  assert.equal(result, 120);
});
