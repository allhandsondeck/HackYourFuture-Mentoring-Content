function createUserDisplay(name) {
  const email = name.toLowerCase() + "@company.com";
  return `Name: ${name}, Email: ${email}`;
}

console.log(createUserDisplay("Alice"));
console.log(createUserDisplay("Bob"));
console.log(createUserDisplay("Charlie"));
