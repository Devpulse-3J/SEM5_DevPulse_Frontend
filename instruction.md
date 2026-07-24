# DevPulse Frontend Engineering Guide

## Purpose

DevPulse is a developer-productivity and code-quality dashboard for distributed engineering teams. This document defines the frontend architecture, directory responsibilities, and team ownership so that a new contributor can identify their work area and start safely.

For local setup, environment variables, API details, and the full product guidance, read [guidance.md](guidance.md).

## Technology baseline

| Concern | Standard |
|---|---|
| Framework | Next.js 15, App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Client state | Redux Toolkit |
| Server state | React Query |
| Authentication | NextAuth |
| Charts | Chart.js through `react-chartjs-2` |
| HTTP | Native `fetch()` |

## Application architecture

DevPulse is one Next.js application. It has three roles: **ADMIN**, **MANAGER**, and **DEVELOPER**.

Admin functionality is structurally different from the day-to-day product workspace, so it lives in the `(admin)` route group. Managers and developers use a single `(workspace)` route group because roughly 90% of their interface, navigation, metrics framing, and data presentation are shared. Role-specific panels are selected inside components instead of maintaining two near-duplicate route trees.

```tsx
{role === "MANAGER" && <ManagerDashboard />}
{role === "DEVELOPER" && <DeveloperDashboard />}
```

This keeps common UX and authorization flows consistent, prevents duplicated code from drifting, and makes shared improvements available to both roles at once. Route-group layouts must still enforce role access through `lib/auth-guard.ts`; component-level checks decide which workspace panels a permitted user sees.

## Frontend structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── (admin)/
│   ├── (workspace)/
│   ├── api/
│   ├── layout.tsx
│   ├── providers.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── charts/
│   ├── tables/
│   ├── layout/
│   └── notifications/
├── features/
│   ├── auth/
│   ├── users/
│   ├── projects/
│   ├── repositories/
│   ├── pullRequests/
│   ├── dora/
│   ├── analytics/
│   ├── alerts/
│   ├── notifications/
│   └── integrations/
├── services/
│   ├── api-client.ts
│   ├── auth.service.ts
│   ├── dashboard.service.ts
│   ├── project.service.ts
│   ├── repository.service.ts
│   ├── github.service.ts
│   ├── jira.service.ts
│   ├── dora.service.ts
│   ├── analytics.service.ts
│   ├── alert.service.ts
│   └── notification.service.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   ├── useRepositories.ts
│   ├── useDora.ts
│   ├── usePullRequests.ts
│   ├── useAlerts.ts
│   └── useNotifications.ts
├── store/
│   ├── index.ts
│   ├── authSlice.ts
│   ├── dashboardSlice.ts
│   ├── projectSlice.ts
│   ├── alertSlice.ts
│   └── notificationSlice.ts
├── lib/
│   ├── auth.ts
│   ├── auth-guard.ts
│   ├── permissions.ts
│   ├── constants.ts
│   └── validators.ts
├── types/
│   ├── auth.ts
│   ├── user.ts
│   ├── project.ts
│   ├── repository.ts
│   ├── pullRequest.ts
│   ├── dora.ts
│   ├── analytics.ts
│   ├── notification.ts
│   └── index.ts
├── utils/
│   ├── formatDate.ts
│   ├── calculateDuration.ts
│   ├── helpers.ts
│   ├── colors.ts
│   └── exportCSV.ts
└── styles/
    ├── globals.css
    └── theme.ts
```

| Top-level folder | Responsibility |
|---|---|
| `app/` | App Router pages, route-group layouts, route handlers, and application composition. |
| `components/` | Reusable presentation components, grouped by UI purpose rather than product domain. |
| `features/` | Domain-focused UI and business logic that compose services, hooks, and reusable components. |
| `services/` | Fetch-based gateway API access; services expose domain operations. |
| `hooks/` | Reusable React hooks, primarily React Query query and mutation wrappers. |
| `store/` | Redux configuration and global client-only state such as UI selections and filters. |
| `lib/` | Shared framework, authorization, validation, and application utilities. |
| `types/` | TypeScript contracts that mirror API gateway DTOs. |
| `utils/` | Small, framework-independent helpers for formatting, calculations, colors, and exports. |
| `styles/` | Global Tailwind v4 tokens and Chart.js-compatible theme values. |

## Dashboard design

The shared dashboard is intentionally split into complete files:

| File | Responsibility | Owner |
|---|---|---|
| `dashboard/page.tsx` | Thin role-aware entry point that composes the common dashboard with the relevant role panel. | Person B |
| `dashboard/SharedDashboard.tsx` | The common frame: filters, shared metrics, layout, and content slot. | Person B |
| `dashboard/ManagerDashboard.tsx` | Manager-only team and project panels. | Person B |
| `dashboard/DeveloperDashboard.tsx` | Developer-only personal panels. | Person C |

```tsx
if (role === "MANAGER") {
  return <SharedDashboard><ManagerDashboard /></SharedDashboard>;
}

