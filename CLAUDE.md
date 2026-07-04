# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Mentoring content for HackYourFuture — a programming school in Amsterdam teaching frontend development to people from underrepresented communities. Each week folder contains exercises and lesson plans for beginner-to-intermediate students.

## Commands

```bash
npm test                  # run all tests (watch mode)
npm run test:ui           # open Vitest browser UI
npm run test:coverage     # run tests with coverage report
```

To run tests for a single file:

```bash
npx vitest run "Week 13 - Testing & Quality/1. Writing Tests for Existing Code/portfolioUtils.spec.js"
```

## Repository structure

```
Week <N> - <Topic>/
  lesson-plan.md                       ← lesson plan (Markdown, Notion-ready)
  Learning Material.md                 ← concept explanations (Markdown, Notion-ready)
  <N>. <Exercise Type>/
    <camelCaseFilename>.js             ← exercise starter file
    <camelCaseFilename>.spec.js        ← Vitest test file (when applicable)
```

Exercises come in two forms:

- **Refactoring exercises** (`1. ...`) — messy or repetitive starter code for students to clean up, usually paired with a `.spec.js`
- **Pair exercises** (`2. ...`) — open-ended JS challenges done in pairs, no spec file by default

## Test file conventions

- ESM imports only: `import { describe, it, expect } from "vitest"` and named imports from the exercise file
- Vitest globals are enabled (`globals: true`), so `describe`/`it`/`expect` don't need importing — but the agent's spec template imports them anyway for clarity
- Tests must be readable and tied directly to the learning goal; avoid testing implementation details

## Learning material formatting (Notion-ready Markdown)

All `.md` content is written to be copy-pasted into Notion:

- Use `##` for exercise/section titles, `###` for sub-sections
- Fenced code blocks with ` ```javascript `
- `> 💡` for tips/key takeaways, `> 🤝` for pair exercise framing, `> ⚠️` for common mistakes
- No horizontal rules (`---`), no raw HTML
- Bold for key terms on first introduction

## Agent

`.github/agents/hyf-content-author.agent.md` defines the **HYF Learning Material Author** agent. Invoke it when creating or improving exercises, concept explanations, lesson plans, or spec files. It enforces all content-type templates and Notion formatting rules described above.

DO NOT generate solutions to exercises — only starter code, requirements, and tests.

## Scope of my work to create and finalise the Learning Material.md of Week 13 - Testing & Quality and Week 14 - Deployent & CI/CD

Here you can see a conversation I had with the education director, first message is mine and the second one is the reply from the education director:

- Hi there! I wanted to clarify the scope of my tasks to ensure everything is covered. Should I be developing the lesson plans alongside the learning materials, or is the assigned mentor for that week responsible for creating their own plans?

- Hi, I will create the lesson plan and slides for the material, you don't need to do it. The scope of your tasks is only learning the materials and if you have the time, the assignment as well. Please make sure that the assignment builds on the previous ones (creating a professional portfolio). You can have a look at the other weeks for inspiration.

So, as you would be aware that the each week has a lesson plan and and slides, and the scope of my work is to create the learning material for Week 13 - Testing & Quality and Week 14 - Deployment & CI/CD. I will ensure that I will not touch the lesson plan and slides, and will focus only on creating the learning material for these two weeks, nothing else. So, my job is only about creating two markdown files properly: Learning Material.md for Week 13 - Testing & Quality and Learning Material.md for Week 14 - Deployment & CI/CD. I will ensure that the content of markdown files will be ready to be copy-pasted into Notion, and will follow the formatting rules mentioned in this CLAUDE.md file.

## Reference content from previous weeks

You can find them on the following urls and sub pges of those urls:
1- https://hub.hackyourfuture.nl/core-program-week-3
2- https://hub.hackyourfuture.nl/core-program-week-4

So you can follow the same structure and make sure including Practice and Assignment pages as well.
