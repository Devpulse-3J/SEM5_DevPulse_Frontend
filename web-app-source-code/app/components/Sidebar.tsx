"use client";

import React, { useState } from "react";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  category: "MONITOR" | "CONFIGURE";
}

const MENU_ITEMS: MenuItem[] = [
  { id: "overview", label: "Overview", icon: "▣", category: "MONITOR" },
  { id: "dora", label: "DORA Metrics", icon: "◧", category: "MONITOR" },
  { id: "pr-risk", label: "PR Risk & Insights", icon: "▲", category: "MONITOR" },
  { id: "team", label: "Team & Workload", icon: "◫", category: "MONITOR" },
  { id: "integrations", label: "Integrations", icon: "◎", category: "CONFIGURE" },
  { id: "settings", label: "Settings", icon: "⚙", category: "CONFIGURE" },
];

interface SidebarProps {
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function Sidebar({ activeId = "overview", onSelect }: SidebarProps) {
  const [current, setCurrent] = useState(activeId);

  const handleItemClick = (id: string) => {
    setCurrent(id);
    if (onSelect) {
      onSelect(id);
    }
  };

  const renderSection = (category: "MONITOR" | "CONFIGURE", title: string) => {
    const items = MENU_ITEMS.filter((item) => item.category === category);

    return (
      <div className="flex flex-col gap-0.5">
        <div className="text-[11px] font-semibold text-[var(--dp-text-dim)] tracking-wider px-2.5 pt-3 pb-1 uppercase">
          {title}
        </div>
        {items.map((item) => {
          const isActive = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              style={{
                backgroundColor: isActive ? "var(--dp-surface-raised)" : "transparent",
                color: isActive ? "var(--dp-text-primary)" : "var(--dp-text-secondary)",
              }}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13px] text-left transition-colors w-full ${
                isActive ? "font-semibold" : "font-normal hover:bg-white/5"
              }`}
            >
              <span className="text-sm opacity-90">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <aside
      style={{
        borderColor: "var(--dp-border-subtle)",
        backgroundColor: "var(--dp-app-bg)",
      }}
      className="w-[212px] shrink-0 border-r p-3 flex flex-col gap-2 min-h-[calc(100vh-56px)] select-none"
    >
      {renderSection("MONITOR", "MONITOR")}
      {renderSection("CONFIGURE", "CONFIGURE")}
    </aside>
  );
}
