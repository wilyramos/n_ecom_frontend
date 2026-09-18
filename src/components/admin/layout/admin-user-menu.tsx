"use client";

import { useState } from "react";
import { User as UserIcon, LogOut, ExternalLink } from "lucide-react";
import Link from "next/link";
import { User } from "@/src/schemas";
import { logout } from '@/actions/logout-user-action';

export function AdminUserMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-accent transition-colors border border-transparent hover:border-border"
        type="button"
      >
        <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs shadow-sm">
           {user?.nombre?.charAt(0).toUpperCase() || "A"}
        </div>
        <div className="hidden lg:flex flex-col items-start text-left">
          <span className="text-[11px] font-bold leading-none text-foreground">{user?.nombre || "Administrador"}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5 leading-none">Admin</span>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-60 bg-background rounded-lg shadow-lg border border-border z-50 overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <span className="truncate">{user?.email}</span>
              </div>
            </div>

            <div className="p-1.5 space-y-0.5">
              <Link
                href="/admin/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span>Mi Perfil</span>
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                <span>Ir a la Tienda</span>
              </a>
            </div>

            <div className="p-1.5 border-t border-border">
              <button
                onClick={async () => {
                    setIsOpen(false);
                    await logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                type="button"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}