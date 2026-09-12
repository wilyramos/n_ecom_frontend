// File: frontend/src/components/admin/layout/admin-page-container.tsx

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
                default: "p-4 sm:p-5 lg:p-6",
                compact: "p-3 sm:p-4",
                none: "p-0",
            },
            spacing: {
                default: "space-y-4 sm:space-y-5",
                compact: "space-y-3",
                loose: "space-y-6",
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