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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

    const [minInput, setMinInput] = useState<string>("");
    const [maxInput, setMaxInput] = useState<string>("");

    useEffect(() => {
        if (currentPriceRange) {
            setMinInput(currentPriceRange.min.toString());
            setMaxInput(currentPriceRange.max.toString());
        } else {
            setMinInput("");
            setMaxInput("");
        }
    }, [currentPriceRange]);

    useEffect(() => {
        const urlMin = currentPriceRange?.min;
        const urlMax = currentPriceRange?.max;

        const parsedMin = minInput === "" ? undefined : parseFloat(minInput);
        const parsedMax = maxInput === "" ? undefined : parseFloat(maxInput);

        if (parsedMin === urlMin && parsedMax === urlMax) return;
        if (parsedMin !== undefined && parsedMax !== undefined && parsedMin > parsedMax) return;

        const delayDebounce = setTimeout(() => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("page");

            if (minInput === "" && maxInput === "") {
                newParams.delete("priceRange");
            } else {
                const finalMin = parsedMin ?? limitPrices.min;
                const finalMax = parsedMax ?? limitPrices.max;
                newParams.set("priceRange", `${finalMin}-${finalMax}`);
            }

            router.push(`${window.location.pathname}?${newParams.toString()}`, { scroll: false });
        }, 600);

        return () => clearTimeout(delayDebounce);
    }, [minInput, maxInput, limitPrices, currentPriceRange, searchParams, router]);

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
        <div className="w-full pb-12 select-none px-4  py-6 rounded-3xl">
            <div className="mb-6 pb-4 border-b border-border-default">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-fg-primary">
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
                className="w-full space-y-3"
                defaultValue={["item-price", "item-categories", "item-brands", "item-lines"]}
            >
                <AccordionItem value="item-price" className="border-0">
                    <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-fg-primary hover:no-underline py-2 px-0">
                        Precio
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-2 px-0">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="min-price" className="text-[10px] uppercase font-bold text-fg-muted tracking-wider">
                                    Desde (S/.)
                                </Label>
                                <Input
                                    id="min-price"
                                    type="number"
                                    placeholder={limitPrices.min.toString()}
                                    value={minInput}
                                    onChange={(e) => setMinInput(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="max-price" className="text-[10px] uppercase font-bold text-fg-muted tracking-wider">
                                    Hasta (S/.)
                                </Label>
                                <Input
                                    id="max-price"
                                    type="number"
                                    placeholder={limitPrices.max.toString()}
                                    value={maxInput}
                                    onChange={(e) => setMaxInput(e.target.value)}
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

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
                                                "px-3 py-2 text-xs border rounded-3xl transition-all duration-200 font-medium text-left",
                                                active
                                                    ? "bg-action-primary border-action-primary text-surface-primary shadow-sm"
                                                    : "border-border-default bg-surface-primary text-fg-primary hover:border-brand-charcoal"
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
                                                "flex items-center justify-between px-3 py-2 rounded-3xl border cursor-pointer transition-all duration-150",
                                                active
                                                    ? "border-brand-charcoal bg-surface-secondary"
                                                    : "border-border-default bg-surface-primary hover:border-brand-charcoal"
                                            )}
                                        >
                                            <span className="text-xs font-medium text-fg-primary">
                                                {brand.nombre}
                                            </span>
                                            <Checkbox
                                                checked={active}
                                                className="w-4 h-4 rounded border-border-default data-[state=checked]:bg-action-primary data-[state=checked]:border-action-primary"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

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
                                                "flex items-center gap-3 px-3 py-2 rounded-3xl cursor-pointer transition-colors duration-150",
                                                active ? "bg-surface-secondary text-fg-primary" : "hover:bg-surface-secondary text-fg-primary"
                                            )}
                                        >
                                            <Checkbox
                                                checked={active}
                                                className="w-3.5 h-3.5 rounded-sm border-border-default data-[state=checked]:bg-action-primary data-[state=checked]:border-action-primary"
                                            />
                                            <span className="text-xs tracking-tight">{line.nombre}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {sortedFilters.atributos.map((attr, idx) => {
                    const isColorAttr = attr.name.toLowerCase().includes("color");
                    return (
                        <AccordionItem key={idx} value={`attr-${idx}`} className="border-0">
                            <AccordionTrigger className="text-xs font-bold uppercase tracking-wider text-fg-primary hover:no-underline py-2 px-0">
                                {attr.name}
                            </AccordionTrigger>
                            <AccordionContent className="pt-3 pb-0 px-0">
                                <div className={cn(isColorAttr ? "grid grid-cols-2 gap-2" : "flex flex-col gap-1", "max-h-[300px] overflow-y-auto pr-1")}>
                                    {attr.values.map((val) => {
                                        const isChecked = searchParams.getAll(attr.name).includes(val);
                                        return (
                                            <div
                                                key={val}
                                                onClick={() => updateFilter(attr.name, val)}
                                                className={cn(
                                                    "flex items-center gap-2.5 p-2 rounded-3xl border cursor-pointer transition-all duration-150",
                                                    isChecked 
                                                        ? "bg-surface-secondary border-transparent" 
                                                        : "border-border-default hover:border-brand-charcoal bg-surface-primary"
                                                )}
                                            >
                                                {isColorAttr && (
                                                    <div className="relative flex-shrink-0 border border-brand-charcoal/10 rounded-full overflow-hidden">
                                                        <ColorCircle color={val} size={16} />
                                                    </div>
                                                )}
                                                <span className="text-[11px] capitalize truncate font-medium text-fg-primary">
                                                    {val}
                                                </span>
                                                {!isColorAttr && (
                                                    <Checkbox
                                                        checked={isChecked}
                                                        className="ml-auto w-3.5 h-3.5 rounded-sm border-border-default data-[state=checked]:bg-action-primary data-[state=checked]:border-action-primary"
                                                    />
                                                )}
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