/*
  Pair Exercise: TDD Contact Form Validator

  How this works:
  • Person A writes the failing tests first in a new contactFormValidator.spec.js
  • Person B reads the tests and writes the implementation to make them pass
  • Swap roles for each new function
  • After each round, discuss: was the test clear enough? Was the function easy to test?

  Context:
  Your portfolio's contact form currently accepts any input without checking it.
  Before a message reaches your inbox, you want to catch obvious mistakes on the
  client side — an empty email, a one-word message, that sort of thing.

  Functions to build:

  1. isValidEmail(email)
     - Returns true if the string contains "@" and a "." after the "@"
     - Returns false otherwise

  2. isValidMessage(message)
     - Returns true if the message is at least 10 characters long
     - Returns false otherwise

  3. validateForm(formData)
     - Accepts an object: { email: string, message: string }
     - Returns an object: { isValid: boolean, errors: string[] }
     - errors should list what went wrong, e.g. ["Invalid email", "Message too short"]
     - If everything is valid, errors should be an empty array

  Requirements:
  • Arrow functions only
  • Pure functions — no side effects, no console.log
  • One function = one job
  • validateForm() must call isValidEmail() and isValidMessage() — don't duplicate logic
*/

const exampleFormData = {
  email: "visitor@example.com",
  message: "Hello! I'd love to collaborate on a project with you.",
};

// Start your functions here
