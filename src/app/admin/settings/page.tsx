export const metadata = { title: "Settings — DevPulse Admin" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold mb-0.5">Organisation Settings</h1>
        <p className="text-xs text-subtle">Configure your organisation preferences and security policies</p>
      </div>

      {/* Org details */}
      <section className="bg-surface border border-border rounded-card p-6 flex flex-col gap-4">
        <h2 className="text-[13px] font-semibold border-b border-border-subtle pb-3">Organisation Details</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted">Organisation name</label>
            <input
              type="text"
              defaultValue="Nimbus Labs"
              className="h-9 px-3 rounded-lg bg-app border border-border text-xs text-ink focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted">Organisation slug</label>
            <div className="h-9 px-3 rounded-lg bg-app border border-border flex items-center text-xs font-mono text-subtle">
              nimbuslabs
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted">Admin email</label>
            <input
              type="email"
              defaultValue="itops@nimbuslabs.io"
              className="h-9 px-3 rounded-lg bg-app border border-border text-xs text-ink focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="button" className="h-9 px-4 rounded-lg bg-accent text-canvas text-xs font-bold border-none cursor-pointer hover:brightness-110 transition-all">
            Save Changes
          </button>
        </div>
      </section>

      {/* Security */}
      <section className="bg-surface border border-border rounded-card p-6 flex flex-col gap-4">
        <h2 className="text-[13px] font-semibold border-b border-border-subtle pb-3">Security</h2>
        <div className="flex flex-col gap-3">
          {[
            { label: "Enforce 2FA for all members", checked: true },
            { label: "Allow GitHub OAuth login",    checked: true },
            { label: "Restrict access by email domain", checked: false },
          ].map(({ label, checked }) => (
            <label key={label} className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-muted">{label}</span>
              <div
                className="relative w-9 h-5 rounded-full transition-colors"
                style={{ background: checked ? "oklch(0.68 0.17 264)" : "oklch(0.30 0.014 260)" }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-ink shadow transition-all"
                  style={{ left: checked ? "calc(100% - 18px)" : "2px" }}
                />
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-surface border border-danger/30 rounded-card p-6 flex flex-col gap-4">
        <h2 className="text-[13px] font-semibold text-danger border-b border-danger/20 pb-3">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-ink">Delete Organisation</div>
            <div className="text-[11px] text-subtle mt-0.5">Permanently remove this organisation and all its data</div>
          </div>
          <button type="button" className="h-9 px-4 rounded-lg bg-danger/20 text-danger border border-danger/40 text-xs font-bold cursor-pointer hover:bg-danger/30 transition-colors">
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}
