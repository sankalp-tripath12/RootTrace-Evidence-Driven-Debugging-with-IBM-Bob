import { applyDiscount } from "./discount.js";

export function calculateSubtotal(items) {
  return items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

export function calculateFinalPrice(items, discountPercent = 0) {
  const subtotal = calculateSubtotal(items);

  // BUG:
  // discountPercent is expressed as 20 for 20%,
  // but applyDiscount expects 0.20.
  return applyDiscount(subtotal, discountPercent);
}
