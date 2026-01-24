// A function passed as an argument to another function
function processUserInput(callback) {
  const name = "Alice";
  callback(name);
}

processUserInput(function (name) {
  console.log("Hello, " + name);
});

// Or with arrow function
processUserInput((name) => console.log("Hello, " + name));
