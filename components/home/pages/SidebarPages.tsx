"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    RiServiceLine, RiServiceFill,
    RiFileShieldLine, RiFileShieldFill,
    RiExternalLinkLine
} from "react-icons/ri";
import { MdCookie, MdOutlineCookie } from "react-icons/md";

export default function SidebarPages() {
    const pathname = usePathname();

    const legalNav = [
        {
            name: "Términos y Condiciones",
            href: "/terminos-y-condiciones",
            icon: RiServiceLine,
            iconFill: RiServiceFill
        },
        {
            name: "Política de privacidad",
            href: "/hc/politicas-de-privacidad",
            icon: RiFileShieldLine,
            iconFill: RiFileShieldFill
        },
        {
            name: "Política de cookies",
            href: "/cookies",
            icon: MdOutlineCookie,
            iconFill: MdCookie
        },
    ];

    return (
        <>
            {/* 📌 Desktop Sidebar */}
            <aside className="sticky top-24 hidden md:flex md:flex-col w-72 h-fit">
                <nav className="flex-1 pr-8 border-r border-[var(--store-border)] space-y-8">

                    {/* Sección Principal: Información Legal */}
                    <div>
                        <h2 className="px-4 mb-5 text-[11px] uppercase tracking-[0.25em] font-bold text-[var(--store-text)]">
                            Información Legal
                        </h2>
                        <div className="space-y-1.5">
                            {legalNav.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = isActive ? item.iconFill : item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-300 group
                                            ${isActive
                                                ? "font-semibold text-[var(--store-primary)] bg-[var(--store-primary)]/5"
                                                : "text-[var(--store-text-muted)] hover:bg-[var(--store-surface-hover)] hover:text-[var(--store-text)]"}
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-[var(--store-primary)]" : "opacity-70"}`} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sección: Redirección al Centro de Ayuda (Versión Ultra-Simple) */}
                    <div className="pt-2">
                        <Link
                            href="/hc"
                            className="flex items-center justify-between px-5 py-4 rounded-2xl bg-[var(--store-bg)] border border-[var(--store-border)] group hover:border-[var(--store-primary)] transition-all duration-300"
                        >
                            <span className="text-xs font-bold text-[var(--store-text)]">
                                Centro de ayuda
                            </span>
                            <RiExternalLinkLine className="w-4 h-4 text-[var(--store-text-muted)] group-hover:text-[var(--store-primary)] group-hover:rotate-12 transition-all" />
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* 📌 Mobile Bottom Nav */}
            <aside className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--store-surface)]/80 backdrop-blur-xl border-t border-[var(--store-border)] z-50 pb-safe">
                <nav className="flex justify-around items-center h-16 px-4">
                    {legalNav.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = isActive ? item.iconFill : item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all
                                    ${isActive ? "text-[var(--store-primary)]" : "text-[var(--store-text-muted)]"}
                                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
                                <span className="text-[9px] font-bold tracking-tight">
                                    {item.name.split(" ")[0]}
                                </span>
                            </Link>
                        );
                    })}

                    <Link
                        href="/hc"
                        className="flex flex-col items-center justify-center gap-1 w-full h-full text-[var(--store-text-muted)] active:text-[var(--store-primary)]"
                    >
                        <RiExternalLinkLine className="w-5 h-5" />
                        <span className="text-[9px] font-bold tracking-tight">Ayuda</span>
                    </Link>
                </nav>
            </aside>
        </>
    );
}