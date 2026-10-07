"use client";

import { useEffect, useState } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";

/**
 * A step-by-step guide: a popup that points at one sidebar link per step and
 * says what to do there. Shared by ManagerTour and AdminTour.
 *
 * Each sidebar link carries `data-tour="<href>"`; a step names the href it
 * points at (several steps may point at the same link). Completion is
 * remembered per user in localStorage under `storagePrefix`, so the guide
 * opens by itself once; firing `replayEvent` on window reopens it.
 */

export interface GuideStep {
  /** href of the sidebar link this step points at. */
  target: string;
  title: string;
  body: string;
  /** Optional numbered instructions under the body. Use the real button names. */
  points?: string[];
}

export interface GuideTourProps {
  userId: number | string | null | undefined;
  steps: GuideStep[];
  storagePrefix: string;
  replayEvent: string;
}

const POPUP_WIDTH = 320;

/** Only call after mount: the server has no localStorage. */
function hasSeen(prefix: string, userId: number | string): boolean {
  try {
    return localStorage.getItem(`${prefix}${userId}`) === "done";
  } catch {
    // No storage: treat as seen so the guide can't reopen on every page.
    return true;
  }
}

function markSeen(prefix: string, userId: number | string): void {
  try {
    localStorage.setItem(`${prefix}${userId}`, "done");
  } catch {
    // Storage unavailable; the guide simply won't remember being closed.
  }
}

interface Anchor {
  top: number;
  left: number;
  width: number;
  height: number;
}

function measure(target: string): Anchor | null {
  const el = document.querySelector(`[data-tour="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export function GuideTour({ userId, steps, storagePrefix, replayEvent }: GuideTourProps) {
  const hasMounted = useHasMounted();
  const [dismissed, setDismissed] = useState(false);
  const [replayed, setReplayed] = useState(false);
  const [step, setStep] = useState(0);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  // localStorage is read only after mount, so the server render and the
  // hydration render agree (both render nothing).
  const firstVisit =
    hasMounted && userId != null && !dismissed && !hasSeen(storagePrefix, userId);
  const open = replayed || firstVisit;
  const target = steps[step].target;

  useEffect(() => {
    const onReplay = () => {
      setStep(0);
      setReplayed(true);
    };
    window.addEventListener(replayEvent, onReplay);
    return () => window.removeEventListener(replayEvent, onReplay);
  }, [replayEvent]);

  // Track the highlighted link's position, including after a window resize.
  useEffect(() => {
    if (!open) return;
    const update = () => setAnchor(measure(target));
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [open, target]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (userId != null) markSeen(storagePrefix, userId);
      setDismissed(true);
      setReplayed(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, userId, storagePrefix]);

  if (!open || !anchor) return null;

  const current = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  const close = () => {
    if (userId != null) markSeen(storagePrefix, userId);
    setDismissed(true);
    setReplayed(false);
    setStep(0);
  };

  // Popup sits to the right of the link, vertically centred on it, and is
  // kept inside the window. Steps with a list are taller, so allow more room.
  const popupHeight = current.points ? 300 : 200;
  const popupLeft = Math.min(anchor.left + anchor.width + 16, window.innerWidth - POPUP_WIDTH - 12);
  const popupTop = Math.max(
    12,
    Math.min(anchor.top + anchor.height / 2 - 70, window.innerHeight - popupHeight),
  );
  const arrowTop = anchor.top + anchor.height / 2 - popupTop - 6;

  return (
    <>
      {/* Ring around the sidebar link the step is about. */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-[60] rounded-lg ring-2 ring-[#5fd3a8] transition-all duration-200"
        style={{
          top: anchor.top - 3,
          left: anchor.left - 3,
          width: anchor.width + 6,
          height: anchor.height + 6,
        }}
      />

      <div
        role="dialog"
        aria-label={`Guide, step ${step + 1} of ${steps.length}: ${current.title}`}
        className="fixed z-[61] rounded-xl border border-[#257f61]/60 bg-surface-raised p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] transition-all duration-200"
        style={{ top: popupTop, left: popupLeft, width: POPUP_WIDTH }}
      >
        {/* Pointer toward the sidebar link. */}
        <div
          aria-hidden
          className="absolute -left-[7px] h-3 w-3 rotate-45 border-b border-l border-[#257f61]/60 bg-surface-raised"
          style={{ top: Math.max(10, arrowTop) }}
        />

        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-[#5fd3a8] uppercase">
            Quick guide
          </span>
          <span className="text-[11px] text-ink">
            {step + 1} of {steps.length}
          </span>
        </div>

        <h2 className="text-sm font-semibold text-ink">{current.title}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-ink/80">{current.body}</p>

        {current.points && (
          <ol className="mt-2.5 flex flex-col gap-1.5">
            {current.points.map((point, i) => (
              <li key={point} className="flex gap-2 text-[13px] leading-relaxed text-ink">
                <span className="mt-px flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-[#257f61] text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={close}
            className="cursor-pointer text-xs text-ink/70 underline-offset-2 hover:text-ink hover:underline"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="h-8 cursor-pointer rounded-lg border border-border px-3 text-xs font-medium text-ink hover:bg-surface"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={isLast ? close : () => setStep((s) => s + 1)}
              className="h-8 cursor-pointer rounded-lg bg-[#257f61] px-3.5 text-xs font-semibold text-white hover:bg-[#2c9572]"
            >
              {isLast ? "Got it" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default GuideTour;
