// OWNER: Person B — duration / relative-time helpers (date-fns only).
import { differenceInDays, formatDistanceToNowStrict, parseISO } from "date-fns";

function toDate(input: string | Date): Date {
  return typeof input === "string" ? parseISO(input) : input;
}

/** "22 minutes ago", "3 hours ago", "5 days ago". */
export function timeAgo(input: string | Date): string {
  return formatDistanceToNowStrict(toDate(input), { addSuffix: true });
}

/** Whole days a PR/issue has been open, from its created date to now. */
export function daysOpen(createdAt: string | Date): number {
  return differenceInDays(new Date(), toDate(createdAt));
}

/** Humanize a raw hour count: 2.8 → "2.8h", 30 → "1.3d". */
export function humanizeHours(hours: number): string {
  if (hours < 24) return `${Math.round(hours * 10) / 10}h`;
  return `${Math.round((hours / 24) * 10) / 10}d`;
}
