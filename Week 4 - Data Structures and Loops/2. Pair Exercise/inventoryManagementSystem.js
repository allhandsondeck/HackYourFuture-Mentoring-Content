/*
  Build an inventory management system using array methods:
  
  1. getInStockProducts(products) 
     - Return array of products where inStock is true
     - Use: filter()
  
  2. getProductNames(products)
     - Return array of product names in uppercase
     - Use: map()
  
  3. findProductByName(products, name)
     - Return the first product matching the name (case-insensitive)
     - Use: find()
  
  4. getTotalInventoryValue(products)
     - Return sum of (price × quantity) for all products
     - Use: reduce()
  
  5. getExpensiveProducts(products, minPrice)
     - Return products with price >= minPrice, sorted by price (highest first)
     - Use: filter() and sort()
  
  6. getLowStockAlert(products, threshold)
     - Return array of product names where quantity < threshold AND inStock is true
     - Use: filter() and map()
  
  Requirements:
  • Use the specified array methods
  • Pure functions (don't modify original array)
  • Template literals where appropriate
*/

const inventory = [
  { name: "laptop", price: 999, quantity: 5, inStock: true },
  { name: "mouse", price: 25, quantity: 50, inStock: true },
  { name: "keyboard", price: 75, quantity: 20, inStock: true },
  { name: "monitor", price: 300, quantity: 0, inStock: false },
  { name: "webcam", price: 80, quantity: 3, inStock: true },
  { name: "headphones", price: 150, quantity: 8, inStock: true },
];

// Start your functions here
