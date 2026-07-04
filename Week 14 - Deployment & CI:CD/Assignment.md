# Week 14 Assignment

This is the final assignment of the core curriculum. It's less about writing new features and more about making sure the way your portfolio ships is something you'd stand behind: automated, configured correctly, and free of leaked secrets.

## Task 1 - Add a CI workflow to your portfolio

### Requirements

- Add a `.github/workflows/ci.yml` file (or fix your existing one) that triggers on push to `main` and on pull requests
- Pin the Node version to a specific number — never `latest`
- Install dependencies with `npm ci`, not `npm install`
- Run your test suite as part of the workflow
- Push your changes and confirm the workflow runs successfully in your repository's Actions tab

## Task 2 - Add environment-aware configuration

### Requirements

- Write a small utility function (or a few) that behaves differently depending on `import.meta.env.MODE` (or `.DEV`/`.PROD`) or another environment variable — for example, which API URL to call, or what to log
- Never hardcode which environment you're in — always read from `import.meta.env`
- Make sure any variable exposed to the browser is prefixed with `VITE_` and never contains a secret
- Add at least one unit test for this function, covering both a production-like value and a development-like value

## Task 3 - Audit your portfolio for leaked secrets

### Requirements

- Check every serverless function and response in your portfolio for anything that shouldn't be sent to the client — API keys, tokens, or raw error details
- Remove any `debug` fields or similar data from response bodies that reach the client
- If your portfolio doesn't have any serverless functions yet, write a short paragraph in your PR description explaining what you checked and why it's safe as-is

## Task 4 - Document your deployment

### Requirements

- Add or update a "Deployment" section in your portfolio's README
- Explain which environment variables the project needs and what each one is for
- Explain what happens if a deployment fails — and where a teammate would go to check

---

## Submission

Follow the Assignment submission guide to learn how to submit the assignment
