import React from "react";
import { cn } from "@/lib/utils";

interface DetailItem {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

interface AdminDetailGroupProps {
  title?: string;
  items: DetailItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function AdminDetailGroup({
  title,
  items,
  columns = 2,
  className,
}: AdminDetailGroupProps) {
  const colStyles = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </h4>
      )}
      <div className={cn("grid grid-cols-1 gap-4", colStyles[columns])}>
        {items.map((item, index) => (
          <div
            key={index}
            className={cn("space-y-1", item.fullWidth && "sm:col-span-full")}
          >
            <p className="text-xs font-medium text-slate-500">{item.label}</p>
            <div className="text-sm font-semibold text-slate-900">
              {item.value ?? <span className="text-slate-400">—</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}