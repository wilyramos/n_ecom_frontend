import * as React from "react";
import { cn } from "@/lib/utils";

interface InputV2Props extends React.ComponentProps<"input"> {
  label: string;
}

const InputV2 = React.forwardRef<HTMLInputElement, InputV2Props>(
  ({ className, type, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="relative w-full">
        <input
          type={type}
          id={inputId}
          ref={ref}
          placeholder=" "
          className={cn(
            "peer h-10 w-full rounded-md border border-neutral-200 bg-white px-3 pt-3.5 pb-1 text-xs text-neutral-900 placeholder-transparent outline-none transition-all shadow-2xs",
            "hover:border-neutral-300",
            "focus:border-neutral-800 focus:ring-2 focus:ring-neutral-900/5",
            "aria-invalid:border-rose-400 aria-invalid:focus:border-rose-500 aria-invalid:focus:ring-rose-500/10",
            "disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-150 disabled:shadow-none",
            "read-only:bg-neutral-50/70 read-only:text-neutral-600 read-only:border-neutral-200/80",
            className
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-3 top-1 text-[10px] font-medium text-neutral-400 transition-all select-none",
            "peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-neutral-500",
            "peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-medium peer-focus:text-neutral-800",
            "peer-aria-invalid:text-rose-500"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

InputV2.displayName = "InputV2";

export { InputV2 };