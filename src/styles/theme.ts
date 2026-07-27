/**
 * Chart.js color tokens — mirrors the CSS @theme values in globals.css.
 * Use these when Chart.js needs plain JS strings (datasets, scales, grid).
 */
export const chart = {
  accent: "oklch(0.68 0.17 264)",
  accentHover: "oklch(0.78 0.15 264)",
  success: "oklch(0.72 0.16 155)",
  warning: "oklch(0.78 0.16 80)",
  danger: "oklch(0.66 0.19 22)",
  ink: "oklch(0.95 0.004 260)",
  muted: "oklch(0.70 0.018 260)",
  subtle: "oklch(0.52 0.02 260)",
  border: "oklch(0.30 0.014 260)",
  surface: "oklch(0.185 0.012 260)",
  surfaceRaised: "oklch(0.225 0.013 260)",
} as const;

/**
 * Palette for multi-series charts — visually distinct, accessible on dark bg.
 */
export const series = [
  "oklch(0.68 0.17 264)", // accent blue
  "oklch(0.72 0.16 155)", // green
  "oklch(0.78 0.16 80)",  // amber
  "oklch(0.66 0.19 22)",  // red
  "oklch(0.70 0.15 310)", // purple
  "oklch(0.75 0.14 190)", // teal
] as const;
