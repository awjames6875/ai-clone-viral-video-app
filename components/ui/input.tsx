"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-foreground-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "input w-full",
            error && "border-status-failed focus:ring-status-failed/50 focus:border-status-failed",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-status-failed">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
