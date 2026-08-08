import { useQuery } from "@tanstack/react-query";
import type { PullRequest } from "@/types/pullRequest";

const MOCK_MY_PRS: PullRequest[] = [
  {
    id: "pr-101",
    number: 142,
    title: "feat(auth): add JWT key rotation and token refresh endpoint",
    description: "Implements cryptographic key rotation for JWT tokens with 15-min expiration window.",
    author: "Alex Developer",
    authorAvatar: "https://avatars.githubusercontent.com/u/1001",
    repositoryId: "repo-1",
    repositoryName: "auth-service",
    status: "open",
    headBranch: "feature/jwt-rotation",
    baseBranch: "main",
    additions: 340,
    deletions: 45,
    changedFiles: 8,
    url: "https://github.com/OdinEyeOrg/auth-service/pull/142",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reviews: [
      {
        id: "rev-1",
        reviewerName: "Sarah Tech Lead",
        state: "APPROVED",
        submittedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
      {
        id: "rev-2",
        reviewerName: "Michael Senior Dev",
        state: "CHANGES_REQUESTED",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ],
    checks: [
      { id: "chk-1", name: "Lint & Format", status: "SUCCESS" },
      { id: "chk-2", name: "Unit Tests", status: "SUCCESS" },
      { id: "chk-3", name: "Security Audit", status: "SUCCESS" },
    ],
    riskAnalysis: {
      riskScore: 78,
      riskLevel: "HIGH",
      summary: "High code churn in security-critical authentication logic with 2 requested changes.",
      factors: [
        { category: "Security", description: "Modifies core token validation handler", impactScore: 40 },
        { category: "Scope", description: "340 additions across 8 security files", impactScore: 25 },
        { category: "Reviews", description: "Pending resolved changes request from senior reviewer", impactScore: 13 },
      ],
    },
  },
  {
    id: "pr-102",
    number: 89,
    title: "fix(metrics): resolve memory leak in DORA calculator buffer",
    description: "Fixes unbounded memory retention during batch metric aggregation.",
    author: "Alex Developer",
    authorAvatar: "https://avatars.githubusercontent.com/u/1001",
    repositoryId: "repo-2",
    repositoryName: "metrics-pipeline",
    status: "open",
    headBranch: "fix/mem-leak",
    baseBranch: "main",
    additions: 28,
    deletions: 14,
    changedFiles: 2,
    url: "https://github.com/OdinEyeOrg/metrics-pipeline/pull/89",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    reviews: [
      {
        id: "rev-3",
        reviewerName: "Sarah Tech Lead",
        state: "APPROVED",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ],
    checks: [
      { id: "chk-4", name: "Build & Test", status: "SUCCESS" },
    ],
    riskAnalysis: {
      riskScore: 18,
      riskLevel: "LOW",
      summary: "Isolated bugfix with high test coverage and single approval.",
      factors: [
        { category: "Scope", description: "Small footprint (<30 lines)", impactScore: 10 },
      ],
    },
  },
  {
    id: "pr-103",
    number: 204,
    title: "refactor(ui): update Chart.js theme colors to match Tailwind v4 dark design tokens",
    description: "Aligns Chart.js dataset background colors with CSS variables.",
    author: "Alex Developer",
    authorAvatar: "https://avatars.githubusercontent.com/u/1001",
    repositoryId: "repo-3",
    repositoryName: "dashboard-frontend",
    status: "merged",
    headBranch: "style/chart-theme",
    baseBranch: "main",
    additions: 92,
    deletions: 64,
    changedFiles: 5,
    url: "https://github.com/OdinEyeOrg/dashboard-frontend/pull/204",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    mergedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    reviews: [
      {
        id: "rev-4",
        reviewerName: "Alex Developer Lead",
        state: "APPROVED",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      },
    ],
    checks: [
      { id: "chk-5", name: "Next.js Build", status: "SUCCESS" },
    ],
    riskAnalysis: {
      riskScore: 12,
      riskLevel: "LOW",
      summary: "Pure visual theme update with zero backend or state logic changes.",
      factors: [],
    },
  },
];

export function useMyPullRequests() {
  return useQuery({
    queryKey: ["my-pull-requests"],
    queryFn: async (): Promise<PullRequest[]> => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl) return MOCK_MY_PRS;

        const res = await fetch(`${baseUrl}/api/metrics/prs?assigned=me`);
        if (!res.ok) throw new Error("Failed to fetch my pull requests");
        return await res.json();
      } catch {
        return MOCK_MY_PRS;
      }
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function usePRRiskDetail(id: string) {
  return useQuery({
    queryKey: ["pr-risk-detail", id],
    queryFn: async (): Promise<PullRequest | null> => {
      const allPrs = MOCK_MY_PRS;
      const found = allPrs.find((p) => p.id === id || String(p.number) === id);
      return found || allPrs[0];
    },
    enabled: Boolean(id),
  });
}
