// frontend/src/components/admin/layout/admin-page-header.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  bordered?: boolean;
}

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  bordered = false,
  className,
  ...props
}: AdminPageHeaderProps) {
  if (!title && !description && !breadcrumbs && !actions) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-1",
        bordered && "border-b border-slate-200",
        className
      )}
      {...props}
    >
      <div className="space-y-1.5 flex-1">
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
        {title && (
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-sm font-normal text-slate-500">{description}</p>
        )}
      </div>
      
      {actions && (
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto ml-auto">
          {actions}
        </div>
      )}
    </div>
  );
}