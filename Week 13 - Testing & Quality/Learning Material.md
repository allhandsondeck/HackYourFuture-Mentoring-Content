# Week 13 Overview

By now you've built and styled a real React application. This week you'll learn how to make sure it actually works; not just "I refreshed the browser and it looked fine", but verifiably, repeatably, and automatically.

Testing is one of those topics that developers often skip early in their career and then wish they hadn't. Once you've experienced the confidence of refactoring a utility function while a test suite tells you instantly whether you broke something, you won't want to go back. This week you'll build that habit from the ground up.

You'll learn to think in two distinct layers: unit tests for pure functions where you test inputs and outputs thoroughly, and behavioural tests for React components where you test what a user sees and does rather than how the code is wired. You'll apply both to your portfolio project, which by this point has real components and real logic worth protecting.

The week also covers accessibility testing; making sure your components aren't just functional but actually usable by everyone; plus an introduction to test-driven development, code review practices, and how production error tracking with tools like Sentry fits into the bigger picture of software quality.

## **Learning Goals**

- Set up Vitest and React Testing Library in a Vite + React + TypeScript project
- Write unit tests for pure functions covering happy paths, edge cases, and boundaries
- Test React components by querying the DOM the way a user would, using accessible queries
- Write async tests that handle loading states and API interactions
- Use accessibility-first queries (`getByRole`, `getByLabelText`) and run automated a11y checks with axe
- Apply the red-green-refactor cycle of TDD to a small feature
- Give and receive structured code review feedback on a pull request

# Introduction to Testing

# Why do we test?

You've been building your portfolio for several weeks. It works, you've tested it manually, you've refreshed the browser dozens of times. So why would you need automated tests?

Here's a scenario: you refactor your `filterProjects` utility to support a new feature. You think nothing is broken. But three components silently depend on the exact output shape of that function, and now two of them render nothing. You find out when a reviewer points it out; or worse, when a recruiter opens your portfolio.

Tests are your safety net. They catch regressions before they reach production, give you confidence to refactor, and document how your code is supposed to behave.

> 💡 **Worth knowing:** At most companies, writing tests is not optional. PRs without test coverage will not be merged. Starting to think in tests now is one of the most career-relevant habits you can build.

---

# Two layers of testing

Before writing a single line, let's establish the mental model you'll use all week.

Frontend applications have two distinct things worth testing, and they need different approaches.

## 1. Pure functions; unit tests

A pure function takes inputs and returns outputs with no side effects. These are your utility functions, data transformers, validators, and formatters. For these, you test inputs and outputs **thoroughly**; every edge case, every unexpected input, every boundary.

```tsx
// A pure function — perfect candidate for unit tests
function filterProjectsByTech(projects: Project[], tech: string): Project[] {
  return projects.filter((p) => p.techStack.includes(tech));
}
```

## 2. React components; behavioural tests

Components render UI and respond to user interaction. Here, you test **what the user sees and does**, not how the component is wired internally. You don't care whether it uses `useState` or `useReducer`. You care that when a user submits an empty form, they see an error message.

```tsx
// What we test: the behaviour the user experiences
// NOT: which hook is used, or how state is structured internally
test("shows error when form is submitted empty", async () => {
  // We'll write this in Chapter 2
});
```

> 💡 **Rule of thumb:** If it's a function with inputs and outputs, unit test it thoroughly. If it's a component, test the behaviour a user would notice.

---

# Setting up Vitest

Vitest is a testing framework built specifically for Vite projects. It's fast, shares config with your existing Vite setup, and has a Jest-compatible API; most things you'll read about Jest apply here too.

## Installation

In your portfolio project, run:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

| Package                       | What it does                               |
| ----------------------------- | ------------------------------------------ |
| `vitest`                      | The test runner                            |
| `@testing-library/react`      | Renders React components in tests          |
| `@testing-library/jest-dom`   | Custom matchers like `toBeInTheDocument()` |
| `@testing-library/user-event` | Simulates real user interactions           |
| `jsdom`                       | Simulates a browser DOM in Node.js         |

## Configure Vitest

Open your `vite.config.ts` and add a `test` block:

```tsx
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
```

The `jsdom` environment simulates a browser DOM in Node.js; this is what lets React Testing Library render your components during tests without a real browser.

## Create a setup file

