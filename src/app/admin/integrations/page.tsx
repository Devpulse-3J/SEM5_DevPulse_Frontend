export const metadata = { title: "Integrations — DevPulse Admin" };

interface Integration {
  tag: string;
  name: string;
  status: "CONNECTED" | "ATTENTION" | "DISCONNECTED";
  stats: { label: string; value: string; valueColor?: string }[];
}

const INTEGRATIONS: Integration[] = [
  {
    tag: "GH",
    name: "GitHub",
    status: "CONNECTED",
    stats: [
      { label: "Last Sync",     value: "2 min ago",  valueColor: "oklch(0.72 0.16 155)" },
      { label: "Repositories",  value: "34" },
      { label: "Webhook",       value: "● Healthy",  valueColor: "oklch(0.72 0.16 155)" },
    ],
  },
  {
    tag: "JR",
    name: "Jira",
    status: "ATTENTION",
    stats: [
      { label: "Last Sync",  value: "18 min ago",              valueColor: "oklch(0.83 0.14 80)" },
      { label: "Projects",   value: "6" },
      { label: "Webhook",    value: "● Token expiring in 3 days", valueColor: "oklch(0.83 0.14 80)" },
    ],
  },
  {
    tag: "SL",
    name: "Slack",
    status: "CONNECTED",
    stats: [
      { label: "Last Sync", value: "Just now",    valueColor: "oklch(0.72 0.16 155)" },
      { label: "Channel",   value: "#eng-alerts" },
      { label: "Webhook",   value: "● Healthy",   valueColor: "oklch(0.72 0.16 155)" },
    ],
  },
];

const STATUS_STYLES = {
  CONNECTED:    { label: "✓ CONNECTED",    color: "oklch(0.72 0.16 155)" },
  ATTENTION:    { label: "⚠ ATTENTION",    color: "oklch(0.78 0.16 80)" },
  DISCONNECTED: { label: "✕ NOT CONNECTED", color: "oklch(0.52 0.02 260)" },
} as const;

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold mb-0.5">Integrations</h1>
        <p className="text-xs text-subtle">Connect and manage external services for your organisation</p>
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INTEGRATIONS.map((integration) => {
          const statusStyle = STATUS_STYLES[integration.status];
          return (
            <div key={integration.tag} className="bg-surface border border-border rounded-card p-5 flex flex-col gap-3">
              {/* Logo + status */}
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-surface-raised flex items-center justify-center font-mono text-[11px] font-bold text-ink">
                  {integration.tag}
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-surface-raised"
                  style={{ color: statusStyle.color }}
                >
                  {statusStyle.label}
                </span>
              </div>

              {/* Name */}
              <div className="text-sm font-semibold text-ink">{integration.name}</div>

              {/* Stats */}
              <div className="flex flex-col gap-2 pt-3 border-t border-border-subtle">
                {integration.stats.map((stat) => (
                  <div key={stat.label} className="flex items-baseline justify-between">
                    <span className="text-[11px] text-subtle">{stat.label}</span>
                    <span
                      className="text-xs font-mono font-semibold"
                      style={{ color: stat.valueColor ?? "oklch(0.95 0.004 260)" }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Configure link */}
              <button
                type="button"
                className="text-left text-xs text-accent font-medium hover:underline cursor-pointer bg-transparent border-none p-0 mt-1"
              >
                Configure →
              </button>
            </div>
          );
        })}
      </div>

      {/* Webhook health summary */}
      <div className="bg-surface border border-border rounded-card p-5">
        <h2 className="text-[13px] font-semibold mb-4">Webhook Health</h2>
        <div className="flex flex-col gap-2">
          {[
            { label: "GitHub Webhook",  status: "Healthy",                   color: "oklch(0.72 0.16 155)" },
            { label: "Jira Webhook",    status: "Token expiring in 3 days",  color: "oklch(0.78 0.16 80)" },
            { label: "Slack Webhook",   status: "Healthy",                   color: "oklch(0.72 0.16 155)" },
          ].map(({ label, status, color }) => (
            <div key={label} className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-0">
              <span className="text-xs text-muted">{label}</span>
              <span className="text-xs font-semibold font-mono" style={{ color }}>
                ● {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
