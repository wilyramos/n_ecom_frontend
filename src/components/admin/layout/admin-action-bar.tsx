// File: frontend/src/components/admin/layout/admin-action-bar.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface AdminActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  leftContent?: React.ReactNode;
  children: React.ReactNode; // Acciones (botones, links)
}

export function AdminActionBar({
  leftContent,
  children,
  className,
  ...props
}: AdminActionBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2.5  px-3 py-2",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {leftContent}
      </div>

      <div className="flex items-center gap-2 ml-auto shrink-0">
        {children}
      </div>
    </div>
  );
}