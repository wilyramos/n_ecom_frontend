"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { User } from "@/src/schemas";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Package,
  Layers3,
  BarChart3,
  Palette,
  Settings,
  Store,
  ChevronDown,
  PanelLeftClose,
  Fingerprint,
  ExternalLink,
  LucideIcon,
} from "lucide-react";

type NavChild = {
  href: string;
  label: string;
  isExternal?: boolean;
};

type NavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  tag?: string;
  isExternal?: boolean;
  children?: NavChild[];
};

type NavGroup = {
  groupLabel: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    groupLabel: "PRINCIPAL",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/pedidos", icon: ShoppingCart, label: "Pedidos", tag: "NUEVO" },
      { href: "/admin/tickets-v2", icon: FileText, label: "Comprobantes" },
      { href: "/admin/products", icon: Package, label: "Productos" },
    ],
  },
  {
    groupLabel: "GESTIÓN",
    items: [
      {
        icon: Layers3,
        label: "Clasificación",
        children: [
          { href: "/admin/products/category", label: "Categorías" },
          { href: "/admin/brands", label: "Marcas" },
          { href: "/admin/lines", label: "Líneas" },
        ],
      },
      {
        icon: BarChart3,
        label: "Métricas",
        children: [
          { href: "/admin/claims", label: "Reclamaciones" },
          { href: "/admin/reports", label: "Reportes" },
        ],
      },
      {
        icon: Palette,
        label: "Contenido",
        children: [
          { href: "/admin/slider", label: "Banners" },
          { href: "/admin/sections", label: "Secciones" },
          { href: "/admin/advertisements", label: "Avisos" },
          { href: "/admin/pages", label: "Páginas" },
        ],
      },
      {
        icon: Settings,
        label: "Sistema",
        children: [
          { href: "/admin/users", label: "Usuarios" },
          { href: "/admin/attendance", label: "Asistencias" },
        ],
      },
      {
        icon: Store,
        label: "Accesos",
        children: [
          { href: "/pos", label: "Punto de Venta", isExternal: true },
          { href: "/", label: "Tienda Online", isExternal: true },
        ],
      },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  user: User;
}

export function AdminSidebar({ isOpen, onToggle, user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    if (!isOpen && window.innerWidth >= 768) {
      onToggle();
      setTimeout(() => setOpenMenus((p) => ({ ...p, [label]: true })), 150);
      return;
    }
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-all duration-300 md:static",
        "border-r border-slate-200 shadow-lg md:shadow-none",
        isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:w-20 md:translate-x-0"
      )}
    >
  {/* Header */}
<div className={cn(
  "flex items-center justify-between h-16 border-b border-slate-200 transition-all duration-300",
  isOpen ? "px-4" : "md:px-0 md:justify-center"
)}>
  <Link href="/admin" className="flex items-center justify-center w-full md:w-auto">
    {isOpen ? (
      <div className="w-full flex items-center">
        <Logo 
          version="completa"
          className="h-8 w-40" // Reemplazado h-7 w-auto por dimensiones explícitas
        />
      </div>
    ) : (
      <Logo 
        version="icono"
        className="h-7 w-7" 
      />
    )}
  </Link>
  <button
    type="button"
    onClick={onToggle}
    className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700 flex-shrink-0"
  >
    <PanelLeftClose className="h-5 w-5" />
  </button>
</div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.groupLabel} className="space-y-2">
            {isOpen && (
              <p className="px-3 text-xs font-bold text-slate-400 tracking-widest uppercase">
                {group.groupLabel}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const { href, icon: Icon, label, children, tag, isExternal } = item;

                if (children) {
                  const isChildActive = children.some(
                    (c: NavChild) => pathname === c.href || (c.href !== "/admin" && pathname.startsWith(`${c.href}/`))
                  );
                  const isMenuOpen = openMenus[label] !== undefined ? openMenus[label] : isChildActive;

                  return (
                    <div key={label} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleMenu(label)}
                        className={cn(
                          "group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                          isChildActive
                            ? "bg-blue-50 text-blue-900"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                          !isOpen && "md:justify-center md:px-0"
                        )}
                        title={!isOpen ? label : undefined}
                      >
                        <Icon className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors",
                          isChildActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                        )} />
                        {isOpen && (
                          <>
                            <span className="flex-1 text-left">{label}</span>
                            <ChevronDown className={cn(
                              "h-4 w-4 transition-transform duration-200 text-slate-400",
                              isMenuOpen && "rotate-180 text-slate-600"
                            )} />
                          </>
                        )}
                      </button>

                      {isOpen && (
                        <div className={cn(
                          "grid overflow-hidden transition-all duration-200",
                          isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        )}>
                          <div className="min-h-0 space-y-1 pl-8">
                            {children.map((sub: NavChild) => {
                              const isSubActive = pathname === sub.href || (sub.href !== "/admin" && pathname.startsWith(`${sub.href}/`));
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  target={sub.isExternal ? "_blank" : undefined}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all",
                                    isSubActive
                                      ? "bg-blue-100 text-blue-900 font-semibold"
                                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                  )}
                                >
                                  <span className="flex-1">{sub.label}</span>
                                  {sub.isExternal && <ExternalLink className="h-3 w-3 flex-shrink-0 text-slate-400" />}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = href && (pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`)));

                return (
                  <Link
                    key={label}
                    href={href || "#"}
                    target={isExternal ? "_blank" : undefined}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                      isActive
                        ? "bg-blue-50 text-blue-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                      !isOpen && "md:justify-center md:px-0"
                    )}
                    title={!isOpen ? label : undefined}
                  >
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                    )} />
                    {isOpen && (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="truncate">{label}</span>
                        {tag && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 flex-shrink-0">
                            {tag}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-3 space-y-2">
        {isOpen ? (
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <Fingerprint className="h-4 w-4 flex-shrink-0 text-indigo-600" />
              <span>Asistencia</span>
            </button>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-xs font-bold shadow-md">
                {user?.nombre?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">
                  {user?.nombre || "Admin"}
                </p>
                <p className="truncate text-[10px] text-slate-500">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              title={`${user?.nombre || "Admin"}\n${user?.email}`}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-xs font-bold cursor-default hover:shadow-lg hover:scale-110 transition-all"
            >
              {user?.nombre?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}