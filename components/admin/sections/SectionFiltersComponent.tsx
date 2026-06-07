"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SECTION_TYPE_LABELS, SectionType } from "@/src/schemas/section.schema";
import { X } from "lucide-react";

interface FiltersProps {
    filters: {
        type?: SectionType;
        isActive?: string;
    };
}

export default function SectionFiltersComponent({ filters }: FiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1"); // Reiniciar a la primera página tras filtrar
        router.push(`?${params.toString()}`);
    };

    const handleReset = () => {
        router.push("?");
    };

    const hasActiveFilters = filters.type || filters.isActive;

    return (
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center justify-between">
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    {/* Filtro por Tipo de Componente */}
                    <div className="flex flex-col gap-1 w-full sm:w-48">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo de Sección</label>
                        <select
                            value={filters.type || ""}
                            onChange={(e) => handleFilterChange("type", e.target.value)}
                            className="w-full bg-background border border-input rounded-lg h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Todos los tipos</option>
                            {Object.entries(SECTION_TYPE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Estado */}
                    <div className="flex flex-col gap-1 w-full sm:w-40">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</label>
                        <select
                            value={filters.isActive || ""}
                            onChange={(e) => handleFilterChange("isActive", e.target.value)}
                            className="w-full bg-background border border-input rounded-lg h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Todos los estados</option>
                            <option value="true">Activas</option>
                            <option value="false">Inactivas</option>
                        </select>
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-dashed border-destructive/30"
                    >
                        <X className="w-3.5 h-3.5" />
                        Limpiar Filtros
                    </button>
                )}
            </div>
        </div>
    );
}