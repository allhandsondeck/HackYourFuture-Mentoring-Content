# Week 13 Overview

This week we turn a skill students have been doing informally — checking that their code works — into a **systematic practice** using automated tests. Writing tests is how professional developers build confidence in their code, catch bugs before users do, and communicate intent to teammates.

Students will write unit tests using **Vitest**, the same testing framework already set up in this repository. They'll work with a partially broken test suite, complete half-written tests, and finish the week having practised **Test-Driven Development (TDD)** with a partner.

The exercises extend the portfolio directly: the utilities being tested (`formatDate`, `calculateReadingTime`, `slugify`) are real functions a portfolio would use, and the contact form validator mirrors the contact section students built earlier in the course.

### Learning goals

- Understand what unit testing is and why it matters
- Write tests using Vitest's `describe` / `it` / `expect` API
- Read a failing test and use it as a debugging clue
- Experience the TDD "write the test first" workflow with a partner

# Agenda

| Time          | Activity                                     |
| ------------- | -------------------------------------------- |
| 11:00 - 11:15 | 🤝 Introductions & Interactive Quiz          |
| 11:15 - 11:30 | Key Takeaways: Testing & Vitest              |
| 11:30 - 12:00 | Writing Tests for Existing Code              |
| 12:00 - 12:30 | 👥 Pair Exercise: TDD Contact Form Validator |
| 12:30 - 13:00 | 🍱 Lunch Break                               |
| 13:00 - 13:30 | Debugging Activity                           |
| 13:30 - 14:00 | Q&A                                          |

# Lesson Plan

## 🤝 Introductions & Interactive Quiz (11:00 - 11:15)

- [ ] Introductions
- [ ] Kahoot

---

## Key Takeaways: Testing & Vitest (11:15 - 11:30)

- [ ] Slides

---

## Writing Tests for Existing Code (11:30 - 12:00)

Open `Week 13 - Testing & Quality/1. Writing Tests for Existing Code/` and walk students through `portfolioUtils.js`. These are real utilities a portfolio might use — formatting dates for a blog section, estimating how long an article takes to read, generating a URL slug from a title.

Then open `portfolioUtils.spec.js` together. Run `npm test` and show students the **failing test**. Ask them: _"What does this failure tell you about the code?"_ Let them find the bug in `portfolioUtils.js` without giving it away.

Once the bug is fixed and all provided tests pass, students complete the `TODO` test stubs themselves.

```javascript
// portfolioUtils.js

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export function calculateReadingTime(text) {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / 2000); // 🐛 Bug is here — mentor note only
}

export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}
```

```javascript
// portfolioUtils.spec.js (partial — students complete the TODOs)

describe("calculateReadingTime", () => {
  it("returns 1 minute for a short text of 100 words", () => {
    const text = "word ".repeat(100).trim();
    expect(calculateReadingTime(text)).toEqual(1); // ← this test fails on first run
  });
  // ...
});
```

- [ ] Run `npm test` together — one test is already failing
- [ ] Ask trainees: "What does this failure tell you about the code?"
- [ ] Let trainees find and fix the bug in `portfolioUtils.js`
- [ ] Trainees complete the `TODO` tests in `portfolioUtils.spec.js`

> 💡 **Mentor note:** The bug is on the `calculateReadingTime` line — it divides by `2000` instead of `200`. Average reading speed is roughly 200 words per minute, not 2000.

---

## 👥 Pair Exercise: TDD Contact Form Validator (12:00 - 12:30)

Open `Week 13 - Testing & Quality/2. Pair Exercise/contactFormValidator.js`.

This exercise flips the usual order: **write the test before the code**. Pair trainees. Person A creates a new `contactFormValidator.spec.js` and writes a failing test for `isValidEmail`. Person B reads the test and writes the implementation to make it pass. Swap roles for the next function.

```javascript
/*
  Pair Exercise: TDD Contact Form Validator

  Person A writes the failing tests first in a new contactFormValidator.spec.js
  Person B reads the tests and writes the implementation to make them pass
  Swap roles for each new function

  Functions to build:

  1. isValidEmail(email)     — returns true if the string contains "@" and a "." after it
  2. isValidMessage(message) — returns true if the message is at least 10 characters
  3. validateForm(formData)  — returns { isValid: boolean, errors: string[] }
*/

const exampleFormData = {
  email: "visitor@example.com",
  message: "Hello! I'd love to collaborate on a project with you.",
};

// Start your functions here
```

- [ ] Pair trainees and explain the TDD rule: no implementation without a failing test first
- [ ] Circulate — check that Person A is writing tests _before_ Person B writes code
- [ ] Bring both pairs back to share: what was surprising about writing the test first?

---

## 🍱 Lunch Break (12:30 - 13:00)

---

## Group Debugging Activity – Portfolio Testimonials Formatter (13:00 - 13:30)

The scenario: students have added a testimonials section to their portfolio where visitors can leave a star rating and a short comment. A classmate wrote the formatting function, but something keeps crashing whenever it runs.

Ask groups to: **first write a test that fails**, then fix the bug.

```javascript
// reviews.js

export function formatReview(author, rating, comment) {
  const stars = "⭐".repeat(rating);
  const date = new Date().toLocaleDateString("en-GB");
  return `${stars} ${rating}/5 by ${author.toUppercase()} on ${date}: "${comment}"`;
}
```

### Expected Behavior

- `formatReview("Maya", 5, "Incredible work!")` → `⭐⭐⭐⭐⭐ 5/5 by MAYA on 28/03/2026: "Incredible work!"`
- `formatReview("Tom", 3, "Very clean design.")` → `⭐⭐⭐ 3/5 by TOM on 28/03/2026: "Very clean design."`

> ⚠️ The bug is a single character. Before fixing it, can you write a test that proves the function is broken?

- [ ] Give trainees 5 minutes to write a failing test
- [ ] Ask: how does the test failure message help you find the bug?
- [ ] Fix the bug together and confirm the test passes

> 💡 **Mentor note:** `toUppercase()` should be `toUpperCase()` — JavaScript method names are case-sensitive.

---

## Q&A (13:30 - 14:00)

---

## Good to cover

- [ ] The difference between a test that passes and code that is _correct_ — tests only verify what you asked them to verify
- [ ] `toEqual` vs `toBe` — use `toBe` for primitives, `toEqual` for objects and arrays
- [ ] Why testing implementation details makes tests brittle — test _what_ a function does, not _how_
