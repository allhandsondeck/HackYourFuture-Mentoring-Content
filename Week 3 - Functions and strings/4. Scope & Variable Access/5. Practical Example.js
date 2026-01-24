function createGreeting(timeOfDay) {
  const prefix = `Good ${timeOfDay}`;

  return function (name) {
    // This inner function can "see" prefix from outer scope
    return `${prefix}, ${name}!`;
  };
}

const morningGreet = createGreeting("morning");
console.log(morningGreet("Alice"));

const eveningGreet = createGreeting("evening");
console.log(eveningGreet("Bob"));
