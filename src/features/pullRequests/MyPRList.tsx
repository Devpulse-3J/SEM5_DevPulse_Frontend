"use client";

import React, { useState } from "react";
import type { PullRequest, PRStatus, PRRiskLevel } from "@/types/pullRequest";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { exportToCSV } from "@/utils/exportCSV";

interface MyPRListProps {
  pullRequests: PullRequest[];
}

export function MyPRList({ pullRequests }: MyPRListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PRStatus | "all">("all");
  const [riskFilter, setRiskFilter] = useState<PRRiskLevel | "all">("all");

  const filteredPrs = pullRequests.filter((pr) => {
    const matchesSearch =
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.repositoryName.toLowerCase().includes(search.toLowerCase()) ||
      String(pr.number).includes(search);
    const matchesStatus = statusFilter === "all" || pr.status === statusFilter;
    const matchesRisk = riskFilter === "all" || pr.riskAnalysis.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const handleExport = () => {
    const rows = filteredPrs.map((pr) => ({
      Number: pr.number,
      Title: pr.title,
      Repository: pr.repositoryName,
      Status: pr.status,
      Additions: pr.additions,
      Deletions: pr.deletions,
      RiskLevel: pr.riskAnalysis.riskLevel,
      RiskScore: pr.riskAnalysis.riskScore,
      CreatedAt: pr.createdAt,
    }));
    exportToCSV("my_pull_requests", rows);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <Input
            type="text"
            placeholder="Search PR title, #number, repo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PRStatus | "all")}
            className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-ink focus:outline-none focus:border-accent"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="merged">Merged</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as PRRiskLevel | "all")}
            className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-ink focus:outline-none focus:border-accent"
          >
            <option value="all">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-muted hover:text-ink hover:border-accent transition-colors"
        >
          📥 Export CSV
        </button>
      </div>

      {/* PR Table / Cards */}
      <Card className="p-0 overflow-hidden border border-border">
        <table className="w-full text-left text-xs text-ink border-collapse">
          <thead className="bg-surface-raised/60 text-subtle font-semibold border-b border-border">
            <tr>
              <th className="py-3 px-4">PR # / Title</th>
              <th className="py-3 px-4">Repository</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Changes</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredPrs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  No pull requests found matching criteria.
                </td>
              </tr>
            ) : (
              filteredPrs.map((pr) => (
                <tr key={pr.id} className="hover:bg-surface-raised/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-ink hover:text-accent font-sans"
                      >
                        #{pr.number} {pr.title}
                      </a>
                      <span className="text-[11px] text-subtle font-mono">
                        {pr.headBranch} → {pr.baseBranch}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-muted">{pr.repositoryName}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        pr.status === "merged"
                          ? "info"
                          : pr.status === "open"
                          ? "success"
                          : "default"
                      }
                    >
                      {pr.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <span className="text-success">+{pr.additions}</span> /{" "}
                    <span className="text-danger">-{pr.deletions}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        pr.riskAnalysis.riskLevel === "HIGH" ||
                        pr.riskAnalysis.riskLevel === "CRITICAL"
                          ? "danger"
                          : pr.riskAnalysis.riskLevel === "MEDIUM"
                          ? "warning"
                          : "success"
                      }
                    >
                      {pr.riskAnalysis.riskLevel} ({pr.riskAnalysis.riskScore})
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline font-semibold"
                    >
                      View ↗
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default MyPRList;
