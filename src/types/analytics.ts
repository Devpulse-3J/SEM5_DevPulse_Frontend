// OWNER: Person B — Team & Workload analytics types (mirror gateway /api/metrics/workload).

export type LoadSeverity = "good" | "warn" | "bad";

/** One row of the "Developer Capacity" roster. */
export interface WorkloadEntry {
  id: string;
  name: string;
  initials: string;
  activePrs: number;
  loadPct: number; // 190 = 190% of team avg
  loadSeverity: LoadSeverity;
  cycleTimeDays: number;
}

/** A slice of the "Effort Distribution" donut. */
export interface EffortSlice {
  label: string; // "Feature work"
  pct: number; // 0–100
}

/** "Cycle Time Breakdown by Stage" — one stacked bar per stage. */
export interface CycleStageSegment {
  team: string; // "Backend" | "Frontend" | "Mobile" | "Data"
  pct: number; // share within the stage, 0–100
}
export interface CycleStage {
  stage: string; // "Coding" | "Pickup" | "Review" | "Merge → Deploy"
  totalHours: number;
  segments: CycleStageSegment[];
}

export type ReviewStatus = "ESCALATED" | "WAITING" | "OK";

/** One row of the "Review Bottlenecks" table. */
export interface ReviewBottleneck {
  prId: string; // "#4128"
  title: string;
  reviewer: string;
  waitingHours: number;
  status: ReviewStatus;
}
