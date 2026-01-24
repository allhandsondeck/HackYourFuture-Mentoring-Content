const message = "Hello, World!";

// How long is it?
console.log(message.length);

// Make it lowercase
console.log(message.toLowerCase());

// Make it uppercase
console.log(message.toUpperCase());

// Does it contain something?
console.log(message.includes("World"));
console.log(message.includes("Goodbye"));

// Get part of it
console.log(message.slice(0, 5));
console.log(message.slice(7));

// Split it into pieces
const words = message.split(", ");
console.log(words);
