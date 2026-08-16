"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  Image as ImageIcon,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Productos", href: "/admin/products", icon: Package },
  { name: "Categorías", href: "/admin/categories", icon: FolderTree },
  { name: "Órdenes", href: "/admin/orders", icon: ShoppingBag },
  { name: "Clientes", href: "/admin/customers", icon: Users },
  { name: "Biblioteca Media", href: "/admin/media", icon: ImageIcon },
  { name: "Configuración", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col border-r border-slate-800",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shrink-0">
            G
          </div>
          {!isCollapsed && (
            <span className="font-extrabold text-base tracking-tight text-white whitespace-nowrap">
               NeoShop <span className="text-slate-400 font-normal text-xs">Admin</span>
            </span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors hidden lg:block"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative",
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
              {!isCollapsed && <span>{item.name}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className={cn("flex items-center gap-3 p-2 rounded-xl bg-slate-800/50", isCollapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
            A
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">Administrador</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}