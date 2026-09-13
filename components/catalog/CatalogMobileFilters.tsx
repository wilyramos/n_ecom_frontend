"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCatalogNav } from "./hooks/useCatalogNav";
import CatalogSidebar from "./CatalogSidebar";
import type { CatalogFilters } from "@/src/schemas/catalog";
import { LuListFilter, LuX } from "react-icons/lu";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";

interface Props {
    filters: CatalogFilters;
}

const SORT_OPTIONS = [
    { label: "Relevancia", value: "relevance" },
    { label: "Precio: Menor a Mayor", value: "price_asc" },
    { label: "Precio: Mayor a Menor", value: "price_desc" },
    { label: "Más nuevos", value: "newest" },
];

export default function CatalogMobileFilters({ filters }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { hasFilters, clearFilters } = useCatalogNav();

    const currentSort = searchParams.get("sort") || "relevance";

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <Drawer>
            {/* Disparador: altura compacta de 36px (h-9) que no satura el viewport */}
            <DrawerTrigger asChild>
                <button
                    type="button"
                    className="
                        lg:hidden
                        w-full
                        h-9
                        flex items-center justify-center
                        gap-2
                        px-3
                        text-xs
                        font-medium
                        rounded-xl
                        border border-brand-silver-border
                        bg-background
                        text-brand-charcoal
                        transition-all duration-150
                        hover:border-brand-gris
                        active:scale-[0.99]
                    "
                >
                    <LuListFilter className="w-3.5 h-3.5 text-brand-charcoal/70" />
                    <span>Filtrar y Ordenar</span>

                    {hasFilters && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-action inline-block shrink-0" />
                    )}
                </button>
            </DrawerTrigger>

            {/* Contenedor del Drawer adaptado a la altura de pantalla restante */}
            <DrawerContent
                className="
                    h-[85vh]
                    bg-background
                    flex flex-col
                    border-t border-brand-silver-border
                "
            >
                {/* Header */}
                <DrawerHeader
                    className="
                        px-4 py-3
                        flex items-center justify-between
                        border-b border-brand-silver-border
                        shrink-0
                    "
                >
                    <DrawerTitle className="text-xs font-bold uppercase tracking-widest text-brand-charcoal">
                        Filtrar y Ordenar
                    </DrawerTitle>

                    <div className="flex items-center gap-3">
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="
                                    text-xs
                                    font-semibold
                                    text-brand-charcoal/80
                                    hover:text-brand-charcoal
                                    underline
                                    underline-offset-4
                                    transition-colors
                                "
                            >
                                Limpiar
                            </button>
                        )}

                        <DrawerClose asChild>
                            <button
                                type="button"
                                aria-label="Cerrar filtros"
                                className="
                                    p-1
                                    rounded-full
                                    text-brand-charcoal
                                    hover:bg-brand-action-muted
                                    transition-colors
                                "
                            >
                                <LuX className="w-4 h-4" />
                            </button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                {/* Body: Ordenamiento + Filtros del Sidebar */}
                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
                    {/* Ordenamiento */}
                    <div className="flex flex-col gap-2.5 pb-4 border-b border-brand-silver-border">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gris select-none">
                            Ordenar por
                        </span>

                        <div className="flex flex-wrap gap-1.5">
                            {SORT_OPTIONS.map((option) => {
                                const isActive = currentSort === option.value;

                                return (
                                    <button
                                        type="button"
                                        key={option.value}
                                        onClick={() => handleSortChange(option.value)}
                                        className={`
                                            px-3 py-1.5
                                            text-xs
                                            rounded-full
                                            border
                                            transition-all
                                            duration-150
                                            text-left
                                            select-none
                                            ${isActive
                                                ? "bg-brand-action-muted text-brand-charcoal border-brand-action font-semibold"
                                                : "bg-background text-brand-charcoal border-brand-silver-border hover:border-brand-gris"
                                            }
                                        `}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filtros dinámicos */}
                    <div className="flex flex-col">
                        <CatalogSidebar filters={filters} />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}