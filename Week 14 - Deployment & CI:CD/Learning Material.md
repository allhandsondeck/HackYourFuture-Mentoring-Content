# Week 14 Overview

This is the final week of the curriculum. You already have a live portfolio (built with Vite, React, and TypeScript) deployed on Vercel — you pushed code, it built, and it appeared on the internet. This week is about everything that happens **between** those two moments: the automated checks that run before your code is allowed to ship, the configuration that lets the same codebase behave differently in different places, and the security habits that keep what should be private actually private.

None of this is about writing more features. It's about the invisible infrastructure that makes shipping code safe, repeatable, and boring — in the good way. By the end of the week you'll be able to read a CI pipeline instead of being intimidated by it, reason about environment variables instead of guessing at them, and spot the kind of security mistake that quietly ships to production more often than you'd think.

## **Learning Goals**

- Understand what CI/CD means and why teams rely on it — as a practice, not just a pipeline
- Understand trunk-based development and why long-lived branches work against Continuous Integration
- Recognise feature flags as the mechanism that lets teams merge unfinished work to trunk safely
- Read and fix a GitHub Actions workflow file
- Explain why `npm ci` runs in automated environments instead of `npm install`
- Understand environment variables and the difference between development, test, and production
- Distinguish between public (`VITE_*`) client-side variables and private, server-only variables
- Recognise and prevent the risk of leaking secrets in an API response
- Understand what happens when a deployment fails on a platform like Vercel

# Understanding CI/CD

# What CI/CD actually means

**CI** stands for Continuous Integration: every time someone pushes code, a machine automatically installs it, tests it, and builds it — the same way, every time, with no human remembering to run a command. **CD** stands for Continuous Deployment (or Delivery): if that build succeeds, the result is automatically shipped somewhere real.

Before this existed, "does it work?" meant one developer running tests on their own laptop and hoping their machine matched everyone else's. CI/CD replaces that hope with a machine that runs the exact same checks, in the exact same environment, on every single change — and refuses to let broken code merge or deploy silently.

> 💡 **Worth knowing:** the value of CI isn't catching bugs a human couldn't find — it's catching them **immediately**, before they're buried under ten more commits, and **consistently**, without depending on someone remembering to run `npm test` before pushing.

# Continuous Integration, Delivery, and Deployment aren't the same thing

The acronym "CI/CD" hides a distinction worth knowing, because "CD" actually gets used two different ways, and people often use it loosely:

- **Continuous Delivery** means every change that passes your pipeline is *ready* to release — packaged, tested, one click away from production — but a human still decides when that click happens.
- **Continuous Deployment** removes that click entirely. Every change that passes the pipeline goes live automatically, with nobody approving each individual release.

Vercel's default workflow is Continuous Deployment: merge to `main`, and it's live, full stop. Plenty of teams deliberately choose Continuous Delivery instead — for something like a banking system, an extra human checkpoint before production might be worth the added friction. Neither approach is "more correct." They trade speed against a manual gate, and the right choice depends on how expensive a mistake in production would actually be.

> 💡 **Worth knowing:** if someone says "we do CD," it's worth asking which one they mean. The difference between "ready to ship" and "already shipped" changes what a green pipeline actually promises you.

# CI/CD is a practice, not just a pipeline

A YAML file is the easy part to point at, but it isn't actually what CI/CD *is*. Continuous Integration started as a practice, not a tool: developers merge their work into one shared mainline **multiple times a day**, in small pieces, rather than working in isolation for days or weeks and reconciling everything at the end. The pipeline is just the automated referee that checks each of those small merges — it exists to serve that habit, not the other way around.

Continuous Deployment takes it one step further: once a change passes those checks on the mainline, it ships — automatically, not "eventually, after a review meeting." The whole point is to make shipping small changes routine and low-stakes instead of rare and terrifying.

> 💡 **Key takeaway:** the pipeline automates the *checking*. The actual discipline of CI/CD is a human one — commit small, integrate constantly, and never let your copy of the code drift far from everyone else's.

# Trunk-based development

That discipline needs a branching model to support it, and the standard one is **trunk-based development**: everyone works off a single shared branch (usually `main`), branches live for at most a day or two, and they merge back constantly instead of accumulating.

This is the opposite of workflows built around long-lived `feature/*` or `release/*` branches, where work stays isolated for days or weeks before one large merge at the end.

> ⚠️ **Anti-pattern: long-lived branches.** The longer a branch lives, the further it drifts from `main` — and from everyone else's work. Merge conflicts get bigger the longer you wait, not smaller. Worse, you don't discover you conflict with a teammate's change until both branches are "done," which is the most expensive possible moment to find out. This is exactly the problem *Continuous* Integration was named to solve: integrating constantly, not once at the end.

