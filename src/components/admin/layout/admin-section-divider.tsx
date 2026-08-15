import React from "react";
import { cn } from "@/lib/utils";

interface AdminSectionDividerProps {
  label?: string;
  className?: string;
}

export function AdminSectionDivider({ label, className }: AdminSectionDividerProps) {
  return (
    <div className={cn("relative my-6", className)}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-slate-200" />
      </div>
      {label && (
        <div className="relative flex justify-start text-xs uppercase tracking-wider">
          <span className="bg-white pr-3 font-bold text-slate-400">{label}</span>
        </div>
      )}
    </div>
  );
}