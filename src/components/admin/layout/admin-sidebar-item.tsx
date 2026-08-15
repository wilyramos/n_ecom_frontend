"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  isCollapsed: boolean;
  badge?: string | number;
}

export function AdminSidebarItem({
  name,
  href,
  icon: Icon,
  isActive,
  isCollapsed,
  badge,
}: AdminSidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative",
        isActive
          ? "bg-white/10 text-white font-bold"
          : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 shrink-0",
          isActive ? "text-white" : "text-slate-400 group-hover:text-white"
        )}
      />
      {!isCollapsed && <span className="truncate">{name}</span>}
      {!isCollapsed && badge && (
        <span className="ml-auto bg-slate-800 text-slate-200 text-[10px] px-1.5 py-0.5 rounded-full border border-slate-700">
          {badge}
        </span>
      )}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
          {name}
        </div>
      )}
    </Link>
  );
}