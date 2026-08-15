// src/components/admin/layout/admin-table-actions.tsx
"use client";

import React from "react";
import { MoreHorizontal, LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminButton } from "./admin-button";

export interface ActionItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

interface AdminTableActionsProps {
  actions: ActionItem[];
  label?: string;
}

export function AdminTableActions({ actions, label }: AdminTableActionsProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdminButton
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-500 hover:text-zinc-900"
          title="Opciones"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Abrir menú de opciones</span>
        </AdminButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 bg-white border border-zinc-200/80 rounded-xl shadow-lg p-1 text-xs z-50"
      >
        {label && (
          <>
            <DropdownMenuLabel className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              {label}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="h-px bg-zinc-100 my-1" />
          </>
        )}

        {actions.map((action, index) => {
          const Icon = action.icon;
          const isDestructive = action.variant === "destructive";

          return (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg font-medium cursor-pointer transition-colors outline-none ${
                isDestructive
                  ? "text-rose-600 hover:bg-rose-50 focus:bg-rose-50"
                  : "text-zinc-700 hover:bg-zinc-100 focus:bg-zinc-100"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
              <span>{action.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}