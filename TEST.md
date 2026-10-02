# DevPulse Frontend — Test Inventory

Generated from the codebase on `main` (commit `cf58cad`), 2026-09-27. This lists every
automated test file in the frontend, for building the project's test report. Framework:
Vitest. All 65 test cases pass as of this commit (`npx vitest run`).

| Test files | Test cases |
|---|---|
| 10 | 65 |

---

| File | Tests | Covers |
|---|---|---|
| `src/features/dora/__tests__/metric-display.test.ts` | 3 | DORA metric formatting: nullable/backend-native units, and the "lower is better" vs. "higher is better" direction used for rating colour. |
| `src/lib/__tests__/invite.test.ts` | 10 | Reading/round-tripping the `?invite=<token>&email=<address>` project-invitation link parameters across the login/register pages: trimming, blank-token handling, reserved-character encoding, and that an ordinary visit carries no token. |
| `src/lib/__tests__/project-label.test.ts` | 3 | Project display label: uses the API-supplied name when present, falls back to `Project #<id>` for a blank/missing name. |
| `src/lib/__tests__/redirect.test.ts` | 13 | Post-login landing path logic: the workspace vs. admin-console login doors never cross-redirect into each other, `?callbackUrl=` is rejected as an open-redirect vector when it would leave the site or point at the wrong door. |
| `src/lib/__tests__/risk.test.ts` | 7 | PR risk-badge display logic (low/medium/high formatting). |
| `src/services/__tests__/api-client.test.ts` | 3 | Core `apiClient`: normalizing the four different error-body shapes the backend can return, and a project-wide guard test that fails if any `apiClient` call is ever written with a leading `/api/` (the base URL already ends in `/api` in production — this is what caused the "doubled `/api/api/...`" 404 bugs found and fixed this session). |
| `src/services/__tests__/auth-service.test.ts` | 7 | `authService`: register/invite-token handling, project-invitation acceptance, `switchCompany` (posts to `/auth/companies/{id}/switch`, authenticated), `linkGithub` and `lookupGithub` (the confirm-before-link GitHub flow). |
| `src/services/__tests__/metrics-services.test.ts` | 8 | `doraService`/`pullRequestService`: DORA summary/deployment queries, `relinkMyAuthored` (catch-up for a newly linked GitHub account's earlier PRs), `rebuildSnapshots` (admin DORA-history rebuild), and "My PRs" now asking the server (`myPrs=true`) instead of falling back to showing everyone's PRs when no local name match was found. |
| `src/services/__tests__/project-service.test.ts` | 9 | `projectService`: project CRUD, member invite/role-change, GitHub repo linking/sync/status endpoints. |
| `src/store/__tests__/dashboard-logout.test.ts` | 2 | Redux `dashboardSlice` resets the active project/role and other per-session UI selections on logout, so the next person signing in on the same tab doesn't inherit them. |

---

## Notes for the report

- **No component-level tests** (e.g. React Testing Library rendering `GithubLinkCard`, the select-project picker, or the DORA "Rebuild history" button) — coverage here is service/lib/store logic, not rendered UI. The GitHub-link confirm flow and the Rebuild-history button were verified manually against the deployed environment, not with an automated component test.
- **Type-checking and lint** (`tsc --noEmit`, `eslint`) are run as a gate on every change in this project's workflow but are not "tests" in the automated-suite sense; worth listing separately in the report as a static-analysis check if the rubric distinguishes them.
- **Live/manual verification done but not automated:** the full company-switch → project-open flow, the GitHub username lookup against the real GitHub API, and the Slack channel-list / send flow against a real Slack workspace.
