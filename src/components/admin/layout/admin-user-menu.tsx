"use client";

import React, { useState } from "react";
import { User, Settings, LogOut, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function AdminUserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
        type="button"
      >
        <div className="h-8 w-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
          W
        </div>
        <div className="hidden lg:block text-left pr-1">
          <p className="text-xs font-semibold text-slate-900 leading-tight">Wily Ramos</p>
          <p className="text-[10px] text-slate-400">Super Admin</p>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
            <div className="p-3 bg-slate-50/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span>Wily Ramos</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500 truncate">wily@gophone.pe</p>
            </div>

            <div className="p-1 space-y-0.5">
              <Link
                href="/admin/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                <span>Configuración</span>
              </Link>
              <Link
                href="/admin/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Mi Perfil</span>
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Ir a la Tienda</span>
              </a>
            </div>

            <div className="p-1">
              <button
                onClick={() => console.log("Cerrar sesión")}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                type="button"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}