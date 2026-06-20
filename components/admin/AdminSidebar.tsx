"use client";

import type { ElementType } from "react";
import { User } from "@/src/schemas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AdminMenu from "./AdminMenu";
import Logo from "../ui/Logo";
import {
    LayoutDashboard, ShoppingBag, Boxes, Tags, Building2, GitFork,
    FileText, ShieldAlert, Images, Layers, Megaphone, Users,
    MonitorSmartphone, Eye, ChevronDown, ChevronRight, Fingerprint,
} from "lucide-react";

type NavChild = { href: string; label: string };
type NavLink = { href?: string; icon?: ElementType; label: string; children?: NavChild[]; isExternal?: boolean };
type NavGroup = { groupLabel: string; items: NavLink[] };
type Props = { user: User };

const navGroups: NavGroup[] = [
    { groupLabel: "General", items: [{ href: "/admin", icon: LayoutDashboard, label: "Dashboard" }] },
    {
        groupLabel: "Ventas",
        items: [
            { href: "/admin/orders", icon: ShoppingBag, label: "Órdenes" },
            { href: "/admin/claims", icon: ShieldAlert, label: "Reclamaciones" },
            {
                icon: FileText,
                label: "Reportes",
                children: [
                    { href: "/admin/reports", label: "Vista General" },
                    { href: "/admin/reports/sales", label: "Ventas" },
                    { href: "/admin/reports/orders", label: "Órdenes" },
                ],
            },
        ],
    },
    {
        groupLabel: "Catálogo",
        items: [
            { href: "/admin/products", icon: Boxes, label: "Productos" },
            { href: "/admin/products/category", icon: Tags, label: "Categorías" },
            { href: "/admin/brands", icon: Building2, label: "Marcas" },
            { href: "/admin/lines", icon: GitFork, label: "Líneas" },
        ],
    },
    {
        groupLabel: "Contenido",
        items: [
            { href: "/admin/slider", icon: Images, label: "Slider Banners" },
            { href: "/admin/sections", icon: Layers, label: "Secciones" },
            { href: "/admin/advertisements", icon: Megaphone, label: "Avisos Publicitarios" },
            { href: "/admin/pages", icon: FileText, label: "Páginas" },
        ],
    },
    {
        groupLabel: "Administración",
        items: [
            { href: "/admin/users", icon: Users, label: "Usuarios" },
            { href: "/admin/attendance", icon: FileText, label: "Asistencias" },
        ],
    },
    {
        groupLabel: "Accesos",
        items: [
            { href: "/pos", icon: MonitorSmartphone, label: "Punto de Venta", isExternal: true },
            { href: "/", icon: Eye, label: "Ver Tienda", isExternal: true },
        ],
    },
];

export default function AdminSidebar({ user }: Props) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) => {
        if (!expanded) {
            setExpanded(true);
            setTimeout(() => setOpenMenus(p => ({ ...p, [label]: true })), 100);
            return;
        }
        setOpenMenus(p => ({ ...p, [label]: !p[label] }));
    };

    return (
        <aside className={cn("relative hidden h-screen flex-col bg-white transition-all duration-200 md:flex", expanded ? "w-56" : "w-16")}>
            {/* Toggle */}
            <button
                onClick={() => {
                    setExpanded(c => !c);
                    setOpenMenus({});
                }}
                className="absolute -right-3 top-7 z-50 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-white text-zinc-400 transition-colors hover:text-[var(--color-accent-vivid)]"
            >
                <ChevronRight className={cn("h-3 w-3 transition-transform duration-200", expanded && "rotate-180")} />
            </button>

            {/* Logo */}
            <div className={cn("flex items-center h-12 px-3", expanded ? "justify-start" : "justify-center")}>
                <Logo />
            </div>

            {/* Nav */}
            <nav className="custom-scrollbar flex-1 overflow-y-auto px-1.5 py-1.5">
                {navGroups.map((group) => (
                    <div key={group.groupLabel} className="mb-3">
                        {expanded && <p className="px-2.5 mb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">{group.groupLabel}</p>}
                        <div className="space-y-0">
                            {group.items.map((item) => {
                                const { href, icon: Icon, label, children, isExternal } = item;

                                if (children) {
                                    const isOpen = !!openMenus[label];
                                    const isChildActive = children.some(c => pathname === c.href || pathname.startsWith(`${c.href}/`));
                                    return (
                                        <div key={label}>
                                            <button
                                                onClick={() => toggleMenu(label)}
                                                className={cn(
                                                    "w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs rounded transition-colors",
                                                    isChildActive
                                                        ? "bg-[var(--color-accent-vivid)]/10 text-[var(--color-accent-vivid)] font-medium"
                                                        : "text-zinc-600 hover:bg-zinc-50"
                                                )}
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    {Icon && <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isChildActive ? "text-[var(--color-accent-vivid)]" : "text-zinc-400")} />}
                                                    {expanded && <span className="truncate text-xs">{label}</span>}
                                                </div>
                                                {expanded && <ChevronDown className={cn("w-3 h-3 text-zinc-400 flex-shrink-0 transition-transform", isOpen && "rotate-180")} />}
                                            </button>
                                            {expanded && (
                                                <div className={cn("grid overflow-hidden transition-all", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                                                    <div className="min-h-0 mt-0.5 ml-0.5 pl-6 py-0.5 space-y-0 border-l border-zinc-200">
                                                        {children.map(sub => (
                                                            <Link
                                                                key={sub.href}
                                                                href={sub.href}
                                                                className={cn(
                                                                    "block text-[11px] px-2 py-1 rounded transition-colors",
                                                                    pathname === sub.href
                                                                        ? "font-semibold text-[var(--color-accent-vivid)] bg-[var(--color-accent-vivid)]/5"
                                                                        : "text-zinc-600 hover:text-zinc-900"
                                                                )}
                                                            >
                                                                {sub.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                const isActive = href && (pathname === href || (href !== "/admin" && pathname.startsWith(href)));
                                return (
                                    <Link
                                        key={label}
                                        href={href!}
                                        target={isExternal ? "_blank" : undefined}
                                        className={cn(
                                            "flex items-center gap-2 px-2.5 py-1.5 text-xs rounded transition-colors",
                                            isActive
                                                ? "bg-[var(--color-secondary)]/50 text-[var(--color-primary)] font-medium"
                                                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                        )}
                                    >
                                        {Icon && <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-[var(--color-primary)]" : "text-zinc-400")} />}
                                        {expanded && <span className="truncate text-xs">{label}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-[var(--color-border-default)] px-1.5 py-2">
                {expanded && (
                    <Link
                        href="/staff/attendance"
                        target="_blank"
                        className="flex items-center gap-2 px-2.5 py-1.5 mb-2 text-[11px] font-medium text-[var(--color-accent-vivid)] bg-[var(--color-accent-vivid)]/10 rounded border border-[var(--color-accent-vivid)]/20 hover:bg-[var(--color-accent-vivid)]/20 transition-colors"
                    >
                        <Fingerprint className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="uppercase tracking-wider">Asistencia</span>
                    </Link>
                )}
                <div className={cn("flex items-center", expanded ? "gap-1.5 justify-between" : "justify-center")}>
                    <div className="flex items-center justify-center w-7 h-7 rounded bg-[var(--color-accent-vivid)]/10 text-[10px] font-semibold text-[var(--color-accent-vivid)] flex-shrink-0">
                        {user?.nombre?.charAt(0).toUpperCase()}
                    </div>
                    {expanded && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-zinc-900 truncate">{user?.nombre}</p>
                                <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                            </div>
                            <AdminMenu user={user} />
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}