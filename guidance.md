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

### Two apps, three role-views(3 apps  danne nathiwa imu)

 An **app** is a separately-running
server (its own port, build, and login); a **dashboard** is a view a role sees *inside*
an app. The Manager and Developer views both live in **dashboard-app**, gated by role,
because they look at the same kind of thing (project analytics) at different scopes:

- **Manager view** — owns the project: whole-project DORA metrics, team workload,
  alert rules and channels.
- **Developer view** — scoped to the person: own PRs and reviews, personal activity,
  received alerts.,

A Developer logging in simply isn't rendered the Manager-only panels. Do **not** add a
third app for this — one codebase with `role`-based gating keeps the charts and layout
shared instead of triplicated.

## First-time setup

> **Read this before writing any code.** When you clone this repo you get the docs and four
> empty folders — nothing is scaffolded yet. The steps below are the agreed way to build
> that scaffold. **One person does steps 1–9 once and pushes**; everybody else clones after
> that and only does step 10.
>
> Do these steps in order. Each one says *what* to create and *why* — the actual
> implementation is yours to write.

### 0. Check your tools

```bash
node -v     # must be >= 20
npm -v      # must be >= 10
git --version
```

If `node -v` is below 20, install Node 20 LTS (use `nvm` if you juggle versions).
Everyone on the team should be on the **same major** version of Node and npm.

### 1. Clone

```bash
git clone git@github.com:UmayaJayasuriya/SEM5_DevPulse_Frontend.git
cd SEM5_DevPulse_Frontend
```

### 2. Add `.gitignore` — do this FIRST

Before anyone runs `npm install`. Without it the first `git add .` commits `node_modules/`
(tens of thousands of files) and possibly a real `.env.local`. Create a `.gitignore` at the
repo root covering at minimum:

```
node_modules/
.next/
out/
build/
.env
.env.local
.env*.local
*.tsbuildinfo
next-env.d.ts
.DS_Store
coverage/
.vscode/
```

**Never commit `.env.local`.** If you ever do, rotate the secret — deleting the file later
does not remove it from git history.

### 3. Create the workspace root

Create a `package.json` at the repo root that:

