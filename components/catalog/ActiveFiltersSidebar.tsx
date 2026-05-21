"use client";

import { useCatalogNav } from "./hooks/useCatalogNav";
import { LuX } from "react-icons/lu";

interface Props {
    compact?: boolean;
}

export default function ActiveFiltersSidebar({ compact = false }: Props) {
    const { 
        currentSlugs, 
        hasFilters, 
        searchParams,
        setCategory,
        setBrand,
        setLine,
        updateFilter,
        clearPriceRange,
    } = useCatalogNav();

    if (!hasFilters) {
        return null;
    }

    const getActiveFilters = () => {
        const filters: Array<{ type: 'slug' | 'param' | 'price'; key: string; value: string; displayValue: string }> = [];

        currentSlugs.forEach((slug) => {
            filters.push({ 
                type: 'slug', 
                key: 'slug', 
                value: slug,
                displayValue: slug
            });
        });

        for (const [key, value] of searchParams.entries()) {
            if (key !== "page" && key !== "sort") {
                if (key === "priceRange") {
                    const [min, max] = value.split('-');
                    filters.push({
                        type: 'price',
                        key,
                        value,
                        displayValue: `S/. ${min} - S/. ${max}`
                    });
                } else {
                    filters.push({ 
                        type: 'param', 
                        key, 
                        value,
                        displayValue: value
                    });
                }
            }
        }

        return filters;
    };

    const activeFilters = getActiveFilters();

    if (!activeFilters.length) {
        return null;
    }

    const removeFilter = (type: 'slug' | 'param' | 'price', key: string, value: string) => {
        if (type === 'price') {
            clearPriceRange();
        } else if (type === 'slug') {
            setCategory(value);
            setBrand(value);
            setLine(value);
        } else if (type === 'param') {
            updateFilter(key, value);
        }
    };

    if (compact) {
        return (
            <div className="flex flex-wrap gap-2">
                {activeFilters.map(({ type, key, value, displayValue }) => (
                    <div
                        key={`${type}-${key}-${value}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-[var(--color-surface-secondary)] border border-[var(--color-border-default)] text-[var(--color-fg-primary)]"
                    >
                        <span className="font-medium capitalize text-[11px]">{displayValue}</span>
                        <button
                            onClick={() => removeFilter(type, key, value)}
                            className="flex items-center justify-center w-3 h-3 rounded-full hover:bg-[var(--color-fg-primary)] hover:bg-opacity-10 transition-colors"
                            aria-label={`Remover filtro: ${displayValue}`}
                        >
                            <LuX className="w-2.5 h-2.5" />
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-fg-primary)]">
                    Filtros Activos
                </h3>
            </div>

            <div className="space-y-2">
                {activeFilters.map(({ type, key, value, displayValue }) => (
                    <div
                        key={`${type}-${key}-${value}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-default)]"
                    >
                        <span className="text-xs font-medium text-[var(--color-fg-primary)] capitalize">
                            {displayValue}
                        </span>
                        <button
                            onClick={() => removeFilter(type, key, value)}
                            className="p-1 rounded hover:bg-[var(--color-fg-primary)] hover:bg-opacity-10 transition-colors"
                            aria-label={`Remover filtro: ${displayValue}`}
                        >
                            <LuX className="w-3.5 h-3.5 text-[var(--color-fg-secondary)]" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}