"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ShoppingBag, LayoutDashboard, ShoppingCart, History,
    DollarSign, BarChart3, LogOut, LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCashStore } from "@/src/store/useCashStore";
import { logoutAction } from "@/src/actions/auth-actions";
import type { User } from "@/src/schemas";

interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    roles?: string[];
}

const ROUTES: NavItem[] = [
    { label: "POS", href: "/pos", icon: ShoppingCart, roles: ["administrador", "vendedor"] },
    { label: "Caja", href: "/cash-shift", icon: DollarSign, roles: ["administrador", "vendedor"] },
    { label: "Ventas", href: "/sales", icon: History, roles: ["administrador", "vendedor"] },
    { label: "Reportes", href: "/reports", icon: BarChart3, roles: ["administrador"] },
];

export const Sidebar = ({ user }: { user: User }) => {
    const pathname = usePathname();
    const { isOpen } = useCashStore();

    const handleLogout = async () => {
        if (isOpen) {
            const confirm = window.confirm("La caja sigue abierta. ¿Desea cerrar sesión?");
            if (!confirm) return;
        }
        await logoutAction();
    };

    const filteredRoutes = ROUTES.filter(
        route => !route.roles || route.roles.includes(user.rol || "")
    );

    return (
        // Usamos h-dvh para asegurar que no se desborde en móviles y overflow-y-auto para scroll interno
        <aside className="hidden lg:flex h-dvh w-20 flex-col items-center border-r py-4 bg-[var(--color-surface-inverse)] border-[var(--color-border-default)] overflow-y-auto">

            {/* Brand Logo */}
            <div className="mb-4 flex h-10 w-10 items-center justify-center font-black text-white text-[10px]">
                NEO
            </div>

            <div className="mb-4 w-10 h-px bg-[var(--color-border-default)]" />

            {/* Navigation Flow: flex-1 permite que el scroll ocurra aquí si es necesario */}
            <nav className="flex flex-col gap-2 w-full items-center">
                {filteredRoutes.map((route) => {
                    const isActive = pathname.startsWith(route.href);
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "group flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-sm transition-all",
                                isActive
                                    ? "bg-[var(--color-accent-vivid)] text-white"
                                    : "text-[var(--color-fg-muted)] hover:bg-[var(--color-accent-vivid)]/10 hover:text-[var(--color-accent-vivid)]"
                            )}
                            title={route.label}
                        >
                            <route.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[8px] font-black uppercase tracking-tighter leading-none">
                                {route.label}
                            </span>
                        </Link>
                    );
                })}

                {/* --- SECCIÓN ADMINISTRATIVA Y EXTERNA --- */}
                <div className="flex flex-col gap-2 w-full items-center border-t border-[var(--color-border-default)] pt-2 mt-2">
                    {user.rol === "administrador" && (
                        <Link href="/admin" className="group flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-sm text-[var(--color-fg-muted)] hover:bg-[var(--color-accent-vivid)]/10 hover:text-[var(--color-accent-vivid)] transition-all">
                            <LayoutDashboard size={18} />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Admin</span>
                        </Link>
                    )}

                    <Link href="/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-sm text-[var(--color-fg-muted)] hover:bg-[var(--color-accent-vivid)]/10 hover:text-[var(--color-accent-vivid)] transition-all">
                        <ShoppingBag size={18} />
                        <span className="text-[8px] font-black uppercase tracking-tighter">Tienda</span>
                    </Link>
                </div>
            </nav>

            {/* Logout */}
            <div className="mt-auto w-full flex flex-col items-center border-t border-[var(--color-border-default)] pt-2">
                <button
                    onClick={handleLogout}
                    className="group flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-sm text-[var(--color-fg-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                    title="Cerrar sesión"
                >
                    <LogOut size={18} />
                    <span className="text-[8px] font-black uppercase">Salir</span>
                </button>
            </div>
        </aside>
    );
};