# Backend Wiring Checklist

Status of the frontend as it stands after mock data was stripped out. Everything
below is what still needs to be written to connect this app to the gateway.

---

## 1. What was already removed (no action needed)

The data layer no longer contains fake data. These services used to swallow every
error and silently return a hardcoded array — meaning a dead backend looked
identical to a working one. They now call `apiClient` and let `ApiError` propagate,
so React Query surfaces real loading/error states.

| File | Was | Now |
|---|---|---|
| `src/services/repository.service.ts` | 3 fake repos + try/catch fallback | `apiClient` calls, errors thrown |
| `src/services/alert.service.ts` | 3 fake rules + 3 fake alerts | `apiClient` calls, errors thrown |
| `src/services/notification.service.ts` | 3 fake notifications | `apiClient` calls, errors thrown |
| `src/services/github.service.ts` | inline fake connection status | `apiClient` calls |
| `src/services/jira.service.ts` | inline fake connection status | `apiClient` calls |
| `src/hooks/usePullRequests.ts` | 128 lines of fake PRs | delegates to service |
| `src/services/pullRequest.service.ts` | *(did not exist)* | **created** — thin `apiClient` wrapper |
| `src/features/dora/mockDora.ts` | all DORA/workload fake data | **deleted** |

> **Verify the endpoint paths I used** — see §5. Several are guesses that go beyond
> what `CLAUDE.md` documents.

---

## 2. Broken right now — fix these first

Deleting `mockDora.ts` broke its only two consumers. **`npx tsc --noEmit` fails until
these are rewired.** Every other error in the typecheck output cascades from these two
missing imports.

- [ ] **`src/app/(workspace)/dora/page.tsx`**
  Imported `mockDoraSummary`, `mockLeadTimeTrend`, `mockRepoDeploys`.
  Needs `useDoraSummary()` / `useLeadTimeTrend()` / `useDeploysByRepo()` from `useDora.ts` (§3).
- [ ] **`src/app/(workspace)/team/page.tsx`**
  Imported `mockWorkload`, `mockEffort`, `mockCycleTime`, `mockReviewBottlenecks`.
  Needs the analytics hooks (§3).

Both pages also need loading / error / empty states — they currently assume data is
always present and synchronous.

---

## 3. Empty files (22) — the actual "fill these" list

None of these are imported anywhere yet, so they don't break the build while empty.
An empty `.ts`/`.tsx` only errors once something imports it ("is not a module").

### Priority 1 — blocks §2 above

| File | What goes in it | Endpoint |
|---|---|---|
| `src/services/dora.service.ts` | `getSummary`, `getLeadTimeTrend`, `getDeploysByRepo` | `/api/metrics/dora`, `/api/metrics/deployments` |
| `src/hooks/useDora.ts` | React Query wrappers over the above | — |
| `src/services/analytics.service.ts` | `getWorkload`, `getEffortDistribution`, `getCycleTime`, `getReviewBottlenecks` | `/api/metrics/workload`, `/api/analytics/*` |

Types for all of these already exist in `src/types/dora.ts` and `src/types/analytics.ts` —
they were written against the old mock shapes, so they are your contract.

### Priority 2 — auth & permissions

| File | What goes in it |
|---|---|
| `src/lib/auth-guard.ts` | route guard — redirect unauthenticated users; role gate for `/admin/**` |
| `src/lib/auth.ts` | NextAuth config / session helpers |
| `src/lib/permissions.ts` | `can(role, action)` — per-project ADMIN/MANAGER/DEVELOPER rules |
| `src/lib/validators.ts` | shared form validation (login/register duplicate this inline today) |
| `src/lib/constants.ts` | shared literals (roles, query keys, page sizes) |
| `src/types/user.ts` | user DTO mirror |

> Route protection currently does not exist. `(workspace)/layout.tsx` only checks that a
> project is selected in Redux — typing `/admin/overview` while logged out is not blocked
> client-side.

### Priority 3 — projects (needed to kill the picker mock)

| File | What goes in it | Endpoint |
|---|---|---|
| `src/services/project.service.ts` | `getMyMemberships`, `getProjects`, `createProject` | `/api/users/me`, `/api/projects` |
| `src/hooks/useProjects.ts` | React Query wrappers | — |
| `src/store/projectSlice.ts` | project UI state (or drop it — `dashboardSlice` already holds `activeProject`) | — |
| `src/types/project.ts` | project + membership DTOs | — |
| `src/services/dashboard.service.ts` | dashboard aggregate, if the gateway has one | `/api/metrics/*` |

### Priority 4 — UI components (cosmetic, nothing imports them)

