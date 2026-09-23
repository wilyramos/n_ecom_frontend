import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-3xl",
  {
    variants: {
      variant: {
        default:
          "bg-brand-charcoal text-white hover:bg-brand-black hover:shadow-md",
        primary:
          "bg-brand-charcoal text-white hover:bg-brand-black hover:shadow-md",
        accent:
          "bg-brand-silver text-brand-charcoal hover:bg-brand-action hover:shadow-sm",
        secondary:
          "bg-brand-silver-border text-brand-charcoal hover:bg-brand-silver",
        outline:
          "bg-transparent text-brand-charcoal border border-brand-silver hover:border-brand-charcoal hover:bg-brand-silver-border/50",
        ghost:
          "text-brand-charcoal hover:bg-brand-silver-border",
        link:
          "text-brand-charcoal underline-offset-4 hover:underline hover:text-brand-black",
        success:
          "bg-brand-gris text-white hover:bg-brand-action hover:text-brand-charcoal",
        warning:
          "bg-brand-action-muted text-brand-charcoal hover:bg-brand-action/30",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 gap-1.5 px-4 text-xs",
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