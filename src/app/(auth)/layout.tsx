import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-canvas text-ink flex flex-col justify-center items-center relative py-12 px-4 overflow-hidden">
      {/* Background Dot Grid */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.26 0.012 260) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top Brand Logo */}
      <div className="relative z-10 mb-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2 no-underline hover:no-underline">
          <span className="font-mono font-bold text-2xl tracking-wide text-ink">
            ◆ DEVPULSE
          </span>
        </Link>
      </div>

      {/* Auth Card Container */}
      <div className="relative z-10 w-full max-w-[400px]">{children}</div>
    </main>
  );
}