# Feature flags: merging without releasing

A fair question: what about a feature that genuinely takes two weeks to build? Trunk-based development doesn't mean shipping half-finished work to real users — it means **decoupling merging from releasing**, and the standard tool for that is the **feature flag**.

A feature flag is a simple condition, usually backed by a config value or environment variable, that decides whether a piece of code runs:

```javascript
if (isFeatureEnabled("new-project-layout")) {
  return <NewProjectGrid />;
}
return <ProjectGrid />;
```

The new component can merge into `main` today — half-finished, disabled by default — and keep merging in small increments over the following two weeks, all on trunk, all covered by CI. Nobody sees it until the flag flips on. When it's ready, flipping the flag *is* the release; no risky big-bang merge required.

> 💡 **This is what makes trunk-based development realistic, not just idealistic.** Small, frequent, low-risk merges to a shared branch — even for work that isn't finished — because the flag controls who sees it, not the branch it lives on.

# Testing: the thing that makes any of this safe

None of this works without trust in your test suite. Merging to trunk constantly, and deploying the moment a build passes, only makes sense if "the build passed" actually means something. Automating a deployment doesn't make broken code safer — it just makes it faster to ship.

This is why last week's testing skills aren't a separate topic from this week's — they're the reason any of this is safe to do. A thorough suite is what turns "we merge to `main` several times a day" from a reckless habit into a disciplined one.

# Designing a pipeline that fails fast

Look ahead at the workflow in the next section: install, then test, then build. That ordering isn't arbitrary — a well-designed pipeline is organised around **failing as cheaply and as quickly as possible.**

A real-world pipeline usually has more stages than that minimal example, and the cheapest, fastest ones go first:

1. **Lint** — catches typos and style issues in seconds, without running a single test
2. **Type-check** — catches whole categories of bugs before anything actually executes
3. **Unit and component tests** — fast, isolated, no real browser needed
4. **Build** — compiles the real production bundle, which takes longer than any of the above
5. **Deploy** — the expensive, external, hardest-to-undo step of all

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4

  - name: Set up Node.js
    uses: actions/setup-node@v4
    with:
      node-version: 20

  - name: Install dependencies
    run: npm ci

  - name: Lint
    run: npm run lint

  - name: Run tests
    run: npm test

  - name: Build project
    run: npm run build
```

If your code has a typo, you want to find out from a ten-second lint step — not by waiting three minutes for the full test suite, and you certainly don't want to discover it only after a slow build has already started. Ordering stages from cheapest-to-fail to most-expensive-to-fail means a broken change gets rejected in seconds instead of minutes, and nobody wastes a coffee break watching a build they now know will fail anyway.

> 💡 **Key takeaway:** a good pipeline isn't just "does everything eventually get checked" — it's "does the cheapest check run first," so feedback arrives in seconds whenever possible, not minutes.

# Rollbacks: reverting is also a deploy

Even with all of this in place, something will eventually reach production and misbehave in a way no check caught. The trunk-based, CI/CD way to handle that isn't to SSH into a server and hand-edit files until it's fixed — it's to treat a **rollback as just another deployment**: redeploy the last known-good commit, exactly the same way you deploy anything else, through the exact same pipeline.

This is a big part of why Vercel keeps your previous deployment alive until a new one fully succeeds, mentioned earlier — the "last known-good version" isn't a backup you have to go dig up, it's simply still running, one click (or one revert commit) away from being the live one again.

> 💡 **Worth knowing:** a team that's genuinely comfortable with their pipeline doesn't panic when something breaks in production — they revert, calmly, using the same automation that got the bad change there in the first place, and investigate the actual bug without the added pressure of an ongoing incident.

# Other CI/CD platforms

This material uses GitHub Actions because it's built into GitHub and free for public repositories, but it's one implementation of an idea, not the only one. **GitLab CI**, **CircleCI**, **Jenkins**, and **Buildkite** all solve the same problem — trigger on a change, run steps on a fresh machine, report pass or fail — with different YAML shapes and different hosting models.

> 💡 **If you ever join a team using one of these instead, the concepts here transfer directly.** You're not learning "GitHub Actions" so much as learning what a CI pipeline is; the specific tool is a detail you can pick up from its docs in an afternoon.

# Anatomy of a GitHub Actions workflow

A GitHub Actions workflow is a YAML file that lives in `.github/workflows/`. It describes three things: what should trigger it, what machine it runs on, and what steps to execute.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build
```

A few things worth naming explicitly:

