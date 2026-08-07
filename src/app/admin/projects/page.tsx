export const metadata = { title: "Projects — DevPulse Admin" };

const PROJECTS = [
  {
    name: "platform-core",
    repo: "nimbuslabs/platform-core",
    status: "ACTIVE",
    members: 12,
  },
  {
    name: "payments-svc",
    repo: "nimbuslabs/payments-svc",
    status: "ACTIVE",
    members: 8,
  },
  {
    name: "mobile-ios",
    repo: "nimbuslabs/mobile-ios",
    status: "ACTIVE",
    members: 6,
  },
  {
    name: "data-pipeline",
    repo: "nimbuslabs/data-pipeline",
    status: "ARCHIVED",
    members: 4,
  },
];

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-surface-raised"
      style={{ color: isActive ? "#ffffff" : "#6b6b6b" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: isActive ? "#ffffff" : "#6b6b6b" }}
      />
      {status}
    </span>
  );
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold mb-0.5">Projects</h1>
          <p className="text-xs text-subtle">Manage organisation projects and their linked repositories</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-accent text-canvas text-xs font-bold hover:brightness-110 transition-all cursor-pointer border-none"
        >
          + Add Project
        </button>
      </div>

      {/* Projects table */}
      <div className="bg-surface border border-border rounded-card overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_2fr_1fr_0.7fr_0.5fr] px-5 py-2.5 border-b border-border-subtle text-[11px] text-subtle font-semibold tracking-widest">
          <div>PROJECT</div>
          <div>REPOSITORY</div>
          <div>STATUS</div>
          <div>MEMBERS</div>
          <div />
        </div>

        {PROJECTS.map((p, i) => (
          <div
            key={p.name}
            className={`grid grid-cols-[2fr_2fr_1fr_0.7fr_0.5fr] items-center px-5 py-3.5 text-xs ${
              i < PROJECTS.length - 1 ? "border-b border-border-subtle" : ""
            } hover:bg-surface-raised/50 transition-colors`}
          >
            <div className="font-semibold text-ink">{p.name}</div>
            <div className="font-mono text-[11px] text-muted">{p.repo}</div>
            <div>
              <StatusBadge status={p.status} />
            </div>
            <div className="text-muted">{p.members}</div>
            <div>
              <button
                type="button"
                className="text-accent text-xs font-medium hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                Manage →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project inline form card (spec shows modal; rendered inline for static UI) */}
      <div className="bg-surface-raised border border-border rounded-panel p-6 flex flex-col gap-4 max-w-md">
        <h2 className="text-[15px] font-bold">Add Project</h2>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="proj-repo" className="text-xs text-muted">Repository (GitHub)</label>
          <div className="h-10 rounded-lg bg-app border border-border flex items-center justify-between px-3 text-[13px] text-muted cursor-pointer">
            nimbuslabs/checkout-api <span className="text-subtle">⌄</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="proj-jira" className="text-xs text-muted">Linked Jira Project</label>
          <div className="h-10 rounded-lg bg-app border border-border flex items-center justify-between px-3 text-[13px] text-muted cursor-pointer">
            CHK — Checkout <span className="text-subtle">⌄</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="proj-members" className="text-xs text-muted">Team members</label>
          <div className="h-10 rounded-lg bg-app border border-border flex items-center px-3 text-[13px] text-subtle">
            Search members to add…
          </div>
        </div>

        <div className="flex justify-end gap-2.5 mt-2">
          <button type="button" className="h-9 px-4 rounded-lg text-[13px] font-semibold text-muted border border-border bg-transparent cursor-pointer hover:border-border hover:text-ink transition-colors">
            Cancel
          </button>
          <button type="button" className="h-9 px-4 rounded-lg bg-accent text-canvas text-[13px] font-bold border-none cursor-pointer hover:brightness-110 transition-all">
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
