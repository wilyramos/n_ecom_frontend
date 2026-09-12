//File: frontend/src/components/admin/layout/admin-form-group.tsx

import React from "react";
import { cn } from "@/lib/utils";

interface AdminFormGroupProps {
  label: string;
  children?: React.ReactNode;
}

export function AdminFormGroup({ label, children }: AdminFormGroupProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-700 block">{label}</label>
      {children}
    </div>
  );
}

export function AdminSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full h-8 border border-slate-200 rounded-lg px-2.5 text-xs bg-white text-slate-800 font-medium outline-none focus:border-slate-400 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function AdminInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 transition-colors",
        className
      )}
      {...props}
    />
  );
}