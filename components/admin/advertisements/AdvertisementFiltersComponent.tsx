"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { AD_LAYOUT_LABELS, AdLayout } from "@/src/schemas/advertisement.schema";

interface AdvertisementFiltersComponentProps {
    filters: {
        layout?: AdLayout;
        isActive?: string;
    };
}

export default function AdvertisementFiltersComponent({ filters }: AdvertisementFiltersComponentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (value && value.trim() !== "") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        
        // Al mutar filtros, siempre reiniciamos a la página 1 de forma segura
        params.set("page", "1");
        router.push(`/admin/advertisements?${params.toString()}`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-card/40 p-4 rounded-xl border border-border shadow-2xs items-end">
            {/* Filtro por Formato (Layout) */}
            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Formato de Renderizado
                </label>
                <select
                    value={filters.layout || ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterChange("layout", e.target.value)}
                    className="w-full bg-background border border-input rounded-md h-9 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                >
                    <option value="">Todos los formatos</option>
                    {Object.entries(AD_LAYOUT_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Filtro por Estado (Visibilidad) */}
            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Estado de Publicación
                </label>
                <select
                    value={filters.isActive || ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterChange("isActive", e.target.value)}
                    className="w-full bg-background border border-input rounded-md h-9 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                >
                    <option value="">Todos los estados</option>
                    <option value="true">Activos (Visibles)</option>
                    <option value="false">Pausados (Ocultos)</option>
                </select>
            </div>
        </div>
    );
}