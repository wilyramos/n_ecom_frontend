// File: frontend/components/ui/SelectV2.tsx
import { cn } from "@/lib/utils";
import * as React from "react";
import { ChevronDown } from "lucide-react";

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
            "peer h-11 w-full min-w-0 rounded-2xl border border-slate-300 bg-white px-3.5 pt-4 pb-1 text-md text-black font-normal outline-none appearance-none cursor-pointer transition-all duration-150 hover:border-slate-400 focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600 aria-invalid:border-red-500 aria-invalid:ring-1 aria-invalid:ring-red-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 shadow-none",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <label
          htmlFor={selectId}
          className="pointer-events-none absolute left-3.5 top-1 select-none text-[10px] font-medium leading-none text-slate-500 transition-all duration-150 peer-focus:text-slate-600"
        >
          {label}
        </label>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-3.5 text-slate-500 transition-colors group-hover:text-slate-700"
        />
      </div>
    );
  }
);
SelectV2.displayName = "SelectV2";