"use client";

import React, { useState } from "react";
import type { Repository } from "@/types/repository";
import { RepositoryCard } from "./RepositoryCard";
import { Input } from "@/components/ui/Input";
import { exportToCSV } from "@/utils/exportCSV";

interface RepositoryListProps {
  repositories: Repository[];
  onSyncRepo?: (id: string) => void;
}

export function RepositoryList({ repositories, onSyncRepo }: RepositoryListProps) {
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("ALL");

  const languages = Array.from(new Set(repositories.map((r) => r.language)));

  const filteredRepos = repositories.filter((repo) => {
    const matchesSearch =
      repo.fullName.toLowerCase().includes(search.toLowerCase()) ||
      repo.description.toLowerCase().includes(search.toLowerCase());
    const matchesLang = languageFilter === "ALL" || repo.language === languageFilter;
    return matchesSearch && matchesLang;
  });

  const handleExportCSV = () => {
    const rows = filteredRepos.map((r) => ({
      ID: r.id,
      Name: r.fullName,
      Language: r.language,
      Status: r.status,
      OpenPRs: r.metrics.openPullRequests,
      Coverage: r.metrics.codeCoverage || 0,
      HealthScore: r.metrics.healthScore,
      LastSynced: r.metrics.lastSyncAt,
    }));
    exportToCSV("repositories_export", rows);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-ink focus:outline-none focus:border-accent"
          >
            <option value="ALL">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExportCSV}
          className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-muted hover:text-ink hover:border-accent transition-colors"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Repository Grid */}
      {filteredRepos.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-panel text-muted text-sm">
          No repositories found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRepos.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} onSync={onSyncRepo} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RepositoryList;