- `on` lists the triggers. Here, the workflow runs on every push to `main`, and on every pull request targeting `main` — which is also what makes Vercel's preview deployments possible: a PR trigger gives you a chance to check a build before it ever touches production.
- `jobs` contains one or more jobs, each running on a fresh virtual machine (`runs-on`).
- `steps` run in order, top to bottom, on that same machine. Each `uses:` step runs a pre-built action; each `run:` step runs a shell command directly.

> 💡 **Order is not cosmetic.** The workflow above only works because checkout happens before install, install happens before test, and test happens before build. Move any of these and the whole pipeline breaks — there's no code to test before it's checked out, and no `node_modules` to test with before install runs.

# Reading a workflow run

Once a workflow is pushed, GitHub actually runs it — and it's worth knowing exactly where to go look. Open your repository on GitHub and click the **Actions** tab: every run of every workflow lives there, most recent first, each one showing a green checkmark, a red cross, or a spinning yellow circle while it's still in progress.

Click into any run and you'll see the exact same `steps` from your YAML file, in order, each expandable to show its full terminal output — literally the same output you'd see running those commands on your own machine, just captured from GitHub's machine instead of yours.

> 💡 **When a run fails, start here, not with guessing.** Click the red step, read the last twenty or so lines of its output, and you'll almost always find the actual error message — a failing test's assertion, a missing dependency, a typo GitHub is more than happy to point at exactly.

# Not wasting CI minutes: concurrency control

Push three commits to the same pull request in quick succession, and by default GitHub happily starts three separate workflow runs — even though only the last one's result actually matters to anyone. That's wasted time, and on a metered plan, wasted money too.

`concurrency` tells GitHub to cancel a still-running workflow the moment a newer one starts for the same branch:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

With this in place, only the most recent push's run is ever left running — anything it supersedes gets cancelled automatically, freeing up the runner instead of finishing a check nobody needs the answer to anymore.

> 💡 **Small config, real impact.** This one addition is common enough that it's worth recognising in any workflow file you read, even before you've fully worked out every other line in it.

# Enforcing it: branch protection rules

A CI workflow that runs but doesn't actually *block* anything is only a suggestion. GitHub's **branch protection rules** (found under Settings → Branches on your repository) turn "please pass CI" into "you cannot merge until you do."

The setting that matters most here is **require status checks to pass before merging.** Once it's enabled, GitHub greys out the merge button on any pull request until your workflow finishes green — no exceptions, no "I'll just merge it and fix the failing test after."

> 💡 **This is the missing link between "we have a pipeline" and "our trunk is always deployable."** A pipeline that merely reports failures is a smoke detector with the battery removed. Branch protection is what makes it actually stop you — combined with trunk-based development, it's what guarantees `main` never breaks by accident rather than by good intentions alone.

# Giving your pipeline its own secrets

Sometimes the pipeline itself needs a secret — a token to deploy somewhere, or an API key to run a real integration check against a third-party service. You never hardcode that directly into the workflow file, because `.github/workflows/*.yml` is committed, visible in your Git history forever, and public if your repository is public.

GitHub gives you a dedicated place for this instead: **Settings → Secrets and variables → Actions**. Anything added there is encrypted at rest and only decrypted inside a running workflow, referenced through the `secrets` context:

```yaml
- name: Run integration check
  run: npm run check:integration
  env:
    API_TOKEN: ${{ secrets.INTEGRATION_API_TOKEN }}
```

The value never appears anywhere in your YAML file, and GitHub actively masks it in the workflow's run logs if it's ever accidentally printed — showing `***` in place of the real value, rather than leaking it into a log anyone with repo access can read.

> ⚠️ **A workflow secret is exactly as sensitive as any other secret.** The rule from later in this material applies here too: never deliberately print it, and never let it flow somewhere — a build artifact, a deployed response — that a client could end up seeing.

# Why `npm ci` instead of `npm install`

Notice the workflow above uses `npm ci`, not `npm install`. They look similar but behave very differently in an automated environment.

`npm install` reads `package.json`, resolves the best-matching versions, and **can update** `package-lock.json` if something doesn't quite match. That's exactly what you want on your own machine while you're actively adding packages.

`npm ci` does the opposite: it deletes `node_modules` entirely, then installs **precisely** what's written in `package-lock.json` — no resolving, no updating. If the lockfile and `package.json` disagree even slightly, `npm ci` fails loudly instead of silently installing something slightly different than what you tested locally.

> ⚠️ **This is exactly the guarantee CI needs.** A pipeline that quietly installs different versions than your machine did defeats the entire point of automated testing — you'd be testing a different set of dependencies than the ones that actually ship.

# Deploying with confidence

Once a build passes, deployment can happen. Platforms like Vercel take this further than a single "live site": every pull request gets its own **preview deployment** — a real, working URL for that exact branch, before it ever merges. That's how a reviewer can click a link and see your change running, instead of trusting your description of it.

