function processOrder(productName, price, customerName, customerEmail) {
  // Validate
  if (!productName || !price) {
    console.log("Invalid product");
    return;
  }

  // Calculate price with tax
  const tax = price * 0.08;
  const total = price + tax;

  // Generate invoice
  const invoice = `Invoice for ${customerName}
  Product: ${productName}
  Total: $${total}`;

  // Send email
  console.log(`Sending email to ${customerEmail}`);
  console.log(invoice);

  // Save to database
  console.log("Saving to database...");

  // Log
  console.log("Order processed!");
}
