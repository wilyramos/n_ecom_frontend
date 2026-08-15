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
      <label className="text-xs font-medium text-zinc-700 block">{label}</label>
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
        "w-full h-8 border border-zinc-200/80 rounded-lg px-2.5 text-xs bg-white text-zinc-800 font-medium outline-none focus:border-zinc-400 transition-colors",
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
        "w-full border border-zinc-200/80 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-400 transition-colors",
        className
      )}
      {...props}
    />
  );
}