"use client";

import { GuideTour, type GuideStep } from "./GuideTour";

/**
 * First-visit guide for managers: points at each manager sidebar item in turn
 * and says what it is for. The popup itself lives in GuideTour; the header's
 * "Guide" button calls `replayManagerTour()` to show it again.
 */

const STEPS: GuideStep[] = [
  {
    target: "/dashboard",
    title: "Start with the overview",
    body: "A summary of how your team is doing in this project.",
  },
  {
    target: "/dora",
    title: "View DORA metrics",
    body: "Deployment frequency, lead time for changes, time to restore and change failure rate, with their trend over time.",
  },
  {
    target: "/pull-requests",
    title: "Check pull request risk",
    body: "Every pull request with its risk level, so you can see which ones need a closer review before they merge.",
  },
  {
    target: "/team",
    title: "Connect with your team",
    body: "Send a message to the people on this project.",
  },
  {
    target: "/alerts",
    title: "Set up alerts",
    body: "Create alert rules to get a Slack message when something needs attention, such as a high-risk pull request.",
  },
];

const STORAGE_PREFIX = "odin-eye-manager-tour:v1:";
const REPLAY_EVENT = "odin-eye:replay-manager-tour";

export function replayManagerTour(): void {
  window.dispatchEvent(new Event(REPLAY_EVENT));
}

export function ManagerTour({ userId }: { userId: number | string | null | undefined }) {
  return (
    <GuideTour
      userId={userId}
      steps={STEPS}
      storagePrefix={STORAGE_PREFIX}
      replayEvent={REPLAY_EVENT}
    />
  );
}

export default ManagerTour;