Remember last week's code review habits? This is where they extend naturally: a good pull request description doesn't just say what changed, it links the preview deployment, so the reviewer can click through and check the actual behaviour — not just read a diff and imagine it.

Production deployments follow the same idea. If a new deployment fails partway through — a build error, a failed check — the currently live version stays exactly as it was. Nothing goes offline because a deployment failed; the broken build simply never replaces the working one.

> 💡 **Key takeaway:** a failed deployment is a non-event for your users. The scary part isn't the pipeline failing — it's a pipeline that isn't there at all, silently letting something broken reach production.

# Atomic deployments: why nothing is ever half-updated

There's one more property worth understanding about how a platform like Vercel actually ships a new version: it's **atomic**. The new version is built and fully assembled somewhere else entirely, completely separately from what's currently live, and only swapped into place once it's entirely ready — all at once, never file by file.

Compare that to naively copying new files over old ones on a traditional server: for the few seconds that copy takes, some visitors could receive a mix of old and new files — an old HTML page requesting a new, incompatible JavaScript bundle, for instance, which is exactly the kind of intermittent, hard-to-reproduce bug that makes deployments feel scary. Atomic deployment removes that window entirely: a visitor sees either the fully old version or the fully new one, never something in between.

> 💡 **This is part of why "just redeploy the last good commit" from the rollback section works so cleanly.** A rollback is just another atomic swap, in the other direction — not a partial, in-place repair with its own chance of going wrong halfway through.

# Additional Resources

## Reading

