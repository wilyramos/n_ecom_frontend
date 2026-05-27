// File: components/admin/AdminSidebar.tsx
"use client";

import type { ElementType } from "react";

import { User } from "@/src/schemas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

import AdminMenu from "./AdminMenu";
import Logo from "../ui/Logo";

import { TooltipProvider } from "@/components/ui/tooltip";

import {
    LayoutDashboard,
    Package,
    Users,
    ReceiptText,
    Sliders,
    Building2,
    GitBranch,
    FolderTree,
    BarChart3,
    Store,
    Scale,
    UserCheck,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

type NavLink = {
    type?: "link" | "separator";
    href?: string;
    icon?: ElementType;
    label: string;
    children?: Array<{
        href: string;
        label: string;
    }>;
    isExternal?: boolean;
};

type Props = {
    user: User;
};

const menuGroups: NavLink[] = [
    // ── GENERAL ─────────────────────────────
    {
        href: "/admin",
        icon: LayoutDashboard,
        label: "Dashboard",
    },

    // ── VENTAS ──────────────────────────────
    {
        type: "separator",
        label: "Ventas y Clientes",
    },
    {
        href: "/admin/orders",
        icon: ReceiptText,
        label: "Órdenes",
    },
    {
        href: "/admin/clients",
        icon: Users,
        label: "Clientes",
    },

    // ── CATÁLOGO ────────────────────────────
    {
        type: "separator",
        label: "Catálogo e Inventario",
    },
    {
        href: "/admin/products",
        icon: Package,
        label: "Productos",
    },
    {
        href: "/admin/products/category",
        icon: FolderTree,
        label: "Categorías",
    },
    {
        href: "/admin/brands",
        icon: Building2,
        label: "Marcas",
    },
    {
        href: "/admin/lines",
        icon: GitBranch,
        label: "Líneas",
    },

    // ── REPORTES ────────────────────────────
    {
        type: "separator",
        label: "Control y Reportes",
    },
    {
        icon: BarChart3,
        label: "Reportes",
        children: [
            {
                href: "/admin/reports",
                label: "Vista General",
            },
            {
                href: "/admin/reports/sales",
                label: "Ventas",
            },
            {
                href: "/admin/reports/orders",
                label: "Órdenes",
            },
        ],
    },
    {
        href: "/admin/claims",
        icon: Scale,
        label: "Reclamaciones",
    },

    // ── CONFIGURACIÓN ───────────────────────
    {
        type: "separator",
        label: "Configuración",
    },
    {
        href: "/admin/slider",
        icon: Sliders,
        label: "Slider Banners",
    },
    {
        icon: UserCheck,
        label: "Usuarios",
        children: [
            {
                href: "/admin/users",
                label: "Lista de Usuarios",
            },
            {
                href: "/admin/users/roles",
                label: "Roles y Permisos",
            },
        ],
    },

    // ── CANALES ─────────────────────────────
    {
        type: "separator",
        label: "Canales",
    },
    {
        href: "/pos",
        icon: Store,
        label: "Punto de Venta",
        isExternal: true,
    },
    {
        href: "/",
        icon: Store,
        label: "Ver Tienda Online",
        isExternal: true,
    },
];

export default function AdminSidebar({ user }: Props) {
    const pathname = usePathname();

    const [expanded, setExpanded] = useState(true);

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        Reportes: true,
    });

    const toggleMenu = (label: string) => {
        if (!expanded) {
            setExpanded(true);

            setTimeout(() => {
                setOpenMenus((prev) => ({
                    ...prev,
                    [label]: true,
                }));
            }, 150);

            return;
        }

        setOpenMenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    "relative hidden h-screen flex-col border-r border-[var(--color-border-default)] bg-white shadow-sm transition-all duration-300 md:flex",
                    expanded ? "w-64" : "w-[80px]"
                )}
            >
                {/* Collapse Button */}
                <button
                    onClick={() => {
                        setExpanded((current) => !current);
                        setOpenMenus({});
                    }}
                    className="absolute -right-3 top-9 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border-default)] bg-white text-zinc-500 shadow-sm transition-colors hover:border-[var(--color-accent-vivid)] hover:text-[var(--color-accent-vivid)]"
                >
                    <ChevronRight
                        className={cn(
                            "h-3 w-3 transition-transform duration-300",
                            expanded && "rotate-180"
                        )}
                    />
                </button>

                {/* Logo */}
                <div
                    className={cn(
                        "flex h-20 items-center px-6 transition-all",
                        expanded ? "justify-start" : "justify-center"
                    )}
                >
                    <Logo />
                </div>

                {/* Navigation */}
                <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-2">
                    {menuGroups.map((item) => {
                        const {
                            type,
                            href,
                            icon: Icon,
                            label,
                            children,
                            isExternal,
                        } = item;

                        // ── Separator ─────────────────────
                        if (type === "separator") {
                            if (!expanded) return null;

                            return (
                                <div
                                    key={`separator-${label}`}
                                    className="select-none px-3 pb-1 pt-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400"
                                >
                                    {label}
                                </div>
                            );
                        }

                        // ── Dropdown Menu ─────────────────
                        if (children) {
                            const isOpen = openMenus[label];

                            const isChildActive = children.some(
                                (child) =>
                                    pathname === child.href ||
                                    pathname.startsWith(
                                        `${child.href}/`
                                    )
                            );

                            return (
                                <div
                                    key={label}
                                    className="space-y-1"
                                >
                                    <button
                                        onClick={() =>
                                            toggleMenu(label)
                                        }
                                        className={cn(
                                            "group flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all",
                                            isChildActive
                                                ? "bg-[var(--color-accent-vivid)]/10 text-[var(--color-accent-vivid)]"
                                                : "text-zinc-600 hover:bg-zinc-100"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {Icon && (
                                                <Icon
                                                    className={cn(
                                                        "h-5 w-5 shrink-0",
                                                        isChildActive
                                                            ? "text-[var(--color-accent-vivid)]"
                                                            : "text-zinc-400"
                                                    )}
                                                />
                                            )}

                                            <span
                                                className={cn(
                                                    "truncate transition-all duration-200",
                                                    expanded
                                                        ? "w-auto opacity-100"
                                                        : "w-0 overflow-hidden opacity-0"
                                                )}
                                            >
                                                {label}
                                            </span>
                                        </div>

                                        {expanded && (
                                            <ChevronDown
                                                className={cn(
                                                    "h-4 w-4 shrink-0 transition-transform duration-200",
                                                    isOpen &&
                                                        "rotate-180"
                                                )}
                                            />
                                        )}
                                    </button>

                                    <div
                                        className={cn(
                                            "grid overflow-hidden transition-all duration-300",
                                            isOpen && expanded
                                                ? "grid-rows-[1fr] opacity-100"
                                                : "grid-rows-[0fr] opacity-0"
                                        )}
                                    >
                                        <div className="min-h-0 space-y-1 py-1 pl-10 pr-2">
                                            {children.map((sub) => {
                                                const isSubActive =
                                                    pathname ===
                                                        sub.href ||
                                                    pathname.startsWith(
                                                        `${sub.href}/`
                                                    );

                                                return (
                                                    <Link
                                                        key={sub.href}
                                                        href={sub.href}
                                                        className={cn(
                                                            "block truncate rounded-md px-3 py-1.5 text-sm transition-colors",
                                                            isSubActive
                                                                ? "font-semibold text-[var(--color-accent-vivid)]"
                                                                : "text-zinc-500 hover:text-black"
                                                        )}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // ── Standard Link ─────────────────
                        if (!href) return null;

                        const isActive =
                            pathname === href ||
                            (href !== "/admin" &&
                                pathname.startsWith(href));

                        return (
                            <Link
                                key={label}
                                href={href}
                                target={
                                    isExternal
                                        ? "_blank"
                                        : undefined
                                }
                                rel={
                                    isExternal
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                className={cn(
                                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-[var(--color-accent-vivid)] text-white shadow-md"
                                        : "text-zinc-600 hover:bg-zinc-100"
                                )}
                            >
                                {Icon && (
                                    <Icon
                                        className={cn(
                                            "h-5 w-5 shrink-0",
                                            isActive
                                                ? "text-white"
                                                : "text-zinc-400"
                                        )}
                                    />
                                )}

                                <span
                                    className={cn(
                                        "truncate transition-all duration-200",
                                        expanded
                                            ? "w-auto opacity-100"
                                            : "w-0 overflow-hidden opacity-0"
                                    )}
                                >
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer */}
                <div className="shrink-0 border-t border-[var(--color-border-default)] p-4">
                    <div
                        className={cn(
                            "flex items-center gap-3 rounded-xl p-2",
                            expanded
                                ? "justify-between"
                                : "justify-center"
                        )}
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-vivid)]/10 font-bold text-[var(--color-accent-vivid)]">
                            {user?.nombre
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        {expanded && (
                            <div className="flex flex-1 flex-col truncate px-1">
                                <span className="truncate text-sm font-bold text-zinc-900">
                                    {user?.nombre}
                                </span>

                                <span className="truncate text-xs text-zinc-500">
                                    {user?.email}
                                </span>
                            </div>
                        )}

                        {expanded && (
                            <AdminMenu user={user} />
                        )}
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    );
}