# Week 14 Overview

This is the final week of the curriculum. Students already have a live portfolio on Vercel — now they learn what happens **before** code reaches production: automated quality checks, environment configuration, and deployment pipelines.

They'll read and fix a broken GitHub Actions workflow, build environment-aware utility functions that their Next.js portfolio can actually use, and confront a real security mistake that is alarmingly common in production code.

### Learning goals

- Understand what CI/CD means and why teams rely on it
- Read and fix a GitHub Actions workflow (`.yml` file)
- Understand environment variables and the difference between development and production
- Recognise the risk of leaking secrets in API responses

# Agenda

| Time          | Activity                                          |
| ------------- | ------------------------------------------------- |
| 11:00 - 11:15 | 🤝 Introductions & Interactive Quiz               |
| 11:15 - 11:30 | Key Takeaways: CI/CD & Deployment                 |
| 11:30 - 12:00 | Fixing a Broken CI Pipeline                       |
| 12:00 - 12:30 | 👥 Pair Exercise: Environment-Aware Configuration |
| 12:30 - 13:00 | 🍱 Lunch Break                                    |
| 13:00 - 13:30 | Debugging Activity                                |
| 13:30 - 14:00 | Q&A                                               |

# Lesson Plan

## 🤝 Introductions & Interactive Quiz (11:00 - 11:15)

- [ ] Introductions
- [ ] Kahoot

---

## Key Takeaways: CI/CD & Deployment (11:15 - 11:30)

- [ ] Slides

---

## Fixing a Broken CI Pipeline (11:30 - 12:00)

Open `Week 14 - Deployment & CI/CD/1. Fixing a Broken CI Pipeline/ci.yml`.

This is a GitHub Actions workflow meant to run tests and build the project automatically on every push to `main` — but it has **4 bugs**. Give trainees 5 minutes to read the file carefully without running it. Ask them to spot as many bugs as they can before going through them together.

```yaml
name: CI

on:
  push:
    branches:
      - master # ❌ Bug 1

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: latest # ❌ Bug 2

      # ❌ Bug 3 — something is missing here before the next step

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run buld # ❌ Bug 4
```

### The 4 Bugs

1. **Wrong branch name** — `master` should be `main`. The workflow never triggers on their actual default branch.
2. **Unpinned Node version** — `latest` changes unexpectedly between runs. Pin to a specific version like `20`.
3. **Missing install step** — `npm ci` must run before `npm test`. Without it, there are no `node_modules`.
4. **Typo in build script** — `buld` should be `build`. The pipeline would fail every single deployment.

- [ ] Let trainees spot bugs before revealing them
- [ ] Discuss: why does the **order** of steps matter?
- [ ] Ask: what would happen if the install step ran _after_ the test step?
- [ ] Ask: what is the difference between `npm install` and `npm ci` in a CI environment?

---

## 👥 Pair Exercise: Environment-Aware Configuration (12:00 - 12:30)

Open `Week 14 - Deployment & CI/CD/2. Pair Exercise/deploymentConfig.js`.

This extends the portfolio directly: students build the config utilities that determine whether their Next.js app is running locally or in production on Vercel. Person A builds `isProduction()` and `getApiUrl()`, Person B reviews and tests them. Then swap for `getConfig()`.

```javascript
/*
  Your portfolio is live on Vercel. In production it uses a real API endpoint,
  but during local development you want it to point to localhost instead.
  You also want to show a "⚠️ Development Mode" banner only when running locally.

  Next.js environment variables:
  • process.env.NODE_ENV           → "development" | "production" | "test"
  • process.env.NEXT_PUBLIC_API_URL → the API base URL set in Vercel's dashboard

  Functions to build:
  1. isProduction()  — returns true if NODE_ENV is "production"
  2. getApiUrl()     — returns NEXT_PUBLIC_API_URL or falls back to localhost
  3. getConfig()     — returns { isProduction, apiUrl, showDevBanner }
*/

// Start your functions here
```

- [ ] Pair trainees
- [ ] Remind them: `process.env` values are always strings — or `undefined`. Never a boolean.
- [ ] After 20 minutes, ask: where in their portfolio would they actually call `getConfig()`?

> 💡 **Key takeaway:** Variables prefixed with `NEXT_PUBLIC_` are bundled into the browser — never put secrets in them. Variables without that prefix stay server-side only.

---

## 🍱 Lunch Break (12:30 - 13:00)

---

## Group Debugging Activity – Leaking a Secret in an API Route (13:00 - 13:30)

The scenario: a trainee added a contact form to their portfolio that calls a Next.js API route to send emails via a third-party service. To make debugging easier during development, they included the API key in the response. The code shipped to production.

Show the code below. Ask groups: **what is the security risk, and how would you fix it?**

```javascript
// app/api/contact/route.js

export async function POST(request) {
  const { name, email, message } = await request.json();

  const apiKey = process.env.EMAIL_SERVICE_API_KEY;
  const result = await sendEmail({ name, email, message, apiKey });

  return Response.json({
    success: true,
    debug: {
      apiKey, // ❌ Never do this
      receivedAt: new Date().toISOString(),
    },
  });
}
```

### Expected Behavior

The `debug` object should be removed entirely. A safe version never includes `apiKey` — or any secret — in any response body.

> ⚠️ Anyone with browser DevTools open can see your API key in the Network tab. They can use it to send emails pretending to be you — or run up a bill on your account.

- [ ] Ask: how would you check right now whether this is happening in your own portfolio?
- [ ] Discuss: should the `debug` field exist at all? What's a safer way to debug API routes?
- [ ] Ask: could a test have caught this? What would that test look like?

> 💡 **Mentor note:** The fix is simply removing the `debug` field. A stricter solution also validates the request body before using it (e.g. checking that `email` is a valid email address).

---

## Q&A (13:30 - 14:00)

---

## Good to cover

- [ ] The difference between `NEXT_PUBLIC_*` and private environment variables in Next.js — one is visible in the browser bundle, one is not
- [ ] Why `npm ci` is preferred over `npm install` in CI — it installs exactly what's in `package-lock.json` and fails if there's a mismatch
- [ ] What happens to failed deployments on Vercel — the previous deployment stays live until a new one succeeds
- [ ] How to add environment variables in the Vercel dashboard so the deployed app can read them
