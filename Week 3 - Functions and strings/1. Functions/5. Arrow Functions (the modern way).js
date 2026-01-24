// Traditional
// const add = function (a, b) {
//   return a + b;
// };

// Arrow function - same thing, shorter
// const add = (a, b) => {
//   return a + b;
// };
//
// // Even shorter! (when you just return something)
// const add = (a, b) => a + b;

// One parameter? Skip parentheses
const double = (x) => x * 2;

// No parameters? Need empty parentheses
const sayHi = () => console.log("Hi!");

console.log(add(5, 3));

console.log(double(5));

console.log(sayHi(5));