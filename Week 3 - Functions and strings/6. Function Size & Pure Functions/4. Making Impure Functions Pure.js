// Instead of this (impure)
let discount = 0.1;
function applyDiscount(price) {
  return price - price * discount;
}

// Do this (pure)
function applyDiscount(price, discount) {
  return price - price * discount;
}

const finalPrice = applyDiscount(100, 0.1);