if (role === "DEVELOPER") {
  return <SharedDashboard><DeveloperDashboard /></SharedDashboard>;
}
```

The split preserves one shared experience while giving each owner an exclusive file. Person C changes only `DeveloperDashboard.tsx`; Person B owns the shared and manager files. This eliminates dashboard merge conflicts without duplicating UI.

## Team ownership

| Person | Primary responsibility | Owned areas | Why this boundary works |
|---|---|---|---|
| **A** | Authentication and Admin | `(auth)/`, `(admin)/`, NextAuth, JWT/session work, `services/api-client.ts`, `app/providers.tsx`, all `lib/`, `features/auth`, `features/users`, `features/projects`, `authSlice`, `projectSlice`, and related auth/user/project types and hooks. | Authentication, session setup, route guards, and admin operations form one security-sensitive foundation. One owner keeps token behavior and access rules coherent. |
| **B** | Shared workspace foundation and manager metrics | `SharedDashboard.tsx`, `ManagerDashboard.tsx`, dashboard entry, shared `ui/`, charts, tables, layout, DORA, analytics, `styles/`, `store/index.ts`, `types/index.ts`, `dashboardSlice`, and shared utilities. | B owns the visual and metrics foundation used across the workspace, preventing inconsistent components, chart conventions, and design tokens. |
| **C** | Developer workflow and integrations | `DeveloperDashboard.tsx`, repositories, alerts, My PRs, GitHub integration, Jira integration, notifications, `components/notifications`, relevant services, hooks, slices, types, and `exportCSV.ts`. | Developer-facing workflows and external integrations change together, creating a focused vertical slice with minimal overlap with B's shared metrics work. |

Within `(workspace)`, ownership is by page: B owns its layout, dashboard, DORA, team-wide pull requests, and team views; C owns My PRs, repositories, and alerts. Do not edit another owner's page or feature area without coordinating first.

## Shared infrastructure

These files are imported across domains and therefore have exactly one editor. Contributors request changes from the owner rather than making parallel edits.

| File or area | Owner | Responsibility and rationale |
|---|---|---|
| `services/api-client.ts` | A | Central fetch wrapper. It resolves the base URL, attaches the JWT, and standardizes request/error handling; authentication ownership makes A the correct editor. |
| `app/providers.tsx` | A | Composes `SessionProvider`, React Query, and Redux at the app boundary. It is session/auth-adjacent and must remain stable. |
| `store/index.ts` | B | Registers every Redux slice. A single owner avoids concurrent reducer-registration conflicts. |
| `types/index.ts` | B | Re-exports domain types. One editor prevents barrel-export merge conflicts and accidental duplicate exports. |
| `components/ui/` | B | Shared controls such as buttons, cards, inputs, badges, and modals. Central ownership preserves a consistent interface. |
| `styles/` | B | `globals.css` defines Tailwind v4 design tokens; `theme.ts` provides Chart.js values. One owner prevents competing visual systems. |

## File ownership map

Every file/folder tagged with its owner — `[A]` Auth & Admin, `[B]` Manager & Metrics +
Foundation, `[C]` Developer & Integrations. Files marked "ask first" are imported across
domains — request changes from the owner rather than editing in parallel.

```text
src/
├── app/
│   ├── (auth)/                    [A]  login, register
│   ├── (admin)/                   [A]  all admin pages + layout.tsx
│   ├── (workspace)/               [B+C] shared — split per page:
│   │   ├── layout.tsx             [B]  role gating + shell
│   │   ├── dashboard/
│   │   │   ├── page.tsx           [B]  thin role router
│   │   │   ├── SharedDashboard.tsx     [B]
│   │   │   ├── ManagerDashboard.tsx    [B]
│   │   │   └── DeveloperDashboard.tsx  [C]
│   │   ├── dora/                  [B]
│   │   ├── pull-requests/         [B]  team-wide PRs
│   │   ├── team/                  [B]
│   │   ├── my-prs/                [C]
│   │   ├── repositories/          [C]
│   │   └── alerts/                [C]
│   ├── api/                       [A]  auth/[...nextauth]/route.ts
│   ├── layout.tsx                 [A]  root layout (mounts providers)
│   ├── providers.tsx              [A]  ask first — RQ + Redux + SessionProvider
│   └── page.tsx                   [A]  root landing / redirect
│
├── components/
│   ├── ui/                        [B]  ask first — Button, Card, Modal, Input, Spinner, Badge
│   ├── charts/                    [B]  DoraChart, LeadTimeChart, ...
│   ├── tables/                    [B]  PRTable, UserTable, ...
│   ├── layout/                    [B]  Navbar, Sidebar, Footer, Header
│   └── notifications/             [C]  AlertCard, Toast
│
├── features/
│   ├── auth/                      [A]
│   ├── users/                     [A]
│   ├── projects/                  [A]
│   ├── repositories/              [C]
│   ├── pullRequests/              [C]
│   ├── dora/                      [B]
│   ├── analytics/                 [B]
│   ├── alerts/                    [C]
│   ├── notifications/             [C]
│   └── integrations/             [C]
│
├── services/
│   ├── api-client.ts              [A]  ask first — everyone imports this
│   ├── auth.service.ts            [A]
│   ├── dashboard.service.ts       [B]
│   ├── project.service.ts         [A]
│   ├── repository.service.ts      [C]
│   ├── github.service.ts          [C]
│   ├── jira.service.ts            [C]
│   ├── dora.service.ts            [B]
│   ├── analytics.service.ts       [B]
│   ├── alert.service.ts           [C]
│   └── notification.service.ts    [C]
│
├── hooks/
│   ├── useAuth.ts                 [A]
│   ├── useProjects.ts             [A]
│   ├── useRepositories.ts         [C]
│   ├── useDora.ts                 [B]
│   ├── usePullRequests.ts         [C]
│   ├── useAlerts.ts               [C]
│   └── useNotifications.ts        [C]
│
├── store/
│   ├── index.ts                   [B]  ask first — combines all slices
│   ├── authSlice.ts               [A]
│   ├── dashboardSlice.ts          [B]
│   ├── projectSlice.ts            [A]
│   ├── alertSlice.ts              [C]
│   └── notificationSlice.ts       [C]
│
├── lib/
│   ├── auth.ts                    [A]
│   ├── auth-guard.ts              [A]
│   ├── permissions.ts             [A]
│   ├── constants.ts               [A]
│   └── validators.ts              [A]
│
├── types/
│   ├── auth.ts                    [A]
│   ├── user.ts                    [A]
│   ├── project.ts                 [A]
│   ├── repository.ts              [C]
│   ├── pullRequest.ts             [C]
│   ├── dora.ts                    [B]
│   ├── analytics.ts               [B]
│   ├── notification.ts            [C]
│   └── index.ts                   [B]  ask first — barrel of all types
│
├── utils/
│   ├── formatDate.ts              [B]
│   ├── calculateDuration.ts       [B]
│   ├── helpers.ts                 [B]
│   ├── colors.ts                  [B]
│   └── exportCSV.ts               [C]
│
└── styles/
    ├── globals.css                [B]  design tokens (single source of truth)
    └── theme.ts                   [B]  Chart.js colors
