import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-2 rounded-3xl",
    {
        variants: {
            variant: {
                default:
                    "bg-action-primary text-fg-inverse shadow-sm hover:bg-action-primary-hover",
                primary:
                    "bg-action-primary text-fg-inverse shadow-sm hover:bg-action-primary-hover",
                accent:
                    "bg-surface-inverse text-fg-inverse shadow-sm hover:bg-brand-black",
                secondary:
                    "bg-surface-secondary text-fg-primary border border-border-default shadow-sm hover:bg-brand-charcoal hover:text-fg-inverse",
                outline:
                    "bg-transparent text-fg-primary border border-border-default hover:bg-surface-secondary",
                ghost:
                    "text-fg-primary hover:bg-surface-secondary",
                link:
                    "text-action-primary underline-offset-4 hover:underline",
                success:
                    "bg-surface-primary text-fg-primary border border-border-default shadow-sm hover:bg-surface-secondary",
                warning:
                    "bg-fg-secondary text-fg-primary shadow-sm hover:bg-brand-charcoal hover:text-fg-inverse",
                destructive:
                    "bg-brand-black text-fg-inverse shadow-sm hover:bg-brand-charcoal",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 gap-1.5 px-3 text-xs",
                lg: "h-12 px-8 text-base",
                icon: "size-10 ",
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