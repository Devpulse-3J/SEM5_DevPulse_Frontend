# DevPulse Frontend — Guidance

## What this repo is

This is the **frontend only** for DevPulse, a developer-productivity and code-quality
insights dashboard for distributed engineering teams.

There is **no backend code here.** The backend lives in a separate repo and is reached
**exclusively through its REST API gateway** — every request the frontend makes goes to
the gateway, never directly to an individual backend service.

This repo is a **monorepo**: two Next.js apps that both consume two shared packages.

## Folder layout

```
SEM5_DevPulse_Frontend/
├── dashboard-app/     # Next.js app — analytics UI          (port 3000)
├── admin-app/         # Next.js app — admin console         (port 3001)
├── shared-ui/         # shared React component library
└── shared-types/      # TypeScript types mirroring backend DTOs
```

- **dashboard-app** — the analytics UI: DORA charts (deployment frequency, lead time,
  MTTR, change failure rate), developer workload, PR/review activity. Used by
  **Managers and Developers** — it serves **two role-gated views** from one codebase
  (see below).
- **admin-app** — the admin console: create/delete projects, manage organisations,
  members and invitations, and connect/disconnect the GitHub and Jira integrations.
  Used by **Admins**.
- **shared-ui** — React components both apps use: chart wrappers, tables, layout.
- **shared-types** — the API contract. TypeScript types that mirror the backend's DTOs,
  so both apps speak the same shapes as the gateway.

Both apps import from `shared-ui` and `shared-types`. Anything used by both apps belongs
in a shared package, not copy-pasted into each app.

### Two apps, three role-views — not three apps

Three roles does **not** mean three Next.js apps. An **app** is a separately-running
server (its own port, build, and login); a **dashboard** is a view a role sees *inside*
an app. The Manager and Developer views both live in **dashboard-app**, gated by role,
because they look at the same kind of thing (project analytics) at different scopes:

- **Manager view** — owns the project: whole-project DORA metrics, team workload,
  alert rules and channels.
- **Developer view** — scoped to the person: own PRs and reviews, personal activity,
  received alerts.

A Developer logging in simply isn't rendered the Manager-only panels. Do **not** add a
third app for this — one codebase with `role`-based gating keeps the charts and layout
shared instead of triplicated.

## Tech stack

| Concern | Use |
|---|---|
| Framework | Next.js, **App Router** |
| Language | TypeScript (strict) |
| UI | React |
| Styling | Tailwind CSS |
| Charts | **Chart.js** via `react-chartjs-2` — **not Recharts** |
| Global client state | Redux Toolkit |
| Server state (fetch/cache/refresh) | React Query (`@tanstack/react-query`) |
| Auth / sessions | NextAuth.js |
| Runtime | Node.js 20+ |

Exact versions are in [`requirement.txt`](requirement.txt).

## Roles

There are exactly **three** roles. There is no Viewer role.

| Role | Scope | Can do | App |
|---|---|---|---|
| **Admin** | The company | Create and delete projects, manage the organisation, members and invitations, connect/disconnect integrations | admin-app (3001) |
| **Manager** | Owns a project | Whole-project DORA dashboards, team workload, alert rules and channels | dashboard-app (3000) |
| **Developer** | Themselves | Own PRs and reviews, personal + team activity, receives alerts | dashboard-app (3000) |

The UI must be **gated by role**: an Admin manages projects in `admin-app`; a Manager and
a Developer share `dashboard-app` but each sees only their own view. A Developer is never
shown Admin or Manager-only screens.

## Backend API

All requests go through the **API gateway**. The base URL comes from the
`NEXT_PUBLIC_API_BASE_URL` environment variable — never hard-code it.

Authenticate by sending the JWT as a header:

```
Authorization: Bearer <token>
```

Rough surface (all paths are relative to the gateway base URL):

- **Auth** — `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/users/me`
- **Orgs & invites** — `/api/orgs`, `/api/orgs/{id}/invitations`
- **Integrations** — `/api/integrations`, `/api/integrations/github/connect`
- **Metrics** — `/api/metrics/dora`, `/api/metrics/prs`, `/api/metrics/workload`, `/api/metrics/deployments`
- **Analytics** — `/api/analytics/predictions`, `/api/analytics/prs/{id}/risk`
- **Notifications** — `/api/notifications/rules`, `/api/notifications/channels`, `/api/notifications/history`

## Environment variables

Each app has its own `.env.local` (git-ignored — **never commit real values**):

```bash
NEXTAUTH_SECRET=<placeholder>
NEXTAUTH_URL=http://localhost:3000        # dashboard-app; use http://localhost:3001 for admin-app
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Only variables prefixed `NEXT_PUBLIC_` reach the browser. `NEXTAUTH_SECRET` must stay
server-side.

## Conventions

- Chart.js for **every** visualisation — keep the library consistent across both apps.
- Server data goes through React Query; Redux Toolkit is for client state only (UI state,
  filters, selections) — don't duplicate server data into Redux.
- Shared types live in `shared-types` and mirror the backend DTOs; when the gateway
  contract changes, update it there first.
