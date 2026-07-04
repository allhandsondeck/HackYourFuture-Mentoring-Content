# Week 13 Assignment

This week's assignment is about proving your portfolio actually works, not just that it looks right. You'll add tests to real code you already have, practise TDD on one new feature, and take part in a code review with a classmate.

## Task 1 - Unit test your portfolio utilities

### Requirements

- Pick at least two pure functions already in your portfolio (a date formatter, a filter, a slugify function, or similar)
- Create a matching `<functionName>.test.ts` file for each
- Cover the happy path, at least one edge case, and at least one boundary value for each function
- Use `describe` / `it` / `expect`, following the conventions from this week's material

## Task 2 - Component tests with React Testing Library

### Requirements

- Pick one or two key components from your portfolio (for example, your project card or your contact form)
- Query elements using `getByRole` or `getByLabelText` — not class names or `data-testid`
- At least one test must cover a user interaction, simulated with `userEvent`
- If the component fetches data, mock the request with `vi.mock` and assert on the resolved state using `findBy`

## Task 3 - TDD a new small feature

### Requirements

- Add one small utility function your portfolio doesn't have yet — ideas: `formatFileSize`, `truncateText`, `isValidUrl`, `getRelativeTime` (e.g. "2 days ago"), or something of your own
- Write the failing test before writing any implementation
- Implement the simplest code that makes the test pass
- Add at least one more test for an edge case, and refactor the implementation once it's green

> 💡 Your PR description for this task should mention which test you wrote first and that you saw it fail before writing the implementation.

## Task 4 - An accessibility test

### Requirements

- Install `vitest-axe` if you haven't already
- Write at least one test asserting `toHaveNoViolations()` against a component with real structure — a form, a nav, or a card with a link
- If axe reports a violation, fix it before submitting

## Task 5 - Code review

### Requirements

- Open a pull request containing this week's changes
- Exchange reviews with a classmate: leave at least one comment using a clear label (`blocking:`, `suggestion:`, `nit:`, or `question:`)
- Respond to every comment left on your own PR, even if just to explain your reasoning

---

## Submission

Follow the Assignment submission guide to learn how to submit the assignment
