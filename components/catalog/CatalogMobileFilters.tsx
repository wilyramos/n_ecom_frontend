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
            {/* Trigger Button */}
            <DrawerTrigger asChild>
                <button
                    className="
                        lg:hidden
                        w-full
                        flex items-center justify-center
                        gap-2
                        px-3 py-2.5
                        text-xs md:text-sm
                        font-medium
                        rounded-lg
                        border border-border-default
                        bg-surface-primary
                        text-fg-primary
                        transition-colors
                        hover:border-brand-charcoal
                        hover:bg-surface-secondary/20
                    "
                >
                    <LuListFilter className="w-4 h-4 text-fg-primary/70" />
                    <span>Filtrar y Ordenar</span>

                    {hasFilters && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-action-primary" />
                    )}
                </button>
            </DrawerTrigger>

            {/* Drawer Content */}
            <DrawerContent
                className="
                    h-[88vh]
                    bg-surface-primary
                    flex flex-col
                    border-t border-border-default
                "
            >
                {/* Header */}
                <DrawerHeader
                    className="
                        px-4 py-3
                        flex items-center justify-between
                        border-b border-border-default
                        shrink-0
                    "
                >
                    <DrawerTitle className="text-sm font-bold uppercase tracking-wider text-fg-primary">
                        Filtrar y Ordenar
                    </DrawerTitle>

                    <div className="flex items-center gap-4">
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="
                                    text-xs
                                    font-semibold
                                    text-fg-primary/70
                                    hover:text-fg-primary
                                    transition-colors
                                    underline
                                    underline-offset-4
                                "
                            >
                                Limpiar
                            </button>
                        )}

                        <DrawerClose asChild>
                            <button
                                className="
                                    p-1.5
                                    rounded-lg
                                    text-fg-primary
                                    hover:bg-surface-secondary/30
                                    transition-colors
                                "
                            >
                                <LuX className="w-4 h-4" />
                            </button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                {/* Body - Horizontal Sort + Sidebar Filters */}
                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
                    {/* Ordenamiento */}
                    <div className="flex flex-col gap-3 pb-5 border-b border-border-default">
                        <span className="text-xs font-bold uppercase tracking-wider text-fg-primary/60">
                            Ordenar por
                        </span>

                        <div className="flex flex-wrap gap-2">
                            {SORT_OPTIONS.map((option) => {
                                const isActive = currentSort === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSortChange(option.value)}
                                        className={`
                                            px-4 py-2
                                            text-xs
                                            rounded-full
                                            border
                                            transition-all
                                            text-left
                                            break-words
                                            leading-tight
                                            max-w-full
                                            ${isActive
                                                ? "bg-[var(--color-brand-action-muted)] text-[var(--color-brand-charcoal)] border-[var(--color-brand-action)] font-bold"
                                                : "bg-surface-primary text-fg-primary border-border-default hover:border-brand-charcoal"
                                            }
                                        `}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex flex-col gap-3">
                     
                        <CatalogSidebar filters={filters} />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}