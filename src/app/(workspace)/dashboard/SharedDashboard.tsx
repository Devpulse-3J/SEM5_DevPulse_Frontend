"use client";

import type { ReactNode } from "react";

interface SharedDashboardProps {
  /** Page title — differs between Manager ("Overview") and Developer ("Welcome back, …") */
  title: string;
  /** Subtitle line under the title */
  subtitle?: string;
  /** Filter controls rendered in the top-right */
  filters?: ReactNode;
  /** Role-specific panel injected as children */
  children: ReactNode;
}

export function SharedDashboard({
  title,
  subtitle,
  filters,
  children,
}: SharedDashboardProps) {
  return (
    <div className="flex flex-col gap-5 p-6 pb-16">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-bold">{title}</h2>
          {subtitle && (
            <div className="mt-1 text-xs text-subtle">{subtitle}</div>
          )}
        </div>
        {filters && <div className="flex gap-2">{filters}</div>}
      </div>

      {/* Role-specific content */}
      {children}
    </div>
  );
}

export default SharedDashboard;
