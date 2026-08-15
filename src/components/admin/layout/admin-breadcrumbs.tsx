"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto py-1 no-scrollbar">
      <Link
        href="/admin"
        className="hover:text-slate-900 transition-colors shrink-0"
        title="Inicio Admin"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const formattedSegment = segment.replace(/-/g, " ");

        return (
          <div key={href} className="flex items-center gap-1.5 capitalize shrink-0">
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {isLast ? (
              <span className="font-semibold text-slate-900">{formattedSegment}</span>
            ) : (
              <Link href={href} className="hover:text-slate-900 transition-colors">
                {formattedSegment}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}