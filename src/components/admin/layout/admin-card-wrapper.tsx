//FIle: frontend/src/components/admin/layout/admin-card-wrapper.tsx

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardWrapperVariants = cva(
  "rounded-xl border border-zinc-200/80 bg-white text-zinc-950 overflow-hidden",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-3.5",
        default: "p-5",
        lg: "p-6",
      },
    },
    defaultVariants: {
      padding: "default",
    },
  }
);

interface AdminCardWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardWrapperVariants> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

export function AdminCardWrapper({
  children,
  padding,
  title,
  description,
  action,
  footer,
  className,
  ...props
}: AdminCardWrapperProps) {
  return (
    <div className={cn(cardWrapperVariants({ padding }), className)} {...props}>
      {(title || description || action) && (
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-100 last:border-none last:pb-0 last:mb-0">
          <div className="space-y-0.5">
            {title && (
              <h3 className="text-sm font-semibold text-zinc-900">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-zinc-500">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-4 pt-3 border-t border-zinc-100 bg-zinc-50/50 -mx-5 -mb-5 px-5 py-2.5 text-xs">
          {footer}
        </div>
      )}
    </div>
  );
}