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
      <div className="relative w-full">
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "peer h-10 w-full rounded-md border border-neutral-300 bg-white px-3 pt-3.5 pb-1 text-xs text-neutral-900 outline-none transition-colors appearance-none cursor-pointer",
            "hover:border-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900",
            "aria-invalid:border-red-500 aria-invalid:ring-1 aria-invalid:ring-red-500",
            "disabled:bg-neutral-50 disabled:text-neutral-400",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <label
          htmlFor={selectId}
          className="pointer-events-none absolute left-3 top-1 text-[9px] font-normal text-neutral-500 transition-all peer-focus:text-neutral-700"
        >
          {label}
        </label>
      </div>
    );
  }
);
SelectV2.displayName = "SelectV2";