- [Trunk Based Development](https://trunkbaseddevelopment.com/)
- [GitHub Actions – Understanding GitHub Actions](https://docs.github.com/en/actions/about-github-actions/understanding-github-actions)
- [npm docs – `npm ci`](https://docs.npmjs.com/cli/v10/commands/npm-ci)
- [Vercel – Deployments](https://vercel.com/docs/deployments)

---

# Environment Configuration

# What environment variables are, and why they exist

The same codebase runs in several different places: your laptop, the CI pipeline, and production. Each of those places needs slightly different behaviour — a different API URL, different logging, different feature toggles — without you maintaining separate copies of your code for each one.

**Environment variables** solve this. They're values injected from *outside* your code, so the same source stays identical everywhere while the values it reads change underneath it.

Where you read them from depends on where your code runs. Your portfolio is a Vite app, which means **two different runtimes** are involved:

- **Client code** — your React components — is bundled by Vite ahead of time and runs in the browser. It has no access to `process.env` at all; instead, Vite exposes variables through `import.meta.env`.
- **Server code** — any serverless function you deploy alongside your static site — runs on Node, exactly like a CI step does, and reads variables the traditional way, through `process.env`.

Vite also gives you three ready-made values for the client: `import.meta.env.DEV` and `import.meta.env.PROD` are real **booleans**, and `import.meta.env.MODE` is a string (`"development"`, `"production"`, or whatever mode you're building for).

> ⚠️ **`process.env` values (used in your server code) are always strings, or `undefined` — never booleans, and never numbers.** `process.env.MAX_RETRIES` is the string `"3"`, not the number `3`. Every value needs to be explicitly parsed or compared against a string. `import.meta.env.DEV`/`.PROD` are the one exception — Vite gives you those two as actual booleans.

# The idea behind this: the Twelve-Factor App

This week's environment-variable habits aren't something specific to Vite or Vercel — they come from the **Twelve-Factor App**, a widely-referenced set of principles for building software that's easy to deploy and scale, written by engineers at Heroku back in 2011 and still the default mental model most teams reach for today.

Factor III, specifically, is **"Config"**: store configuration in the environment, never in the code. The test the methodology proposes is refreshingly concrete — could you make your codebase public right now, without exposing a single credential? If the answer is no, something that should be an environment variable is hardcoded instead.

> 💡 **Key takeaway:** this isn't a tool-specific convention — it's an industry-wide principle that Vite, Next.js, Vercel, and pretty much every serious hosting platform happen to implement, each in their own way.

# Configuration vs. secrets

Not every environment variable is protecting something, and it's worth explicitly separating two categories that tend to get lumped together under the umbrella of "env vars":

- **Configuration** — values that change *where* or *how* your app behaves, with nothing to hide: an API base URL, a feature flag, a display name. These are often perfectly fine to make public.
- **Secrets** — values that grant access to something: an API key, a signing token, a service password. These must never reach the client, ever, under any circumstance.

The `VITE_` prefix decision from the next section is really this distinction wearing a technical costume: configuration is safe to prefix and expose to the browser; secrets never are. Whenever you add a new environment variable to your project, ask which category it belongs to *before* deciding whether it gets the prefix — not after.

# Public vs private environment variables in Vite

Vite draws a hard line between two kinds of environment variables:

- Variables prefixed with **`VITE_`** get bundled directly into the JavaScript sent to the browser. Anyone can open DevTools and read them.
- Variables **without** that prefix are invisible to your client code entirely — Vite simply never includes them in the browser bundle. They only exist for server-side code (like a Vercel serverless function) reading `process.env`.

This isn't a minor naming convention — it's the entire security boundary. A value like `VITE_API_URL` is meant to be public; there's nothing to protect. A value like a mailing-service secret key must never carry that prefix, because the moment it does, it ships to every visitor's browser.

> ⚠️ **If you're ever unsure whether something is a secret, assume it is.** The cost of an unnecessary private variable is a few extra lines of server code. The cost of an accidentally public secret is someone else spending your API quota, or worse.

# Build-time vs runtime: when a new value actually takes effect

Here's a detail that trips up almost everyone the first time: Vite doesn't look up `import.meta.env.VITE_X` while your app is running in the browser. It replaces it, literally, with the actual string value, at **build time** — before the JavaScript is ever bundled or shipped anywhere.

That has a real consequence: changing a `VITE_` variable's value in Vercel's dashboard does nothing to your live site until you **trigger a new deployment**. The old value is already baked directly into the JavaScript file sitting on Vercel's servers; there's no environment left to re-read at runtime, the way there is for server code reading `process.env`.

> ⚠️ **If you change a `VITE_` variable and nothing seems to happen, this is almost always why.** Push any commit, or manually trigger a redeploy from Vercel's dashboard, to force a fresh build. A server restart wouldn't help here even if you could trigger one — the value isn't read at runtime at all.

# Writing environment-aware utility functions

Reading `import.meta.env` directly all over your components makes it easy to typo a variable name or forget a fallback. Instead, wrap it in small, pure, defensive functions:

```javascript
// src/config/featureFlags.js

export function isFeatureEnabled(flagName) {
  const value = import.meta.env[`VITE_FEATURE_${flagName.toUpperCase()}`];
  return value === "true";
}

export function getEnvironmentLabel() {
  if (import.meta.env.PROD) return "Live";
  if (import.meta.env.MODE === "test") return "Test";
  return "Local Development";
}
```

Notice the shape of both functions: each reads `import.meta.env`, each returns a plain value (never throws), and each has sensible behaviour even when the variable is missing entirely — `getEnvironmentLabel` quietly falls back to `"Local Development"` rather than returning `undefined` or crashing.

> 💡 **Key takeaway:** treat `import.meta.env` the way you'd treat any untrusted input. Wrap it once, in one place, in functions that are easy to unit test — don't scatter raw `import.meta.env.X` checks through your components.

# Validating your environment at startup

A missing environment variable is one of the most common ways a working app breaks the moment it's deployed somewhere new. It ran fine locally, because your `.env.local` had everything it needed — and then it silently misbehaves in preview or production, because one variable was never added there.

The fix is to check for what you need once, up front, instead of discovering it's missing halfway through unrelated code:

```typescript
// src/config/env.ts

function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const apiUrl = requireEnv("VITE_API_URL");
```

This fails loudly and immediately, with a message that names the exact problem — instead of failing quietly three components deep with a confusing `undefined` that could mean almost anything.

> 💡 **Worth knowing:** larger projects often reach for a schema-validation library (like Zod) to validate their whole set of environment variables at once, with types included for free. The principle is identical either way: check early, fail loudly, name the problem precisely.

# Vite's env file loading order

Vite doesn't read just one `.env` file — it looks for several, in a specific order, and later files override earlier ones where they overlap:

| File | Loaded |
| --- | --- |
| `.env` | Always, in every mode |
| `.env.local` | Always, except when running tests — never committed |
| `.env.[mode]` (e.g. `.env.production`) | Only when building for that mode |
| `.env.[mode].local` | Only in that mode, never committed |

"Mode" here usually corresponds to `development` or `production`, matching how you ran Vite (`vite dev` vs `vite build`). It's worth double-checking this isn't automatically the same thing as your final deployment environment if your setup ever grows a staging tier in between the two.

# Setting environment variables where they belong

Locally, that means real secrets and machine-specific values belong in `.env.local` — and that file must be in `.gitignore`. Committing it would mean committing whatever secrets it contains straight into your Git history, where they're nearly impossible to fully remove later.

In production, you set the same variables in your hosting platform's dashboard. On Vercel, that's **Project Settings → Environment Variables**, where you can scope a value to production, preview, or development independently — so a preview deployment can safely point at a staging API while production points at the real one.

> ⚠️ **The most common "works on my machine" bug in this space:** you add a new variable to `.env.local`, everything works perfectly locally, you push — and the deployed build breaks, because nobody added the same variable to Vercel's dashboard. Whenever you add an environment variable, add it in both places in the same sitting, not "later."

# `.env.example`: documenting what's needed, without leaking it

If `.env.local` is gitignored, how does a new contributor — or you, six months from now, setting this project up on a new laptop — know which variables the project even needs? The convention is a second file, `.env.example`, which **is** committed:

```bash
# .env.example
VITE_API_URL=
VITE_GITHUB_STATS_URL=
```

It lists every variable name your project reads, with no real values — just enough for someone to copy it to `.env.local` and fill in the blanks themselves. It's documentation that can't go stale, because it lives right next to the code that actually reads it.

> 💡 **A nice side effect:** reviewing a pull request that adds a new environment variable is a good moment to ask "did `.env.example` get updated too?" It's an easy thing to forget, and an easy thing to catch in review.

# A worked example: adding a new environment variable end-to-end

Let's put the whole chapter together with one concrete walk-through: your portfolio needs to call a new "GitHub stats" API to show your contribution graph, and the base URL it calls needs to differ between environments.

1. **Add it locally**, in `.env.local`: `VITE_GITHUB_STATS_URL=http://localhost:4000/stats`
2. **Read it through a wrapped function**, not scattered inline through your components:

```javascript
// src/config/githubStats.js
export function getGithubStatsUrl() {
  return import.meta.env.VITE_GITHUB_STATS_URL || "https://api.github.com";
}
```

3. **Test it**, covering both the configured case and the fallback
4. **Add the same variable to Vercel** — Project Settings → Environment Variables — with the real production URL, scoped to Production (and a separate staging URL scoped to Preview, if your setup has one)
5. **Push, and let the pipeline do the rest**: CI installs, lints, tests, and builds; Vercel then builds again with the *production* value baked in, and deploys it

Notice what's absent from this list: nobody SSHed into a server, manually edited a config file after deploying, or had to remember to update something a week later. Every step lives either in your codebase — reviewed, tested, versioned — or in a dashboard built for exactly this purpose.

> 💡 **This is the payoff of the whole chapter.** Once this pattern is in place, adding the tenth environment-aware value is exactly as easy as adding the first one.

# Additional Resources

## Reading

- [The Twelve-Factor App – Config](https://12factor.net/config)
- [Vite – Env Variables and Modes](https://vite.dev/guide/env-and-mode)
- [Vercel – Environment Variables](https://vercel.com/docs/environment-variables)

---

# Security in Production

# The cost of a leaked secret

An API key or secret token is, functionally, a password. If your `WEATHER_API_KEY` or `STRIPE_SECRET_KEY` ends up somewhere a visitor can read it, they can use it exactly as if it were theirs — running up your bill, exhausting your rate limit, or sending requests that look like they came from you.

The uncomfortable part: they don't need to hack anything. Every request your frontend makes, and every response it receives, is fully visible in the browser's **Network tab**. Nothing that reaches the client is private, no matter how deeply it's nested in a response object.

> ⚠️ **You also don't get the benefit of "nobody will notice."** Automated bots scan public GitHub repositories, and even live websites, constantly — specifically looking for text patterns that resemble API keys. A secret exposed in a public repo or a public response is often found and abused within minutes, not eventually.

# HTTPS protects the wrong thing for this lesson

Vercel gives every deployment HTTPS automatically, and it's worth understanding exactly what that buys you: encryption **in transit** — nobody sitting on the same coffee-shop Wi-Fi, or your internet provider, can read the traffic between a visitor's browser and your server. That's genuinely important, and free, and worth appreciating.

What HTTPS does *not* do is protect data from the person the request was addressed to. A secret sent to the browser arrives over a perfectly encrypted connection — and then sits there, in full view, for the browser's own owner to read in DevTools whenever they like. Encryption in transit and "safe to send" are two completely different properties, and it's easy to mistake one for the other.

> 💡 **Key takeaway:** HTTPS keeps a secret safe *on the way* to the browser. It does nothing at all once it arrives. The only real protection is never sending it there in the first place.

# Seeing it for yourself: viewing the bundled source

It's worth doing this once, deliberately, so the idea stops being abstract. Open any deployed website, open DevTools, and go to the **Sources** tab (or **Network**, filtered to `.js` files). Every piece of JavaScript your browser is running — including any string that was ever accidentally embedded in it — is sitting right there, fully readable, often only lightly minified.

Search that source for a word you know shouldn't be there — `secret`, `key`, `password` — and on a poorly-configured site, you will occasionally find exactly that. Minification makes code hard to *read*, not hard to *search*; a secret key doesn't stop being a working secret key just because the variable name around it got shortened to `a`.

> ⚠️ **"It's minified" is not a security measure.** Minification is a size optimisation for network transfer, nothing more. Anything in your JavaScript bundle should be treated as public, permanently, from the moment it ships — because functionally, it already is.

# Where a static site keeps a secret

Your portfolio is a static Vite build with no traditional backend — so where would a secret even live? Vercel (and most static hosts) support **serverless functions**: any file in a top-level `/api` folder is deployed as its own small piece of real, server-side Node code, separate from your bundled frontend. Your contact form, for example, might post to `/api/contact`, which is the one place allowed to hold an email service's secret key — because it's the one place the browser never sees the source of.

# A common way secrets leak: debug fields in a response

Here's a mistake that's easy to make and easy to miss, because the code runs perfectly fine — right up until something goes wrong:

```javascript
// api/contact.js — a Vercel Serverless Function

export default async function handler(request, response) {
  const { name, email, message } = request.body;
  const apiKey = process.env.RESEND_API_KEY;

  try {
    const result = await sendEmail({ name, email, message, apiKey });
    response.status(200).json({ success: true });
  } catch (error) {
    // ❌ apiKey ends up in the response body the moment sendEmail fails
    response.status(500).json({ error: error.message, apiKey });
  }
}
```

This was almost certainly added to make debugging easier during development — and then nobody removed it before shipping. The fix is just as simple as the mistake:

```javascript
export default async function handler(request, response) {
  const { name, email, message } = request.body;
  const apiKey = process.env.RESEND_API_KEY;

  try {
    const result = await sendEmail({ name, email, message, apiKey });
    response.status(200).json({ success: true });
  } catch (error) {
    response.status(500).json({ error: "Unable to send message" });
  }
}
```

> ⚠️ **The rule is absolute, not situational:** nothing read from `process.env` should ever appear inside a response body, a thrown error message sent to the client, or a log line that a client-facing tool might surface. If you need to debug it, log it server-side only, where the client can never see it.

# Logging without leaking

The fix above moved the secret out of the *response* — but it's worth being careful about where "just log it server-side instead" actually leads, too. Server-side logs still get *read* by something: a dashboard, a log aggregator, sometimes a whole team with broader access than you'd expect.

A safer habit is to log that a key was used, not the key itself:

```javascript
console.error("sendEmail failed", { hasApiKey: Boolean(apiKey), message: error.message });
```

This tells you everything you need in order to debug — the key was present, and here's exactly what broke — without ever writing the actual secret anywhere it might be retained, forwarded, or viewed by more people than you intended.

> 💡 **A useful habit generally, not just a rule for this one case:** before logging any object, ask what's inside it. `console.log(requestBody)` is convenient during development and a liability the moment that request body might ever contain something private.

# Validating input at the boundary

A serverless function is a boundary — the one place your code meets input from outside your control. That's exactly where validation belongs: check that a request body has the shape you expect *before* you use it, rather than trusting it and hoping.

This isn't about defensive-programming everywhere. Internal function calls between code you wrote can trust each other. But the moment data crosses from "anyone on the internet" into your system, assume nothing about its shape until you've checked.

# Client-side checks are UX, not security

You may remember, from last week, testing a contact form's client-side validation — checking that an empty submission shows an error before it ever reaches the network. That check is genuinely useful: it gives a real user instant feedback without waiting on a round trip. But it protects nothing.

Anyone can bypass your React component entirely and call your serverless function directly:

```bash
curl -X POST https://your-portfolio.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email": "not-an-email", "message": "x"}'
```

No browser, no form, no client-side validation anywhere in sight — just a raw request straight at your endpoint. If `isValidEmail` and `isValidMessage` from last week's pair exercise only ever run inside the React component, a request like this one sails straight through untouched.

> ⚠️ **The rule:** validate on the client for a better user experience. Validate on the server because you have to. If a check only exists in the browser, it isn't really a check — it's a suggestion the rest of the internet is entirely free to ignore.

# CORS: who's allowed to call your API

If you've ever seen a browser console error mentioning **CORS** while calling an API from client code, this is what that was about. **Cross-Origin Resource Sharing** is a browser-enforced rule: by default, JavaScript running on `your-portfolio.vercel.app` is *not* allowed to read a response from a different origin, unless that other origin explicitly says it's fine.

Your own `/api` functions don't trigger this at all — they share the same origin as your frontend. It comes up the moment you call *someone else's* API directly from client-side code, or if you ever open your own API up to be called from other sites.

> 💡 **Worth knowing:** CORS is not something you "fix" by disabling it. The error is the browser protecting *users*, not you. If you control the API and genuinely need another site to call it, you configure that server to explicitly allow it. If you don't control it, that's usually a sign the call belongs behind your own serverless function instead of the browser — which conveniently also happens to be exactly the pattern that keeps secrets off the client.

# Keeping dependencies from becoming the leak

Not every vulnerability is a mistake you personally wrote. Every package in your `package-lock.json` is code you're implicitly trusting, and occasionally one of them has a known security issue discovered well after you first installed it.

```bash
npm audit
```

This checks your installed dependencies against a public vulnerability database and reports anything concerning, often with an automatic fix available via `npm audit fix`. On GitHub, **Dependabot** does the equivalent of this continuously and automatically — opening a pull request the moment a fix is available for something you depend on, so it flows through your normal CI pipeline and branch protection exactly like any other change.

> 💡 **This is CI/CD and security meeting in practice.** A Dependabot PR is just a pull request. It runs your pipeline, it needs to pass, and trunk-based development means it can merge the same day it opens instead of sitting untouched for months while the vulnerability stays live in production.

# Least privilege: scoping a key to only what it needs

One more habit worth carrying into any real API key you generate: give it the **smallest set of permissions** that actually gets the job done, not the broadest one available by default.

Most services that issue API keys let you scope them — a send-only email key instead of one that can also read your entire account's history, a database credential that can only insert into one table instead of one with full administrative rights. If a key like that ever does leak despite everything else in this material, the damage it can do is bounded by exactly what you gave it permission to do in the first place.

> 💡 **Key takeaway:** every other safeguard in this material reduces the *chance* of a leak. Least privilege is different — it reduces the *consequence* if one happens anyway. Both matter, for the same reason a seatbelt and a speed limit both matter, even though only one of them prevents the crash.

# A note on third-party form services

Writing your own `/api/contact` function isn't the only option for a portfolio contact form, and it's worth knowing the alternative exists. Services like **Formspree** or **EmailJS** are built specifically for static sites that have no backend of their own: you submit the form directly to their endpoint, using a public identifier rather than a secret key, and they handle sending the email on your behalf.

This sidesteps the entire "where do I safely keep a secret" question for that one form, at the cost of depending on a third party. Building your own function gives you more control and is genuinely worth doing once, for the practice — but it isn't the only correct answer, and reaching for one of these services for a simple contact form is a completely reasonable engineering decision, not a shortcut you should feel bad about.

# A quick self-audit for your portfolio

Before you consider a deployment finished, it's worth a five-minute pass over exactly this:

- Open your Network tab and look at the response from every serverless function your portfolio has — is anything in there that shouldn't be?
- Search your client code for `import.meta.env` — is every result intentionally prefixed with `VITE_`? Then search any `/api` functions for `process.env` — is every one of those values kept out of the response body?
- Check `.gitignore` — does it list `.env`, `.env.local`, and any other file holding real secrets?
- Run `npm audit` — is there anything reported that you haven't looked at yet?

> 💡 **None of this requires new tools.** It's the same DevTools and search bar you already use every day — just pointed at a different question.

# Additional Resources

## Reading

- [OWASP – API Security Top 10](https://owasp.org/www-project-api-security/)
- [Vercel – Functions](https://vercel.com/docs/functions)

---

# Wrapping up

You now have the other half of what it takes to ship software professionally. Writing features and tests (last week) proves your code works. This week's toolkit is what makes shipping that code *safe* to do again and again, without a human double-checking every step by hand: trunk-based development and feature flags as the practice, a fast-failing pipeline guarded by branch protection as the automation, and secret-conscious, dependency-aware configuration as the safety net underneath all of it.

None of these ideas are independent of each other, which is worth sitting with for a moment. Small trunk-based merges are only safe *because* a test suite backs them up. A pipeline is only a real guarantee *because* branch protection makes it mandatory, not optional. A secret is only safe *because* it never crosses the one boundary — client code — where privacy stops existing. Pull on any one thread and the others explain why it's there.

This is also the final week of the core curriculum. Every skill from here is one you already have: read the problem carefully, write the smallest correct fix, prove it with a test, and ship it in a way you'd trust without watching over it.

# Bringing it back to your portfolio

Your assignment this week is to make sure your own portfolio's deployment is something you'd trust:

- Add (or fix) a CI workflow that runs your tests on every push and pull request
- Add at least one environment-aware configuration function, with a test for it
- Audit your own serverless functions for anything that shouldn't be in a response
- Document how your deployment actually works, for the next person who touches this code — which might be you, in six months

> 💡 **The goal isn't a perfect pipeline.** It's a portfolio where "push and it just works" is true because you built it that way, not because nothing has gone wrong yet.
