import type {
  LinkedRepo,
  Project,
  ProjectMember,
} from "@/types/adminProject";

/**
 * Seed data for the admin Projects screens.
 *
 * There is no `/api/projects` endpoint, so these stand in for it. Everything
 * here is fake — the repo URLs point at real-looking paths that were never
 * fetched, and the members are invented.
 *
 * The seeds are exported through `cloneSeed*()` functions rather than as bare
 * consts. The provider mutates its copy, and handing out the same array twice
 * would let one demo run leak into the next. Cloning keeps "Reset demo data"
 * honest.
 *
 * Dates are fixed strings, not `Date.now()` offsets, so the table's Created
 * column does not shift every time the page is opened.
 */

export const SEED_PROJECTS: readonly Project[] = [
  {
    id: "proj-backend-api",
    name: "Backend API",
    description: "Core REST services, gateway routing, and the shared schema.",
    jiraProjectKey: "DEVP",
    githubRepoUrl: "https://github.com/devpulse-demo/backend-api",
    memberCount: 5,
    createdAt: "2026-03-04T09:15:00.000Z",
  },
  {
    id: "proj-mobile-app",
    name: "Mobile App",
    description: "React Native client for iOS and Android.",
    jiraProjectKey: "MOB",
    githubRepoUrl: "https://github.com/devpulse-demo/mobile-app",
    memberCount: 4,
    createdAt: "2026-04-22T14:40:00.000Z",
  },
  {
    id: "proj-marketing-site",
    name: "Marketing Site",
    description: "Public marketing pages and the docs portal.",
    jiraProjectKey: undefined,
    githubRepoUrl: "https://github.com/devpulse-demo/marketing-site",
    memberCount: 3,
    createdAt: "2026-06-11T11:02:00.000Z",
  },
];

export const SEED_REPOS: readonly LinkedRepo[] = [
  {
    id: "repo-backend-api",
    projectId: "proj-backend-api",
    url: "https://github.com/devpulse-demo/backend-api",
    owner: "devpulse-demo",
    name: "backend-api",
    webhookSecret: "s3cr3tPlAcEh0ld3rBackendApi000001",
    status: "CONNECTED",
    lastSyncedAt: "2026-08-21T18:30:00.000Z",
  },
  {
    id: "repo-mobile-app",
    projectId: "proj-mobile-app",
    url: "https://github.com/devpulse-demo/mobile-app",
    owner: "devpulse-demo",
    name: "mobile-app",
    webhookSecret: undefined,
    status: "CONNECTED",
    lastSyncedAt: "2026-08-20T07:12:00.000Z",
  },
  {
    // Deliberately unhealthy, so the Disconnected branch of the GitHub section
    // is visible without having to click the status through first.
    id: "repo-marketing-site",
    projectId: "proj-marketing-site",
    url: "https://github.com/devpulse-demo/marketing-site",
    owner: "devpulse-demo",
    name: "marketing-site",
    webhookSecret: undefined,
    status: "DISCONNECTED",
    lastSyncedAt: undefined,
  },
];

export const SEED_MEMBERS: Readonly<Record<string, readonly ProjectMember[]>> = {
  "proj-backend-api": [
    {
      id: "pm-1",
      userId: "u-1",
      email: "kalhara@devpulse.test",
      fullName: "Kalhara Perera",
      role: "MANAGER",
      joinedAt: "2026-03-04T09:20:00.000Z",
      status: "ACTIVE",
    },
    {
      id: "pm-2",
      userId: "u-2",
      email: "didula@devpulse.test",
      fullName: "Didula Hirupama",
      role: "DEVELOPER",
      joinedAt: "2026-03-05T10:00:00.000Z",
      status: "ACTIVE",
    },
    {
      id: "pm-3",
      userId: "u-3",
      email: "umaya@devpulse.test",
      fullName: "Umaya Fernando",
      role: "DEVELOPER",
      joinedAt: "2026-03-06T08:45:00.000Z",
      status: "ACTIVE",
    },
    {
      id: "pm-4",
      userId: "u-4",
      email: "nadeesha@devpulse.test",
      fullName: "Nadeesha Silva",
      role: "DEVELOPER",
      joinedAt: "2026-05-19T13:30:00.000Z",
      status: "ACTIVE",
    },
    {
      id: "pm-5",
      userId: "u-5",
      email: "contractor@partner.test",
      fullName: "contractor",
      role: "DEVELOPER",
      joinedAt: "2026-08-18T16:05:00.000Z",
      status: "PENDING",
    },
  ],
  "proj-mobile-app": [
    {
      id: "pm-6",
      userId: "u-2",
      email: "didula@devpulse.test",
      fullName: "Didula Hirupama",
      // Same person, different project, different role — the whole point of
      // per-project RBAC. Worth keeping in the seed as a visible example.
      role: "MANAGER",
      joinedAt: "2026-04-22T14:45:00.000Z",
      status: "ACTIVE",
    },
    {
      id: "pm-7",
      userId: "u-6",
      email: "ishara@devpulse.test",
      fullName: "Ishara Weerasinghe",
      role: "DEVELOPER",
      joinedAt: "2026-04-23T09:10:00.000Z",
      status: "ACTIVE",
    },
    {
      id: "pm-8",
      userId: "u-7",
      email: "tharindu@devpulse.test",
      fullName: "Tharindu Jayasuriya",
      role: "DEVELOPER",
      joinedAt: "2026-04-30T11:55:00.000Z",
      status: "ACTIVE",
    },
    {
      id: "pm-9",
      userId: "u-8",
      email: "qa.lead@devpulse.test",
      fullName: "Sanduni Rathnayake",
      role: "DEVELOPER",
      joinedAt: "2026-07-02T15:20:00.000Z",
      status: "ACTIVE",
    },
  ],
  "proj-marketing-site": [
    {
      id: "pm-10",
      userId: "u-9",
      email: "marketing.lead@devpulse.test",
      fullName: "Ruwan Alwis",
      role: "MANAGER",
      joinedAt: "2026-06-11T11:10:00.000Z",
      status: "ACTIVE",
    },
    {
      id: "pm-11",
      userId: "u-10",
      email: "chamodi@devpulse.test",
      fullName: "Chamodi Gunawardena",
      role: "DEVELOPER",
      joinedAt: "2026-06-12T09:00:00.000Z",
      status: "ACTIVE",
    },
    {
      id: "pm-12",
      userId: "u-11",
      email: "newhire@devpulse.test",
      fullName: "newhire",
      role: "DEVELOPER",
      joinedAt: "2026-08-15T10:25:00.000Z",
      status: "PENDING",
    },
  ],
};

export function cloneSeedProjects(): Project[] {
  return SEED_PROJECTS.map((project) => ({ ...project }));
}

export function cloneSeedRepos(): Record<string, LinkedRepo> {
  return Object.fromEntries(
    SEED_REPOS.map((repo) => [repo.projectId, { ...repo }])
  );
}

export function cloneSeedMembers(): Record<string, ProjectMember[]> {
  return Object.fromEntries(
    Object.entries(SEED_MEMBERS).map(([projectId, members]) => [
      projectId,
      members.map((member) => ({ ...member })),
    ])
  );
}
