//File: frontend/components/ui/status-badge.tsx

"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md font-medium tracking-tight border transition-colors",
  {
    variants: {
      status: {
        active: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
        completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
        pending: "bg-amber-50 text-amber-700 border-amber-200/60",
        processing: "bg-blue-50 text-blue-700 border-blue-200/60",
        draft: "bg-slate-100 text-slate-600 border-slate-200/70",
        failed: "bg-red-50 text-red-700 border-red-200/60",
        cancelled: "bg-slate-100 text-slate-500 border-slate-200/70",
        outOfStock: "bg-red-50 text-red-700 border-red-200/60",
      },
      size: {
        sm: "text-[11px] px-1.5 py-0.5 gap-1",
        default: "text-xs px-2 py-0.5",
        lg: "text-xs px-2.5 py-1",
      },
    },
    defaultVariants: {
      status: "active",
      size: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  asChild?: boolean;
  label?: string;
  showDot?: boolean;
  pulseDot?: boolean;
}

export function StatusBadge({
  className,
  status = "active",
  size,
  asChild = false,
  label,
  showDot = true,
  pulseDot = false,
  children,
  ...props
}: StatusBadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="status-badge"
      className={cn(statusBadgeVariants({ status, size }), className)}
      {...props}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulseDot && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-50" />
          )}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {label || children}
    </Comp>
  );
}

export default StatusBadge;