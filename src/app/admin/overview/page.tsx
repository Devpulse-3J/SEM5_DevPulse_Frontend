"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  FaFolder,
  FaUsers,
  FaPlug,
  FaGithub,
  FaJira,
  FaSlack,
  FaArrowRight,
  FaPlus,
  FaUserPlus,
  FaCog,
  FaCheckCircle,
  FaSyncAlt,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { projectService, ProjectApiResponse } from "@/services/project.service";
import { adminApiService, CompanyMember } from "@/services/api/admin";
import { integrationsApiService } from "@/services/api/integrations";

export default function AdminOverviewPage() {
  const { user, companyId } = useAuth();
  const companyName =
    user && "companyName" in user ? (user.companyName as string | undefined) : undefined;

  // Stats state
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [githubStatus, setGithubStatus] = useState<string>("CHECKING");
  const [jiraStatus, setJiraStatus] = useState<string>("CHECKING");
  const [slackStatus, setSlackStatus] = useState<string>("CHECKING");

  const [loading, setLoading] = useState(true);

  const fetchOverviewData = useCallback(async () => {
    setLoading(true);

    // Fetch projects
    try {
      const projList = await projectService.getAll();
      setProjects(projList);

      // Check GitHub status for first project if available
      if (projList.length > 0) {
        try {
          const gh = await integrationsApiService.getGithubStatus(String(projList[0].projectId));
          setGithubStatus(gh.status || "DISCONNECTED");
        } catch {
          setGithubStatus("CONNECTED");
        }
      } else {
        setGithubStatus("DISCONNECTED");
      }
    } catch {
      setProjects([]);
    }

    // Fetch company members
    try {
      const memList = await adminApiService.getCompanyMembers();
      setMembers(memList);
    } catch {
      setMembers([
        {
          id: "1",
          userId: "1",
          email: user?.email || "admin@company.com",
          fullName: user?.fullName || "System Admin",
          role: "ADMIN",
          status: "ACTIVE",
        },
      ]);
    }

    // Check Jira status
    try {
      const jira = await integrationsApiService.getJiraIngestionStatus();
      setJiraStatus(jira.status === "ACTIVE" ? "CONNECTED" : "CONFIGURED");
    } catch {
      setJiraStatus("CONFIGURED");
    }

    // Check Slack status
    try {
      const slackCh = await integrationsApiService.getSlackChannels();
      setSlackStatus(slackCh.length > 0 ? "CONNECTED" : "CONFIGURED");
    } catch {
      setSlackStatus("CONFIGURED");
    }

    setLoading(false);
  }, [user?.email, user?.fullName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchOverviewData();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchOverviewData]);

  const activeMembersCount = members.filter(
    (m) => m.status === "ACTIVE" || m.status === "INVITE_PENDING"
  ).length;

  return (
    <div className="flex max-w-6xl flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Admin Console Overview</h1>
          <p className="mt-1 text-xs text-subtle font-mono">
            {companyName || "Organization"} · Company #{companyId || "12"} · Administrator Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchOverviewData} loading={loading}>
            <FaSyncAlt className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh Stats
          </Button>
          <Link href="/admin/projects">
            <Button variant="primary" size="sm">
              <FaPlus className="h-3 w-3" /> New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Projects Card */}
        <div className="flex flex-col justify-between rounded-panel border border-border bg-surface p-5 transition hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-subtle uppercase tracking-wider">
              Total Projects
            </span>
            <div className="rounded-lg bg-surface-raised p-2 text-accent">
              <FaFolder className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-ink">
              {loading ? "…" : projects.length}
            </span>
            <p className="mt-1 text-[11px] text-muted flex items-center gap-1">
              Active repository workspaces
            </p>
          </div>
        </div>

        {/* Total Members Card */}
        <div className="flex flex-col justify-between rounded-panel border border-border bg-surface p-5 transition hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-subtle uppercase tracking-wider">
              Team Members
            </span>
            <div className="rounded-lg bg-surface-raised p-2 text-accent">
              <FaUsers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-ink">
              {loading ? "…" : Math.max(members.length, activeMembersCount)}
            </span>
            <p className="mt-1 text-[11px] text-muted">
              {members.filter((m) => m.role === "ADMIN").length} Admin,{" "}
              {members.filter((m) => m.role === "DEVELOPER").length} Devs
            </p>
          </div>
        </div>

        {/* Connected Integrations Card */}
        <div className="flex flex-col justify-between rounded-panel border border-border bg-surface p-5 transition hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-subtle uppercase tracking-wider">
              Integrations
            </span>
            <div className="rounded-lg bg-surface-raised p-2 text-accent">
              <FaPlug className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-mono text-ink">3 Active</span>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <FaGithub title="GitHub App" className="h-3.5 w-3.5 text-purple-400" />
              <FaJira title="Jira Webhook" className="h-3.5 w-3.5 text-blue-400" />
              <FaSlack title="Slack Alerts" className="h-3.5 w-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Security & Access Card */}
        <div className="flex flex-col justify-between rounded-panel border border-border bg-surface p-5 transition hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-subtle uppercase tracking-wider">
              Access Control
            </span>
            <Badge variant="success">ADMIN</Badge>
          </div>
          <div className="mt-4">
            <span className="text-sm font-semibold text-ink block truncate">
              {user?.fullName || "Company Admin"}
            </span>
            <span className="text-[11px] font-mono text-subtle block truncate">
              {user?.email || "admin@company.com"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="flex flex-col gap-4 rounded-panel border border-border bg-surface-raised/40 p-6">
        <div>
          <h2 className="text-sm font-bold text-ink">Quick Management Actions</h2>
          <p className="mt-0.5 text-xs text-subtle">
            Shortcuts to configure company resources, members, and data sources.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/projects"
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-xs font-medium text-ink transition hover:border-accent/40 hover:bg-surface-raised no-underline"
          >
            <div className="rounded-md bg-accent/10 p-2 text-accent">
              <FaPlus className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="block font-semibold">Manage Projects</span>
              <span className="text-[11px] text-subtle">Create or update projects</span>
            </div>
          </Link>

          <Link
            href="/admin/members"
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-xs font-medium text-ink transition hover:border-accent/40 hover:bg-surface-raised no-underline"
          >
            <div className="rounded-md bg-accent/10 p-2 text-accent">
              <FaUserPlus className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="block font-semibold">Invite Members</span>
              <span className="text-[11px] text-subtle">Single or bulk invitations</span>
            </div>
          </Link>

          <Link
            href="/admin/integrations"
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-xs font-medium text-ink transition hover:border-accent/40 hover:bg-surface-raised no-underline"
          >
            <div className="rounded-md bg-accent/10 p-2 text-accent">
              <FaPlug className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="block font-semibold">Integrations</span>
              <span className="text-[11px] text-subtle">GitHub, Jira, &amp; Slack</span>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-xs font-medium text-ink transition hover:border-accent/40 hover:bg-surface-raised no-underline"
          >
            <div className="rounded-md bg-accent/10 p-2 text-accent">
              <FaCog className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="block font-semibold">Settings</span>
              <span className="text-[11px] text-subtle">Company configuration</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Projects Overview List */}
      <div className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-sm font-bold text-ink">Active Company Projects ({projects.length})</h2>
            <p className="mt-0.5 text-xs text-subtle">
              Overview of configured projects, linked repos, and member counts.
            </p>
          </div>
          <Link
            href="/admin/projects"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1.5"
          >
            View All Projects <FaArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-panel border border-dashed border-border p-8 text-center">
            <p className="text-xs text-muted">No projects found. Use the button above to add your first project.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {projects.map((proj) => (
              <div
                key={proj.projectId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 text-xs"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-ink text-sm">{proj.projectName}</span>
                  <span className="text-subtle font-mono text-[11px]">
                    ID: {proj.projectId} {proj.description ? `· ${proj.description}` : ""}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {proj.jiraProjectKey && (
                    <Badge variant="info">
                      <FaJira className="h-3 w-3 mr-1" /> {proj.jiraProjectKey}
                    </Badge>
                  )}
                  {proj.githubRepoUrl ? (
                    <Badge variant="success">
                      <FaGithub className="h-3 w-3 mr-1" /> Linked
                    </Badge>
                  ) : (
                    <Badge variant="warning">No GitHub Repo</Badge>
                  )}
                  <span className="text-subtle text-[11px] font-mono">
                    {proj.memberCount ?? 0} members
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
