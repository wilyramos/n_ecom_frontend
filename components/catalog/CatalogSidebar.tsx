// File: src/components/catalog/CatalogSidebar-NEW.tsx
"use client";

import { useMemo } from "react";
import { useCatalogNav } from "./hooks/useCatalogNav";
import type { CatalogFilters } from "@/src/schemas/catalog";
import { cn } from "@/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import ActiveFiltersSidebar from "./ActiveFiltersSidebar";
import ColorCircle from "../ui/ColorCircle";
import { LuX } from "react-icons/lu";

interface Props {
    filters: CatalogFilters;
}

export default function CatalogSidebar({ filters }: Props) {
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

    const sortedFilters = useMemo(() => ({
        categories: [...filters.categories].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        brands: [...filters.brands].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        lines: [...filters.lines].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        atributos: [...filters.atributos]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((attr) => ({
                ...attr,
                values: [...attr.values].sort((a, b) => a.localeCompare(b)),
            })),
    }), [filters]);

    return (
        <div className="w-full pb-12 select-none bg-gray-200 px-4 py-6 rounded-3xl">
            {/* HEADER CON LIMPIAR FILTROS */}
            <div className="mb-6 pb-4 border-b border-[var(--color-border-default)]">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-fg-primary)]">
                        Filtros
                    </h2>
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-[11px] font-semibold text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] transition-colors flex items-center gap-1"
                        >
                            <LuX className="w-3 h-3" />
                            Limpiar
                        </button>
                    )}
                </div>
                
                {/* FILTROS ACTIVOS */}
                {hasFilters && (
                    <div className="mb-0">
                        <ActiveFiltersSidebar compact />
                    </div>
                )}
            </div>

            {/* ACCORDION DE FILTROS */}
            <Accordion
                type="multiple"
                className="w-full space-y-3"
                defaultValue={["item-categories", "item-brands", "item-lines"]}
            >
                {/* CATEGORÍAS - Pills */}
                {sortedFilters.categories.length > 0 && (
                    <AccordionItem value="item-categories" className="border-0">
                        <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[var(--color-fg-primary)] hover:no-underline py-2 px-0">
                            Categorías
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 pb-0 px-0">
                            <div className="flex flex-col gap-2">
                                {sortedFilters.categories.map((cat) => {
                                    const active = isCategoryActive(cat.slug);
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setCategory(cat.slug)}
                                            className={cn(
                                                "px-3 py-2 text-xs border rounded-3xl transition-all duration-200 font-medium text-left",
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
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* MARCAS */}
                {sortedFilters.brands.length > 0 && (
                    <AccordionItem value="item-brands" className="border-0">
                        <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[var(--color-fg-primary)] hover:no-underline py-2 px-0">
                            Marcas
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 pb-0 px-0">
                            <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-1">
                                {sortedFilters.brands.map((brand) => {
                                    const active = isBrandActive(brand.slug);
                                    return (
                                        <div
                                            key={brand.id}
                                            onClick={() => setBrand(brand.slug)}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2 rounded-3xl border cursor-pointer transition-all duration-150",
                                                active
                                                    ? "border-[var(--color-brand-charcoal)] bg-[var(--color-surface-secondary)]"
                                                    : "border-[var(--color-border-default)] bg-[var(--color-surface-primary)] hover:border-[var(--color-brand-charcoal)]"
                                            )}
                                        >
                                            <span className={cn(
                                                "text-xs font-medium transition-colors",
                                                active ? "text-[var(--color-fg-primary)] font-bold" : "text-[var(--color-fg-primary)]"
                                            )}>
                                                {brand.nombre}
                                            </span>
                                            <Checkbox
                                                checked={active}
                                                className="w-4 h-4 rounded border-[var(--color-border-default)] data-[state=checked]:bg-[var(--color-action-primary)] data-[state=checked]:border-[var(--color-action-primary)] transition-colors duration-150"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* MODELOS/LÍNEAS */}
                {sortedFilters.lines.length > 0 && (
                    <AccordionItem value="item-lines" className="border-0">
                        <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[var(--color-fg-primary)] hover:no-underline py-2 px-0">
                            Modelos
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 pb-0 px-0">
                            <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
                                {sortedFilters.lines.map((line) => {
                                    const active = isLineActive(line.slug);
                                    return (
                                        <div
                                            key={line.id}
                                            onClick={() => setLine(line.slug)}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-3xl cursor-pointer transition-colors duration-150",
                                                active 
                                                    ? "bg-[var(--color-surface-secondary)] text-[var(--color-fg-primary)] font-semibold" 
                                                    : "hover:bg-[var(--color-surface-secondary)] hover:bg-opacity-40 text-[var(--color-fg-primary)]"
                                            )}
                                        >
                                            <Checkbox
                                                checked={active}
                                                className="w-3.5 h-3.5 rounded-sm border-[var(--color-border-default)] data-[state=checked]:bg-[var(--color-action-primary)] data-[state=checked]:border-[var(--color-action-primary)]"
                                            />
                                            <span className="text-xs tracking-tight">
                                                {line.nombre}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* ATRIBUTOS DINÁMICOS */}
                {sortedFilters.atributos.map((attr, idx) => {
                    const isColorAttr = attr.name.toLowerCase().includes("color");

                    return (
                        <AccordionItem key={idx} value={`attr-${idx}`} className="border-0">
                            <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-[var(--color-fg-primary)] hover:no-underline py-2 px-0">
                                {attr.name}
                            </AccordionTrigger>
                            <AccordionContent className="pt-3 pb-0 px-0">
                                {isColorAttr ? (
                                    /* MATRIZ DE COLORES */
                                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                                        {attr.values.map((val) => {
                                            const isChecked = searchParams.getAll(attr.name).includes(val);
                                            return (
                                                <div
                                                    key={val}
                                                    onClick={() => updateFilter(attr.name, val)}
                                                    className={cn(
                                                        "flex items-center gap-2.5 p-2 rounded-3xl border cursor-pointer transition-all duration-150",
                                                        isChecked
                                                            ? " bg-[var(--color-surface-secondary)]  "
                                                            : "border-[var(--color-border-default)] hover:border-[var(--color-brand-charcoal)] bg-[var(--color-surface-primary)]"
                                                    )}
                                                >
                                                    <div className="relative flex-shrink-0 border border-[var(--color-brand-black)]/10 rounded-full overflow-hidden">
                                                        <ColorCircle color={val} size={16} />
                                                    </div>
                                                    <span className={cn(
                                                        "text-[11px] capitalize truncate font-medium",
                                                        isChecked ? "text-[var(--color-fg-primary)] font-bold" : "text-[var(--color-fg-primary)]"
                                                    )}>
                                                        {val}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* LISTA DE ATRIBUTOS */
                                    <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
                                        {attr.values.map((val) => {
                                            const isChecked = searchParams.getAll(attr.name).includes(val);
                                            return (
                                                <div
                                                    key={val}
                                                    onClick={() => updateFilter(attr.name, val)}
                                                    className={cn(
                                                        "flex items-center justify-between px-3 py-2 rounded-3xl cursor-pointer transition-colors duration-150",
                                                        isChecked ? "bg-[var(--color-surface-secondary)] text-[var(--color-fg-primary)]" : "hover:bg-[var(--color-surface-secondary)] hover:bg-opacity-40"
                                                    )}
                                                >
                                                    <span className="text-xs font-medium capitalize">
                                                        {val}
                                                    </span>
                                                    <Checkbox
                                                        checked={isChecked}
                                                        className="w-3.5 h-3.5 rounded-sm border-[var(--color-border-default)] data-[state=checked]:bg-[var(--color-action-primary)] data-[state=checked]:border-[var(--color-action-primary)]"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}