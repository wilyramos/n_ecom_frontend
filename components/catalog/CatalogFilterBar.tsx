// File: src/components/catalog/CatalogFilterBar-Mobile.tsx
"use client";

import { useMemo } from "react";
import { useCatalogNav } from "./hooks/useCatalogNav";
import type { CatalogFilters } from "@/src/schemas/catalog";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LuChevronDown, LuX } from "react-icons/lu";
import ActiveFiltersSidebar from "./ActiveFiltersSidebar";

interface Props {
    filters: CatalogFilters;
    isOpen: boolean;
    onToggle: () => void;
}

export default function CatalogFilterBar({ filters, isOpen, onToggle }: Props) {
    const {
        setCategory,
        setBrand,
        setLine,
        updateFilter,
        isCategoryActive,
        isBrandActive,
        isLineActive,
        searchParams,
        hasFilters,
        clearFilters,
    } = useCatalogNav();

    const currentSort = searchParams.get("sort") || "recientes";

    const sortedFilters = useMemo(() => ({
        categories: [...filters.categories].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        brands: [...filters.brands].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        lines: [...filters.lines].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    }), [filters]);

    return (
        <div className="py-4">
            {/* TOP ROW - Filtros principales + Ordenamiento */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                {/* Filtros principales en horizontal */}
                <div className="flex flex-wrap gap-1.5 flex-1">
                    {/* CATEGORÍAS - Pills */}
                    {sortedFilters.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {sortedFilters.categories.map((cat) => {
                                const active = isCategoryActive(cat.slug);
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.slug)}
                                        className={cn(
                                            "px-2.5 py-1 text-[11px] font-medium rounded-full border transition-all duration-200 whitespace-nowrap",
                                            active
                                                ? "bg-[var(--color-action-primary)] border-[var(--color-action-primary)] text-[var(--color-fg-inverse)] shadow-sm"
                                                : "border-[var(--color-border-default)] bg-[var(--color-surface-primary)] text-[var(--color-fg-primary)] hover:border-[var(--color-brand-charcoal)]"
                                        )}
                                    >
                                        {cat.nombre}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Ordenamiento */}
                <div className="w-full md:w-auto">
                    <Select
                        value={currentSort}
                        onValueChange={(val) => updateFilter("sort", val)}
                    >
                        <SelectTrigger className="w-full md:w-[200px] h-9 px-2.5 border-[var(--color-border-default)] bg-[var(--color-surface-primary)] text-[11px] font-medium text-[var(--color-fg-primary)] focus:ring-2 focus:ring-[var(--color-action-primary)]">
                            <SelectValue placeholder="Ordenar" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--color-surface-primary)] border-[var(--color-border-default)]">
                            <SelectItem value="relevancia">Relevancia</SelectItem>
                            <SelectItem value="recientes">Más Recientes</SelectItem>
                            <SelectItem value="rating">Mejor Valorados</SelectItem>
                            <SelectItem value="discount">Mayor Descuento</SelectItem>
                            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                            <SelectItem value="name-asc">Nombre: A - Z</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* EXPANDED FILTERS SECTION */}
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 opacity-100 mb-3" : "max-h-0 opacity-0"
                )}
            >
                <div className="space-y-3 pb-3 pt-2 border-t border-[var(--color-border-default)]">
                    {/* MARCAS */}
                    {sortedFilters.brands.length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-fg-primary)] mb-1.5">
                                Marcas
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {sortedFilters.brands.map((brand) => {
                                    const active = isBrandActive(brand.slug);
                                    return (
                                        <button
                                            key={brand.id}
                                            onClick={() => setBrand(brand.slug)}
                                            className={cn(
                                                "px-2.5 py-1 text-[11px] font-medium rounded-md border transition-all duration-200 whitespace-nowrap",
                                                active
                                                    ? "bg-[var(--color-surface-secondary)] border-[var(--color-brand-charcoal)] text-[var(--color-fg-primary)] font-bold"
                                                    : "border-[var(--color-border-default)] bg-[var(--color-surface-primary)] text-[var(--color-fg-primary)] hover:border-[var(--color-brand-charcoal)]"
                                            )}
                                        >
                                            {brand.nombre}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* MODELOS/LÍNEAS */}
                    {sortedFilters.lines.length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-fg-primary)] mb-1.5">
                                Modelos
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {sortedFilters.lines.map((line) => {
                                    const active = isLineActive(line.slug);
                                    return (
                                        <button
                                            key={line.id}
                                            onClick={() => setLine(line.slug)}
                                            className={cn(
                                                "px-2.5 py-1 text-[11px] font-medium rounded-md border transition-all duration-200 whitespace-nowrap",
                                                active
                                                    ? "bg-[var(--color-surface-secondary)] border-[var(--color-brand-charcoal)] text-[var(--color-fg-primary)] font-bold"
                                                    : "border-[var(--color-border-default)] bg-[var(--color-surface-primary)] text-[var(--color-fg-primary)] hover:border-[var(--color-brand-charcoal)]"
                                            )}
                                        >
                                            {line.nombre}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="flex items-center justify-between">
                {/* Toggle */}
                {(sortedFilters.brands.length > 0 || sortedFilters.lines.length > 0) && (
                    <button
                        onClick={onToggle}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-fg-primary)] hover:text-[var(--color-action-primary)] transition-colors"
                    >
                        <span>{isOpen ? "Ocultar" : "Mostrar"} filtros</span>
                        <LuChevronDown
                            className={cn(
                                "w-3.5 h-3.5 transition-transform duration-300",
                                isOpen && "rotate-180"
                            )}
                        />
                    </button>
                )}

                {/* Limpiar */}
                <div className="ml-auto">
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-[11px] font-medium text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] transition-colors flex items-center gap-1"
                        >
                            <LuX className="w-3 h-3" />
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* ACTIVE FILTERS */}
            {hasFilters && (
                <div className="mt-2 pt-2 border-t border-[var(--color-border-default)]">
                    <ActiveFiltersSidebar compact />
                </div>
            )}
        </div>
    );
}