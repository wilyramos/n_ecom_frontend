// File: frontend/components/navigation/ButtonShowSheetMobile.tsx
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
import { Button } from "@/components/ui/button";

interface Props {
    categories: CategoryResponse[];
}

export default function ButtonShowSheetMobile({ categories }: Props) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => setOpen(false), [pathname]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label="Abrir menú de navegación"
                    className="p-2 text-brand-charcoal hover:bg-brand-gris/20 rounded-full active:scale-95 transition-all outline-none cursor-pointer"
                >
                    <Menu size={22} strokeWidth={1.8} />
                </button>
            </SheetTrigger>

            <SheetContent side="left" className="flex flex-col p-0 bg-white border-r border-border w-[300px] sm:w-[340px]">
                {/* Header con Logo */}
                <div className="px-4 py-3.5 border-b border-border">
                    <SheetHeader className="text-left">
                        <SheetTitle className="flex items-center">
                            <Logo />
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Categorías */}
                <ScrollArea className="flex-1">
                    <div className="px-3 py-4">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2 pb-2">
                            Catálogo
                        </h3>
                        <div className="space-y-1">
                            {categories.filter((c) => !c.parent).map((parent) => {
                                const subcategories = categories.filter(
                                    (c) => (typeof c.parent === "object" ? c.parent?._id : c.parent) === parent._id
                                );
                                const hasSubcategories = subcategories.length > 0;

                                return (
                                    <div key={parent._id} className="overflow-hidden">
                                        {hasSubcategories ? (
                                            <details className="group/details">
                                                <summary className="list-none flex items-center justify-between py-2 px-2.5 cursor-pointer hover:bg-secondary rounded-xl transition-colors select-none">
                                                    <span className="text-xs font-semibold text-foreground">{parent.nombre}</span>
                                                    <ChevronRight size={14} className="text-muted-foreground group-open/details:rotate-90 transition-transform" />
                                                </summary>
                                                <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-border ml-3 my-1">
                                                    {subcategories.map((sub) => (
                                                        <Link
                                                            key={sub._id}
                                                            href={routes.catalog({ category: sub.slug })}
                                                            onClick={() => setOpen(false)}
                                                            className="block text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg px-2 py-1.5 transition-colors"
                                                        >
                                                            {sub.nombre}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </details>
                                        ) : (
                                            <Link
                                                href={routes.catalog({ category: parent.slug })}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center justify-between py-2 px-2.5 hover:bg-secondary rounded-xl transition-colors text-xs font-semibold text-foreground"
                                            >
                                                <span>{parent.nombre}</span>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer de cuenta */}
                <div className="mt-auto border-t border-border p-4 bg-secondary/30">
                    <Button asChild className="w-full">
                        <Link href="/auth/login" className="flex items-center justify-center gap-2">
                            <User className="size-4" />
                            <span>Mi Cuenta</span>
                        </Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}