# DevPulse Frontend — Product & Setup Guide

## Which document to read

- **This file (`guidance.md`)** — what DevPulse is, how to set it up and run it locally,
  environment variables, the backend API surface, roles, and project conventions.
- **[`instruction.md`](instruction.md)** — the engineering guide: folder structure,
  architecture decisions, and **who owns what**. Read it before writing code.

## What this repo is

This is the **frontend only** for DevPulse, a developer-productivity and code-quality
dashboard for distributed engineering teams.

There is **no backend code here.** The backend lives in a separate repo and is reached
**exclusively through its REST API gateway** — every request the frontend makes goes to the
gateway, never directly to an individual backend service.

It is a **single Next.js app** (App Router). All three roles live in one codebase, separated
by route groups and gated by role. (An earlier plan used a two-app monorepo with
`shared-ui` / `shared-types` packages; that was dropped for simplicity. Any references to
those folders are stale.)

## Architecture in brief

Full detail is in [`instruction.md`](instruction.md). The essentials:

- Everything lives under `src/` (`app/`, `components/`, `features/`, `services/`, `hooks/`,
  `store/`, `lib/`, `types/`, `utils/`, `styles/`).
- Two route groups serve three roles:
  - **`(admin)/`** — Admin only.
  - **`(workspace)/`** — Manager **and** Developer share this, because ~90% of their UI is
    identical. Role-specific panels are chosen inside components, not in separate routes:
    ```tsx
    if (role === "MANAGER")   { /* team-wide DORA, workload, team PRs */ }
    if (role === "DEVELOPER") { /* my PRs, my repositories, my alerts */ }
    ```
- Route-group `layout.tsx` files enforce role access with `lib/auth-guard.ts`.
- Drill-down screens (PR Risk Detail, Repository Detail) are dynamic routes —
  `(workspace)/pull-requests/[id]/` and `(workspace)/repositories/[id]/`.

## First-time setup

> The single-app scaffold (root config + the empty `src/` skeleton) is **already in the
> repo**. Most people just clone, install, and run — steps 0–2, then 7 and 8. Steps 3–6
> explain how the scaffold is wired and how to fill in the parts that ship empty.

### 0. Check your tools

```bash
node -v     # must be >= 20
npm -v      # must be >= 10
git --version
```

If `node -v` is below 20, install Node 20 LTS (use `nvm` if you juggle versions). The whole
team should be on the **same major** version of Node and npm.

### 1. Clone and install

```bash
git clone git@github.com:UmayaJayasuriya/SEM5_DevPulse_Frontend.git
cd SEM5_DevPulse_Frontend
npm install               # from the repo ROOT
```

### 2. Set up your environment file

```bash
cp .env.example .env.local     # then edit .env.local with real values — ask the team
```

