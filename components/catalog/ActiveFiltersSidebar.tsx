// File: src/components/catalog/ActiveFiltersSidebar-COMPACT.tsx
"use client";

import { useCatalogNav } from "./hooks/useCatalogNav";
import { LuX } from "react-icons/lu";
import { cn } from "@/lib/utils";

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
    } = useCatalogNav();

    if (!hasFilters) {
        return null;
    }

    // Obtener todos los filtros activos (tanto slugs como query params)
    const getActiveFilters = () => {
        const filters: Array<{ type: 'slug' | 'param'; key: string; value: string }> = [];

        // 1. Agregar slugs (categorías, marcas, líneas)
        currentSlugs.forEach((slug) => {
            filters.push({ 
                type: 'slug', 
                key: 'slug', 
                value: slug 
            });
        });

        // 2. Agregar query params (color, almacenamiento, etc)
        for (const [key, value] of searchParams.entries()) {
            if (key !== "page" && key !== "sort") {
                filters.push({ 
                    type: 'param', 
                    key, 
                    value 
                });
            }
        }

        return filters;
    };

    const activeFilters = getActiveFilters();

    if (!activeFilters.length) {
        return null;
    }

    // Remover un filtro (slug o param)
    const removeFilter = (type: 'slug' | 'param', key: string, value: string) => {
        if (type === 'slug') {
            // Es un slug, determinar si es categoría, marca o línea
            // El hook se encarga de hacerlo automáticamente
            setCategory(value);  // Si es categoría
            setBrand(value);     // Si es marca (toggle)
            setLine(value);      // Si es línea (toggle)
        } else if (type === 'param') {
            // Es un query param (color, almacenamiento, etc)
            updateFilter(key, value);
        }
    };

    if (compact) {
        return (
            <div className="flex flex-wrap gap-2">
                {activeFilters.map(({ type, key, value }) => (
                    <div
                        key={`${type}-${key}-${value}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-[var(--color-surface-secondary)] border border-[var(--color-border-default)] text-[var(--color-fg-primary)]"
                    >
                        <span className="font-medium capitalize">{value}</span>
                        <button
                            onClick={() => removeFilter(type, key, value)}
                            className="flex items-center justify-center w-3 h-3 rounded-full hover:bg-[var(--color-fg-primary)] hover:bg-opacity-10 transition-colors"
                            aria-label={`Remover filtro: ${value}`}
                        >
                            <LuX className="w-2.5 h-2.5" />
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    // Versión no-compacta (original)
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-fg-primary)]">
                    Filtros Activos
                </h3>
            </div>

            <div className="space-y-2">
                {activeFilters.map(({ type, key, value }) => (
                    <div
                        key={`${type}-${key}-${value}`}
                        className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-default)]",
                        )}
                    >
                        <span className="text-xs font-medium text-[var(--color-fg-primary)] capitalize">
                            {value}
                        </span>
                        <button
                            onClick={() => removeFilter(type, key, value)}
                            className="p-1 rounded hover:bg-[var(--color-fg-primary)] hover:bg-opacity-10 transition-colors"
                            aria-label={`Remover filtro: ${value}`}
                        >
                            <LuX className="w-3.5 h-3.5 text-[var(--color-fg-secondary)]" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}