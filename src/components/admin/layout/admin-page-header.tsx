//File: frontend/src/components/admin/layout/admin-page-header.tsx

import React from "react";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  bordered?: boolean;
}

export function AdminPageHeader({
  title,
  description,
  actions,
  bordered = true,
  className,
  ...props
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6",
        bordered && "border-b border-slate-200",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm font-normal text-slate-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}