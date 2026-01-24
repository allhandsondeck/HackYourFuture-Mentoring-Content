function calculateTotal(productName, price) {
  const tax = price * 0.08;
  const total = price + tax;
  return `${productName}: $${total.toFixed(2)}`;
}

console.log(calculateTotal("Laptop", 999));
console.log(calculateTotal("Mouse", 25));