- sets `"private": true` (the root is never published)
- declares `"workspaces": ["dashboard-app", "admin-app", "shared-ui", "shared-types"]`
- defines scripts to run each app and both together:
  - `dev:dashboard` → dev server for dashboard-app on **3000**
  - `dev:admin` → dev server for admin-app on **3001**
  - `dev` → both at once (that's what `npm-run-all` is for)
  - `build`, `lint`, `format` → run across all workspaces
- pins the Node version with an `"engines"` field so nobody silently uses Node 18

Then install the root-only dev tools (see the *Where each dependency is installed* block in
[`requirement.txt`](requirement.txt)).

### 4. Scaffold the two Next.js apps

Create each app **inside its existing folder**, with the App Router and TypeScript:

```bash
npx create-next-app@latest dashboard-app --ts --app --tailwind --eslint --src-dir --use-npm
npx create-next-app@latest admin-app     --ts --app --tailwind --eslint --src-dir --use-npm
```

Then, in **both** apps:

- delete any boilerplate marketing page content — keep the layout skeleton only
- confirm `tsconfig.json` has `"strict": true` (non-negotiable)
- make sure the folder is `app/`, **not** `pages/` — we do not use the Pages Router
- set `admin-app`'s dev and start scripts to run on **port 3001**

If the generator installs a Tailwind version older than 4, fix it — see step 6.

### 5. Create the two shared packages

Neither is published to npm; they are resolved by npm workspaces.

**`shared-types/`** — the API contract. Create a `package.json` (name `shared-types`,
`"private": true`) and a `tsconfig.json`. It holds **types only**: interfaces mirroring the
gateway's DTOs, plus the `Role` union (`'ADMIN' | 'MANAGER' | 'DEVELOPER'`). It must have
**zero runtime dependencies** — nothing importable at runtime, only `type`/`interface`
declarations.

**`shared-ui/`** — the component library. Create a `package.json` (name `shared-ui`,
`"private": true`) and a `tsconfig.json`. It holds the React components both apps use:
chart wrappers, tables, layout shells. Declare `react`, `react-dom` and `chart.js` as
**peerDependencies** so the apps supply them and you don't end up with two copies of React.

### 6. Wire everything together

- Add `shared-ui` and `shared-types` to each app's dependencies as `"*"` — npm resolves
  them to the local folders.
- Run `npm install` **once from the repo root**. Never run it inside an app folder; that
  breaks workspace linking. There will be **one** `package-lock.json`, at the root — commit it.
- Because the shared packages ship TypeScript source (not compiled JS), add
  `transpilePackages: ['shared-ui', 'shared-types']` to each app's `next.config.ts`.
- Confirm Tailwind is **v4**: there should be no `tailwind.config.js` full of theme JS.
  v4 is CSS-first — `postcss.config.mjs` uses `@tailwindcss/postcss`, and your global
  stylesheet starts with `@import "tailwindcss";`. Configure theme tokens in CSS with
  `@theme`, not in a JS config.
- For Tailwind to see classes used inside `shared-ui`, declare that folder as a source in
  your global CSS with `@source`.

### 7. Set up environment files

In **each** app create `.env.local` (git-ignored) with the three variables listed under
[Environment variables](#environment-variables) below. Also commit a `.env.example` in each
app with the same keys and **placeholder values only** — that's how a new teammate knows
what to fill in.

Remember `NEXTAUTH_URL` differs per app: `:3000` for dashboard-app, `:3001` for admin-app.

### 8. Add the app-wide providers

Both apps need the same three providers wrapping the app, in a **client component** mounted
from the root layout (providers use React context, so they cannot live in a server component):

1. **React Query** — one `QueryClient` per browser session. Set sensible defaults for
   `staleTime` and retries; add the devtools in development only.
2. **Redux Toolkit** — the store for *client* state only: filters, selected project, UI
   toggles. Server data never goes in here.
3. **NextAuth `SessionProvider`** — so `useSession()` works anywhere.

Also set up NextAuth itself: a Credentials provider that posts to `/api/auth/login` on the
gateway, and callbacks that carry the gateway's JWT **and the user's `role`** into the
session. Role-gating depends on that role being present — get it right before building any
screen.

### 9. Verify, then push

```bash
npm run lint
npm run build          # both apps must build clean
npm run dev            # dashboard on :3000, admin on :3001
```

Both apps must compile with **zero TypeScript errors** before this is pushed. Once green,
commit the scaffold and push to `main` — from here on, everyone works off this.

### 10. Everyone else: after the scaffold is pushed

```bash
git clone git@github.com:UmayaJayasuriya/SEM5_DevPulse_Frontend.git
cd SEM5_DevPulse_Frontend
npm install                       # from the ROOT, always
cp dashboard-app/.env.example dashboard-app/.env.local
cp admin-app/.env.example admin-app/.env.local
# edit both .env.local files — ask the team for the real values
npm run dev
```

The backend gateway must be running on `NEXT_PUBLIC_API_BASE_URL` (default
`http://localhost:8080`) or every request will fail. That repo is separate — check with
whoever owns it.

### Working agreement

- **Branch per task**: `feature/<short-name>`, `fix/<short-name>`. Never commit to `main`
  directly; open a PR.
- **Own your area** to avoid conflicts — split by app and by feature (e.g. one person on
  auth + role-gating, one on DORA charts, one on the admin console). Anything touching
  `shared-ui` or `shared-types` affects everyone: announce it before you change it.
- **Change `shared-types` first** when the gateway contract changes, then update both apps.
- Run `npm run lint` and `npm run build` **before** you open a PR.
- Adding a dependency? Add it to [`requirement.txt`](requirement.txt) in the same PR, and
  check the "Do NOT add" list there first.
- Commit `package-lock.json` whenever it changes — it's what keeps everyone's installs identical.

### Common mistakes

| Symptom | Cause |
|---|---|
| `Module not found: shared-ui` | You ran `npm install` inside an app folder instead of the root |
| Shared component renders unstyled | Tailwind isn't scanning `shared-ui` — add `@source` in global CSS |
| `Cannot use import statement outside a module` from a shared package | Missing `transpilePackages` in `next.config.ts` |
| Both apps try to start on 3000 | admin-app's dev script isn't pinned to `-p 3001` |
| `useSession`/`useSelector` "must be used within a Provider" | Providers file isn't `'use client'`, or isn't mounted in the root layout |
| Every API call 401s | JWT not attached as `Authorization: Bearer <token>`, or the gateway isn't running |
| Chart with a date axis silently fails | `chartjs-adapter-date-fns` not imported — Chart.js has no built-in date support |

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
`NEXT_PUBLIC_API_BASE_URL` environment variable(mama danna widihata hard code karanne na)

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
