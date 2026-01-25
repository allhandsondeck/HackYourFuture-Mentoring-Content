export function getLaptopListing() {
  const product1Name = "Laptop";
  const product1Price = 999;
  const product1Tax = product1Price * 0.08;
  const product1Total = product1Price + product1Tax;
  const product1 =
    product1Name.toUpperCase() + " - $" + product1Total.toFixed(2);
  return product1;
}

export function getMouseListing() {
  const product2Name = "Mouse";
  const product2Price = 25;
  const product2Tax = product2Price * 0.08;
  const product2Total = product2Price + product2Tax;
  const product2 =
    product2Name.toUpperCase() + " - $" + product2Total.toFixed(2);
  return product2;
}

export function getKeyboardListing() {
  const product3Name = "Keyboard";
  const product3Price = 75;
  const product3Tax = product3Price * 0.08;
  const product3Total = product3Price + product3Tax;
  const product3 =
    product3Name.toUpperCase() + " - $" + product3Total.toFixed(2);
  return product3;
}

export function logAllProducts() {
  const laptopListing = getLaptopListing();
  const mouseListing = getMouseListing();
  const keyboardListing = getKeyboardListing();
  return [laptopListing, mouseListing, keyboardListing];
}
