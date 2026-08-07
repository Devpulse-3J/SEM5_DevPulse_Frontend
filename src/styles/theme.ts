/**
 * Chart.js color tokens. Use these when Chart.js needs plain JS strings
 * (datasets, scales, grid).
 *
 * The app chrome is monochrome black — but DATA is allowed color, because hue
 * is the only channel that does series identity well. So this file splits:
 *
 *   - chrome (ink/muted/subtle/border/surface) mirrors the grayscale @theme
 *     values in globals.css;
 *   - data (accent/status/series) carries hue and is deliberately NOT mirrored
 *     into globals.css — nothing outside a chart should use these.
 *
 * All data colors are validated against this app's black chart surface
 * (#000000) for the dark lightness band, chroma floor, protan/deutan/tritan
 * separation, and >= 3:1 contrast. Don't hand-edit a hex here; re-run the
 * validator if the palette needs to change.
 */
export const chart = {
  /* ── chrome: grayscale, matches globals.css ── */
  ink: "#ffffff",
  muted: "#a3a3a3",
  subtle: "#6b6b6b",
  border: "#2a2a2a",
  surface: "#000000",
  surfaceRaised: "#0a0a0a",

  /* ── data: primary series color (categorical slot 1) ── */
  accent: "#3987e5",
  accentHover: "#5598e7",

  /* ── data: status scale, reserved meaning ──
     Only for series that MEAN good/bad (workload pressure, failure rate).
     A series that is merely "series 4" takes a `series` slot instead.
     Always ship these with an icon or text label — never color alone. */
  success: "#0ca30c", // good      6.26:1 on black
  warning: "#fab219", // warning  11.45:1
  serious: "#ec835a", // serious   7.96:1
  danger: "#d03b3b", // critical  4.37:1
} as const;

/**
 * Categorical palette for multi-series charts — series identity only.
 *
 * Assign in order, never cycled: the ORDER is the colorblind-safety mechanism,
 * not decoration. Worst adjacent pair on black measures ΔE 8.4 under protanopia
 * and 19.3 under normal vision.
 *
 * Caps: safe for stacks/bars/lines/rings at all 8 slots (only neighbors touch).
 * For scatter/bubble/small-multiples, where any two marks can land side by side,
 * use the FIRST THREE slots only and fold the rest into "Other" — no ordering of
 * eight can stay pairwise-distinct in that case.
 */
export const series = [
  "#3987e5", // 1 blue
  "#d95926", // 2 orange
  "#199e70", // 3 aqua
  "#c98500", // 4 yellow
  "#d55181", // 5 magenta
  "#008300", // 6 green
  "#9085e9", // 7 violet
  "#e66767", // 8 red
] as const;
