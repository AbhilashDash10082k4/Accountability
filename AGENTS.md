# AGENTS.md

Proof-of-Execution Operating System

# Project Vision

ExecutionOS is a discipline-first operating system designed to transform ambitions into measurable execution.

The system exists to:

- Convert goals into executable tasks
- Require proof-of-work for completion
- Eliminate fake productivity
- Block distractions(apps like instagram, facebook, youtube, etc) until work is completed
- Provide measurable progress toward long-term goals

# Core Product Principles

## Principle 1: Execution > Consumption

The product should always encourage creating, shipping, learning, building, exercising, or selling.

## Principle 2: Deterministic Systems > AI Systems

Prefer:

- Validation rules
- Integrations
- Event-based systems
- Explicit logic

Before:

- LLM calls
- AI inference
- Agentic workflows

# Technology Stack

## Mobile -(Make the frontend follow component architecture. Emphasize separation of concerns as much as possible)

- React Native
- Expo
- TypeScript
- NativeWind
- Zustand
- React Query

## Backend

- Expo router
- TypeScript
- Prisma
- PostgreSQL
- Redis
- BullMQ

## Authentication

- Supabase Auth
- Google OAuth

## Storage

Supabase Storage

## Analytics

- Internal analytics engine
- Minimal LLM usage

# Architecture Rules

## Mandatory Layering

All requests must follow:

Route
→ Controller
→ Service
→ Repository / Prisma
→ Database

Never allow routes to access Prisma directly.

## Business Logic Location

Business logic belongs only in Services.

Never place business logic inside:

- Routes
- Controllers
- UI components

## Database Access

Only repositories/services may access Prisma. Never access Prisma directly from UI-related code.

## State Management

Use Zustand for:

- User session
- Active goal
- Focus mode state
- App settings

Use React Query for:

- Server state
- API caching
- Mutations

Do not duplicate server state into Zustand.

# AI Usage Policy

ExecutionOS intentionally minimizes AI.

Allowed AI usage:

- Daily insights
- Bottleneck summaries
- Future content summarization

AI must never:

- Automatically complete tasks
- Bypass proof validation
- Override execution rules
- Modify user goals

# Focus Mode Rules

Focus mode is a core feature. It should be treated as mission-critical infrastructure.

Requirements:

- Survive app minimization
- Survive navigation changes
- Restore after app relaunch
- Persist session state

Users must not lose focus session state accidentally.

# Proof System Rules

A task is never completed manually. Every task requires proof.

Allowed proof types:

- Link
- Screenshot
- Video/ Live screen recording
- Text Summary

Future proof types:

- GitHub
- Gmail
- LeetCode
- Deployment Verification
  Task completion must always be deterministic.

# Scheduling Rules

Requirements:

- Prevent overlapping tasks
- Carry forward unfinished tasks
- Prioritize carried-forward tasks

Tasks must never silently disappear.

# Security Rules

## Authentication

Every protected endpoint requires authentication.(Implement it at last)

## Authorization

Users can only access their own data. All database queries must be scoped by:

user_id

## File Uploads

Validate:

- MIME type
- File size
- Ownership

Never trust client-side validation.

# Performance Rules

Avoid premature optimization.

However:

- No unnecessary re-renders
- No duplicated API calls
- No polling where events suffice

Prefer:

- Caching
- Event-driven updates
- Queue processing

# Error Handling Rules

All backend endpoints must return:

- Success state
- Error state
- Human-readable message

Never return raw server errors.

# Logging Rules

Log:

- Authentication events
- Focus session events
- Task completion events
- Upload failures
- Critical errors

# Analytics Rules

Track:

- Completion %
- Focus hours
- Streaks
- Violations
- Missed tasks

Do not track unnecessary personal data.

# UI Philosophy

The interface should feel:

- Calm
- Minimal
- Serious
- Focused

# Definition of Done

A feature is complete only when:

- It works end-to-end
- Errors are handled
- Loading states exist
- Empty states exist
- Permissions are handled
- Data persists correctly
- Tests pass

Feature completion is not code completion.

# VERIFICATION COMMANDS:

- Tests: npx expo test
- Type check: npx expo type-check
- Lint: npx expo lint
- Verification -npx expo-doctor
- Migrate- npx prisma migrate deploy

## Progress Tracking Rules

At the start of every session:

1. Read PROGRESS.md
2. Understand current state
3. Continue from last recorded task

At the end of every session:

1. add completed work
2. add file structure changes
3. add blockers
4. add next tasks
5. Add a new Session Log entry

A session is not complete until PROGRESS.md has been updated.

## Token Utilization-

minimize token usage in thinking and output everytime by reading accountability\.agents\skills\caveman
