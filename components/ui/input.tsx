import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] selection:bg-[var(--color-action-primary)] selection:text-[var(--color-text-inverse)]",
        "h-9 w-full min-w-0 border bg-[var(--color-bg-primary)] border-[var(--color-border-default)] px-3 py-1 text-base transition-[color,box-shadow] outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[var(--color-surface-active)] focus-visible:ring-[var(--color-surface-hover)] focus-visible:ring-[2px]",
        "aria-invalid:ring-[var(--color-error)]/20 aria-invalid:border-[var(--color-error)]",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
)

Input.displayName = "Input"

export { Input }