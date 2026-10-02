import Link from "next/link";
import Image from "next/image";
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
import TechText from "@/components/landing/TechText";
import GradientWaves from "@/components/landing/GradientWaves";
import ParticleText from "@/components/landing/ParticleText";
import TextType from "@/components/landing/TextType";
import { chart } from "@/styles/theme";

const HERO_LINES = ["Ship faster with clarity,", "not guesswork."];

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE — GitHub-style Landing Page
   Owner: Person A (root landing / redirect)
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas text-ink overflow-x-hidden">
      {/* ─── NAVIGATION ─── */}
      <nav className="sticky top-0 z-50 h-14 bg-app/80 backdrop-blur-xl border-b border-border px-6">
        {/* Same centred container as the sections below, so the logo and the
            buttons line up with the page content at any window width. */}
        <div className="mx-auto flex h-full max-w-7xl 2xl:max-w-[1440px] items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-mono font-bold text-[15px] tracking-wide text-ink no-underline hover:no-underline">
              <Image
                src="/icons/icon.png"
                alt="OdinEye"
                width={24}
                height={24}
                className="rounded object-contain"
              />
              <span>OdinEye</span>
            </Link>
            <div className="hidden md:flex items-center gap-5 ml-6 text-[13px]">
              <a href="#features" className="text-muted hover:text-ink transition-colors">Features</a>
              <a href="#metrics" className="text-muted hover:text-ink transition-colors">Metrics</a>
              <a href="#integrations" className="text-muted hover:text-ink transition-colors">Integrations</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/adminlogin" className="text-[13px] font-medium text-muted hover:text-ink transition-colors px-3 py-1.5 no-underline hover:no-underline">
              Admin login
            </Link>
            <Link href="/login" className="text-[13px] font-medium text-muted hover:text-ink transition-colors px-3 py-1.5 no-underline hover:no-underline">
              Sign in
            </Link>
            <Link href="/register" className="text-[13px] font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-neutral-200 hover:text-black transition-colors no-underline hover:no-underline">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative flex flex-col items-center text-center pt-24 pb-40 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#1a1a1a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Animated wave field behind the hero. Values are the ones chosen in
            the React Bits customizer. Masked so it fades out toward the top,
            where the heading sits, and again at the very bottom so the hero
            ends without a hard edge. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 62%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 62%, transparent 100%)",
          }}
        >
          <GradientWaves
            horizonColor="#0b8b58"
            waveColor="#FF9FFC"
            crestColor="#FFFFFF"
            speed={0.3}
            amplitude={2.5}
            waveScale={0.4}
            waveRatio={0.7}
            swell={60}
            turbulence={20}
            tilt={1.11}
            zoom={1.0}
            height={5.5}
            fogDepth={15}
            detail="medium"
            brightness={1.5}
            opacity={0.8}
            mouseInteraction={true}
            parallaxStrength={0.5}
            grain={true}
            grainIntensity={0.05}
          />
        </div>

        <div className="relative z-10 max-w-3xl flex flex-col items-center">
          <div className="w-full h-44 sm:h-56 md:h-64 flex items-center justify-center mb-6">
            <ParticleText
              text="OdinEye"
              particleSize={2}
              density={4}
              color="#ffffff"
              highlightColor="#5fd3a8"
              scatter={180}
              gatherDuration={1600}
              stagger={420}
              pointerRepel={40}
              repelRadius={120}
              idleDrift={0}
              trigger="mount"
              fontSize="clamp(3rem, 12vw, 8rem)"
              fontWeight={650}
              fontFamily="inherit"
              glow
            />
          </div>

          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-accent bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8">
            DEVELOPER PRODUCTIVITY PLATFORM
          </div>

          <div className="mb-6 min-h-[120px] flex items-center justify-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white text-center">
              <TextType
                text={["Ship faster with clarity,", "not guesswork."]}
                typingSpeed={65}
                pauseDuration={1800}
                deletingSpeed={35}
                showCursor={true}
                cursorCharacter="|"
                cursorClassName="text-[#5fd3a8]"
                textColors={["#ffffff", "#5fd3a8"]}
              />
            </h1>
          </div>

          <p className="text-base md:text-lg text-muted max-w-xl mx-auto leading-relaxed mb-10">
            OdinEye gives engineering teams DORA metrics, ML-powered PR risk scoring, real-time bottleneck alerts, and workload analytics all in one dark-mode dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-6 py-3 rounded-lg hover:bg-neutral-200 hover:text-black transition-colors no-underline hover:no-underline">
              Get Started <IconArrowRight />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 bg-surface-raised text-muted font-semibold text-sm px-6 py-3 rounded-lg border border-border hover:text-ink hover:border-white/40 transition-all no-underline hover:no-underline">
              Sign in to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LIVE METRICS PREVIEW ─── */}
      <section id="metrics" className="relative py-16 px-6 scroll-mt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[min(1100px,90%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#257f61]/20 blur-3xl"
        />
        <div className="relative max-w-7xl 2xl:max-w-[1440px] mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-xs text-[#5fd3a8] tracking-widest mb-2">DORA METRICS AT A GLANCE</div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Your engineering pulse, <span className="bg-gradient-to-r from-[#5fd3a8] to-[#ff9ffc] bg-clip-text text-transparent">quantified</span>
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
        <div className="relative max-w-7xl 2xl:max-w-[1440px] mx-auto">
          <div className="text-center mb-14">
            <div className="font-mono text-xs text-[#5fd3a8] tracking-widest mb-2">CAPABILITIES</div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Everything your team needs to <span className="bg-gradient-to-r from-[#5fd3a8] to-[#ff9ffc] bg-clip-text text-transparent">deliver better software</span>
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
      <section id="integrations" className="relative py-20 px-6 scroll-mt-20 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#257f61]/20 blur-3xl"
        />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="font-mono text-xs text-[#5fd3a8] tracking-widest mb-2">INTEGRATIONS</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Plugs into your <span className="bg-gradient-to-r from-[#5fd3a8] to-[#ff9ffc] bg-clip-text text-transparent">existing workflow</span>
          </h2>
          <p className="text-sm text-muted max-w-lg mx-auto mb-12">
            OdinEye connects to GitHub, Jira, and Slack out of the box — no custom scripts, no manual exports. Set up in minutes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-[#257f61]/[0.07] border border-[#257f61]/30 rounded-card p-5 flex flex-col items-center gap-3 group hover:border-[#5fd3a8]/70 hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#257f61]/25 flex items-center justify-center text-[#5fd3a8] transition-colors">
                <IconGitHub />
              </div>
              <div className="text-sm font-semibold">GitHub</div>
              <div className="text-[11px] text-muted">Repos, PRs, Webhooks</div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#257f61]/20 text-[#5fd3a8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5fd3a8]" /> SUPPORTED
              </span>
            </div>

            <div className="bg-[#257f61]/[0.07] border border-[#257f61]/30 rounded-card p-5 flex flex-col items-center gap-3 group hover:border-[#5fd3a8]/70 hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#257f61]/25 flex items-center justify-center text-[#5fd3a8] transition-colors">
                <IconJira />
              </div>
              <div className="text-sm font-semibold">Jira</div>
              <div className="text-[11px] text-muted">Issues, Sprints, Boards</div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#257f61]/20 text-[#5fd3a8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5fd3a8]" /> SUPPORTED
              </span>
            </div>

            <div className="bg-[#257f61]/[0.07] border border-[#257f61]/30 rounded-card p-5 flex flex-col items-center gap-3 group hover:border-[#5fd3a8]/70 hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#257f61]/25 flex items-center justify-center font-mono text-sm font-bold text-[#5fd3a8] transition-colors">
                SL
              </div>
              <div className="text-sm font-semibold">Slack</div>
              <div className="text-[11px] text-muted">Alerts, Notifications</div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#257f61]/20 text-[#5fd3a8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5fd3a8]" /> SUPPORTED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#257f61]/30 py-8 px-6">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/icons/icon.png"
              alt="OdinEye"
              width={20}
              height={20}
              className="rounded object-contain"
            />
            <span className="font-mono font-bold text-sm text-ink">OdinEye</span>
            <span className="text-xs text-subtle ml-1">Developer Productivity Dashboard</span>
          </div>
          <div className="text-xs text-subtle">
            © {new Date().getFullYear()} OdinEye. Built for engineering teams.
          </div>
        </div>
      </footer>
    </main>
  );
}