Create `src/test/setup.ts`:

```tsx
import "@testing-library/jest-dom";
```

This registers the custom matchers from `jest-dom` globally, so you can use `toBeInTheDocument()`, `toBeVisible()`, `toHaveValue()`, and others in every test file without importing them manually.

## Add test scripts

In your `package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

> 💡 **`vitest --ui`** opens a browser-based test dashboard. It's optional but genuinely useful once you have more than a handful of tests; you can see which passed, which failed, and re-run individual tests with a click.

## Verify the setup

Create `src/test/setup.test.ts`:

```tsx
test("Vitest is working", () => {
  expect(1 + 1).toBe(2);
});
```

Run `npm test`. Green? You're ready.

---

# Writing your first unit test

Let's write a real test for a real function. Your portfolio has a utility that filters projects by technology; let's test it properly.

## The function

Create `src/utils/filterProjects.ts`:

```tsx
export type Project = {
  id: number;
  title: string;
  techStack: string[];
};

export function filterProjectsByTech(
  projects: Project[],
  tech: string,
): Project[] {
  return projects.filter((p) =>
    p.techStack.map((t) => t.toLowerCase()).includes(tech.toLowerCase()),
  );
}
```

## The test file

Create `src/utils/filterProjects.test.ts`:

```tsx
import { describe, it, expect } from "vitest";
import { filterProjectsByTech, Project } from "./filterProjects";

const projects: Project[] = [
  { id: 1, title: "Portfolio", techStack: ["React", "TypeScript"] },
  { id: 2, title: "Weather App", techStack: ["React", "TailwindCSS"] },
  { id: 3, title: "Blog", techStack: ["Next.js", "TypeScript"] },
];

describe("filterProjectsByTech", () => {
  it("returns projects that include the given tech", () => {
    const result = filterProjectsByTech(projects, "React");
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Portfolio");
  });

  it("is case-insensitive", () => {
    const result = filterProjectsByTech(projects, "typescript");
    expect(result).toHaveLength(2);
  });

  it("returns an empty array when no projects match", () => {
    const result = filterProjectsByTech(projects, "Vue");
    expect(result).toHaveLength(0);
  });

  it("returns an empty array when given an empty list", () => {
    const result = filterProjectsByTech([], "React");
    expect(result).toHaveLength(0);
  });
});
```

## What's happening here

- `describe` groups related tests; use it to organise around a single function or concept
- `it` (or `test`) defines one test case; name it like a sentence: _"it does X when Y"_
- `expect` paired with a matcher (`toBe`, `toHaveLength`, `toEqual`) asserts what the result should be

> 💡 **Naming tests well matters.** When a test fails, the first thing you read is the test name. _"returns an empty array when no projects match"_ tells you exactly what broke. _"test 3"_ tells you nothing.

Notice we tested four distinct cases:

- The happy path (normal input, expected output)
- A variation (case-insensitivity)
- An edge case (no match found)
- A boundary case (empty input array)

This is what _thorough_ means for unit tests. You're not trying to hit every possible string; you're thinking about the **categories of input** that could behave differently.

---

# Additional Resources

## Videos

https://www.youtube.com/watch?v=XdDZKeM5_pQ&list=PL4cUxeGkcC9iyuClsf48SSgsJPBStHo7F

## Reading

- [Vitest – Getting Started](https://vitest.dev/guide/)
- [Testing Library – Introduction](https://testing-library.com/docs/)
- [@testing-library/jest-dom matchers reference](https://github.com/testing-library/jest-dom)

---

# Testing React Components with RTL

# How React Testing Library thinks

React Testing Library has one central philosophy: **test your components the way a user uses them**.

A user doesn't know or care whether your component uses `useState` or `useReducer`. They see a button, they click it, and they expect something to happen. RTL pushes you to write tests that reflect exactly that.

This means you query elements the way a user or assistive technology would find them; by their visible text, their role, or their label; not by class names or internal IDs that could change at any time.

> 💡 **If your test breaks when you rename a CSS class but not when you change the text on a button, something is wrong. RTL queries should reflect what users actually interact with.**

---

# The query hierarchy

RTL gives you several ways to find elements. Use them in this order of preference:

| Query                  | When to use                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| `getByRole`            | Almost always your first choice; buttons, headings, inputs, links |
| `getByLabelText`       | Form inputs associated with a label                               |
| `getByText`            | Non-interactive text content                                      |
| `getByPlaceholderText` | Last resort for inputs without labels                             |
| `getByTestId`          | Only when nothing else works; add `data-testid` to the element    |

> 💡 **`getByRole` and `getByLabelText` are not just convenient; they enforce accessibility. If you can't find your button with `getByRole('button', { name: 'Submit' })`, it likely has an accessibility problem.**

The difference between `getBy`, `queryBy`, and `findBy`:

- `getBy` — throws if the element isn't found; use when the element should be there
- `queryBy` — returns `null` if not found; use when asserting something is _absent_
- `findBy` — returns a Promise; use for elements that appear asynchronously

---

# Testing a component: ProjectCard

Let's start with something straightforward. A `ProjectCard` component receives a project as a prop and renders its title, description, and a link to the live demo.

## The component

```tsx
// src/components/ProjectCard.tsx
type Props = {
  title: string;
  description: string;
  demoUrl: string;
  techStack: string[];
};

