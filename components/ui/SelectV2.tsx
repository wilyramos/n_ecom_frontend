// frontend/components/ui/SelectV2.tsx
import { cn } from "@/lib/utils";
import * as React from "react";

interface SelectV2Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export const SelectV2 = React.forwardRef<HTMLSelectElement, SelectV2Props>(
  ({ className, label, id, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="relative w-full group flex flex-col justify-end h-11">
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "peer h-11 w-full border bg-background border-border px-2 pt-4 pb-1 text-xs outline-none rounded-md appearance-none text-foreground cursor-pointer",
            "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[1px]",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <label htmlFor={selectId} className="absolute left-3 top-1 text-[10px] text-muted-foreground pointer-events-none transition-all">
          {label}
        </label>
      </div>
    );
  }
);
SelectV2.displayName = "SelectV2";