"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, User, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CategoryResponse } from "@/src/schemas";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import Logo from "../ui/Logo";

interface Props {
    categories: CategoryResponse[];
}

export default function ButtonShowSheetMobile({ categories }: Props) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => setOpen(false), [pathname]);

    // Filtrar solo las 4 categorías principales
    const mainCategories = categories
        .filter((c) => !c.parent)
        .slice(0, 4);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label="Abrir menú de navegación"
                    className="p-2 text-brand-gris hover:text-brand-silver hover:bg-brand-action-muted rounded-full active:scale-95 transition-all outline-none cursor-pointer"
                >
                    <Menu size={22} strokeWidth={1.8} />
                </button>
            </SheetTrigger>

            <SheetContent 
                side="left" 
                className="flex flex-col p-0 bg-background border-r border-brand-silver-border w-[300px] sm:w-[340px]"
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-brand-silver-border">
                    <SheetHeader className="text-left">
                        <SheetTitle className="flex items-center m-0 p-0">
                            <Link href="/" onClick={() => setOpen(false)} className="inline-flex">
                                <Logo 
                                    color="black" 
                                    className="h-8 w-32" 
                                />
                            </Link>
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Lista de categorías con estado activo */}
                <ScrollArea className="flex-1">
                    <div className="px-4 py-5">
                        <span className="text-[10px] font-semibold text-brand-gris uppercase tracking-[0.2em] px-3 pb-3 block select-none">
                            Dispositivos
                        </span>
                        
                        <nav className="space-y-1">
                            {mainCategories.map((category) => {
                                const categoryHref = routes.catalog({ category: category.slug });
                                const isActive = 
                                    pathname === categoryHref || 
                                    pathname.startsWith(`${categoryHref}/`);

                                return (
                                    <Link
                                        key={category._id}
                                        href={categoryHref}
                                        onClick={() => setOpen(false)}
                                        aria-current={isActive ? "page" : undefined}
                                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-sm transition-all select-none ${
                                            isActive
                                                ? "bg-brand-action-muted text-brand-charcoal font-semibold border border-brand-action/40 shadow-xs"
                                                : "text-brand-charcoal font-medium hover:bg-brand-silver-border/60 active:bg-brand-action-muted border border-transparent"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {isActive && (
                                                <span 
                                                    className="w-1.5 h-1.5 rounded-full bg-brand-action inline-block shrink-0" 
                                                    aria-hidden="true" 
                                                />
                                            )}
                                            {category.nombre}
                                        </span>
                                        <ChevronRight 
                                            size={15} 
                                            className={isActive ? "text-brand-charcoal font-bold" : "text-brand-gris"} 
                                        />
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </ScrollArea>

                {/* Footer de cuenta */}
                <div className="mt-auto border-t border-brand-silver-border p-4 bg-background">
                    <Link
                        href="/auth/login"
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                            pathname === "/auth/login"
                                ? "bg-brand-black text-white ring-2 ring-brand-action ring-offset-2"
                                : "bg-brand-charcoal text-white hover:bg-brand-black active:scale-[0.99]"
                        }`}
                    >
                        <User className="size-4 text-brand-silver" />
                        <span>Mi Cuenta</span>
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );
}