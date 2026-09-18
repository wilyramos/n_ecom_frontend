// File: frontend/components/admin/layout/admin-sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { User } from "@/src/schemas";
import {
  LayoutGrid,
  ShoppingBag,
  Receipt,
  Package,
  Layers,
  LineChart,
  Compass,
  SlidersHorizontal,
  Store,
  ChevronRight,
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
    groupLabel: "Principal",
    items: [
      { href: "/admin", icon: LayoutGrid, label: "Dashboard" },
      { href: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos Web", tag: "NUEVO" },
      { href: "/admin/tickets-v2", icon: Receipt, label: "Comprobantes" },
      { href: "/admin/products", icon: Package, label: "Productos" },
    ],
  },
  {
    groupLabel: "Gestión",
    items: [
      {
        icon: Layers,
        label: "Clasificación",
        children: [
          { href: "/admin/products/category", label: "Categorías" },
          { href: "/admin/brands", label: "Marcas" },
          { href: "/admin/lines", label: "Líneas" },
        ],
      },
      {
        icon: LineChart,
        label: "Ventas & Métricas",
        children: [
          { href: "/admin/claims", label: "Reclamaciones" },
          { href: "/admin/reports", label: "Reporte General" },
        ],
      },
      {
        icon: Compass,
        label: "Contenido Web",
        children: [
          { href: "/admin/slider", label: "Sliders & Banners" },
          { href: "/admin/sections", label: "Secciones" },
          { href: "/admin/advertisements", label: "Avisos" },
          { href: "/admin/pages", label: "Páginas Estáticas" },
        ],
      },
      {
        icon: SlidersHorizontal,
        label: "Configuración",
        children: [
          { href: "/admin/users", label: "Usuarios" },
          { href: "/admin/attendance", label: "Asistencias" },
        ],
      },
      {
        icon: Store,
        label: "Accesos Directos",
        children: [
          { href: "/pos", label: "Punto de Venta", isExternal: true },
          { href: "/", label: "Ver Tienda Online", isExternal: true },
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
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-zinc-200/70 bg-white transition-all duration-300 md:static",
        isOpen ? "w-[250px] translate-x-0" : "w-[250px] -translate-x-full md:w-[68px] md:translate-x-0"
      )}
    >
      {/* Header / Logo */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-100 px-4">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2 font-semibold transition-all",
            !isOpen && "md:justify-center md:px-0 w-full"
          )}
        >
          {isOpen ? (
            <Logo className="h-6 w-28 transition-all duration-300" />
          ) : (
            <div className="relative h-6 w-6 shrink-0">
              <Image
                src="/miniaturagris.png"
                alt="Logo Miniatura"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className="md:hidden text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      {/* Navegación */}
      <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.groupLabel} className="space-y-1">
            {isOpen && (
              <p className="px-2.5 pb-1 text-[11px] font-medium tracking-wide text-zinc-400">
                {group.groupLabel}
              </p>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const { href, icon: Icon, label, children, tag, isExternal } = item;

                // Item con submenú desplegable
                if (children) {
                  const isChildActive = children.some(
                    (c: NavChild) =>
                      pathname === c.href || (c.href !== "/admin" && pathname.startsWith(`${c.href}/`))
                  );
                  const isMenuOpen =
                    openMenus[label] !== undefined ? openMenus[label] : isChildActive;

                  return (
                    <div key={label} className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => toggleMenu(label)}
                        className={cn(
                          "group flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-all cursor-pointer",
                          isChildActive
                            ? "bg-zinc-100/90 text-zinc-900 font-semibold"
                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                          !isOpen && "md:justify-center md:px-0"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            fill={isChildActive ? "currentColor" : "none"}
                            className={cn(
                              "h-[18px] w-[18px] shrink-0 transition-all",
                              isChildActive
                                ? "text-zinc-900 stroke-zinc-900 stroke-[1.2]"
                                : "text-zinc-500 stroke-[1.8] group-hover:text-zinc-800"
                            )}
                          />
                          {isOpen && <span className="truncate">{label}</span>}
                        </div>
                        {isOpen && (
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform duration-200",
                              isMenuOpen && "rotate-90 text-zinc-700"
                            )}
                          />
                        )}
                      </button>

                      {isOpen && (
                        <div
                          className={cn(
                            "grid overflow-hidden transition-all duration-200",
                            isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          )}
                        >
                          <div className="min-h-0 space-y-0.5 pl-8 pr-1 py-1">
                            {children.map((sub: NavChild) => {
                              const isSubActive =
                                pathname === sub.href ||
                                (sub.href !== "/admin" && pathname.startsWith(`${sub.href}/`));
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  target={sub.isExternal ? "_blank" : undefined}
                                  className={cn(
                                    "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[12.5px] transition-colors",
                                    isSubActive
                                      ? "bg-zinc-100 text-zinc-900 font-semibold"
                                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                  )}
                                >
                                  <span className="truncate">{sub.label}</span>
                                  {sub.isExternal && (
                                    <ExternalLink className="h-3 w-3 text-zinc-400" />
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

                // Item simple
                const isActive =
                  href && (pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`)));

                return (
                  <Link
                    key={label}
                    href={href || "#"}
                    target={isExternal ? "_blank" : undefined}
                    className={cn(
                      "group flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-all",
                      isActive
                        ? "bg-zinc-100/90 text-zinc-900 font-semibold"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                      !isOpen && "md:justify-center md:px-0"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        fill={isActive ? "currentColor" : "none"}
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-all",
                          isActive
                            ? "text-zinc-900 stroke-zinc-900 stroke-[1.2]"
                            : "text-zinc-500 stroke-[1.8] group-hover:text-zinc-800"
                        )}
                      />
                      {isOpen && <span className="truncate">{label}</span>}
                    </div>
                    {isOpen && tag && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                        {tag}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Asistencia y Perfil */}
      <div className="border-t border-zinc-100 p-3 space-y-2">
        {isOpen ? (
          <div className="space-y-2">
            <Link
              href="/staff/attendance"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-zinc-200/80 bg-zinc-50/60 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Fingerprint className="h-4 w-4 text-zinc-500" />
              <span>Marcar Asistencia</span>
            </Link>
            <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 text-xs font-semibold">
                {user?.nombre?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-800 leading-tight">
                  {user?.nombre || "Admin"}
                </p>
                <p className="truncate text-[10px] text-zinc-400 leading-tight">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div
              title={`${user?.nombre || "Admin"} (${user?.email})`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 text-xs font-semibold cursor-default"
            >
              {user?.nombre?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}