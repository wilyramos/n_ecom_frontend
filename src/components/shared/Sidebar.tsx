"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ShoppingBag,
    LayoutDashboard,
    ShoppingCart,
    History,
    DollarSign, LogOut,
    LucideIcon,
    Fingerprint
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
        (route) => !route.roles || route.roles.includes(user.rol || "")
    );

    return (
        <aside className="hidden lg:flex h-dvh w-20 flex-col items-center border-r border-sidebar-border bg-sidebar text-sidebar-foreground py-4 overflow-y-auto">
            {/* Brand Logo */}
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm bg-brand-charcoal text-[10px] font-black text-brand-silver">
                NEO
            </div>

            <div className="mb-4 h-px w-10 bg-sidebar-border" />

            {/* Navigation Flow */}
            <nav className="flex w-full flex-col items-center gap-2">
                {filteredRoutes.map((route) => {
                    const isActive = pathname.startsWith(route.href);
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "group flex h-14 w-16 flex-col items-center justify-center gap-0.5 rounded-sm transition-all",
                                isActive
                                    ? "bg-brand-action text-brand-charcoal font-black"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
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

                {/* Sección Administrativa y Externa */}
                <div className="mt-2 flex w-full flex-col items-center gap-2 border-t border-sidebar-border pt-2">
                    <Link
                        href="/staff/attendance"
                        target="_blank"
                        className="group flex h-14 w-16 flex-col items-center justify-center gap-0.5 rounded-sm text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        title="Asistencia"
                    >
                        <Fingerprint size={18} />
                        <span className="text-[8px] font-black uppercase tracking-tighter">Asist.</span>
                    </Link>

                    {user.rol === "administrador" && (
                        <Link
                            href="/admin"
                            className="group flex h-14 w-16 flex-col items-center justify-center gap-0.5 rounded-sm text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            title="Admin"
                        >
                            <LayoutDashboard size={18} />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Admin</span>
                        </Link>
                    )}

                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-14 w-16 flex-col items-center justify-center gap-0.5 rounded-sm text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        title="Tienda"
                    >
                        <ShoppingBag size={18} />
                        <span className="text-[8px] font-black uppercase tracking-tighter">Tienda</span>
                    </Link>
                </div>
            </nav>

            {/* Logout */}
            <div className="mt-auto flex w-full flex-col items-center border-t border-sidebar-border pt-2">
                <button
                    onClick={handleLogout}
                    className="group flex h-14 w-16 flex-col items-center justify-center gap-0.5 rounded-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    title="Cerrar sesión"
                >
                    <LogOut size={18} />
                    <span className="text-[8px] font-black uppercase">Salir</span>
                </button>
            </div>
        </aside>
    );
};