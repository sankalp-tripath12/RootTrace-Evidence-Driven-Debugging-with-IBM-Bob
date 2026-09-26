/**
 * Applies a discount rate to a subtotal.
 *
 * IMPORTANT:
 * discountRate is expected to be a decimal.
 *
 * Example:
 * 20% => 0.20
 */
export function applyDiscount(subtotal, discountRate) {
  if (discountRate < 0 || discountRate > 1) {
    throw new Error("Discount rate must be between 0 and 1");
  }

  return subtotal * (1 - discountRate);
}
