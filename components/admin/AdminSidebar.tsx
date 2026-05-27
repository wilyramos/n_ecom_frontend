
//File: 
"use client";

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
    Package2,
    Users2,
    ReceiptText,
    BadgeDollarSign,
    Building2,
    GitBranch,
    Shapes,
    BarChart3,
    ShieldCheck,
    Store,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

type NavLink = {
    href?: string;
    icon: React.ElementType;
    label: string;
    children?: { href: string; label: string }[];
    isExternal?: boolean;
};

type Props = { user: User };

const links: NavLink[] = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: Package2, label: "Productos" },
    { href: "/admin/clients", icon: Users2, label: "Clientes" },
    { href: "/admin/orders", icon: ReceiptText, label: "Órdenes" },
    { href: "/admin/slider", icon: BadgeDollarSign, label: "Slider" },
    { href: "/admin/brands", icon: Building2, label: "Marcas" },
    { href: "/admin/lines", icon: GitBranch, label: "Líneas" },
    { href: "/admin/products/category", icon: Shapes, label: "Categorías" },
    {
        icon: BarChart3,
        label: "Reportes",
        children: [
            { href: "/admin/reports", label: "Vista General" },
            { href: "/admin/reports/sales", label: "Ventas" },
            { href: "/admin/reports/orders", label: "Órdenes" },
        ],
    },
    {
        icon: ShieldCheck,
        label: "Usuarios",
        children: [
            { href: "/admin/users", label: "Lista de usuarios" },
            { href: "/admin/users/roles", label: "Roles y permisos" },
        ],
    },
    { href: "/pos", icon: Store, label: "Punto de Venta", isExternal: true },
    { href: "/", icon: Store, label: "Ver Tienda", isExternal: true },
];

export default function AdminSidebar({ user }: Props) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) => {
        if (!expanded) {
            setExpanded(true);
            setTimeout(() => setOpenMenus((p) => ({ ...p, [label]: true })), 150);
        } else setOpenMenus((p) => ({ ...p, [label]: !p[label] }));
    };

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    "hidden md:flex relative h-screen flex-col border-r border-[var(--color-border-default)] bg-white transition-all duration-300 shadow-sm",
                    expanded ? "w-64" : "w-[80px]"
                )}
            >
                {/* Botón Colapsar */}
                <button
                    onClick={() => {
                        setExpanded((c) => !c);
                        setOpenMenus({});
                    }}
                    className="absolute -right-3 top-9 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-white text-zinc-500 hover:text-[var(--color-accent-vivid)] hover:border-[var(--color-accent-vivid)] shadow-sm transition-colors"
                >
                    <ChevronRight className={cn("h-3 w-3 transition-transform duration-300", expanded && "rotate-180")} />
                </button>

                {/* Logo Area */}
                <div className={cn("flex h-20 items-center px-6 transition-all", expanded ? "justify-start" : "justify-center")}>
                    <Logo />
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {links.map((item) => {
                        const { href, icon: Icon, label, children, isExternal } = item;

                        if (children) {
                            const isOpen = openMenus[label];
                            const isChildActive = children.some((c) => c.href === pathname);

                            return (
                                <div key={label} className="space-y-1">
                                    <button
                                        onClick={() => toggleMenu(label)}
                                        className={cn(
                                            "group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all",
                                            isChildActive ? "bg-[var(--color-accent-vivid)]/10 text-[var(--color-accent-vivid)]" : "text-zinc-600 hover:bg-zinc-100"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={cn("h-5 w-5", isChildActive ? "text-[var(--color-accent-vivid)]" : "text-zinc-400")} />
                                            <span className={cn("transition-opacity duration-200", expanded ? "opacity-100" : "opacity-0 hidden")}>{label}</span>
                                        </div>
                                        {expanded && <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />}
                                    </button>
                                    
                                    <div className={cn("grid overflow-hidden transition-all duration-300", isOpen && expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                                        <div className="min-h-0 pl-10 pr-2 py-1 space-y-1">
                                            {children.map((sub) => (
                                                <Link key={sub.href} href={sub.href} className={cn("block rounded-md px-3 py-1.5 text-sm transition-colors", pathname === sub.href ? "text-[var(--color-accent-vivid)] font-semibold" : "text-zinc-500 hover:text-black")}>
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        const isActive = href && pathname === href;
                        return (
                            <Link
                                key={label}
                                href={href!}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className={cn(
                                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                                    isActive ? "bg-[var(--color-accent-vivid)] text-white shadow-md" : "text-zinc-600 hover:bg-zinc-100"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-zinc-400 group-hover:text-[var(--color-accent-vivid)]")} />
                                <span className={cn("transition-opacity duration-200", expanded ? "opacity-100" : "opacity-0 hidden")}>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Usuario */}
                <div className="border-t border-[var(--color-border-default)] p-4">
                    <div className={cn("flex items-center gap-3 rounded-xl p-2", expanded ? "justify-between" : "justify-center")}>
                        <div className="h-9 w-9 rounded-full bg-[var(--color-accent-vivid)]/10 flex items-center justify-center font-bold text-[var(--color-accent-vivid)]">
                            {user?.nombre?.charAt(0).toUpperCase()}
                        </div>
                        {expanded && (
                            <div className="flex flex-col truncate">
                                <span className="text-sm font-bold text-zinc-900">{user?.nombre}</span>
                                <span className="text-xs text-zinc-500">{user?.email}</span>
                            </div>
                        )}
                        {expanded && <AdminMenu user={user} />}
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    );
}