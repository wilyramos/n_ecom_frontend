// frontend/components/store/ButtonShowSheetMobile.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, User, ChevronRight, Zap, Tag, LayoutGrid } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import type { CategoryResponse } from "@/src/schemas";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import Logo from "../ui/Logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
    categories: CategoryResponse[];
}

export default function ButtonShowSheetMobile({ categories }: Props) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => setOpen(false), [pathname]);

    const mainLinks = [
        { href: "/novedades", label: "Novedades", icon: <Zap size={18} />, description: "Lo último" },
        { href: "/ofertas", label: "Ofertas", icon: <Tag size={18} />, description: "Precios especiales" },
        { href: routes.catalog(), label: "Catálogo", icon: <LayoutGrid size={18} />, description: "Todo" },
    ];

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
                    <div className="grid grid-cols-1 gap-1 mb-6">
                        {mainLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 transition-all duration-200 border-b border-transparent",
                                        isActive
                                            ? "bg-surface-inverse text-fg-inverse font-bold"
                                            : "hover:bg-surface-secondary text-fg-primary"
                                    )}
                                >
                                    <div className="shrink-0">{link.icon}</div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase font-bold tracking-wider leading-none">{link.label}</span>
                                        <span className={cn("text-[10px] mt-1", isActive ? "text-brand-silver" : "text-fg-secondary")}>
                                            {link.description}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="px-4 pb-10">
                        <h3 className="text-[10px] font-bold text-fg-secondary uppercase tracking-[0.2em] mb-3 pl-2">Explorar</h3>
                        <div className="space-y-1">
                            {categories.filter(c => !c.parent).map((parent) => (
                                <details key={parent._id} className="group overflow-hidden border border-transparent transition-all">
                                    <summary className="list-none flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-surface-secondary rounded transition-colors">
                                        <span className="text-sm font-semibold text-fg-primary">{parent.nombre}</span>
                                        <ChevronRight size={14} className="text-fg-secondary group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <div className="pl-6 pr-2 pb-2 pt-1 space-y-2 animate-in slide-in-from-top-1 duration-200">
                                        {categories.filter(c => (typeof c.parent === 'object' ? c.parent?._id : c.parent) === parent._id).map((sub) => (
                                            <Link
                                                key={sub._id}
                                                href={routes.catalog({ category: sub.slug })}
                                                className="block text-xs font-medium text-fg-secondary hover:text-action-primary transition-colors py-1"
                                            >
                                                {sub.nombre}
                                            </Link>
                                        ))}
                                    </div>
                                </details>
                            ))}
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