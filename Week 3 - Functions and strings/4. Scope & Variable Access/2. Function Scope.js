function greet() {
  const secretMessage = "I only exist inside this function";
  console.log(secretMessage); // Works
}

greet();
console.log(secretMessage); // ERROR! secretMessage is not defined
