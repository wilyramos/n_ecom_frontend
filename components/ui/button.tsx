import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-3xl",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-sm hover:bg-action-primary-hover",
                primary:
                    "bg-primary text-primary-foreground shadow-sm hover:bg-action-primary-hover",
                accent:
                    "bg-accent text-accent-foreground shadow-sm hover:bg-action-secondary-hover",
                secondary:
                    "bg-secondary text-secondary-foreground border border-border shadow-sm hover:bg-action-secondary-hover",
                outline:
                    "bg-transparent text-foreground border border-border hover:bg-secondary hover:text-secondary-foreground",
                ghost:
                    "text-foreground hover:bg-secondary hover:text-secondary-foreground",
                link:
                    "text-primary underline-offset-4 hover:underline",
                success:
                    "bg-background text-foreground border border-border shadow-sm hover:bg-secondary",
                warning:
                    "bg-accent-vivid text-primary-foreground shadow-sm hover:bg-accent-vivid/90",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 gap-1.5 px-3 text-xs",
                lg: "h-12 px-8 text-base",
                icon: "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }