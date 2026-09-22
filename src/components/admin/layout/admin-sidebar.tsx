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

const navItems: NavItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/pedidos", icon: ShoppingCart, label: "Pedidos", tag: "NUEVO" },
  { href: "/admin/tickets-v2", icon: FileText, label: "Comprobantes" },
  { href: "/admin/products", icon: Package, label: "Productos" },
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
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  user: User;
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
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
        "border-r border-slate-200 shadow-md md:shadow-none",
        isOpen ? "w-56 translate-x-0" : "w-56 -translate-x-full md:w-16 md:translate-x-0"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between h-14 border-b border-slate-200 transition-all duration-300",
          isOpen ? "px-3" : "md:px-0 md:justify-center"
        )}
      >
        <Link href="/admin" className="flex items-center justify-center w-full md:w-auto">
          {isOpen ? (
            <div className="w-full flex items-center">
              <Logo version="completa" className="h-7 w-32" />
            </div>
          ) : (
            <Logo version="icono" className="h-6 w-6" />
          )}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className="md:hidden p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-500 hover:text-slate-700 flex-shrink-0"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2.5 space-y-3">
        {navItems.map((item) => {
          const { href, icon: Icon, label, children, tag, isExternal } = item;

          if (children) {
            const isChildActive = children.some(
              (c: NavChild) =>
                pathname === c.href || (c.href !== "/admin" && pathname.startsWith(`${c.href}/`))
            );
            const isMenuOpen = openMenus[label] !== undefined ? openMenus[label] : isChildActive;

            return (
              <div key={label} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleMenu(label)}
                  className={cn(
                    "group w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all text-xs font-medium",
                    isChildActive
                      ? "bg-blue-50 text-blue-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                    !isOpen && "md:justify-center md:px-0"
                  )}
                  title={!isOpen ? label : undefined}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0 transition-colors",
                      isChildActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                    )}
                  />
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left truncate">{label}</span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200 text-slate-400",
                          isMenuOpen && "rotate-180 text-slate-600"
                        )}
                      />
                    </>
                  )}
                </button>

                {isOpen && (
                  <div
                    className={cn(
                      "grid overflow-hidden transition-all duration-200",
                      isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="min-h-0 space-y-0.5 pl-6">
                      {children.map((sub: NavChild) => {
                        const isSubActive =
                          pathname === sub.href ||
                          (sub.href !== "/admin" && pathname.startsWith(`${sub.href}/`));
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            target={sub.isExternal ? "_blank" : undefined}
                            rel={sub.isExternal ? "noopener noreferrer" : undefined}
                            className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition-all",
                              isSubActive
                                ? "bg-blue-100 text-blue-900 font-semibold"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            )}
                          >
                            <span className="flex-1 truncate">{sub.label}</span>
                            {sub.isExternal && (
                              <ExternalLink className="h-3 w-3 flex-shrink-0 text-slate-400" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          const isActive =
            href && (pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`)));

          return (
            <Link
              key={label}
              href={href || "#"}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={cn(
                "group flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all text-xs font-medium",
                isActive
                  ? "bg-blue-50 text-blue-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                !isOpen && "md:justify-center md:px-0"
              )}
              title={!isOpen ? label : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                )}
              />
              {isOpen && (
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span className="truncate">{label}</span>
                  {tag && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-100 text-amber-700 flex-shrink-0">
                      {tag}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-2 space-y-1.5">
        <Link
          href="/staff/attendance"
          target="_blank"
          rel="noopener noreferrer"
          title={!isOpen ? "Asistencia" : undefined}
          className={cn(
            "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors",
            !isOpen && "justify-center px-0"
          )}
        >
          <Fingerprint className="h-4 w-4 flex-shrink-0 text-indigo-600" />
          {isOpen && (
            <>
              <span className="flex-1 truncate">Asistencia</span>
              <ExternalLink className="h-3 w-3 text-slate-400 flex-shrink-0" />
            </>
          )}
        </Link>
      </div>
    </aside>
  );
}