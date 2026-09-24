// File: frontend/components/profile/SidebarProfileNav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    {
        href: "/profile",
        label: "Datos personales",
        icon: User,
    },
    {
        href: "/profile/pedidos",
        label: "Mis pedidos",
        icon: Package,
    },
];

export default function SidebarProfileNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
                // Coincide exacto o si es una sub-ruta del segmento
                const isActive =
                    pathname === href || (href !== "/profile" && pathname.startsWith(href));

                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 select-none",
                            isActive
                                ? "bg-neutral-100 text-neutral-950 font-medium shadow-2xs"
                                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/80 font-normal"
                        )}
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                                size={15}
                                strokeWidth={isActive ? 2 : 1.75}
                                className={cn(
                                    "shrink-0 transition-colors",
                                    isActive ? "text-neutral-950" : "text-neutral-400 group-hover:text-neutral-700"
                                )}
                            />
                            <span className="truncate tracking-tight">{label}</span>
                        </div>

                        <ChevronRight
                            size={13}
                            className={cn(
                                "shrink-0 transition-all duration-150",
                                isActive
                                    ? "opacity-100 text-neutral-400 translate-x-0"
                                    : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-neutral-300"
                            )}
                        />
                    </Link>
                );
            })}
        </nav>
    );
}