import React from "react";

export interface FeatureUnavailableProps {
  /** What the user came here for, e.g. "DORA metrics". */
  title: string;
  /** One line on why it is not here. Say what is missing, not "coming soon". */
  message: string;
  className?: string;
}

/**
 * The honest empty state for a screen whose backend does not exist yet.
 *
 * Deliberately NOT a skeleton and NOT a zeroed-out chart: a loading shimmer
 * implies data is on its way, and a "0" implies a real measurement of zero.
 * Both are lies that cost someone an afternoon of debugging. This renders a
 * heading and one sentence, and nothing else.
 */
export function FeatureUnavailable({
  title,
  message,
  className = "",
}: FeatureUnavailableProps) {
  return (
    <div
      className={`flex min-h-[220px] flex-col items-center justify-center rounded-panel border border-dashed border-border bg-surface px-6 py-12 text-center ${className}`}
    >
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <p className="mt-1.5 max-w-md text-xs text-muted">{message}</p>
    </div>
  );
}

export default FeatureUnavailable;