`.env.local` is git-ignored. **Never commit it.** If you ever do, rotate the secret —
deleting the file later does not remove it from git history. See
[Environment variables](#environment-variables).

### 3. How the root is configured

The repo root already has `package.json` (single app, Node pinned via `"engines"`, scripts
`dev`/`build`/`start`/`lint`/`format`), plus `tsconfig.json` (strict mode, `@/*` → `src/*`
path alias), `next.config.ts`, `postcss.config.mjs`, and `eslint.config.mjs`. Don't re-run
`create-next-app` over it.

### 4. The `src/` skeleton

The full `src/` tree exists as empty placeholder files. See [`instruction.md`](instruction.md)
for the tree and ownership. Fill in **your own** area; don't edit another person's files.
App Router only (folder is `src/app/`, never `pages/`); `tsconfig` stays `"strict": true`.

### 5. Imports and shared code

There are no shared packages — shared code lives in `src/components`, `src/lib`, `src/types`,
etc. Import it with the `@/` alias, e.g. `import { Button } from "@/components/ui/Button"`.

### 6. Styling — Tailwind v4 (CSS-first)

There is no `tailwind.config.js`. `postcss.config.mjs` uses `@tailwindcss/postcss`, and
`src/styles/globals.css` starts with `@import "tailwindcss";`. Theme tokens are defined in
CSS with `@theme` — that is the **single source of truth** for the palette. Mirror colors into
`src/styles/theme.ts` only when Chart.js needs plain JS strings.

### 7. App-wide providers (owned by Person A)

`src/app/providers.tsx` is a **client component** (`'use client'`) mounted from
`src/app/layout.tsx`, wrapping the app in three providers:

1. **React Query** — one `QueryClient` per browser session; sensible `staleTime`/retries;
   devtools in development only.
2. **Redux Toolkit** — `src/store` for *client* state only (filters, selections, UI toggles).
   Server data never goes here.
3. **NextAuth `SessionProvider`** — so `useSession()` works anywhere.

Set up NextAuth in `src/app/api/auth/[...nextauth]/route.ts`: a Credentials provider that
posts to `/api/auth/login` on the gateway, with callbacks that carry the gateway's JWT **and
the user's `role`** into the session. Role-gating depends on that role — get it right first.

### 8. Run and verify

```bash
npm run lint
npm run build          # must build clean, zero TypeScript errors
npm run dev            # http://localhost:3000
```

The backend gateway must be running on `NEXT_PUBLIC_API_BASE_URL` (default
`http://localhost:8080`) or every request will fail. That repo is separate — check with
whoever owns it.

## Tech stack

| Concern | Use |
|---|---|
| Framework | Next.js, **App Router** |
| Language | TypeScript (strict) |
| UI | React |
| Styling | Tailwind CSS v4 (CSS-first) |
| Charts | **Chart.js** via `react-chartjs-2` — **not Recharts** |
| Global client state | Redux Toolkit |
| Server state (fetch/cache/refresh) | React Query (`@tanstack/react-query`) |
| HTTP | native `fetch()` — **not axios** |
| Auth / sessions | NextAuth.js |
| Runtime | Node.js 20+ |

Exact pinned versions are in [`requirement.txt`](requirement.txt).

## Roles

There are exactly **three** roles. There is no Viewer role.

| Role | Scope | Can do | Route group |
|---|---|---|---|
| **Admin** | The company | Create/delete projects, manage the organisation, members and invitations, connect/disconnect integrations | `(admin)/` |
| **Manager** | Owns a project | Whole-project DORA dashboards, team workload, alert rules and channels | `(workspace)/` |
| **Developer** | Themselves | Own PRs and reviews, personal + team activity, receives alerts | `(workspace)/` |

The UI must be **gated by role**. `(admin)/` and `(workspace)/` are separated by
`lib/auth-guard.ts` in each group's `layout.tsx`. **Within** `(workspace)/`, Manager-only and
Developer-only panels are shown/hidden with `role` checks inside the components — a Developer
is never rendered Manager-only panels, and vice versa.

## Backend API

All requests go through the **API gateway**. The base URL comes from the
`NEXT_PUBLIC_API_BASE_URL` environment variable — **never hard-code it**.

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

One `.env.local` at the repo root (git-ignored — **never commit real values**):

```bash
NEXTAUTH_SECRET=<placeholder>
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Only variables prefixed `NEXT_PUBLIC_` reach the browser. `NEXTAUTH_SECRET` must stay
server-side. A `.env.example` with placeholder values is committed so new teammates know
what to fill in.

## Conventions

- **Charts:** Chart.js via `react-chartjs-2` for every visualisation — never Recharts. For a
  date/time axis, import `chartjs-adapter-date-fns` (Chart.js has no built-in date support).
- **Data:** server data goes through React Query; Redux Toolkit is for client state only
  (UI state, filters, selections) — don't duplicate server data into Redux.
- **HTTP:** all requests go through `src/services/api-client.ts` using `fetch` — never axios.
- **Types:** shared types live in `src/types` and mirror the gateway DTOs; when the contract
  changes, update them there first, then update consumers.
- **Ownership:** own your area (see [`instruction.md`](instruction.md)); shared "glue" files
  have a single editor — ask before changing them.

## Working agreement

- **Branch per task**: `feature/<short-name>`, `fix/<short-name>`. Never commit to `main`
  directly; open a PR.
- Run `npm run lint` and `npm run build` **before** you open a PR.
- Adding a dependency? Add it to [`requirement.txt`](requirement.txt) in the same PR, and
  check the "Do NOT add" list there first (notably: **no axios, no Recharts**).
- Commit `package-lock.json` whenever it changes — it keeps everyone's installs identical.

## Common mistakes

| Symptom | Cause |
|---|---|
| `useSession`/`useSelector` "must be used within a Provider" | `providers.tsx` isn't `'use client'`, or isn't mounted in the root layout |
| Every API call 401s | JWT not attached as `Authorization: Bearer <token>`, or the gateway isn't running |
| Chart with a date axis silently fails | `chartjs-adapter-date-fns` not imported |
| Import fails with a long relative path | Use the `@/` alias (`@/components/...`) instead of `../../..` |
| A route renders for the wrong role | `lib/auth-guard.ts` not applied in that route group's `layout.tsx` |
