"use client";

import React, { useState } from "react";
import {
  Header,
  Sidebar,
  Card,
  MetricCard,
  RiskBadge,
  StatusBadge,
} from "./components";

export default function OverviewDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // DORA Metrics Data
  const doraMetrics = [
    {
      title: "Deployment Frequency",
      value: "6.2",
      unit: "/day",
      borderColor: "oklch(0.72 0.16 155)",
      trendText: "▲ Elite · +0.8 vs prior period",
      trendColor: "oklch(0.72 0.16 155)",
      sparklineBars: [
        { heightPct: 40 },
        { heightPct: 55 },
        { heightPct: 50 },
        { heightPct: 70 },
        { heightPct: 65 },
        { heightPct: 85, highlighted: true },
        { heightPct: 100, highlighted: true },
      ],
    },
    {
      title: "Lead Time for Changes",
      value: "4.1",
      unit: "hrs",
      borderColor: "oklch(0.72 0.16 155)",
      trendText: "▼ Elite · −1.4hrs vs prior period",
      trendColor: "oklch(0.72 0.16 155)",
      sparklineBars: [
        { heightPct: 80, color: "rgba(251,191,36,0.4)" },
        { heightPct: 70, color: "rgba(251,191,36,0.4)" },
        { heightPct: 60, color: "rgba(74,222,128,0.4)" },
        { heightPct: 55, color: "rgba(74,222,128,0.4)" },
        { heightPct: 40, highlighted: true },
        { heightPct: 35, highlighted: true },
        { heightPct: 30, highlighted: true },
      ],
    },
    {
      title: "Mean Time to Recovery",
      value: "2.8",
      unit: "hrs",
      borderColor: "oklch(0.78 0.16 80)",
      trendText: "▲ High · +0.6hrs vs prior period",
      trendColor: "oklch(0.83 0.14 80)",
      sparklineBars: [
        { heightPct: 30, color: "rgba(74,222,128,0.4)" },
        { heightPct: 35, color: "rgba(74,222,128,0.4)" },
        { heightPct: 60, color: "rgba(251,191,36,0.4)" },
        { heightPct: 55, color: "rgba(251,191,36,0.4)" },
        { heightPct: 65, highlighted: true },
        { heightPct: 50, highlighted: true },
        { heightPct: 58, highlighted: true },
      ],
    },
    {
      title: "Change Failure Rate",
      value: "18.4",
      unit: "%",
      borderColor: "oklch(0.66 0.19 22)",
      trendText: "▲ Needs Attention · +3.1pp vs prior period",
      trendColor: "oklch(0.78 0.16 22)",
      sparklineBars: [
        { heightPct: 35, color: "rgba(74,222,128,0.4)" },
        { heightPct: 40, color: "rgba(74,222,128,0.4)" },
        { heightPct: 45, color: "rgba(251,191,36,0.4)" },
        { heightPct: 55, color: "oklch(0.78 0.16 80)" },
        { heightPct: 75, highlighted: true },
        { heightPct: 80, highlighted: true },
        { heightPct: 90, highlighted: true },
      ],
    },
  ];

  // Repository Deployments
  const repoDeploys = [
    { repo: "api-gateway", count: 42, pct: "88%" },
    { repo: "web-app", count: 34, pct: "70%" },
    { repo: "payments-svc", count: 25, pct: "52%" },
    { repo: "mobile-ios", count: 14, pct: "30%" },
    { repo: "data-pipeline", count: 9, pct: "20%" },
  ];

  // High-Risk PRs Data
  const highRiskPRs: Array<{
    riskLevel: "HIGH" | "MED";
    score: string;
    id: string;
    title: string;
    author: string;
    openDuration: string;
    diffSize: string;
  }> = [
    {
      riskLevel: "HIGH",
      score: "0.92",
      id: "#4128",
      title: "Refactor auth token rotation",
      author: "M. Webb",
      openDuration: "11d",
      diffSize: "+890",
    },
    {
      riskLevel: "HIGH",
      score: "0.87",
      id: "#4131",
      title: "Payment retry queue rewrite",
      author: "D. Alvarez",
      openDuration: "8d",
      diffSize: "+612",
    },
    {
      riskLevel: "MED",
      score: "0.58",
      id: "#4140",
      title: "Mobile push notification retry",
      author: "A. Osei",
      openDuration: "4d",
      diffSize: "+205",
    },
    {
      riskLevel: "MED",
      score: "0.51",
      id: "#4145",
      title: "Data pipeline schema migration",
      author: "J. Kim",
      openDuration: "3d",
      diffSize: "+340",
    },
  ];

  // Alerts Feed Data
  const alertsFeed = [
    {
      id: 1,
      type: "danger",
      dotColor: "oklch(0.78 0.16 22)",
      bgStyle: "rgba(239,68,68,0.15)",
      borderStyle: "1px solid rgba(239,68,68,0.4)",
      title: "Build failing 3x — api-gateway/main",
      subtitle: "Triggered by #4128 · 22 min ago",
    },
    {
      id: 2,
      type: "warning",
      dotColor: "oklch(0.83 0.14 80)",
      bgStyle: "rgba(245,158,11,0.15)",
      borderStyle: "1px solid rgba(245,158,11,0.4)",
      title: "Review overdue 48h+ on 5 PRs",
      subtitle: "Assigned to P. Patel · 1 hr ago",
    },
    {
      id: 3,
      type: "warning",
      dotColor: "oklch(0.83 0.14 80)",
      bgStyle: "rgba(245,158,11,0.15)",
      borderStyle: "1px solid rgba(245,158,11,0.4)",
      title: "T. Reilly overloaded — 9 active PRs",
      subtitle: "190% of team avg · 3 hrs ago",
    },
    {
      id: 4,
      type: "info",
      dotColor: "oklch(0.68 0.17 264)",
      bgStyle: "var(--dp-surface-raised)",
      borderStyle: "1px solid var(--dp-border)",
      title: "Stale PR warning — #4098 idle 9 days",
      subtitle: "Author E. Rossi · 5 hrs ago",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--dp-app-bg)] text-[var(--dp-text-primary)]">
      {/* Global Navigation Header */}
      <Header />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Left Navigation Sidebar */}
        <Sidebar activeId={activeTab} onSelect={setActiveTab} />

        {/* Dashboard Workspace */}
        <main className="flex-1 p-6 md:p-7 flex flex-col gap-5 max-w-[1600px] w-full overflow-x-hidden">
          {/* Workspace Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--dp-text-primary)]">
                  {activeTab === "overview"
                    ? "Overview"
                    : activeTab.toUpperCase().replace("-", " ")}
                </h1>
                <StatusBadge text="MANAGER VIEW" />
              </div>
              <p className="text-xs text-[var(--dp-text-dim)] mt-1 font-mono">
                platform-core · 34 repos · updated 2 min ago
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <button
                style={{
                  backgroundColor: "var(--dp-surface)",
                  borderColor: "var(--dp-border)",
                }}
                className="text-xs px-3 py-1.75 rounded-[7px] border text-[var(--dp-text-primary)] font-medium hover:bg-[var(--dp-surface-raised)] transition-colors cursor-pointer"
              >
                All Teams ⌄
              </button>
              <button
                style={{
                  backgroundColor: "var(--dp-surface)",
                  borderColor: "var(--dp-border)",
                }}
                className="text-xs px-3 py-1.75 rounded-[7px] border text-[var(--dp-text-primary)] font-medium hover:bg-[var(--dp-surface-raised)] transition-colors cursor-pointer"
              >
                Last 30 days ⌄
              </button>
            </div>
          </div>

          {/* Tab Placeholder Notice if another menu item selected */}
          {activeTab !== "overview" && (
            <Card className="p-8 text-center my-4">
              <div className="font-mono text-sm text-[var(--dp-accent)] font-semibold mb-2">
                MODULE BASE READY
              </div>
              <h2 className="text-lg font-bold text-[var(--dp-text-primary)] mb-2">
                {activeTab.toUpperCase().replace("-", " ")} View Scaffold
              </h2>
              <p className="text-xs text-[var(--dp-text-secondary)] max-w-md mx-auto leading-relaxed">
                This route scaffold uses the shared DevPulse UI theme components. Other developers can build the full detail view for this screen using the established design system tokens.
              </p>
            </Card>
          )}

          {/* DORA Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {doraMetrics.map((metric, idx) => (
              <MetricCard
                key={idx}
                title={metric.title}
                value={metric.value}
                unit={metric.unit}
                borderColor={metric.borderColor}
                trendText={metric.trendText}
                trendColor={metric.trendColor}
                sparklineBars={metric.sparklineBars}
              />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {/* Lead Time Trend Line Chart */}
            <Card className="lg:col-span-2 flex flex-col justify-between" padding="md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs md:text-sm font-semibold text-[var(--dp-text-primary)]">
                  Lead Time Trend — 12 Weeks
                </h3>
                <span className="text-[11px] text-[var(--dp-text-dim)] font-mono">
                  median, hrs
                </span>
              </div>

              {/* Trend SVG Sparkline */}
              <div className="w-full h-[180px] my-1">
                <svg
                  viewBox="0 0 640 180"
                  className="w-full h-full overflow-visible"
                >
                  {/* Horizontal Gridlines */}
                  <line
                    x1="0"
                    y1="30"
                    x2="640"
                    y2="30"
                    stroke="var(--dp-border-subtle)"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="80"
                    x2="640"
                    y2="80"
                    stroke="var(--dp-border-subtle)"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="130"
                    x2="640"
                    y2="130"
                    stroke="var(--dp-border-subtle)"
                    strokeWidth="1"
                  />

                  {/* Gradient Area Fill */}
                  <polygon
                    points="0,110 58,100 116,105 174,90 232,95 290,70 348,75 406,55 464,60 522,45 580,40 640,35 640,180 0,180"
                    fill="rgba(99,102,241,0.12)"
                  />

                  {/* Polyline Line */}
                  <polyline
                    points="0,110 58,100 116,105 174,90 232,95 290,70 348,75 406,55 464,60 522,45 580,40 640,35"
                    fill="none"
                    stroke="var(--dp-accent)"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between text-[10px] text-[var(--dp-text-dim)] font-mono mt-1">
                <span>W1</span>
                <span>W3</span>
                <span>W5</span>
                <span>W7</span>
                <span>W9</span>
                <span>W11</span>
              </div>
            </Card>

            {/* Deploys by Repo Bar List */}
            <Card padding="md" className="flex flex-col justify-between">
              <h3 className="text-xs md:text-sm font-semibold text-[var(--dp-text-primary)] mb-3">
                Deploys by Repo (7d)
              </h3>
              <div className="flex flex-col gap-2.5">
                {repoDeploys.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="w-[88px] text-[11px] text-[var(--dp-text-secondary)] truncate">
                      {item.repo}
                    </span>
                    <div className="flex-1 h-2 bg-[var(--dp-surface-raised)] rounded-full overflow-hidden">
                      <div
                        style={{
                          width: item.pct,
                          backgroundColor: "var(--dp-accent)",
                        }}
                        className="h-full rounded-full"
                      />
                    </div>
                    <span className="font-mono text-[11px] text-[var(--dp-text-primary)] w-6 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* High-Risk Table & Alerts Feed Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {/* High-Risk Pull Requests Table */}
            <Card className="lg:col-span-2 overflow-hidden" padding="none">
              <div className="flex justify-between items-center p-4.5 pb-2.5">
                <h3 className="text-xs md:text-sm font-semibold text-[var(--dp-text-primary)]">
                  High-Risk Pull Requests
                </h3>
                <span className="text-[11px] text-[var(--dp-accent)] cursor-pointer hover:underline">
                  View all →
                </span>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 px-4.5 py-2 text-[11px] text-[var(--dp-text-dim)] font-semibold border-b border-[var(--dp-border-muted)] font-mono">
                <div className="col-span-3">RISK</div>
                <div className="col-span-5">PULL REQUEST</div>
                <div className="col-span-2">AUTHOR</div>
                <div className="col-span-1">OPEN</div>
                <div className="col-span-1 text-right">SIZE</div>
              </div>

              {/* Table Rows */}
              {highRiskPRs.map((pr, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-12 px-4.5 py-2.75 items-center text-xs border-b border-[var(--dp-border-muted)] last:border-b-0 hover:bg-white/[0.02] transition-colors`}
                >
                  <div className="col-span-3">
                    <RiskBadge level={pr.riskLevel} score={pr.score} />
                  </div>
                  <div className="col-span-5 font-medium text-[var(--dp-text-primary)] truncate pr-2">
                    <span className="font-mono text-[var(--dp-text-secondary)] mr-1.5">
                      {pr.id}
                    </span>
                    {pr.title}
                  </div>
                  <div className="col-span-2 text-[var(--dp-text-secondary)] truncate">
                    {pr.author}
                  </div>
                  <div
                    style={{
                      color:
                        pr.riskLevel === "HIGH"
                          ? "var(--dp-risk-high-text)"
                          : "var(--dp-risk-med-text)",
                    }}
                    className="col-span-1 font-semibold text-[11px]"
                  >
                    {pr.openDuration}
                  </div>
                  <div className="col-span-1 font-mono text-[var(--dp-text-secondary)] text-right text-[11px]">
                    {pr.diffSize}
                  </div>
                </div>
              ))}
            </Card>

            {/* Real-Time Bottleneck Alerts */}
            <Card padding="md" className="flex flex-col">
              <h3 className="text-xs md:text-sm font-semibold text-[var(--dp-text-primary)] mb-3">
                Real-Time Bottleneck Alerts
              </h3>
              <div className="flex flex-col gap-2.5 flex-1">
                {alertsFeed.map((alert) => (
                  <div
                    key={alert.id}
                    style={{
                      backgroundColor: alert.bgStyle,
                      border: alert.borderStyle,
                    }}
                    className="flex gap-2.5 p-2.5 rounded-lg transition-all"
                  >
                    <span
                      style={{ color: alert.dotColor }}
                      className="text-xs font-bold mt-0.5 leading-none"
                    >
                      ●
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-[var(--dp-text-primary)] leading-snug">
                        {alert.title}
                      </div>
                      <div className="text-[11px] text-[var(--dp-text-secondary)] mt-0.5">
                        {alert.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
