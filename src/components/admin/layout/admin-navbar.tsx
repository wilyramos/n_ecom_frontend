// File: frontend/components/admin/layout/admin-navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  ChevronRight,
  Bell, LayoutGrid
} from "lucide-react";
import { AdminUserMenu } from "./admin-user-menu";
import { User } from "@/src/schemas";

const routeNames: Record<string, string> = {
  admin: "Panel",
  pedidos: "Pedidos Web",
  "tickets-v2": "Comprobantes",
  products: "Productos",
  new: "Nuevo",
  category: "Categorías",
  brands: "Marcas",
  lines: "Líneas",
  claims: "Reclamaciones",
  reports: "Reportes",
  sales: "Ventas",
  slider: "Banners",
  sections: "Secciones Web",
  advertisements: "Avisos",
  pages: "Páginas",
  users: "Usuarios",
  attendance: "Asistencias",
  settings: "Configuración",
  profile: "Mi Perfil",
};

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  user: User;
}

export function AdminNavbar({ onToggleSidebar, user }: AdminNavbarProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-200/80 bg-white/90 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 sm:px-6">
      {/* Sección Izquierda: Toggle de Sidebar + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer ring-1 ring-transparent hover:ring-zinc-200/70"
          title="Alternar barra lateral"
          aria-label="Alternar barra lateral"
        >
          <Sidebar className="h-4 w-4 stroke-[2]" />
        </button>

        <div className="h-4 w-px bg-zinc-200 shrink-0" />

        {/* Breadcrumb Navegable */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs">
          <Link
            href="/admin"
            className="flex items-center text-zinc-400 hover:text-zinc-800 transition-colors p-1 rounded-md hover:bg-zinc-100"
            title="Inicio Panel"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Link>

          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            const label =
              routeNames[segment] ||
              segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <React.Fragment key={href}>
                <ChevronRight className="h-3 w-3 text-zinc-300 shrink-0" />
                {isLast ? (
                  <span className="font-semibold text-zinc-900 truncate max-w-[150px] sm:max-w-xs">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="text-zinc-500 hover:text-zinc-800 transition-colors truncate max-w-[100px] sm:max-w-none"
                  >
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Sección Derecha: Acciones Rápidas + Notificaciones + Menú de Usuario */}
      <div className="flex items-center gap-2 sm:gap-2.5">
      

        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
          aria-label="Ver notificaciones"
        >
          <Bell className="h-4 w-4 stroke-[1.8]" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

        <AdminUserMenu user={user} />
      </div>
    </header>
  );
}