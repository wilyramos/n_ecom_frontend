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
            "peer h-10 w-full rounded-md border border-neutral-200 bg-white pl-3 pr-8 pt-3.5 pb-1 text-xs text-neutral-900 outline-none transition-all appearance-none cursor-pointer shadow-2xs",
            "hover:border-neutral-300",
            "focus:border-neutral-800 focus:ring-2 focus:ring-neutral-900/5",
            "aria-invalid:border-rose-400 aria-invalid:focus:border-rose-500 aria-invalid:focus:ring-rose-500/10",
            "disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-150 disabled:shadow-none",
            className
          )}
          {...props}
        >
          {children}
        </select>

        <label
          htmlFor={selectId}
          className="pointer-events-none absolute left-3 top-1 text-[10px] font-medium text-neutral-400 transition-all select-none peer-focus:text-neutral-800 peer-aria-invalid:text-rose-500"
        >
          {label}
        </label>

        {/* Flecha select discreta y nítida */}
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 peer-focus:text-neutral-700">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    );
  }
);

SelectV2.displayName = "SelectV2";