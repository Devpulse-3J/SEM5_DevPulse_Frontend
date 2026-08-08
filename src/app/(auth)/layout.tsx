import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 py-12 text-white">
      {/* Background Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#1c1c1c 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Soft vignette so the card lifts off the grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, transparent 0%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Top Brand Logo */}
      <div className="relative z-10 mb-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white no-underline hover:text-white hover:no-underline"
        >
          <span className="font-mono text-2xl font-bold tracking-wide">
            ◆ Odin Eye
          </span>
        </Link>
      </div>

      {/* Auth Card Container */}
      <div className="relative z-10 w-full max-w-[400px]">{children}</div>
    </main>
  );
}
