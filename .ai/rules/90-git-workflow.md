---
title: Git workflow
description: Branch naming, commit message format, PR expectations
globs: []
always_apply: true
---

# Git

- Never commit directly to `main`; branch as `feat/<name>`, `fix/<name>`,
  `chore/<name>`.
- Commit message: `[Tag] Short imperative summary`
  - Tags: `[Feature]`, `[Improve]`, `[Fix]`, `[Refactor]`, `[Chore]`
- One logical change per PR; lint, format:check, build and rules:check green before opening it.
- Don't commit `dist/`, `.env*` (except `.env.example`), or generated
  files you didn't regenerate with `npm run rules:gen`.
