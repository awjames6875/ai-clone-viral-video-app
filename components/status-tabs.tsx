"use client";

import { cn } from "@/lib/utils";
import type { ScriptStatus } from "@/lib/supabase";

type TabStatus = ScriptStatus | "all";

interface StatusTabsProps {
  activeTab: TabStatus;
  onTabChange: (tab: TabStatus) => void;
  counts: Record<ScriptStatus, number>;
}

const tabs: { value: TabStatus; label: string; color?: string }[] = [
  { value: "all", label: "All" },
  { value: "Pending Script", label: "Pending", color: "bg-status-pending" },
  { value: "Script Approved", label: "Approved", color: "bg-status-approved" },
  { value: "Video Ready (Preview)", label: "Ready", color: "bg-status-ready" },
  { value: "Posted", label: "Posted", color: "bg-status-posted" },
  { value: "Failed", label: "Failed", color: "bg-status-failed" },
];

export function StatusTabs({ activeTab, onTabChange, counts }: StatusTabsProps) {
  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const count = tab.value === "all" ? totalCount : counts[tab.value as ScriptStatus];
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              isActive
                ? "bg-surface text-foreground border border-border"
                : "text-foreground-muted hover:text-foreground-secondary"
            )}
          >
            {tab.color && (
              <span className={cn("w-2 h-2 rounded-full", tab.color)} />
            )}
            {tab.label}
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-surface text-foreground-muted"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
