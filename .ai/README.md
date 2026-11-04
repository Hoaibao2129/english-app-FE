# AI rules

Single source of truth for the coding conventions every AI assistant must
follow in this repo. Edit files in `rules/` only; IDE-specific files are
generated from them.

## Layout

```
.ai/
├── README.md          # this file
├── targets.json       # which IDE outputs to generate
└── rules/             # base rules (one topic per file)
    ├── 00-project-overview.md
    ├── 10-architecture.md
    └── ...
```

## Rule file format

```markdown
---
title: Naming conventions
description: One line, used by IDEs to decide when to load the rule
globs: ['src/**/*.ts', 'src/**/*.tsx'] # optional, [] = no file scope
always_apply: true # true = always in context
---

Rule body in Markdown.
```

- Files are emitted in filename order, so keep the numeric prefix.
- `always_apply: false` + `globs` → loaded only when touching matching files
  (on IDEs that support scoping; otherwise it is concatenated like the rest).

## Generate

```bash
npm run rules:gen                    # every target in targets.json
npm run rules:gen -- cursor claude   # only these targets
npm run rules:check                  # fail if generated files are stale (CI)
```

| Target   | Output                                                       |
| -------- | ------------------------------------------------------------ |
| claude   | `CLAUDE.md`                                                  |
| agents   | `AGENTS.md` (Codex, Gemini CLI, Zed, … read this)            |
| cursor   | `.cursor/rules/*.mdc`                                        |
| copilot  | `.github/copilot-instructions.md` + `.github/instructions/*` |
| windsurf | `.windsurf/rules/*.md`                                       |

Generated files start with an `AUTO-GENERATED` banner — never edit them by hand.
