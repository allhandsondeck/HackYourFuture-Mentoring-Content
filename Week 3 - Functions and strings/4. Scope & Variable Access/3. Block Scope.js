if (true) {
  let blockVariable = "I'm stuck in this block";
  const alsoBlocked = "Me too!";
  var notBlocked = "I'm free!";
}

console.log(notBlocked); // Works (var is old-school, don't use it)
console.log(blockVariable); // ERROR
console.log(alsoBlocked); // ERROR
