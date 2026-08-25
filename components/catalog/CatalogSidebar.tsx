"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Slider } from "@/components/ui/slider";
import ActiveFiltersSidebar from "./ActiveFiltersSidebar";
import ColorCircle from "../ui/ColorCircle";
import { LuX } from "react-icons/lu";

interface Props {
    filters: CatalogFilters;
}

export default function CatalogSidebar({ filters }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        setCategory,
        setBrand,
        setLine,
        updateFilter,
        isCategoryActive,
        isBrandActive,
        isLineActive,
        hasFilters,
        clearFilters,
    } = useCatalogNav();

    const limitPrices = useMemo(() => {
        const fallback = { min: 0, max: 5000 };
        if (!filters.price || filters.price.length === 0) return fallback;
        const record = filters.price[0];
        return {
            min: record.min ?? fallback.min,
            max: record.max ?? fallback.max
        };
    }, [filters.price]);

    const currentPriceRange = useMemo(() => {
        const raw = searchParams.get("priceRange");
        if (!raw) return null;
        const [min, max] = raw.split("-").map(Number);
        return isNaN(min) || isNaN(max) ? null : { min, max };
    }, [searchParams]);

    const [priceRangeValue, setPriceRangeValue] = useState<[number, number]>([
        limitPrices.min,
        limitPrices.max,
    ]);

    useEffect(() => {
        if (currentPriceRange) {
            setPriceRangeValue([currentPriceRange.min, currentPriceRange.max]);
        } else {
            setPriceRangeValue([limitPrices.min, limitPrices.max]);
        }
    }, [currentPriceRange, limitPrices]);

    useEffect(() => {
        const urlMin = currentPriceRange?.min ?? limitPrices.min;
        const urlMax = currentPriceRange?.max ?? limitPrices.max;
        const [currentMin, currentMax] = priceRangeValue;

        if (currentMin === urlMin && currentMax === urlMax) return;

        const delayDebounce = setTimeout(() => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("page");

            if (currentMin === limitPrices.min && currentMax === limitPrices.max) {
                newParams.delete("priceRange");
            } else {
                newParams.set("priceRange", `${currentMin}-${currentMax}`);
            }

            router.push(`${window.location.pathname}?${newParams.toString()}`, { scroll: false });
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [priceRangeValue, limitPrices, currentPriceRange, searchParams, router]);

    const sortedFilters = useMemo(() => {
        const parseStorageToValue = (valueStr: string): number => {
            const cleanStr = valueStr.toLowerCase().replace(/\s+/g, "");
            const match = cleanStr.match(/^(\d+(?:\.\d+)?)(gb|tb|mb)$/);

            if (!match) return 0;

            const num = parseFloat(match[1]);
            const unit = match[2];

            switch (unit) {
                case "tb": return num * 1024;
                case "gb": return num;
                case "mb": return num / 1024;
                default: return num;
            }
        };

        return {
            categories: [...filters.categories].sort((a, b) => a.nombre.localeCompare(b.nombre)),
            brands: [...filters.brands].sort((a, b) => a.nombre.localeCompare(b.nombre)),
            lines: [...filters.lines].sort((a, b) => a.nombre.localeCompare(b.nombre)),
            atributos: [...filters.atributos]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((attr) => {
                    const isStorageAttribute =
                        attr.name.toLowerCase().includes("almacenamiento") ||
                        attr.name.toLowerCase().includes("capacidad") ||
                        attr.name.toLowerCase().includes("memoria");

                    const sortedValues = [...attr.values].sort((a, b) => {
                        if (isStorageAttribute) {
                            const valA = parseStorageToValue(a.value);
                            const valB = parseStorageToValue(b.value);

                            if (valA !== 0 || valB !== 0) {
                                return valA - valB;
                            }
                        }
                        return a.value.localeCompare(b.value);
                    });

                    return {
                        ...attr,
                        values: sortedValues,
                    };
                }),
        };
    }, [filters]);

    const defaultExpanded = useMemo(() => [
        "item-price",
        "item-categories",
    ], []);

    return (
        <div className="w-full pb-12 select-none px-1 py-4 rounded-3xl">
            <div className="mb-6 pb-4 border-b border-border-default">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-fg-primary">
                        Filtros
                    </h2>
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-[11px] font-semibold text-fg-muted hover:text-fg-primary transition-colors flex items-center gap-1"
                        >
                            <LuX className="w-3 h-3" />
                            Limpiar
                        </button>
                    )}
                </div>

                {hasFilters && (
                    <div className="mb-0">
                        <ActiveFiltersSidebar compact />
                    </div>
                )}
            </div>

            <Accordion
                type="multiple"
                className="w-full space-y-4"
                defaultValue={defaultExpanded}
            >
                {/* PRECIO */}
                <AccordionItem value="item-price" className="border-0">
                    <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-fg-primary hover:no-underline py-2 px-0">
                        Precio
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2 px-1">
                        <div className="space-y-5">
                            <Slider
                                min={limitPrices.min}
                                max={limitPrices.max}
                                step={10}
                                value={priceRangeValue}
                                onValueChange={(val) => setPriceRangeValue(val as [number, number])}
                                className="w-full"
                            />
                            <div className="flex items-center justify-between text-xs font-medium text-fg-primary">
                                <span>S/. {priceRangeValue[0]}</span>
                                <span>S/. {priceRangeValue[1]}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* CATEGORÍAS */}
                {sortedFilters.categories.length > 0 && (
                    <AccordionItem value="item-categories" className="border-0">
                        <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-fg-primary hover:no-underline py-2 px-0">
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
                                                "flex items-center justify-between px-4 py-2 text-xs border rounded-3xl transition-all duration-200 font-medium text-left",
                                                active
                                                    ? "bg-[var(--color-brand-action-muted)] border-[var(--color-brand-action)] text-[var(--color-brand-charcoal)] font-semibold"
                                                    : "border-border-default bg-surface-primary text-fg-primary hover:border-brand-gris"
                                            )}
                                        >
                                            <span>{cat.nombre}</span>
                                            <span className={cn("text-[10px]", active ? "text-[var(--color-brand-charcoal)]/70 font-semibold" : "text-fg-muted")}>
                                                ({cat.count})
                                            </span>
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
                        <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-fg-primary hover:no-underline py-2 px-0">
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
                                                "flex items-center justify-between px-4 py-2 rounded-3xl border cursor-pointer transition-all duration-150",
                                                active
                                                    ? "border-[var(--color-brand-charcoal)] bg-[var(--color-brand-silver-border)] font-medium"
                                                    : "border-border-default bg-surface-primary hover:border-brand-gris"
                                            )}
                                        >
                                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                                <Checkbox checked={active} />
                                                <span className="text-xs font-medium text-fg-primary truncate">
                                                    {brand.nombre}
                                                </span>
                                            </div>
                                            <span className="text-fg-muted text-[10px] ml-2 shrink-0">
                                                ({brand.count})
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* MODELOS */}
                {sortedFilters.lines.length > 0 && (
                    <AccordionItem value="item-lines" className="border-0">
                        <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-fg-primary hover:no-underline py-2 px-0">
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
                                                "flex items-center justify-between px-4 py-2 rounded-3xl border cursor-pointer transition-colors duration-150",
                                                active 
                                                    ? "border-[var(--color-brand-charcoal)] bg-[var(--color-brand-silver-border)] font-medium" 
                                                    : "border-border-default bg-surface-primary hover:border-brand-gris"
                                            )}
                                        >
                                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                                <Checkbox checked={active} />
                                                <span className="text-xs font-medium text-fg-primary truncate tracking-tight">
                                                    {line.nombre}
                                                </span>
                                            </div>
                                            <span className="text-fg-muted text-[10px] ml-2 shrink-0">
                                                ({line.count})
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
                            <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-fg-primary hover:no-underline py-2 px-0">
                                {attr.name}
                            </AccordionTrigger>
                            <AccordionContent className="pt-3 pb-0 px-0">
                                <div className={cn(isColorAttr ? "grid grid-cols-2 gap-2" : "flex flex-col gap-1", "max-h-[300px] overflow-y-auto pr-1")}>
                                    {attr.values.map((valObj) => {
                                        const val = valObj.value;
                                        const count = valObj.count;
                                        const isChecked = searchParams.getAll(attr.name).includes(val);
                                        return (
                                            <div
                                                key={val}
                                                onClick={() => updateFilter(attr.name, val)}
                                                className={cn(
                                                    "flex items-center justify-between p-2 px-4 rounded-3xl border cursor-pointer transition-all duration-150",
                                                    isChecked
                                                        ? "bg-[var(--color-brand-silver-border)] border-[var(--color-brand-charcoal)]/30 font-medium"
                                                        : "border-border-default hover:border-brand-gris bg-surface-primary"
                                                )}
                                            >
                                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                                    {isColorAttr && (
                                                        <div className="relative flex-shrink-0 border border-brand-charcoal/10 rounded-full overflow-hidden">
                                                            <ColorCircle color={val} size={16} />
                                                        </div>
                                                    )}
                                                    {!isColorAttr && (
                                                        <Checkbox checked={isChecked} />
                                                    )}
                                                    <span className="text-[11px] capitalize truncate font-medium text-fg-primary">
                                                        {val}
                                                    </span>
                                                </div>
                                                <span className="text-fg-muted text-[10px] ml-2 shrink-0">
                                                    ({count})
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}