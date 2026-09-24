# Manager role — file map

Every file the MANAGER role touches, from where the role is decided to where its
screens get their data. Manager and Developer share `(workspace)/`, so most files
here are shared; the **Manager-only** ones are marked.

The role is **per project**, never global. It comes from `projectRoles` on
`GET /api/auth/me` and is chosen on the project picker.

## 1. Where the role is decided

| File | What it does |
|---|---|
| [src/app/select-project/page.tsx](src/app/select-project/page.tsx) | Picker. Maps the API's lowercase `manager` → uppercase `MANAGER` and dispatches `setActiveProject({ id, name, role })` |
| [src/hooks/useProjects.ts](src/hooks/useProjects.ts) | `useMyMemberships()` — reads `projectRoles` from `/api/auth/me` |
| [src/store/dashboardSlice.ts](src/store/dashboardSlice.ts) | Holds `activeProject.role` (`WorkspaceRole`). **Not persisted** — a hard refresh returns to the picker |
| [src/types/user.ts](src/types/user.ts) | `ProjectRole`, `ProjectRoleName` (lowercase, as the API sends it) |
| [src/types/adminProject.ts](src/types/adminProject.ts) | `ProjectRoleLabel` (uppercase, as gateway *writes* require) |
| [src/lib/constants.ts](src/lib/constants.ts) | `PROJECT_ROLES` (lowercase) + `QUERY_KEYS` |

## 2. Role gating & shell

| File | What it does |
|---|---|
| [src/app/(workspace)/layout.tsx](src/app/(workspace)/layout.tsx) | Blocks render until authed + a project is picked; feeds `role` to Sidebar/Header |
| [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx) | **Manager nav lives here** — `managerNav` vs `developerNav` |
| [src/components/layout/Header.tsx](src/components/layout/Header.tsx) | Role badge, project name, logout |
| [src/lib/permissions.ts](src/lib/permissions.ts) | `isManagerOf()`, `can()`. Manager-only actions: `project:manage`, `metrics:viewTeam`, `alerts:manage` |
| [src/lib/auth-guard.ts](src/lib/auth-guard.ts) | `useRequireAuth` — UX gate only, not a security boundary |

## 3. Manager screens

Manager sidebar: **Overview** `/dashboard` · **DORA Metrics** `/dora` ·
**PR Risk & Insights** `/pull-requests` · **Team & Workload** `/team`

| Route | File | Notes |
|---|---|---|
| `/dashboard` | [dashboard/page.tsx](src/app/(workspace)/dashboard/page.tsx) | Role switch — `MANAGER` → `ManagerDashboard` |
| | [dashboard/SharedDashboard.tsx](src/app/(workspace)/dashboard/SharedDashboard.tsx) | Common shell |
| | [dashboard/ManagerDashboard.tsx](src/app/(workspace)/dashboard/ManagerDashboard.tsx) | **Manager-only.** DORA + workload + deployments |
| `/dora` | [dora/page.tsx](src/app/(workspace)/dora/page.tsx) | DORA grid + lead-time history |
| `/pull-requests` | [pull-requests/page.tsx](src/app/(workspace)/pull-requests/page.tsx) | All PRs on the project |
| `/pull-requests/[id]` | [pull-requests/[id]/page.tsx](src/app/(workspace)/pull-requests/[id]/page.tsx) | PR detail |
| `/team` | [team/page.tsx](src/app/(workspace)/team/page.tsx) | ⛔ Renders "not available" — needs analytics-service |

Not in the manager nav (developer-only): `/my-prs`, `/repositories`, `/alerts`.

## 4. Feature & presentation components

| File | Used by |
|---|---|
| [features/dora/DoraMetricGrid.tsx](src/features/dora/DoraMetricGrid.tsx) | `/dora`, ManagerDashboard |
| [features/dora/metric-display.ts](src/features/dora/metric-display.ts) | Formats values, `"Not available"` on `null`, change vs previous window |
| [features/pullRequests/MyPRList.tsx](src/features/pullRequests/MyPRList.tsx) | `/pull-requests` |
| [features/pullRequests/PRRiskCard.tsx](src/features/pullRequests/PRRiskCard.tsx) | `/pull-requests/[id]` |
| [components/charts/LeadTimeChart.tsx](src/components/charts/LeadTimeChart.tsx) | `/dora` |
| [components/charts/WorkloadChart.tsx](src/components/charts/WorkloadChart.tsx) | ManagerDashboard |
| [components/tables/PRTable.tsx](src/components/tables/PRTable.tsx) | High-risk PR table (not yet mounted anywhere) |
| [components/ui/](src/components/ui/) | `Card`, `Spinner`, `FeatureUnavailable`, `Badge` |

## 5. Data layer

| File | Endpoint |
|---|---|
| [hooks/useDora.ts](src/hooks/useDora.ts) | `useDoraSummary`, `useWorkload`, `useDeployments` |
| [hooks/usePullRequests.ts](src/hooks/usePullRequests.ts) | `usePullRequests`, `usePullRequest` |
| [services/dora.service.ts](src/services/dora.service.ts) | `GET /api/metrics/{dora,workload,deployments}` |
| [services/pullRequest.service.ts](src/services/pullRequest.service.ts) | `GET /api/metrics/prs` |
| [services/api-client.ts](src/services/api-client.ts) | Bearer token + `params` serialization |
| [types/dora.ts](src/types/dora.ts) | `DoraSummary`, `DoraMetric`, `WorkloadEntry`, `Deployment` |
| [types/pullRequest.ts](src/types/pullRequest.ts) | `PullRequest`, `PRRiskAnalysis` |
| [utils/formatDate.ts](src/utils/formatDate.ts) · [utils/calculateDuration.ts](src/utils/calculateDuration.ts) | date-fns helpers |

## Gotchas

- **Role casing:** reads are lowercase (`manager`), gateway writes need uppercase
  (`MANAGER`). A lowercase write returns a **500, not a 400**.
- **Never derive the role from `systemRole`** — that's company-wide (admin). The
  project role comes from `activeProject.role`.
- **`/team` and PR risk scoring are intentionally unavailable** — they throw
  `NotImplementedError` / return `unavailable()`. Don't substitute invented data.
- **`projectId` must be a positive integer** or every metrics query stays disabled
  and the page spins forever (`Number(activeProject.id)`).
