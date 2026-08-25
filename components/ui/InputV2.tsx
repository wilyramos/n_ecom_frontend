import * as React from "react";
import { cn } from "@/lib/utils";

interface InputV2Props extends React.ComponentProps<"input"> {
  label: string;
}

function InputV2({ className, type, label, id, ...props }: InputV2Props) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="relative w-full">
      <input
        type={type}
        id={inputId}
        placeholder=" "
        className={cn(
          "peer h-10 w-full rounded-md border border-neutral-300 bg-white px-3 pt-3.5 pb-1 text-xs text-neutral-900 placeholder-transparent outline-none transition-colors",
          "hover:border-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900",
          "aria-invalid:border-red-500 aria-invalid:ring-1 aria-invalid:ring-red-500",
          "disabled:bg-neutral-50 disabled:text-neutral-400",
          className
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute left-3 top-1 text-[9px] font-normal text-neutral-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs peer-focus:top-1 peer-focus:text-[9px] peer-focus:text-neutral-700"
      >
        {label}
      </label>
    </div>
  );
}

export { InputV2 };