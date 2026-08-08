import type { Repository, RepositoryBranch, RepositoryCommit } from "@/types/repository";

const MOCK_REPOSITORIES: Repository[] = [
  {
    id: "repo-1",
    name: "auth-service",
    owner: "OdinEyeOrg",
    fullName: "OdinEyeOrg/auth-service",
    description: "OAuth2 & JWT authentication microservice gateway",
    url: "https://github.com/OdinEyeOrg/auth-service",
    defaultBranch: "main",
    language: "TypeScript",
    isPrivate: true,
    status: "active",
    starsCount: 42,
    forksCount: 8,
    metrics: {
      openPullRequests: 3,
      openIssues: 5,
      codeCoverage: 88.5,
      healthScore: 92,
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    branches: [
      {
        name: "main",
        isDefault: true,
        lastCommitHash: "a1b2c3d",
        lastCommitMessage: "feat: add rate limiting to OAuth token endpoint",
        updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        name: "feature/jwt-rotation",
        isDefault: false,
        lastCommitHash: "e5f6g7h",
        lastCommitMessage: "wip: implement key rotation algorithm",
        updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
    ],
    recentCommits: [
      {
        hash: "a1b2c3d",
        message: "feat: add rate limiting to OAuth token endpoint",
        author: "Alex Developer",
        authorEmail: "alex@odineye.io",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        branch: "main",
      },
      {
        hash: "f9e8d7c",
        message: "fix: handle expired refresh token gracefully",
        author: "Alex Developer",
        authorEmail: "alex@odineye.io",
        timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        branch: "main",
      },
    ],
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "repo-2",
    name: "metrics-pipeline",
    owner: "OdinEyeOrg",
    fullName: "OdinEyeOrg/metrics-pipeline",
    description: "High-throughput telemetry ingestion & DORA calculator engine",
    url: "https://github.com/OdinEyeOrg/metrics-pipeline",
    defaultBranch: "main",
    language: "Go",
    isPrivate: true,
    status: "active",
    starsCount: 89,
    forksCount: 14,
    metrics: {
      openPullRequests: 5,
      openIssues: 12,
      codeCoverage: 94.2,
      healthScore: 88,
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    branches: [
      {
        name: "main",
        isDefault: true,
        lastCommitHash: "c8d9e0f",
        lastCommitMessage: "perf: optimize deployment frequency aggregation query",
        updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
    ],
    recentCommits: [
      {
        hash: "c8d9e0f",
        message: "perf: optimize deployment frequency aggregation query",
        author: "Odin Eye Bot",
        authorEmail: "bot@odineye.io",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        branch: "main",
      },
    ],
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    createdAt: "2024-11-05T14:30:00Z",
  },
  {
    id: "repo-3",
    name: "dashboard-frontend",
    owner: "OdinEyeOrg",
    fullName: "OdinEyeOrg/dashboard-frontend",
    description: "Next.js 15 analytics & productivity client application",
    url: "https://github.com/OdinEyeOrg/dashboard-frontend",
    defaultBranch: "main",
    language: "TypeScript",
    isPrivate: true,
    status: "active",
    starsCount: 120,
    forksCount: 22,
    metrics: {
      openPullRequests: 4,
      openIssues: 8,
      codeCoverage: 81.0,
      healthScore: 95,
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
    updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    createdAt: "2025-02-01T09:00:00Z",
  },
];

export const repositoryService = {
  async getRepositories(): Promise<Repository[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) return MOCK_REPOSITORIES;

      const res = await fetch(`${baseUrl}/api/repositories`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch repositories");
      return await res.json();
    } catch {
      return MOCK_REPOSITORIES;
    }
  },

  async getRepositoryById(id: string): Promise<Repository | null> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        return MOCK_REPOSITORIES.find((r) => r.id === id) || MOCK_REPOSITORIES[0];
      }

      const res = await fetch(`${baseUrl}/api/repositories/${id}`);
      if (!res.ok) throw new Error("Failed to fetch repository detail");
      return await res.json();
    } catch {
      return MOCK_REPOSITORIES.find((r) => r.id === id) || MOCK_REPOSITORIES[0];
    }
  },

  async syncRepository(id: string): Promise<{ success: boolean; syncedAt: string }> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (baseUrl) {
        await fetch(`${baseUrl}/api/repositories/${id}/sync`, { method: "POST" });
      }
    } catch {
      // fallback mock response
    }
    return { success: true, syncedAt: new Date().toISOString() };
  },
};
