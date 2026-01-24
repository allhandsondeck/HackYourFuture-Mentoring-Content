const global = "I'm global";

function outer() {
  const outerVar = "I'm in outer";

  function inner() {
    const innerVar = "I'm in inner";

    console.log(innerVar); // ✓ Found it here
    console.log(outerVar); // ✓ Look one level up, found it
    console.log(global); // ✓ Look two levels up, found it
  }

  inner();
  console.log(innerVar); // ✗ Can't look DOWN, only UP
}

outer();
