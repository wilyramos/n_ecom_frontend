import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gridLayoutVariants = cva("grid w-full", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      dashboard: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
      form: "grid-cols-1 lg:grid-cols-3",
    },
    gap: {
      default: "gap-6",
      compact: "gap-4",
      loose: "gap-8",
    },
  },
  defaultVariants: {
    columns: 3,
    gap: "default",
  },
});

interface AdminGridLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridLayoutVariants> {}

export function AdminGridLayout({
  children,
  columns,
  gap,
  className,
  ...props
}: AdminGridLayoutProps) {
  return (
    <div className={cn(gridLayoutVariants({ columns, gap }), className)} {...props}>
      {children}
    </div>
  );
}