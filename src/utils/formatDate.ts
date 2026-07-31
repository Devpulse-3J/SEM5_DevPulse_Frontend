// OWNER: Person B — date formatting helpers (date-fns only, never Moment).
import { format, parseISO } from "date-fns";

function toDate(input: string | Date): Date {
  return typeof input === "string" ? parseISO(input) : input;
}

/** "Jul 31, 2026" */
export function formatDate(input: string | Date, pattern = "MMM d, yyyy"): string {
  return format(toDate(input), pattern);
}

/** "Jul 31, 2026 · 14:05" */
export function formatDateTime(input: string | Date): string {
  return format(toDate(input), "MMM d, yyyy · HH:mm");
}

/** Short weekday label, e.g. "Mon". */
export function formatWeekday(input: string | Date): string {
  return format(toDate(input), "EEE");
}
