"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, User, ChevronRight } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
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
                <button className="p-2 text-fg-primary active:scale-95 transition-transform outline-none cursor-pointer">
                    <Menu size={24} strokeWidth={1.5} />
                </button>
            </SheetTrigger>

            <SheetContent side="left" className="flex flex-col p-0 bg-surface-primary border-r border-border-default">
                <div className="px-4 pt-3 border-b border-border-default">
                    <SheetHeader className="text-left">
                        <SheetTitle>
                            <Logo />
                        </SheetTitle>
                    </SheetHeader>
                </div>

                <ScrollArea className="flex-1">
                    <div className="px-4 pb-10">
                        <h3 className="text-[10px] font-bold text-fg-secondary uppercase tracking-[0.2em] mb-3 pl-2 pt-4">CATALOGO</h3>
                        <div className="space-y-1">
                            {categories.filter(c => !c.parent).map((parent) => {
                                const subcategories = categories.filter(c => (typeof c.parent === 'object' ? c.parent?._id : c.parent) === parent._id);
                                const hasSubcategories = subcategories.length > 0;

                                return (
                                    <div key={parent._id} className="group overflow-hidden border border-transparent">
                                        {hasSubcategories ? (
                                            <details className="group/details">
                                                <summary className="list-none flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-surface-secondary rounded transition-colors">
                                                    <span className="text-sm font-semibold text-fg-primary">{parent.nombre}</span>
                                                    <ChevronRight size={14} className="text-fg-secondary group-open/details:rotate-90 transition-transform" />
                                                </summary>
                                                <div className="pl-6 pr-2 pb-2 pt-1 space-y-2 animate-in slide-in-from-top-1 duration-200">
                                                    {subcategories.map((sub) => (
                                                        <Link
                                                            key={sub._id}
                                                            href={routes.catalog({ category: sub.slug })}
                                                            onClick={() => setOpen(false)} // Cierra el sheet al hacer clic
                                                            className="block text-xs font-medium text-fg-secondary hover:text-action-primary transition-colors py-1"
                                                        >
                                                            {sub.nombre}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </details>
                                        ) : (
                                            <Link
                                                href={routes.catalog({ category: parent.slug })}
                                                onClick={() => setOpen(false)} // Cierra el sheet al hacer clic
                                                className="flex items-center justify-between py-3 px-2 hover:bg-surface-secondary rounded transition-colors"
                                            >
                                                <span className="text-sm font-semibold text-fg-primary">{parent.nombre}</span>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </ScrollArea>

                <div className="mt-auto border-t border-border-default p-4">
                    <Button asChild className="w-full bg-action-primary hover:bg-action-primary-hover text-fg-inverse rounded-md">
                        <Link href="/auth/registro" className="flex items-center justify-center gap-2">
                            <User className="h-4 w-4" />
                            Mi Cuenta
                        </Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}