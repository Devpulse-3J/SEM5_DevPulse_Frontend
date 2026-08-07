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
        <h1 className="mb-1 text-xl font-bold text-white">
          Get started with DevPulse
        </h1>
        <p className="text-xs text-neutral-400">
          Create your account or sign up with GitHub
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-panel border border-neutral-800 bg-[#0a0a0a] p-7 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
        {/* GitHub OAuth Button */}
        <button
          type="button"
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-black text-xs font-semibold text-white transition-colors hover:border-neutral-500 hover:bg-neutral-900"
        >
          <IconGitHub />
          <span>Sign up with GitHub</span>
        </button>

        {/* Divider */}
        <div className="my-1 flex items-center gap-3 font-mono text-[11px] text-neutral-500">
          <div className="h-px flex-1 bg-neutral-800" />
          <span>OR</span>
          <div className="h-px flex-1 bg-neutral-800" />
        </div>

        {/* Register Form */}
        <form className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-xs font-medium text-neutral-400"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Marcus Webb"
              required
              className="h-10 rounded-lg border border-neutral-800 bg-black px-3 text-xs text-white transition-colors placeholder:text-neutral-600 focus:border-white focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-neutral-400"
            >
              Work email
            </label>
            <input
              id="email"
              type="email"
              placeholder="marcus.webb@nimbuslabs.io"
              required
              className="h-10 rounded-lg border border-neutral-800 bg-black px-3 text-xs text-white transition-colors placeholder:text-neutral-600 focus:border-white focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-neutral-400"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              required
              minLength={8}
              className="h-10 rounded-lg border border-neutral-800 bg-black px-3 text-xs text-white transition-colors placeholder:text-neutral-600 focus:border-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-10 w-full cursor-pointer rounded-lg border-none bg-white text-xs font-bold text-black transition-colors hover:bg-neutral-200"
          >
            Create Account
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-neutral-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-white hover:text-white hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
