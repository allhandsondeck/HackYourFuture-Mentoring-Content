function calculateTotal(price, taxRate = 0.08) {
  return price + price * taxRate;
}

function createInvoice(customerName, productName, total) {
  return `Invoice for ${customerName}
Product: ${productName}
Total: $${total.toFixed(2)}`;
}

function processOrder(productName, price, customerName, customerEmail) {
  if (!productName || !price) {
    console.log("Invalid product");
    return;
  }

  const total = calculateTotal(price);
  const invoice = createInvoice(customerName, productName, total);

  console.log(`Sending email to ${customerEmail}`);
  console.log(invoice);
  console.log("Saving to database...");
  console.log("Order processed!");
}
