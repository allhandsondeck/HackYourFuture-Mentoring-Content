# Let's get practical

> 💭 Practice exercises are optional and do not need to be submitted

## Exercise 1 - Fix this workflow

This workflow is supposed to check every pull request before it merges. Something's wrong with it — find the bugs before running it.

```yaml
name: Deploy Check

on:
  pull_request:
    branches:
      - main

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: latest

      - name: Install dependencies
        run: npm instal

      - name: Run tests
        run: npm test
```

> 💡 Hint: one bug is a typo in a command. The other is something this week's material specifically warned you about pinning.

## Exercise 2 - An environment-aware upload limit

Write `getMaxUploadSize()`, which returns the maximum file upload size **in megabytes, as a number**:

```javascript
// when import.meta.env.VITE_MAX_UPLOAD_MB is "10":
getMaxUploadSize(); // returns 10

// when it isn't set at all:
getMaxUploadSize(); // returns 5 in development, 20 in production
```

**Questions to consider:**

- Why would returning the string `"10"` instead of the number `10` cause a bug somewhere else in the codebase?
- What should this function do if `MAX_UPLOAD_MB` is set to something that isn't a valid number, like `"abc"`?

## Exercise 3 - Spot the leaked secret

This Vercel Serverless Function returns configuration to the client on page load. One of these fields should never be here.

```javascript
// api/site-config.js

export default function handler(request, response) {
  response.status(200).json({
    siteName: process.env.SITE_NAME,
    theme: process.env.THEME,
    analyticsId: process.env.ANALYTICS_ID,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  });
}
```

Which field is the problem, and how can you tell just from the variable name — without knowing anything else about this codebase?

> 💡 If you would like to practice more then remember that you can ask AI to generate more exercises for you!