```

**Tally:** A = auth, admin, `lib/`, and the app shell/plumbing. B = the visual foundation
(components, styles, charts) + manager metrics + the two barrel files. C = developer-facing
pages + external integrations + notifications.

## Development flow

```text
Person A: authentication, session, role guards, API client
                         ↓
Person B: shared workspace foundation and manager metrics
                         ↓
Person C: developer workflow and integrations
```

Person A is the initial bottleneck because real data access depends on login, session/JWT propagation, role information, providers, and the shared API client. B and C should build independently against local mock JSON in their feature folders until those pieces are ready. That lets the UI, state shapes, and loading/error states progress without waiting for the gateway connection.

## Development rules

- Do not edit another developer's owned files; coordinate changes to shared infrastructure.
- Do not create separate Manager and Developer UIs for shared workspace functionality; reuse the common dashboard and components.
- Reuse existing components before creating new ones.
- Keep pages small; put domain logic in `features/`, `hooks/`, and `services/`.
- Route all HTTP requests through `services/api-client.ts`; use native `fetch()`, never Axios.
- Use React Query for server state and Redux only for global client state.
- Use Chart.js via `react-chartjs-2` for charts.
- Protect route groups with role guards and apply component-level role checks for workspace-only panels.
- Keep components focused, composable, and reusable.
- Update `types/` first when a gateway DTO changes, then update its consumers.

## Contribution checklist

Before opening a pull request, confirm that the work stays within your ownership boundary, shared UI was reused where possible, and `npm run lint` plus `npm run build` pass. Use a task branch and open a PR rather than committing directly to `main`.
