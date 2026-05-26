import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-2xl border border-border-default bg-surface-primary px-3 py-1 text-base transition-[color,box-shadow] outline-none",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-fg-primary",
        "placeholder:text-fg-muted",
        "selection:bg-action-primary selection:text-fg-inverse",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-action-primary-hover focus-visible:ring-[3px] focus-visible:ring-action-primary/20",
        "aria-invalid:border-brand-gris aria-invalid:ring-brand-gris/20",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
)

Input.displayName = "Input"

export { Input }