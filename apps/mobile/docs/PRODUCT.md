# Product Description -- Accountability

## Project Vision

Accountability is a discipline-first app designed to transform ambitions into measurable execution.
The system exists to:

- Convert goals into executable tasks
- Require proof-of-work for completion
- Eliminate fake productivity
- Block distractions (apps/domains) until work is completed
- Provide measurable progress toward long-term goals

## Core Features

### Authentication and Authorization

- User logs in via Supabase Auth & Google OAuth (Google SignIn button).
- All routes are authorized.

### Goal Setting - Profile Page

- User inputs long term (5y), yearly, and monthly goals and the path he choses to reach the goal
- AI refactors the execution plan, suggests timelines and milestones.
- Progress visualization based on daily task completion. Minimal LLM calls.

### Calendar View

- Google Calendar-like functionality. Grid view of days.
- 24-hr time blocks with current time indicator.
- Resizable, draggable task boxes. Popups for name, description, duration.
- Historical task view.

### App Blocking

- Task completion prerequisite. App selection overlay blocks chosen apps.
- Custom domain blocking supported.
- Distractions blocked until 90% of daily tasks are complete.
- Unfinished tasks carry forward to the next day automatically.

### Task Completion - Proof Engine

- Deterministic proof validation. Tasks marked complete only after valid proof submission.
- Formats: text, URL, image, video (.mp4). Max size: 10 MB.
- AI Validation: Lightweight open-source model (e.g. gemma4) evaluates proof legitimacy.

## Dashboard

- Shows speed and percentage of execution. Analytics (daily, weekly, monthly, yearly).

## User Interface

4-tab layout:

- Calendar - Showing the calendar view
- Tasks - Showing the tasks of the day set in the Calendar Tab
- Dashboard - Analytics (daily, weekly, monthly, yearly)
- Profile - Containing the long-term, mid-term, monthly goals, sign out button

## Constraints

- Maximum supported proof size: 10 MB.
- Supported formats: text, image , video, URL
