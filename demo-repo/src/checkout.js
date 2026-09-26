import { calculateFinalPrice } from "./pricing.js";

const cart = [
  {
    name: "Keyboard",
    price: 100,
    quantity: 1
  },
  {
    name: "Mouse",
    price: 50,
    quantity: 1
  }
];

const discountPercent = 20;

const finalPrice = calculateFinalPrice(cart, discountPercent);

console.log(`Final price: $${finalPrice}`);
