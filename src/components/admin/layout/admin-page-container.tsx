//File: frontend/src/components/admin/layout/admin-page-container.tsx

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pageContainerVariants = cva(
    "w-full mx-auto transition-all duration-200",
    {
        variants: {
            maxWidth: {
                default: "max-w-7xl",
                full: "max-w-full",
                narrow: "max-w-4xl",
            },
            padding: {
                default: "p-4 sm:p-6 lg:p-8",
                compact: "p-3 sm:p-4 lg:p-6",
                none: "p-0",
            },
            spacing: {
                default: "space-y-6",
                compact: "space-y-4",
                loose: "space-y-8",
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
    VariantProps<typeof pageContainerVariants> { }

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