export function ProjectCard({ title, description, demoUrl, techStack }: Props) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
        {techStack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <a href={demoUrl}>View demo</a>
    </article>
  );
}
```

## The test file

```tsx
// src/components/ProjectCard.test.tsx
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";

const defaultProps = {
  title: "Portfolio",
  description: "My personal portfolio site",
  demoUrl: "https://example.com",
  techStack: ["React", "TypeScript"],
};

describe("ProjectCard", () => {
  it("renders the project title", () => {
    render(<ProjectCard {...defaultProps} />);
    expect(
      screen.getByRole("heading", { name: "Portfolio" }),
    ).toBeInTheDocument();
  });

  it("renders all tech stack items", () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders a link to the demo", () => {
    render(<ProjectCard {...defaultProps} />);
    const link = screen.getByRole("link", { name: "View demo" });
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});
```

A few things worth noticing:

- `render` mounts the component into the jsdom environment
- `screen` is your access point to the rendered DOM; always use `screen` rather than destructuring from `render`
- We're using `defaultProps` to avoid repeating the same props in every test; override only what a specific test needs

---

# Testing user interaction: ContactForm

Now let's test something with actual user interaction. A contact form has inputs, a submit button, and validation messages; perfect for testing behaviour.

## The component

```tsx
// src/components/ContactForm.tsx
import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      setError("Please fill in all fields");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return <p>Thanks for reaching out, {name}!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Send message</button>
    </form>
  );
}
```

## The test file

```tsx
// src/components/ContactForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  it("renders the form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send message" }),
    ).toBeInTheDocument();
  });

  it("shows an error when submitted with empty fields", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please fill in all fields",
    );
  });

  it("shows a success message after valid submission", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Anna");
    await user.type(screen.getByLabelText("Email"), "anna@example.com");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(
      screen.getByText("Thanks for reaching out, Anna!"),
    ).toBeInTheDocument();
  });
});
```

> 💡 **Always use `userEvent` over `fireEvent` for simulating interactions.** `userEvent.type` simulates real keystrokes including focus, input, and change events. `fireEvent` is a lower-level utility that skips several of those steps and can give you false positives.

> ⚠️ **`userEvent.setup()` must be called before `render`.** It sets up a user session that properly handles pointer and keyboard events. Calling it after render can cause subtle timing issues.

> 📝 **Note for instructors:** The component examples above use a basic `useState` form. If trainees have already built their contact form with React Hook Form (introduced in week 9), encourage them to test that version instead. The queries and assertions stay the same; only the component internals differ.

---

# Async testing

Sometimes your component fetches data or waits for something before rendering. For these cases you need `findBy` queries and `waitFor`.

## Mocking API calls with vi.mock

In tests, you never want to make real network requests. They're slow, unreliable, and you can't control what they return. Instead, you mock the module responsible for fetching.

Here's a component that fetches and displays projects:

```tsx
// src/components/ProjectList.tsx
import { useEffect, useState } from "react";
import { fetchProjects } from "../api/projects";

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading projects...</p>;

  return (
    <ul>
      {projects.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

And the test:

```tsx
// src/components/ProjectList.test.tsx
import { render, screen } from "@testing-library/react";
import { ProjectList } from "./ProjectList";
import { fetchProjects } from "../api/projects";

vi.mock("../api/projects");

const mockFetchProjects = vi.mocked(fetchProjects);

describe("ProjectList", () => {
  it("shows a loading state initially", () => {
    mockFetchProjects.mockResolvedValue([]);
    render(<ProjectList />);
    expect(screen.getByText("Loading projects...")).toBeInTheDocument();
  });

  it("renders projects after loading", async () => {
    mockFetchProjects.mockResolvedValue([
      { id: 1, title: "Portfolio" },
      { id: 2, title: "Weather App" },
    ]);

    render(<ProjectList />);

    expect(await screen.findByText("Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Weather App")).toBeInTheDocument();
  });
});
```

`vi.mock('../api/projects')` replaces the entire module with an auto-mocked version. `vi.mocked()` gives you TypeScript-aware access to the mock so you can control what it returns per test with `mockResolvedValue`.

> ⚠️ **`findByText` (note the `find`) returns a Promise and will wait up to 1000ms for the element to appear. Use `findBy` whenever you're waiting for something async to resolve.**

---

# Additional Resources

## Videos

https://www.youtube.com/watch?v=7dTTFW7yACQ&list=PL4cUxeGkcC9gm4_-5UsNmLqMosM-dzuvQ

## Reading

- [Testing Library – Queries](https://testing-library.com/docs/queries/about)
- [Testing Library – user-event](https://testing-library.com/docs/user-event/intro)
- [Common mistakes with RTL – Kent C. Dodds](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Vitest – Mocking](https://vitest.dev/guide/mocking)

---

# Software Quality in Practice

# Accessibility testing

You've already been writing accessible tests without fully realising it. Every time you reached for `getByRole` or `getByLabelText`, you asserted that an element is reachable the same way a screen reader or keyboard user would reach it. That's the first layer of accessibility testing, and it's almost free; it falls straight out of querying the way RTL encourages.

But accessible queries only check the elements you happen to query. They won't catch a button with no accessible name three components over, an image missing its `alt` text, or body text with too little colour contrast. For that broader sweep you bring in an automated accessibility checker: **axe**.

## What axe does, and what it doesn't

`axe-core` is the engine behind most accessibility tooling, including the axe DevTools browser extension and parts of Lighthouse. It scans rendered DOM against a large ruleset; missing form labels, invalid ARIA, duplicate IDs, insufficient contrast, broken heading structure; and reports every violation it finds.

> ⚠️ **Automated checks catch roughly 30–50% of accessibility issues.** axe is excellent at the mechanical, rule-based problems, but it cannot tell you whether your tab order makes sense, whether focus moves somewhere sensible after an action, or whether an error is actually announced to a screen reader. Treat axe as a fast first pass, never a certificate of accessibility; keyboard testing and a real screen reader still matter.

## Setting it up

For a Vitest project, install `vitest-axe`:

```bash
npm install --save-dev vitest-axe
```

Register its matcher in your `src/test/setup.ts`, right alongside `jest-dom`:

```tsx
import "@testing-library/jest-dom";
import * as axeMatchers from "vitest-axe/matchers";
import { expect } from "vitest";

expect.extend(axeMatchers);
```

This adds a single new matcher, `toHaveNoViolations()`, to every test file.

## Writing an accessibility test

You render the component, run axe against its container, and assert there are no violations:

```tsx
// src/components/ContactForm.a11y.test.tsx
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ContactForm } from "./ContactForm";

it("has no accessibility violations", async () => {
  const { container } = render(<ContactForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

If that form had an input with no associated `<label>`, this test would fail with a message naming the exact element and the rule it broke. Fixing the test means fixing the accessibility problem; precisely the incentive you want.

> 💡 **You don't need an axe test for every component.** Add them where structure and interaction are real: forms, navigation, modals, cards with links. A handful of well-placed accessibility tests catches the regressions that actually reach users.

> 💡 **Key takeaway:** Accessible queries and axe reinforce each other. If your component is easy to find by role and label, it already satisfies many of axe's rules; accessibility is a property of well-structured components, not a chore you bolt on at the end.

---

# Test-Driven Development

So far you've written tests _after_ the code: the function exists, then you test it. **Test-Driven Development (TDD)** flips that order. You write the test first, watch it fail, then write just enough code to make it pass. It feels backwards until you try it, and then it quietly changes how you work.

## The red-green-refactor cycle

TDD is a loop of three short steps:

1. **Red** — Write a test for behaviour that doesn't exist yet. Run it; it fails (red), because there's nothing to satisfy it. This proves the test can actually fail, which means it's testing something real.
2. **Green** — Write the simplest code that makes the test pass. Not the elegant version; the simplest one. Get to green fast.
3. **Refactor** — Now that you're green, improve the code: rename, deduplicate, simplify; with the test standing guard so you'll know instantly if you break it.

Then you go around again, one small behaviour at a time. **Red → Green → Refactor**, repeat.

> 💡 **Why write the test first?** It forces you to decide what "done" looks like before you disappear into implementation details. It guarantees the code is testable, because you literally cannot write untestable code this way. And you never end up with code that has no test, because the test came first.

## A worked example

Say your portfolio shows contributor avatars, and when there's no image you want to fall back to the person's initials. Let's build `getInitials` the TDD way.

**Red.** Write the failing test before any implementation:

```tsx
// src/utils/getInitials.test.ts
import { describe, it, expect } from "vitest";
import { getInitials } from "./getInitials";

describe("getInitials", () => {
  it("returns the first letter of each name, uppercased", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
  });
});
```

Run it. It fails; `getInitials` doesn't exist yet. Seeing red first is the whole point: it proves the test is wired up and genuinely checks something.

**Green.** Write the simplest thing that passes:

```tsx
// src/utils/getInitials.ts
export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((part) => part[0].toUpperCase())
    .join("");
}
```

Run again; green.

**Refactor and extend.** Now drive out the edge cases the same way; each one starts as a fresh failing test:

```tsx
it("handles a single name", () => {
  expect(getInitials("Cher")).toBe("C");
});

it("ignores extra whitespace", () => {
  expect(getInitials("  Grace   Hopper  ")).toBe("GH");
});
```

The whitespace test goes red, because `"  Grace   Hopper  ".split(" ")` produces empty strings that blow up on `part[0]`. Now you have a concrete reason to improve the implementation, and a test that proves the fix works:

```tsx
export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0].toUpperCase())
    .join("");
}
```

Green again. Every loop added exactly one behaviour, and you never wrote a line of implementation that wasn't demanded by a failing test.

> ⚠️ **The discipline is the point.** It is tempting to skip "red" and just write the code. But if you never watch the test fail, you don't actually know it _can_ fail; a test that passes against missing or broken code is worse than no test at all. Always go red first.

## You'll practise this

The week's pair exercise is pure TDD: one partner writes a failing test for the contact form validator, the other writes just enough code to make it pass, then you swap roles. Resist the urge to write the implementation first. The entire point is to feel how writing the test first shapes the code you end up with.

---

# Code review

Tests prove your code does what you said. **Code review** is where another human checks whether you said the right thing; whether the approach is sound, the names are clear, the edge cases are handled, and yes, whether it's tested. On a professional team, almost no code reaches production without it.

The vehicle for this is the **pull request (PR)**: you push your branch, open a PR describing what changed and why, and teammates review it before it merges. You've opened PRs before; this week the focus is on the _quality of the conversation_ inside them.

## Giving good feedback

A good review comment is specific, kind, and actionable. You are reviewing the code, never the person.

- **Separate must-fix from nice-to-have.** Label comments so the author knows what's blocking. A common convention:
  - `blocking:` this needs to change before merge
  - `suggestion:` I'd prefer this, but it's your call
  - `nit:` tiny or stylistic, totally optional
  - `question:` I'm trying to understand, not criticising
- **Explain the why, and offer a path.** "This will break on an empty array" beats "this is wrong", and "…consider guarding with `if (!items.length) return []`" is better still.
- **Praise what's good.** "Nice, this test name reads really clearly" costs nothing and makes review somewhere people want to be.
- **Ask, don't command.** "What happens if `user` is null here?" invites a fix without putting anyone on the defensive.

Compare:

```text
❌ "This is messy. Why didn't you handle the error?"

