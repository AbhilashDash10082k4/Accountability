# AGENTS.md

## Startup Rules

Before writing any code, complete these steps in order:

1. **Read this file completely.** It defines the boundaries and conventions for this project.
2. **Read `docs/ARCHITECTURE.md`** to understand the structure of project.
3. **Read `docs/PRODUCT.md`** to understand the feature requirements.
4. **Use `/graphify` skill.** If `graphify-out/graph.json` exists, run `/graphify query "<question>"` to trace paths. Otherwise, generate graph for deep codebase context.
5. **Run `bash init.sh`** to verify the project builds cleanly. If it fails, fix build errors before proceeding.
6. **Read `feature_list.json`** to see the current state of all features.

## Expo Layers

This project has strict feature layers. Code must respect these boundaries:

### Calendar (`features/calendar/`, `app/(tabs)/calendar.tsx`)

- Owns the Calendar day grid view. Each month/year visible. Uses `expo-calendar`.

### Tasks (`features/tasks/`, `app/(tabs)/tasks.tsx`)

- Shows all daily tasks. Allows proof upload.

### App Blocking (`features/blocking/`, `modules/block-distractions/`)

- Supports app blocking by displaying an overlay. Works for both Android and iOS.

### Analytics (`features/analytics/`, `app/(tabs)/analytics.tsx`)

- Shows percentage of daily task completion, streak, efficiency.

### Proofs (`features/proofs/`, `features/verification/`)

- Allows proof upload. Verification engine queues and validates sequentially (text, image, video, URLs). Minimal LLM calls.

### Profile (`features/profile/`, `app/(tabs)/profile.tsx`)

- Long-term goals (5y, 1y, 1m). Allow the user to set the path that he has decided to take to achieve the goals
  -Suggests better execution paths. Visual progress tracking.

## Conventions

- TypeScript strict mode is enabled. No `any` types without a comment explaining why.
- **Caveman Mode Active:** Minimize token usage. Use terse language ("caveman speak"). Technical substance exact. Drop fluff. Pattern: [thing] [action] [reason]. [next step]. (Reference: `accountability\.agents\skills\caveman`).

## Definition of Done

1. TypeScript compiles without errors (`npx expo lint`).
2. The app launches and is visible (`npx expo start`).
3. The feature appears in `feature_list.json` with status `"pass"` and evidence.
4. No console errors during normal operation.
5. End-to-end functionality works.
6. Loading and Empty states exist.
7. Permissions are handled. Data persists correctly. Tests pass.

## Working with the Feature List

`feature_list.json` is the source of truth. Features have `status`: `"pass"`, `"fail"`, `"not-started"`. Update status to `"pass"` with evidence when done. Never delete features.

## Progress Tracking Rules

Start session:

1. Read `claude-progress.md`. Understand current state. Continue from last task.

End session:

1. Update `claude-progress.md` with completed work, file structure changes, blockers, next tasks, and new Session Log entry. A session is not complete until this is updated.

## Context Engine (CCE)

This project uses Code Context Engine for intelligent code retrieval and
cross-session memory.

### Searching the codebase

**Use `context_search` instead of reading files directly** when exploring
the codebase, answering questions about code, or understanding how things
work. `context_search` returns the most relevant code chunks with
confidence scores instead of whole files.

When to use `context_search`:
- Answering questions about the codebase ("how does X work?", "where is Y?")
- Exploring structure or architecture
- Finding related code, functions, or patterns

Other tools:
- `expand_chunk` for full source of a compressed result
- `related_context` for what calls/imports a function
- `session_recall` to recall past decisions

### Cross-session memory

Call `session_recall("topic phrase")` before answering non-trivial questions.
Call `record_decision(decision="...", reason="...")` after making choices.
Call `record_code_area(file_path="...", description="...")` after meaningful work.

### Output style

Respond in compressed style. Drop articles (a, an, the) in prose. Use
sentence fragments over full sentences. Use short synonyms (fix not resolve,
check not investigate). Pattern: [thing] [action] [reason]. [next step].
No filler, hedging, pleasantries, trailing summaries, or restating what
the user said. One sentence if one sentence is enough.

When suggesting code changes, show only the changed lines with 3 lines of
context. Never rewrite entire files. Multiple changes in one file: show each
change separately. Never echo back unchanged code the user already has.

Code blocks, file paths, commands, error messages: always written in full.
Security warnings and destructive action confirmations: use full clarity.
