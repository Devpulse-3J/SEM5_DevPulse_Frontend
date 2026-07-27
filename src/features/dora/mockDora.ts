// OWNER: Person B — FAKE data for the Manager view, taken from the UI spec.
// Use this until Person A's api-client + gateway are ready, then swap for a
// React Query hook (useDora) that fetches the same shapes.

import type { DoraSummary, LeadTimeTrend, RepoDeploy } from "@/types/dora";
import type {
  WorkloadEntry,
  EffortSlice,
  CycleStage,
  ReviewBottleneck,
} from "@/types/analytics";

/** Overview dashboard — 4 DORA metric cards. */
export const mockDoraSummary: DoraSummary = {
  project: "platform-core",
  repoCount: 34,
  updatedAgo: "2 min ago",
  metrics: [
    {
      key: "deploymentFrequency",
      label: "Deployment Frequency",
      value: 6.2,
      unit: "/day",
      rating: "ELITE",
      ratingLabel: "Elite",
      severity: "good",
      trend: { direction: "up", text: "Elite · +0.8 vs prior period" },
      sparkline: [40, 55, 50, 70, 65, 85, 100],
    },
    {
      key: "leadTime",
      label: "Lead Time for Changes",
      value: 4.1,
      unit: "hrs",
      rating: "ELITE",
      ratingLabel: "Elite",
      severity: "good",
      trend: { direction: "down", text: "Elite · −1.4hrs vs prior period" },
      sparkline: [80, 70, 60, 55, 40, 35, 30],
    },
    {
      key: "mttr",
      label: "Mean Time to Recovery",
      value: 2.8,
      unit: "hrs",
      rating: "HIGH",
      ratingLabel: "High",
      severity: "warn",
      trend: { direction: "up", text: "High · +0.6hrs vs prior period" },
      sparkline: [30, 35, 60, 55, 65, 50, 58],
    },
    {
      key: "changeFailureRate",
      label: "Change Failure Rate",
      value: 18.4,
      unit: "%",
      rating: "LOW",
      ratingLabel: "Needs Attention",
      severity: "bad",
      trend: { direction: "up", text: "Needs Attention · +3.1pp vs prior period" },
      sparkline: [35, 40, 45, 55, 75, 80, 90],
    },
  ],
};

/** Overview dashboard — "Lead Time Trend — 12 Weeks" line chart. */
export const mockLeadTimeTrend: LeadTimeTrend = {
  unit: "median, hrs",
  points: [
    { week: "W1", hours: 7.8 },
    { week: "W2", hours: 7.2 },
    { week: "W3", hours: 7.4 },
    { week: "W4", hours: 6.6 },
    { week: "W5", hours: 6.8 },
    { week: "W6", hours: 5.6 },
    { week: "W7", hours: 5.8 },
    { week: "W8", hours: 4.8 },
    { week: "W9", hours: 5.0 },
    { week: "W10", hours: 4.4 },
    { week: "W11", hours: 4.2 },
    { week: "W12", hours: 4.1 },
  ],
};

/** Overview dashboard — "Deploys by Repo (7d)". */
export const mockRepoDeploys: RepoDeploy[] = [
  { repo: "api-gateway", deploys: 42, pct: 88 },
  { repo: "web-app", deploys: 34, pct: 70 },
  { repo: "payments-svc", deploys: 25, pct: 52 },
  { repo: "mobile-ios", deploys: 14, pct: 30 },
  { repo: "data-pipeline", deploys: 9, pct: 20 },
];

/** Team & Workload — "Developer Capacity" roster. */
export const mockWorkload: WorkloadEntry[] = [
  { id: "u1", name: "Tom Reilly", initials: "TR", activePrs: 9, loadPct: 190, loadSeverity: "bad", cycleTimeDays: 3.4 },
  { id: "u2", name: "Marcus Webb", initials: "MW", activePrs: 6, loadPct: 122, loadSeverity: "warn", cycleTimeDays: 2.1 },
  { id: "u3", name: "Priya Patel", initials: "PP", activePrs: 5, loadPct: 94, loadSeverity: "good", cycleTimeDays: 1.6 },
  { id: "u4", name: "Diego Alvarez", initials: "DA", activePrs: 7, loadPct: 128, loadSeverity: "warn", cycleTimeDays: 2.8 },
  { id: "u5", name: "Aisha Osei", initials: "AO", activePrs: 3, loadPct: 71, loadSeverity: "good", cycleTimeDays: 1.2 },
];

/** Team & Workload — "Effort Distribution" donut. */
export const mockEffort: EffortSlice[] = [
  { label: "Feature work", pct: 42 },
  { label: "Code review", pct: 24 },
  { label: "Bug fixes", pct: 22 },
  { label: "Meetings/other", pct: 12 },
];

/** Team & Workload — "Cycle Time Breakdown by Stage" (stacked by team). */
export const mockCycleTime: CycleStage[] = [
  {
    stage: "Coding",
    totalHours: 14.2,
    segments: [
      { team: "Backend", pct: 38 },
      { team: "Frontend", pct: 22 },
      { team: "Mobile", pct: 28 },
      { team: "Data", pct: 12 },
    ],
  },
  {
    stage: "Pickup",
    totalHours: 6.8,
    segments: [
      { team: "Backend", pct: 20 },
      { team: "Frontend", pct: 15 },
      { team: "Mobile", pct: 15 },
      { team: "Data", pct: 50 },
    ],
  },
  {
    stage: "Review",
    totalHours: 9.4,
    segments: [
      { team: "Backend", pct: 30 },
      { team: "Frontend", pct: 40 },
      { team: "Mobile", pct: 20 },
      { team: "Data", pct: 10 },
    ],
  },
  {
    stage: "Merge → Deploy",
    totalHours: 3.1,
    segments: [
      { team: "Backend", pct: 60 },
      { team: "Frontend", pct: 20 },
      { team: "Mobile", pct: 15 },
      { team: "Data", pct: 5 },
    ],
  },
];

/** Team & Workload — "Review Bottlenecks" table. */
export const mockReviewBottlenecks: ReviewBottleneck[] = [
  { prId: "#4128", title: "Refactor auth token rotation", reviewer: "P. Patel", waitingHours: 52, status: "ESCALATED" },
  { prId: "#4140", title: "Mobile push notification retry", reviewer: "J. Kim", waitingHours: 28, status: "WAITING" },
];
