"use client";

import React from "react";
import { Menu } from "lucide-react";
import { AdminSearchCommand } from "./admin-search-command";
import { AdminNotifications } from "./admin-notifications";
import { AdminUserMenu } from "./admin-user-menu";
import { AdminBreadcrumbs } from "./admin-breadcrumbs";
import { AdminStatusIndicator } from "./admin-status-indicator";

interface AdminNavbarProps {
  onToggleSidebar?: () => void;
}

export function AdminNavbar({ onToggleSidebar }: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          aria-label="Abrir Menú"
          type="button"
        >
          <Menu className="w-5 h-5" />
        </button>
        <AdminBreadcrumbs />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <AdminSearchCommand />
        <AdminStatusIndicator status="online" />
        <AdminNotifications />
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />
        <AdminUserMenu />
      </div>
    </header>
  );
}