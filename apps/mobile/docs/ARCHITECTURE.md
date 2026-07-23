# Architecture -- Accountability Mobile App

## System Overview

Accountability is a discipline-first app designed to transform ambitions into measurable execution

## Principle : Deterministic Systems > AI Systems

Prefer:

- Validation rules
- Integrations
- Event-based systems
- Explicit logic

# Technology Stack

## Mobile (Frontend Component Architecture)

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

- Supabase and Google auth

## Storage

- Supabase Storage

## Analytics

- Internal analytics engine
- Minimal LLM usage

# Architecture Rules

## Mandatory Layering

All requests must follow:
Route → Controller → Service → Repository / Prisma → Database

Never allow routes to access Prisma directly.

## Business Logic Location

Business logic belongs only in Services.
Never place business logic inside Routes, Controllers, or UI components.

## Database Access

Only repositories/services may access Prisma. Never access Prisma directly from UI-related code.

## State Management

Use Zustand for: User session, Active goal, Focus mode state, App settings.
Use React Query for: Server state, API caching, Mutations.
Do not duplicate server state into Zustand.

# AI Usage Policy

Accountability intentionally minimizes AI.
Allowed AI usage: Daily insights, Bottleneck summaries, Future planning.
AI must never: Automatically complete tasks, Bypass proof validation, Override execution rules, Modify user goals.

# Focus Mode Rules

Focus mode is a CORE feature
Requirements: Survive app minimization, Survive navigation changes, Restore after app relaunch, Persist session state.

# Proof System Rules

Every task requires proof for completion.
Allowed proof types: Link, Screenshot, Video/ Live screen recording, Text Summary
Future proof types: GitHub, Gmail, LeetCode, Deployment Verification.
Task completion must always be deterministic.

# Scheduling Rules

Requirements: Prevent overlapping tasks, Carry forward unfinished tasks, Prioritize carried-forward tasks.
Tasks must never silently disappear.

# Security Rules

## Authentication

Every protected endpoint requires authentication

## Authorization

Users can only access their own data. All database queries must be scoped by: user_id

## File Uploads

Validate: MIME type, File size, Ownership. Never trust client-side validation.

# Performance Rules

Avoid premature optimization. However: No unnecessary re-renders, No duplicated API calls, No polling where events suffice.
Prefer: Caching, Event-driven updates, Queue processing.

# Error Handling Rules

All backend endpoints must return: Success state, Error state, Human-readable message. Never return raw server errors.

# Logging Rules

Log: Authentication events, Focus session events, Task completion events, Upload failures, Critical errors.

# Analytics Rules

Track: Completion %, Focus hours, Streaks, Violations, Missed tasks. NO unnecessary personal data to be tracked.

# UI Philosophy

The interface should feel: Calm, Minimal, Serious, Focused.
