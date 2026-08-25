"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HiUser, HiOutlineUser,
    HiArchiveBox, HiOutlineArchiveBox,
    HiLockClosed, HiOutlineLockClosed
} from "react-icons/hi2";
import { cn } from "@/lib/utils";

const links = [
    {
        href: '/profile',
        label: 'Datos personales',
        iconActive: HiUser,
        iconInactive: HiOutlineUser
    },
    {
        href: '/profile/pedidos',
        label: 'Mis pedidos',
        iconActive: HiArchiveBox,
        iconInactive: HiOutlineArchiveBox
    },
    {
        href: '/profile/password',
        label: 'Seguridad',
        iconActive: HiLockClosed,
        iconInactive: HiOutlineLockClosed
    },
];

export default function SidebarProfileNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-0.5">
            {links.map(({ href, label, iconActive: IconActive, iconInactive: IconInactive }) => {
                const isActive = pathname === href;

                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex items-center gap-4 px-3 py-3 text-sm transition-all duration-300 relative group ",
                            isActive
                                ? "text-[var(--color-text-primary)] font-bold "
                                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]/50"
                        )}
                    >
                        {/* Indicador Warm sutil (Dot) */}
                        {isActive && (
                            <div className="absolute left-0 w-1 h-full bg-[var(--color-accent-warm)]  animate-in fade-in slide-in-from-left-2 duration-500" />
                        )}

                        {/* Icon Switcher */}
                        <div className="flex items-center justify-center w-6">
                            {isActive ? (
                                <IconActive className="text-xl text-[var(--color-accent-warm)] animate-in zoom-in duration-300" />
                            ) : (
                                <IconInactive className="text-xl text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)] transition-colors" />
                            )}
                        </div>

                        <span className="tracking-tight">{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}