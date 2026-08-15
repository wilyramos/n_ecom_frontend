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
    LayoutDashboard,
    ShoppingBag,
    ReceiptText,
    Boxes,
    Tags,
    Building2,
    GitFork,
    FileText,
    ShieldAlert,
    Images,
    Layers,
    Megaphone,
    Users,
    MonitorSmartphone,
    Eye,
    ChevronDown,
    ChevronLeft,
    Fingerprint,
    ExternalLink,
    TrendingUp,
    FolderKanban,
    Settings2,
    Globe,
} from "lucide-react";

type NavChild = { href: string; label: string; icon?: ElementType; isExternal?: boolean };
type NavLink = {
    href?: string;
    icon?: ElementType;
    label: string;
    children?: NavChild[];
    isExternal?: boolean;
};
type NavGroup = { groupLabel: string; items: NavLink[] };
type Props = { user: User };

const navGroups: NavGroup[] = [
    {
        groupLabel: "Principal",
        items: [
            { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/admin/orders", icon: ShoppingBag, label: "Órdenes" },
            { href: "/admin/tickets-v2", icon: ReceiptText, label: "Comprobantes" },
            { href: "/admin/products", icon: Boxes, label: "Productos" },
        ],
    },
    {
        groupLabel: "Gestión",
        items: [
            {
                icon: Tags,
                label: "Clasificación",
                children: [
                    { href: "/admin/products/category", label: "Categorías", icon: Tags },
                    { href: "/admin/brands", label: "Marcas", icon: Building2 },
                    { href: "/admin/lines", label: "Líneas", icon: GitFork },
                ],
            },
            {
                icon: TrendingUp,
                label: "Ventas & Métricas",
                children: [
                    { href: "/admin/claims", label: "Reclamaciones", icon: ShieldAlert },
                    { href: "/admin/reports", label: "Reporte General", icon: TrendingUp },
                    { href: "/admin/reports/sales", label: "Reporte Ventas", icon: TrendingUp },
                    { href: "/admin/reports/orders", label: "Reporte Pedidos", icon: TrendingUp },
                ],
            },
            {
                icon: FolderKanban,
                label: "Contenido Web",
                children: [
                    { href: "/admin/slider", label: "Sliders & Banners", icon: Images },
                    { href: "/admin/sections", label: "Secciones", icon: Layers },
                    { href: "/admin/advertisements", label: "Avisos Publicitarios", icon: Megaphone },
                    { href: "/admin/pages", label: "Páginas Estáticas", icon: FileText },
                ],
            },
            {
                icon: Settings2,
                label: "Configuración",
                children: [
                    { href: "/admin/users", label: "Usuarios", icon: Users },
                    { href: "/admin/attendance", label: "Asistencias", icon: FileText },
                ],
            },
            {
                icon: Globe,
                label: "Accesos Directos",
                children: [
                    { href: "/pos", label: "Punto de Venta", icon: MonitorSmartphone, isExternal: true },
                    { href: "/", label: "Ver Tienda Online", icon: Eye, isExternal: true },
                ],
            },
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
            setTimeout(() => setOpenMenus((p) => ({ ...p, [label]: true })), 120);
            return;
        }
        setOpenMenus((p) => ({ ...p, [label]: !p[label] }));
    };

    return (
        <aside
            className={cn(
                "relative hidden h-screen select-none flex-col border-r border-zinc-200/80 bg-white shadow-xs transition-all duration-300 ease-in-out md:flex",
                expanded ? "w-60" : "w-[68px]"
            )}
        >
            {/* Toggle Button */}
            <button
                type="button"
                onClick={() => {
                    setExpanded((c) => !c);
                    setOpenMenus({});
                }}
                className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-xs transition-all hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none cursor-pointer"
                aria-label={expanded ? "Contraer menú" : "Expandir menú"}
            >
                <ChevronLeft
                    className={cn("h-3.5 w-3.5 transition-transform duration-300", !expanded && "rotate-180")}
                />
            </button>

            {/* Header / Brand Logo */}
            <div className="flex h-14 items-center border-b border-zinc-100 px-3.5">
                <div className={cn("flex w-full items-center", expanded ? "justify-start" : "justify-center")}>
                    <Logo />
                </div>
            </div>

            {/* Navigation List */}
            <nav className="custom-scrollbar flex-1 overflow-y-auto px-2.5 py-3 space-y-3.5">
                {navGroups.map((group) => (
                    <div key={group.groupLabel} className="space-y-1">
                        {expanded && (
                            <p className="px-2.5 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                                {group.groupLabel}
                            </p>
                        )}

                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const { href, icon: Icon, label, children, isExternal } = item;

                                if (children) {
                                    const isChildActive = children.some(
                                        (c) => pathname === c.href || (c.href !== "/admin" && pathname.startsWith(`${c.href}/`))
                                    );
                                    const isOpen = openMenus[label] !== undefined ? openMenus[label] : isChildActive;

                                    return (
                                        <div key={label} className="space-y-0.5">
                                            <button
                                                type="button"
                                                onClick={() => toggleMenu(label)}
                                                title={!expanded ? label : undefined}
                                                className={cn(
                                                    "group flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150 cursor-pointer",
                                                    isChildActive
                                                        ? "bg-zinc-100 text-zinc-900 font-semibold"
                                                        : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900"
                                                )}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    {Icon && (
                                                        <Icon
                                                            className={cn(
                                                                "h-4 w-4 shrink-0 transition-colors",
                                                                isChildActive
                                                                    ? "text-zinc-900"
                                                                    : "text-zinc-400 group-hover:text-zinc-700"
                                                            )}
                                                        />
                                                    )}
                                                    {expanded && <span className="truncate">{label}</span>}
                                                </div>
                                                {expanded && (
                                                    <ChevronDown
                                                        className={cn(
                                                            "h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform duration-200",
                                                            isOpen && "rotate-180"
                                                        )}
                                                    />
                                                )}
                                            </button>

                                            {expanded && (
                                                <div
                                                    className={cn(
                                                        "grid overflow-hidden transition-all duration-200 ease-in-out",
                                                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                                    )}
                                                >
                                                    <div className="min-h-0 ml-4 space-y-0.5 border-l border-zinc-200 py-1 pl-3">
                                                        {children.map((sub) => {
                                                            const isSubActive =
                                                                pathname === sub.href ||
                                                                (sub.href !== "/admin" && pathname.startsWith(`${sub.href}/`));
                                                            const SubIcon = sub.icon;

                                                            return (
                                                                <Link
                                                                    key={sub.href}
                                                                    href={sub.href}
                                                                    target={sub.isExternal ? "_blank" : undefined}
                                                                    className={cn(
                                                                        "flex items-center justify-between rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                                                                        isSubActive
                                                                            ? "bg-zinc-900 text-white font-semibold"
                                                                            : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"
                                                                    )}
                                                                >
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        {SubIcon && (
                                                                            <SubIcon
                                                                                className={cn(
                                                                                    "h-3 w-3 shrink-0",
                                                                                    isSubActive ? "text-white" : "text-zinc-400"
                                                                                )}
                                                                            />
                                                                        )}
                                                                        <span className="truncate">{sub.label}</span>
                                                                    </div>
                                                                    {sub.isExternal && (
                                                                        <ExternalLink className="h-2.5 w-2.5 opacity-60" />
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
                                        href={href!}
                                        target={isExternal ? "_blank" : undefined}
                                        title={!expanded ? label : undefined}
                                        className={cn(
                                            "group flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150",
                                            isActive
                                                ? "bg-zinc-900 text-white shadow-xs"
                                                : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900"
                                        )}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {Icon && (
                                                <Icon
                                                    className={cn(
                                                        "h-4 w-4 shrink-0 transition-colors",
                                                        isActive
                                                            ? "text-white"
                                                            : "text-zinc-400 group-hover:text-zinc-700"
                                                    )}
                                                />
                                            )}
                                            {expanded && <span className="truncate">{label}</span>}
                                        </div>

                                        {expanded && isExternal && (
                                            <ExternalLink className="h-3 w-3 text-zinc-400 group-hover:text-zinc-600" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Attendance & Profile Footer */}
            <div className="border-t border-zinc-100 p-2.5 space-y-2 bg-zinc-50/50">
                {expanded && (
                    <Link
                        href="/staff/attendance"
                        target="_blank"
                        className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs transition-all hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300"
                    >
                        <Fingerprint className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Marcar Asistencia</span>
                    </Link>
                )}

                <div
                    className={cn(
                        "flex items-center rounded-lg p-1 transition-colors",
                        expanded ? "gap-2 justify-between" : "justify-center"
                    )}
                >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-bold text-white shadow-2xs">
                        {user?.nombre?.charAt(0).toUpperCase() || "A"}
                    </div>

                    {expanded && (
                        <>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-zinc-900 leading-tight">
                                    {user?.nombre || "Administrador"}
                                </p>
                                <p className="truncate text-[10px] text-zinc-400 leading-tight">
                                    {user?.email || "admin@sistema.pe"}
                                </p>
                            </div>
                            <AdminMenu user={user} />
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}