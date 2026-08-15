// File: frontend/components/ui/InputV2.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface InputV2Props extends React.ComponentProps<"input"> {
  label: string;
}

function InputV2({
  className,
  type,
  label,
  id,
  ...props
}: InputV2Props) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="group relative flex h-11 w-full flex-col justify-end">
      <input
        type={type}
        id={inputId}
        placeholder=" "
        data-slot="input"
        className={cn(
          "peer h-11 w-full min-w-0 rounded-2xl border border-slate-300 bg-white px-3.5 pt-4 pb-1 text-md text-black font-normal transition-all duration-150 outline-none hover:border-slate-400 focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600 aria-invalid:border-red-500 aria-invalid:ring-1 aria-invalid:ring-red-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 shadow-none",
          className
        )}
        {...props}
      />

      <label
        htmlFor={inputId}
        className={cn(
          "pointer-events-none absolute left-3.5 top-1 select-none origin-left text-[10px] font-medium leading-none text-slate-500 transition-all duration-150 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-medium peer-focus:text-slate-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px]"
        )}
      >
        {label}
      </label>
    </div>
  );
}

export { InputV2 };