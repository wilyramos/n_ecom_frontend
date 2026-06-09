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
    LayoutDashboard, ShoppingBag, Boxes, Tags, Building2, GitFork,
    FileText, ShieldAlert, Images, Layers, Megaphone, Users,
    MonitorSmartphone, Eye, ChevronDown, ChevronRight,
} from "lucide-react";

// ── Tipos ────────────────────────────────────────────────────────────────────

type NavChild = { href: string; label: string; };
type NavLink = { href?: string; icon?: ElementType; label: string; children?: NavChild[]; isExternal?: boolean; };
type NavGroup = { groupLabel: string; items: NavLink[]; };
type Props = { user: User; };

// ── Data ─────────────────────────────────────────────────────────────────────

const navGroups: NavGroup[] = [
    { groupLabel: "General", items: [{ href: "/admin", icon: LayoutDashboard, label: "Dashboard" }] },
    {
        groupLabel: "Ventas",
        items: [
            { href: "/admin/orders", icon: ShoppingBag, label: "Órdenes" },
            { href: "/admin/claims", icon: ShieldAlert, label: "Reclamaciones" },
            {
                icon: FileText, label: "Reportes",
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
        ],
    },
    { groupLabel: "Administración", items: [{ href: "/admin/users", icon: Users, label: "Usuarios" }] },
    {
        groupLabel: "Accesos",
        items: [
            { href: "/pos", icon: MonitorSmartphone, label: "Punto de Venta", isExternal: true },
            { href: "/", icon: Eye, label: "Ver Tienda", isExternal: true },
        ],
    },
];

// ── Componente ───────────────────────────────────────────────────────────────

export default function AdminSidebar({ user }: Props) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ Reportes: true });

    const toggleMenu = (label: string) => {
        if (!expanded) { setExpanded(true); setTimeout(() => setOpenMenus(p => ({ ...p, [label]: true })), 150); return; }
        setOpenMenus(p => ({ ...p, [label]: !p[label] }));
    };

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    "relative hidden h-screen flex-col bg-white shadow-sm transition-all duration-300 md:flex", // <-- Eliminé "border-r border-[var(--color-border-default)]"
                    expanded ? "w-60" : "w-[72px]"
                )}
            >
                <button
                    onClick={() => { setExpanded(c => !c); setOpenMenus({}); }}
                    className="absolute -right-3 top-9 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border-default)] bg-white text-zinc-500 shadow-sm hover:border-[var(--color-accent-vivid)]"
                >
                    <ChevronRight className={cn("h-3 w-3 transition-transform duration-300", expanded && "rotate-180")} />
                </button>

                <div className={cn("flex h-16 items-center px-4", expanded ? "justify-start" : "justify-center")}>
                    <Logo />
                </div>

                <nav className="custom-scrollbar flex-1 space-y-3 overflow-y-auto px-2 py-2">
                    {navGroups.map((group) => (
                        <div key={group.groupLabel}>
                            {expanded && (
                                <p className="mb-1 px-3 text-[9px] font-bold text-zinc-400 select-none">
                                    {group.groupLabel}
                                </p>
                            )}
                            <div className="space-y-0">
                                {group.items.map((item) => {
                                    const { href, icon: Icon, label, children, isExternal } = item;

                                    if (children) {
                                        const isOpen = !!openMenus[label];
                                        const isChildActive = children.some(c => pathname === c.href || pathname.startsWith(`${c.href}/`));

                                        return (
                                            <div key={label}>
                                                <button onClick={() => toggleMenu(label)} className={cn("flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm font-medium transition-all", isChildActive ? "bg-[var(--color-accent-vivid)]/10 text-[var(--color-accent-vivid)]" : "text-zinc-600 hover:bg-zinc-100")}>
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        {Icon && <Icon className={cn("h-4 w-4 shrink-0", isChildActive ? "text-[var(--color-accent-vivid)]" : "text-zinc-400")} />}
                                                        {expanded && <span className="truncate">{label}</span>}
                                                    </div>
                                                    {expanded && <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")} />}
                                                </button>
                                                <div className={cn("grid overflow-hidden transition-all", isOpen && expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                                                    <div className="min-h-0 pl-8 py-0.5 space-y-0.5">
                                                        {children.map(sub => (
                                                            <Link key={sub.href} href={sub.href} className={cn("block text-xs py-1.5", (pathname === sub.href) ? " text-[var(--color-accent-vivid)]" : "text-zinc-500 hover:text-black")}>
                                                                {sub.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    const isActive = href && (pathname === href || (href !== "/admin" && pathname.startsWith(href)));
                                    return (
                                        <Link key={label} href={href!} target={isExternal ? "_blank" : undefined} className={cn("flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium transition-all", isActive ? "bg-[var(--color-accent-vivid)] text-white" : "text-zinc-600 hover:bg-zinc-100")}>
                                            {Icon && <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-zinc-400")} />}
                                            {expanded && <span className="truncate">{label}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="shrink-0 border-t border-[var(--color-border-default)] p-3">
                    <div className={cn("flex items-center gap-2", expanded ? "justify-between" : "justify-center")}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-vivid)]/10 text-xs font-bold text-[var(--color-accent-vivid)]">
                            {user?.nombre?.charAt(0).toUpperCase()}
                        </div>
                        {expanded && (
                            <div className="flex flex-1 flex-col truncate px-2">
                                <span className="truncate text-xs font-bold">{user?.nombre}</span>
                                <span className="truncate text-[10px] text-zinc-500">{user?.email}</span>
                            </div>
                        )}
                        {expanded && <AdminMenu user={user} />}
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    );
}