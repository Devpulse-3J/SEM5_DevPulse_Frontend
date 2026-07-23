# DevPulse Frontend — Work Split Instructions

Read [`guidance.md`](guidance.md) first — it covers the repo layout, the tech stack, and the
one-time scaffold. This file covers **who owns what** once the scaffold is on `main`.

> **Path note:** the apps are scaffolded with `--src-dir`, so every `app/...` path below
> actually lives at `<app>/src/app/...`. Paths are written without the `src/` prefix for
> brevity.

## Three parallel lanes

| | **Person A — Auth & Admin** | **Person B — Manager & Metrics** | **Person C — Developer & Integrations** |
|---|---|---|---|
| **Owns** | all of `admin-app/` | `dashboard-app/app/(manager)/` | `dashboard-app/app/(developer)/` |
| **Plus** | auth layer in `dashboard-app` | chart components | integrations UI |

### Person A — Auth & Admin

```
admin-app/app/(dashboard)/projects/
admin-app/app/(dashboard)/users/
admin-app/app/(dashboard)/integrations/
dashboard-app/app/(auth)/login/                  ← login page
dashboard-app/app/api/auth/[...nextauth]/route.ts
dashboard-app/lib/api-client.ts                  ← attaches JWT, everyone imports this
dashboard-app/lib/auth-guard.ts                  ← role checks
shared-types/src/auth.ts                         ← User, Role, Project, Membership
```

### Person B — Manager & Metrics

```
dashboard-app/app/(manager)/team/
dashboard-app/app/(manager)/dora/
dashboard-app/app/(manager)/alerts/
shared-ui/src/charts/                            ← LineChart, BarChart (Chart.js)
shared-ui/src/table/
shared-types/src/metrics.ts                      ← DoraMetrics, WorkloadEntry
```

### Person C — Developer & Integrations

```
dashboard-app/app/(developer)/my-prs/
dashboard-app/app/(developer)/my-alerts/
dashboard-app/app/(developer)/team-view/
admin-app/app/(dashboard)/integrations/          ← ⚠️ see "Conflicts" below
shared-types/src/events.ts                       ← PullRequest, Alert
```

## Four rules that prevent merge hell

1. **Never touch another person's route group.** `(manager)/` is B's, `(developer)/` is C's.
   No exceptions.
2. **Only A edits `lib/`.** B and C import `api-client.ts`; if you need a change, ask A.
3. **One file each in `shared-types/`.** A → `auth.ts`, B → `metrics.ts`, C → `events.ts`.
   Nobody edits `index.ts` except A.
4. **`shared-ui/` is B's for day one** (charts are the bulk). C adds components only in
   `shared-ui/src/dev/`.

## Two conflicts in this split — flagged now

**1. Integrations UI is double-owned.** The role table gives A "Admin dashboard (…
integrations)" and C "GitHub/Jira integration."

> **Suggested cut:** C builds `admin-app/app/(dashboard)/integrations/` since they own that
> domain end-to-end — A just leaves the folder empty. **Confirm between yourselves before
> either starts.**

**2. A is the bottleneck.** B and C can't fetch anything real until `api-client.ts` and the
login page exist. So **A should land those before touching `admin-app/`** — otherwise two
people idle. Until then, B and C build against **mock JSON**.
