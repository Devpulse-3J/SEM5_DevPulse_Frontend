"use client";

import React, { useState } from "react";
import type { PullRequest, PRStatus } from "@/types/pullRequest";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { riskPresentation } from "@/lib/risk";
import { exportToCSV } from "@/utils/exportCSV";
import { formatHours, getTtfrStatus } from "@/components/dashboard/ReviewVelocityCard";

interface MyPRListProps {
  pullRequests: PullRequest[];
}

export function MyPRList({ pullRequests }: MyPRListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PRStatus | "all">("all");
  const [selectedPr, setSelectedPr] = useState<PullRequest | null>(null);

  const filteredPrs = pullRequests.filter((pr) => {
    const matchesSearch =
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.repositoryName.toLowerCase().includes(search.toLowerCase()) ||
      String(pr.number).includes(search);
    const matchesStatus = statusFilter === "all" || pr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const rows = filteredPrs.map((pr) => ({
      Number: pr.number,
      Title: pr.title,
      Risk: riskPresentation(pr.riskAnalysis).label,
      Repository: pr.repositoryName,
      Status: pr.status,
      Additions: pr.additions,
      Deletions: pr.deletions,
      Reviews: pr.reviews.length,
      Checks: pr.checks.length,
      TTFR_Hours: pr.timeToFirstReviewHours ?? "N/A",
      Review_Iterations: pr.reviewIterations ?? 0,
      Turnaround_Hours: pr.reviewTurnaroundHours ?? "N/A",
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
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="merged">Merged</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-muted hover:text-ink hover:border-accent transition-colors cursor-pointer"
        >
          📥 Export CSV
        </button>
      </div>

      {/* PR Table */}
      <Card className="p-0 overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink border-collapse">
            <thead className="bg-surface-raised/60 text-subtle font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">PR # / Title</th>
                <th className="py-3 px-4">Repository</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Changes</th>
                <th className="py-3 px-4">Review Velocity & Iterations</th>
                <th className="py-3 px-4">Reviews / Checks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredPrs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted">
                    No pull requests found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredPrs.map((pr) => {
                  const hasTtfr =
                    pr.timeToFirstReviewHours !== undefined && pr.timeToFirstReviewHours !== null;
                  const ttfrStatus = hasTtfr ? getTtfrStatus(pr.timeToFirstReviewHours) : null;
                  const iterations = pr.reviewIterations ?? (pr.reviews.length > 0 ? 1 : 0);

                  return (
                    <tr
                      key={pr.id}
                      className="hover:bg-surface-raised/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedPr(pr)}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <RiskBadge risk={pr.riskAnalysis} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-ink hover:text-accent font-sans">
                            #{pr.number} {pr.title}
                          </span>
                          <span className="text-[11px] text-subtle font-mono">
                            {pr.headBranch ?? "unknown branch"} → {pr.baseBranch}
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

                      {/* Review Velocity & Iterations Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {ttfrStatus ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-semibold border ${ttfrStatus.bgColor} ${ttfrStatus.textColor} ${ttfrStatus.borderColor}`}
                              title={`Time to first review: ${formatHours(pr.timeToFirstReviewHours)}`}
                            >
                              First review in {formatHours(pr.timeToFirstReviewHours)}
                            </span>
                          ) : (
                            <span className="text-[10px] text-subtle font-mono">
                              Awaiting 1st review
                            </span>
                          )}

                          {iterations > 0 && (
                            <span
                              className="inline-flex items-center gap-1 rounded border border-border bg-surface-raised px-2 py-0.5 font-mono text-[10px] text-muted"
                              title={`${iterations} review iterations/passes`}
                            >
                              {iterations} {iterations === 1 ? "iteration" : "iterations"}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] text-muted">
                          {pr.reviews.length} rev / {pr.checks.length} chk
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedPr(pr)}
                            className="rounded px-2 py-1 text-xs text-muted hover:text-ink hover:bg-surface-raised border border-border transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          {pr.url && (
                            <a
                              href={pr.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent hover:underline font-semibold text-xs"
                            >
                              ↗
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PR Detail Modal */}
      {selectedPr && (
        <Modal open={Boolean(selectedPr)} onClose={() => setSelectedPr(null)} width={540}>
          <ModalHeader
            title={`PR #${selectedPr.number} — ${selectedPr.title}`}
            description={`${selectedPr.repositoryName} · by ${selectedPr.author}`}
            onClose={() => setSelectedPr(null)}
          />
          <ModalBody className="flex flex-col gap-4 text-xs">
            {/* Review Velocity Metrics Highlights */}
            <div className="rounded-lg border border-border bg-surface p-3.5 flex flex-col gap-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
                Review Velocity & Cycles
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {selectedPr.timeToFirstReviewHours !== undefined &&
                selectedPr.timeToFirstReviewHours !== null ? (
                  (() => {
                    const st = getTtfrStatus(selectedPr.timeToFirstReviewHours);
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-semibold ${st.bgColor} ${st.textColor} ${st.borderColor}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        First review in {formatHours(selectedPr.timeToFirstReviewHours)}
                      </span>
                    );
                  })()
                ) : (
                  <span className="rounded-md border border-border bg-surface-raised px-2.5 py-1 text-xs text-subtle">
                    No initial review recorded yet
                  </span>
                )}

                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-raised px-2.5 py-1 font-mono text-xs text-ink">
                  {selectedPr.reviewIterations ?? (selectedPr.reviews.length > 0 ? 1 : 0)}{" "}
                  iterations
                </span>

                {selectedPr.reviewTurnaroundHours !== undefined &&
                  selectedPr.reviewTurnaroundHours !== null && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-raised px-2.5 py-1 font-mono text-xs text-ink">
                      Turnaround: {formatHours(selectedPr.reviewTurnaroundHours)}
                    </span>
                  )}
              </div>
            </div>

            {/* General Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded border border-border bg-surface-raised/40 p-2.5">
                <span className="text-subtle text-[10px] uppercase">Status</span>
                <p className="mt-1 font-semibold uppercase text-ink">{selectedPr.status}</p>
              </div>
              <div className="rounded border border-border bg-surface-raised/40 p-2.5">
                <span className="text-subtle text-[10px] uppercase">Branch Target</span>
                <p className="mt-1 font-mono text-[11px] text-ink truncate">
                  {selectedPr.headBranch ?? "head"} → {selectedPr.baseBranch}
                </p>
              </div>
              <div className="rounded border border-border bg-surface-raised/40 p-2.5">
                <span className="text-subtle text-[10px] uppercase">Diff Size</span>
                <p className="mt-1 font-mono text-[11px]">
                  <span className="text-success">+{selectedPr.additions}</span> /{" "}
                  <span className="text-danger">-{selectedPr.deletions}</span> (
                  {selectedPr.changedFiles} files)
                </p>
              </div>
              <div className="rounded border border-border bg-surface-raised/40 p-2.5">
                <span className="text-subtle text-[10px] uppercase">Reviews / Checks</span>
                <p className="mt-1 font-mono text-[11px] text-ink">
                  {selectedPr.reviews.length} reviews · {selectedPr.checks.length} checks
                </p>
              </div>
            </div>

            {/* Risk Analysis if present */}
            {selectedPr.riskAnalysis && (
              <div className="rounded border border-border p-3 bg-surface-raised/30">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">Risk Assessment</span>
                  <RiskBadge risk={selectedPr.riskAnalysis} />
                </div>
                <p className="mt-1 text-[11px] text-muted">{selectedPr.riskAnalysis.summary}</p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setSelectedPr(null)}>
              Close
            </Button>
            {selectedPr.url && (
              <a
                href={selectedPr.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-[7px] bg-accent px-3 py-[7px] text-xs font-semibold text-white hover:bg-accent/90"
              >
                Open in GitHub ↗
              </a>
            )}
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

export default MyPRList;