| File | Note |
|---|---|
| `src/components/charts/DoraChart.tsx` | The DORA page currently hand-rolls its cards; decide if this is even needed |
| `src/components/charts/RiskChart.tsx` | no risk chart exists anywhere yet |
| `src/components/charts/DeploymentChart.tsx` | "Deploys by Repo" is hand-rolled `<div>` bars today |
| `src/components/tables/AlertTable.tsx` | `AlertList.tsx` has its own inline table |
| `src/components/tables/ProjectTable.tsx` | `admin/projects` has its own inline table |
| `src/components/tables/UserTable.tsx` | `admin/users` has its own inline table |
| `src/components/layout/Footer.tsx` | landing page has an inline footer |
| `src/components/layout/Navbar.tsx` | landing page has an inline nav |

Use the theme's `series` palette for any new chart — it is colorblind-validated and
assigned in slot order.

---

## 4. Hardcoded data still living inside pages (9 files)

These are **not** empty files — they hold fake data inline as their only data source.
Deleting the array blanks the page, so each needs a hook wired at the same time.

| File | Hardcoded | Replace with |
|---|---|---|
| `src/app/(workspace)/dashboard/ManagerDashboard.tsx` | `doraMetrics`, `leadTimeLabels`, `leadTimeData`, `deploysByRepo`, `highRiskPRs` | `useDora*` + `usePullRequests` |
| `src/app/(workspace)/pull-requests/[id]/page.tsx` | whole `pr` object — **route param `id` is ignored** | `usePRRiskDetail(id)` |
| `src/app/(workspace)/pull-requests/page.tsx` | `mockHighRiskPrs` | `usePullRequests({ riskLevel })` |
| `src/app/select-project/page.tsx` | `memberships` | `useMyMemberships()` — **this is what decides the user's role** |
| `src/app/admin/overview/page.tsx` | `STATS`, `RECENT_ACTIVITY` | org stats endpoint |
| `src/app/admin/projects/page.tsx` | `PROJECTS` | `useProjects()` |
| `src/app/admin/users/page.tsx` | `MEMBERS` | org members endpoint |
| `src/app/admin/integrations/page.tsx` | `INTEGRATIONS` | `githubService` / `jiraService` (already real) |
| `src/app/(auth)/login/page.tsx` | `DEMO_ROLES` with **real-looking prefilled passwords** | delete before any deploy |

`DeveloperDashboard.tsx` is already fully hook-driven — no work needed there.

---

## 5. Endpoint contract — verify against the backend

`CLAUDE.md` documents this set:

```
/api/auth/{login,register,refresh}   /api/users/me
/api/orgs   /api/orgs/{id}/invitations
/api/integrations   /api/integrations/github/connect
/api/metrics/{dora,prs,workload,deployments}
/api/analytics/predictions   /api/analytics/prs/{id}/risk
/api/notifications/{rules,channels,history}
```

**Paths the frontend now calls that are NOT in that list** — confirm each one or tell me
the real path and I'll correct the services:

| Called from | Path | Status |
|---|---|---|
| `repository.service.ts` | `/api/repositories`, `/{id}`, `/{id}/sync` | ⚠️ undocumented — whole resource |
| `notification.service.ts` | `/api/notifications`, `/{id}/read`, `/read-all` | ⚠️ only `rules`/`channels`/`history` are documented |
| `alert.service.ts` | `/api/notifications/history/{id}/acknowledge` | ⚠️ undocumented |
| `github.service.ts` | `/api/integrations/github`, `/github/sync` | ⚠️ only `/github/connect` documented |
| `jira.service.ts` | `/api/integrations/jira`, `/jira/sync` | ⚠️ undocumented |
| `pullRequest.service.ts` | `/api/metrics/prs/{id}` | ⚠️ only the collection is documented |
| `auth.service.ts` *(pre-existing)* | `/api/auth/me` | ⚠️ CLAUDE.md says `/api/users/me` — these disagree |

`auth.service.ts` also retries every call against an unprefixed fallback (`/auth/login`
after `/api/auth/login` 404s). Once the real paths are confirmed, that fallback should
go — it doubles failed requests and hides misconfiguration.

---

## 6. Config

- No `.env.local` exists. Copy `.env.example` → `.env.local`.
- `NEXT_PUBLIC_API_BASE_URL` is inlined at build time — restart `npm run dev` after changing it.
- Without it, `getApiBaseUrl()` falls back to `http://localhost:8080`.
- CORS must allow `http://localhost:3000` on the gateway, or every browser call fails
  before it reaches your controllers.
