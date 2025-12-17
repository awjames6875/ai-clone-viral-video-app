"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, showCount, maxLength, value, ...props }, ref) => {
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-foreground-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            className={cn(
              "textarea w-full min-h-[120px]",
              error && "border-status-failed focus:ring-status-failed/50 focus:border-status-failed",
              className
            )}
            ref={ref}
            value={value}
            maxLength={maxLength}
            {...props}
          />
          {showCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-foreground-muted">
              {currentLength} / {maxLength}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-status-failed">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
