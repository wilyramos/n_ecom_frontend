"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebarcs() {
    const pathname = usePathname();

    const navItems = [
        { name: "Centro de ayuda", href: "/hc" },
        { name: "Contacto y soporte", href: "/hc/contacto-y-soporte" },
        { name: "Proceso de compra", href: "/hc/proceso-de-compra" },
        { name: "Garantías y devoluciones", href: "/hc/garantias-y-devoluciones" },
        { name: "Preguntas frecuentes", href: "/hc/preguntas-frecuentes" },
        { name: "Políticas de privacidad", href: "/hc/politicas-de-privacidad" },
    ];

    return (
        <>
            {/* 📌 Desktop sidebar: Lista simple, sin iconos, sin bordes */}
            <aside className="sticky top-24 hidden md:flex md:flex-col w-72 h-fit">
                <nav className="flex-1 space-y-8">
                    <div>
                        <h2 className="px-2 mb-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            Soporte
                        </h2>
                        <div className="space-y-0.5">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`block px-2 py-2 text-sm transition-colors ${
                                            isActive 
                                                ? "font-bold text-black" 
                                                : "text-gray-600 hover:text-black"
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <Link
                            href="/terminos-y-condiciones"
                            className="block px-2 py-2 text-sm font-bold text-gray-600 hover:text-black"
                        >
                            Información Legal
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* 📌 Mobile bottom nav: Texto simple */}
            <aside className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
                <nav className="flex justify-around items-center h-16">
                    {navItems.slice(0, 4).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-[10px] font-bold uppercase tracking-wide ${
                                    isActive ? "text-black" : "text-gray-400"
                                }`}
                            >
                                {item.name.split(" ")[0]}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}