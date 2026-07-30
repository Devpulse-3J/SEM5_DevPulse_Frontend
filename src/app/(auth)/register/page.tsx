import Link from "next/link";
import { IconGitHub } from "@/components/icons";

export const metadata = {
  title: "Create Account — DevPulse",
  description: "Create your account or request workspace access on DevPulse",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-1">Get started with DevPulse</h1>
        <p className="text-xs text-muted">
          Create your account or sign up with GitHub
        </p>
      </div>

      <div className="bg-surface border border-border rounded-panel p-7 flex flex-col gap-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        {/* GitHub OAuth Button */}
        <button
          type="button"
          className="w-full h-10 rounded-lg bg-canvas border border-border text-ink font-semibold text-xs flex items-center justify-center gap-2 hover:border-accent/40 transition-all cursor-pointer"
        >
          <IconGitHub />
          <span>Sign up with GitHub</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-subtle text-[11px] font-mono my-1">
          <div className="flex-1 h-px bg-border-subtle" />
          <span>OR</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        {/* Register Form */}
        <form className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs text-muted font-medium">
              Full name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Marcus Webb"
              required
              className="h-10 px-3 rounded-lg bg-canvas border border-border text-ink text-xs focus:outline-none focus:border-accent transition-colors placeholder:text-subtle"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs text-muted font-medium">
              Work email
            </label>
            <input
              id="email"
              type="email"
              placeholder="marcus.webb@nimbuslabs.io"
              required
              className="h-10 px-3 rounded-lg bg-canvas border border-border text-ink text-xs focus:outline-none focus:border-accent transition-colors placeholder:text-subtle"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs text-muted font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              required
              minLength={8}
              className="h-10 px-3 rounded-lg bg-canvas border border-border text-ink text-xs focus:outline-none focus:border-accent transition-colors placeholder:text-subtle"
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 mt-2 rounded-lg bg-accent text-canvas font-bold text-xs hover:brightness-110 transition-all cursor-pointer border-none"
          >
            Create Account
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-subtle">
        Already have an account?{" "}
        <Link href="/login" className="text-accent font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