✅ "question: what should happen if fetchProjects() rejects here?
    Right now the loading state would hang forever. Maybe a catch
    that sets an error message? Happy to pair on it."
```

## Receiving feedback well

- **Assume good intent.** Reviewers are trying to make the code better, not to judge you. Feedback is a gift, even when it stings a little.
- **Respond to every comment.** Resolve it, or reply with your reasoning. Silence leaves the reviewer guessing.
- **It's fine to disagree; do it with reasoning.** "I kept the `for` loop because we mutate two arrays here and `reduce` got harder to read; open to it if you feel strongly." A PR is a conversation, not a verdict.
- **Say thank you.** Reviewing takes real time and attention.

> 💡 **Tests make reviews better.** When your PR includes tests, the reviewer can see the behaviour you intended and trust that it works. A reviewer's most powerful question is often simply: _"Is there a test for that?"_

## A lightweight review checklist

When you review a classmate's PR this week, look for:

- Does it actually do what the PR description says?
- Are the names clear, and is the code readable without a verbal explanation?
- Are edge cases and error states handled?
- Is the new behaviour covered by a test?
- Would I be comfortable maintaining this in six months?

> ⚠️ **"LGTM" without reading isn't a review.** Rubber-stamping a PR helps no one and quietly erodes trust in the whole process. If you approve it, you're vouching for it.

---

# Error tracking in production

Tests run before you ship. They catch the bugs you thought to check for, in an environment you control. But production is messy: real users on browsers you've never tested, flaky networks, data shapes you didn't anticipate. Something _will_ slip through eventually. The only question is whether you hear about it from your tools, or from an annoyed message weeks later.

**Error tracking** (also called error monitoring) closes that gap. A tool like **Sentry** sits inside your deployed app, captures unhandled errors as they happen to real users, and sends you the full picture: the stack trace, the browser and operating system, the sequence of actions that led there (breadcrumbs), and how many users were hit.

## How it fits in a React app

The setup is small. You install the SDK and initialise it once, near your app's entry point:

```bash
npm install @sentry/react
```

```tsx
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, // comes from your Sentry project
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});
```

From then on, an error that would otherwise vanish into a user's console gets reported to your Sentry dashboard. You can also wrap part of your UI in Sentry's error boundary, so a crash shows a friendly fallback instead of a blank screen while still being reported:

```tsx
<Sentry.ErrorBoundary fallback={<p>Something went wrong. We're on it.</p>}>
  <App />
</Sentry.ErrorBoundary>
```

> 💡 **Tests and monitoring are two halves of quality.** Tests prevent the regressions you can imagine; monitoring catches the failures you couldn't. Mature teams invest in both: a green test suite before merge, and eyes on production after deploy.

You don't need to wire up Sentry for your portfolio to pass this week. But knowing this category of tool exists, and why every serious product runs something like it, is part of thinking about quality the way a professional does.

---

# Additional Resources

## Reading

- [axe-core – accessibility rules](https://github.com/dequelabs/axe-core)
- [Testing Library – Accessibility](https://testing-library.com/docs/dom-testing-library/api-accessibility/)
- [web.dev – Learn Accessibility](https://web.dev/learn/accessibility/)
- [Martin Fowler – Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Google Engineering Practices – How to do a code review](https://google.github.io/eng-practices/review/)
- [Conventional Comments](https://conventionalcomments.org/)
- [Sentry – React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)

---

# Wrapping up

Step back and look at what you can now do. You can take a pure function and pin its behaviour down with thorough unit tests. You can test a component the way a user experiences it, including the asynchronous parts. You can run an accessibility pass with axe, drive a small feature with TDD, review a teammate's pull request like a professional, and explain where production monitoring fits in. That's the full quality toolkit for a frontend developer.

The mindset underneath all of it: **quality is a habit, not a final step.** You don't build the app and then "do testing". You build the safety net as you go, so you can move faster with more confidence.

## Bringing it back to your portfolio

Your assignment this week is to make your portfolio _verifiably_ good, not just good-looking:

- Add unit tests for at least two utility functions; date formatting, filtering, slugifying, whatever yours has.
- Add component tests for one or two key components; your project card and your contact form are perfect candidates.
- Add at least one accessibility test with axe.
- Open a pull request for your changes and exchange reviews with a classmate, practising the feedback habits from this chapter.

> 💡 **The goal isn't 100% coverage.** It's confidence; a portfolio you can refactor without fear, hand to a reviewer with pride, and trust to work for every visitor. That's what these tests buy you.
