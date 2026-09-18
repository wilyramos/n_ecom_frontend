// File: frontend/src/components/admin/layout/admin-page-container.tsx

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pageContainerVariants = cva(
  "w-full mx-auto transition-all duration-200",
  {
    variants: {
      maxWidth: {
        default: "max-w-[1600px]",
        wide: "max-w-[1800px]",
        full: "max-w-full",
        narrow: "max-w-5xl",
      },
      padding: {
        default: "p-2.5 sm:p-3.5 md:p-4",
        compact: "p-2 sm:p-2.5",
        none: "p-0",
      },
      spacing: {
        default: "space-y-3 sm:space-y-3.5",
        compact: "space-y-2.5",
        loose: "space-y-5",
        none: "space-y-0",
      },
    },
    defaultVariants: {
      maxWidth: "default",
      padding: "default",
      spacing: "default",
    },
  }
);

interface AdminPageContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageContainerVariants> {}

export function AdminPageContainer({
  children,
  maxWidth,
  padding,
  spacing,
  className,
  ...props
}: AdminPageContainerProps) {
  return (
    <div
      className={cn(pageContainerVariants({ maxWidth, padding, spacing }), className)}
      {...props}
    >
      {children}
    </div>
  );
}