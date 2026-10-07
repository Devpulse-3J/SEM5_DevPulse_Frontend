"use client";

import { GuideTour, type GuideStep } from "./GuideTour";

/**
 * First-visit guide for admins: how to set up a project and connect GitHub,
 * Jira and Slack. Points at the admin sidebar links (data-tour in
 * admin/layout.tsx). Button names in the steps match the real pages; update
 * them here if those labels change. The header's "Guide" button calls
 * `replayAdminTour()` to show it again.
 */

const STEPS: GuideStep[] = [
  {
    target: "/admin/projects",
    title: "Create a project first",
    body: "Integrations are connected per project, so start here.",
    points: [
      "Open Projects.",
      "Select Create Project and enter a project name.",
      "The GitHub repository is optional here. You can link it now or in the next step.",
    ],
  },
  {
    target: "/admin/integrations",
    title: "Connect GitHub",
    body: "This is required. It brings in pull requests, commits and deployments.",
    points: [
      "Open Integrations, then GitHub.",
      "Choose your project under Target Project.",
      "Select Install GitHub App and approve access to the repository.",
      "Pick the repository and select Link Repository.",
    ],
  },
  {
    target: "/admin/integrations",
    title: "Connect Jira (optional)",
    body: "Brings in Jira issues so team workload includes planned work.",
    points: [
      "Open Integrations, then Jira.",
      "Select Connect Jira Workspace.",
      "Sign in to Atlassian and allow access.",
    ],
  },
  {
    target: "/admin/integrations",
    title: "Connect Slack (optional)",
    body: "Lets alert rules post messages to your Slack channels.",
    points: [
      "Open Integrations, then Slack.",
      "Select Add to Slack and allow access to your workspace.",
      "Choose the channel that should receive alerts.",
      "Send a test alert to check it arrives.",
    ],
  },
  {
    target: "/admin/projects",
    title: "Invite your team",
    body: "Once a project is connected, add the people who work on it.",
    points: [
      "Open a project from Projects.",
      "Select Invite Member and choose Manager or Developer.",
    ],
  },
];

const STORAGE_PREFIX = "odin-eye-admin-tour:v1:";
const REPLAY_EVENT = "odin-eye:replay-admin-tour";

export function replayAdminTour(): void {
  window.dispatchEvent(new Event(REPLAY_EVENT));
}

export function AdminTour({ userId }: { userId: number | string | null | undefined }) {
  return (
    <GuideTour
      userId={userId}
      steps={STEPS}
      storagePrefix={STORAGE_PREFIX}
      replayEvent={REPLAY_EVENT}
    />
  );
}

export default AdminTour;
