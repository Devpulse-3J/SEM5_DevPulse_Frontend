import Link from "next/link";
import {
  IconChart,
  IconShield,
  IconZap,
  IconGitBranch,
  IconBell,
  IconUsers,
  IconArrowRight,
  IconGitHub,
  IconJira,
} from "@/components/icons";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { MetricCard } from "@/components/landing/MetricCard";
import { chart } from "@/styles/theme";

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE — GitHub-style Landing Page
   Owner: Person A (root landing / redirect)
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas text-ink overflow-x-hidden">
      {/* ─── NAVIGATION ─── */}
      <nav className="sticky top-0 z-50 h-14 bg-app/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-4">
          <span className="font-mono font-bold text-[15px] tracking-wide text-ink">
            ◆ DEVPULSE
          </span>
          <div className="hidden md:flex items-center gap-5 ml-6 text-[13px]">
            <a href="#features" className="text-muted hover:text-ink transition-colors">Features</a>
            <a href="#metrics" className="text-muted hover:text-ink transition-colors">Metrics</a>
            <a href="#integrations" className="text-muted hover:text-ink transition-colors">Integrations</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-[13px] font-medium text-muted hover:text-ink transition-colors px-3 py-1.5 no-underline hover:no-underline">
            Sign in
          </Link>
          <Link href="/register" className="text-[13px] font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-neutral-200 hover:text-black transition-colors no-underline hover:no-underline">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative flex flex-col items-center text-center pt-24 pb-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#1a1a1a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.10), transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-accent bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8">
            DEVELOPER PRODUCTIVITY PLATFORM
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight mb-6">
            Ship faster with <span className="text-accent">clarity</span>,<br /> not guesswork.
          </h1>

          <p className="text-base md:text-lg text-muted max-w-xl mx-auto leading-relaxed mb-10">
            DevPulse gives engineering teams DORA metrics, ML-powered PR risk scoring, real-time bottleneck alerts, and workload analytics — all in one dark-mode dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-6 py-3 rounded-lg hover:bg-neutral-200 hover:text-black transition-colors no-underline hover:no-underline">
              Get Started Free <IconArrowRight />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 bg-surface-raised text-muted font-semibold text-sm px-6 py-3 rounded-lg border border-border hover:text-ink hover:border-white/40 transition-all no-underline hover:no-underline">
              Sign in to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LIVE METRICS PREVIEW ─── */}
      <section id="metrics" className="py-16 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-xs text-subtle tracking-widest mb-2">DORA METRICS AT A GLANCE</div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Your engineering pulse, <span className="text-accent">quantified</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Data gets color even though the chrome is monochrome. accentColor is the
                reserved status scale — always paired with the ▲/▼ + tier text below it. */}
            <MetricCard label="Deployment Frequency" value="6.2" unit="/day" sparkData={[40, 55, 50, 70, 65, 85, 100]} accentColor={chart.success} trend="▲ Elite · +0.8 vs prior period" />
            <MetricCard label="Lead Time for Changes" value="4.1" unit="hrs" sparkData={[80, 70, 60, 55, 40, 35, 30]} accentColor={chart.success} trend="▼ Elite · −1.4hrs vs prior period" />
            <MetricCard label="Mean Time to Recovery" value="2.8" unit="hrs" sparkData={[30, 35, 60, 55, 65, 50, 58]} accentColor={chart.warning} trend="▲ High · +0.6hrs vs prior period" />
            <MetricCard label="Change Failure Rate" value="18.4" unit="%" sparkData={[35, 40, 45, 55, 75, 80, 90]} accentColor={chart.danger} trend="▲ Needs Attention · +3.1pp" />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-20 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="font-mono text-xs text-subtle tracking-widest mb-2">CAPABILITIES</div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Everything your team needs to <span className="text-accent">deliver better software</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard icon={<IconChart />} title="DORA Metrics Dashboard" description="Track Deployment Frequency, Lead Time, MTTR, and Change Failure Rate in real time with Elite/High/Medium/Low tier benchmarks." />
            <FeatureCard icon={<IconShield />} title="ML-Powered PR Risk Scoring" description="Predictive risk analysis on every pull request — flag high-risk changes before they merge and cause outages." />
            <FeatureCard icon={<IconZap />} title="Real-Time Bottleneck Alerts" description="Automatic detection of stale PRs, review bottlenecks, build failures, and overloaded developers. Instant Slack notifications." />
            <FeatureCard icon={<IconGitBranch />} title="Repository & PR Insights" description="Deep drill-downs into every repository and pull request — file-level hotspots, review velocity, and code churn analysis." />
            <FeatureCard icon={<IconUsers />} title="Team Workload Analytics" description="Visualize developer workload distribution, identify burnout risks, and balance assignments across the team." />
            <FeatureCard icon={<IconBell />} title="Smart Notifications" description="Configurable alert rules with Slack, email, and in-app channels. Never miss a critical deployment or review delay." />
          </div>
        </div>
      </section>

      {/* ─── INTEGRATIONS ─── */}
      <section id="integrations" className="py-20 px-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-mono text-xs text-subtle tracking-widest mb-2">INTEGRATIONS</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Plugs into your <span className="text-accent">existing workflow</span>
          </h2>
          <p className="text-sm text-muted max-w-lg mx-auto mb-12">
            DevPulse connects to GitHub, Jira, and Slack out of the box — no custom scripts, no manual exports. Set up in minutes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-surface border border-border rounded-card p-5 flex flex-col items-center gap-3 group hover:border-white/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-surface-raised flex items-center justify-center text-ink transition-colors">
                <IconGitHub />
              </div>
              <div className="text-sm font-semibold">GitHub</div>
              <div className="text-[11px] text-muted">Repos, PRs, Webhooks</div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-surface-raised text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> SUPPORTED
              </span>
            </div>

            <div className="bg-surface border border-border rounded-card p-5 flex flex-col items-center gap-3 group hover:border-white/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-surface-raised flex items-center justify-center text-ink transition-colors">
                <IconJira />
              </div>
              <div className="text-sm font-semibold">Jira</div>
              <div className="text-[11px] text-muted">Issues, Sprints, Boards</div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-surface-raised text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> SUPPORTED
              </span>
            </div>

            <div className="bg-surface border border-border rounded-card p-5 flex flex-col items-center gap-3 group hover:border-white/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-surface-raised flex items-center justify-center font-mono text-sm font-bold text-ink transition-colors">
                SL
              </div>
              <div className="text-sm font-semibold">Slack</div>
              <div className="text-[11px] text-muted">Alerts, Notifications</div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-surface-raised text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> SUPPORTED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm text-ink">◆ DEVPULSE</span>
            <span className="text-xs text-subtle">Developer Productivity Dashboard</span>
          </div>
          <div className="text-xs text-subtle">
            © {new Date().getFullYear()} DevPulse. Built for engineering teams.
          </div>
        </div>
      </footer>
    </main>
  );
}