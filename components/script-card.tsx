"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRelativeTime, truncate } from "@/lib/utils";
import type { Script } from "@/lib/supabase";

interface ScriptCardProps {
  script: Script;
  index?: number;
}

export function ScriptCard({ script, index = 0 }: ScriptCardProps) {
  const hook = script.script_json?.hook || script.analysis_json?.hook || "No hook available";
  const caption = script.caption || script.script_json?.caption || "No caption";
  const hasError = script.status === "Failed";

  const href = script.status === "Video Ready (Preview)" || script.status === "Posted"
    ? `/videos/${script.id}`
    : `/scripts/${script.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={href}>
        <Card hoverable className="group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Hook */}
              <p className="text-foreground font-medium mb-1 truncate">
                &ldquo;{truncate(hook, 60)}&rdquo;
              </p>

              {/* Caption */}
              <p className="text-foreground-secondary text-sm mb-3 line-clamp-2">
                {truncate(caption, 100)}
              </p>

              {/* Error message */}
              {hasError && script.error_message && (
                <div className="flex items-center gap-2 text-status-failed text-xs mb-3">
                  <AlertCircle className="w-3 h-3" />
                  <span className="truncate">{script.error_message}</span>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center gap-3 text-xs text-foreground-muted">
                <StatusBadge status={script.status} />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(script.created_at)}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="text-foreground-muted group-hover:text-primary transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export function ScriptCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="space-y-3">
        <div className="h-5 bg-surface-hover rounded w-3/4" />
        <div className="h-4 bg-surface-hover rounded w-full" />
        <div className="h-4 bg-surface-hover rounded w-2/3" />
        <div className="flex items-center gap-3">
          <div className="h-5 w-16 bg-surface-hover rounded-full" />
          <div className="h-4 w-12 bg-surface-hover rounded" />
        </div>
      </div>
    </Card>
  );
}
