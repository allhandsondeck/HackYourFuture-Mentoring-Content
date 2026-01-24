// Pure: same input = same output, every time
const add = (a, b) => a + b;
add(2, 3); // Always 5
add(2, 3); // Always 5

const getFullName = (first, last) => `${first} ${last}`;
getFullName("Alice", "Smith"); // Always "Alice Smith"

// IMPURE EXAMPLES
// Impure: depends on external variable
let taxRate = 0.08;
const calculateTax = (price) => price * taxRate; // What if taxRate changes?

// Impure: modifies external state
let count = 0;
const increment = () => {
  count++; // Changing something outside!
  return count;
};

// Impure: different output each time
const getRandomNumber = () => Math.random();
