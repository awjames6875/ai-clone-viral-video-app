"use client";

import { cn } from "@/lib/utils";
import type { ScriptStatus } from "@/lib/supabase";

const statusConfig: Record<
  ScriptStatus,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  "Pending Script": {
    label: "Pending",
    color: "text-status-pending",
    bgColor: "bg-status-pending/10",
    dotColor: "bg-status-pending",
  },
  "Script Approved": {
    label: "Approved",
    color: "text-status-approved",
    bgColor: "bg-status-approved/10",
    dotColor: "bg-status-approved",
  },
  "Video Ready (Preview)": {
    label: "Ready",
    color: "text-status-ready",
    bgColor: "bg-status-ready/10",
    dotColor: "bg-status-ready",
  },
  Posted: {
    label: "Posted",
    color: "text-status-posted",
    bgColor: "bg-status-posted/10",
    dotColor: "bg-status-posted",
  },
  Failed: {
    label: "Failed",
    color: "text-status-failed",
    bgColor: "bg-status-failed/10",
    dotColor: "bg-status-failed",
  },
};

interface StatusBadgeProps {
  status: ScriptStatus;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  status,
  className,
  showDot = true,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "status-badge",
        config.bgColor,
        config.color,
        className
      )}
    >
      {showDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />
      )}
      {config.label}
    </span>
  );
}

export function StatusDot({
  status,
  className,
}: {
  status: ScriptStatus;
  className?: string;
}) {
  const config = statusConfig[status];

  return (
    <span
      className={cn("w-2 h-2 rounded-full", config.dotColor, className)}
      title={config.label}
    />
  );
}
