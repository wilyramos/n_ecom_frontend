"use client";

import { ArrowUpDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCatalogNav } from "./hooks/useCatalogNav";

export default function CatalogMobileSort() {
    const { updateFilter, searchParams } = useCatalogNav();
    const currentSort = searchParams.get("sort") || "recientes";

    return (
        <div className="relative flex items-center bg-surface-primary text-fg-primary select-none rounded-3xl">
            <div className="absolute left-3 z-10 pointer-events-none">
                <ArrowUpDown className="w-3.5 h-3.5 text-fg-secondary" />
            </div>

            <Select
                value={currentSort}
                onValueChange={(val) => updateFilter("sort", val)}
            >
                <SelectTrigger
                    className="
                        h-9 pl-9 pr-3
                        text-[13px] font-medium
                        border border-border-default
                        bg-surface-primary
                        text-fg-primary
                        focus:ring-0 focus:outline-none
                        hover:bg-surface-secondary
                        transition-colors
                        w-auto
                        cursor-pointer rounded-3xl
                    "
                >
                    <SelectValue placeholder="Ordenar" />
                </SelectTrigger>

                <SelectContent
                    align="end"
                    className="bg-surface-primary border border-border-default rounded-xl p-1 text-fg-primary"
                >
                    {/* RELEVANCIA */}
                    <SelectItem value="relevancia" className="rounded-lg text-[13px] cursor-pointer focus:bg-surface-secondary focus:text-fg-primary">
                        Relevancia
                    </SelectItem>

                    {/* RECIENTES */}
                    <SelectItem value="recientes" className="rounded-lg text-[13px] cursor-pointer focus:bg-surface-secondary focus:text-fg-primary">
                        Más Recientes
                    </SelectItem>

                    {/* VALORACIÓN */}
                    <SelectItem value="rating" className="rounded-lg text-[13px] cursor-pointer focus:bg-surface-secondary focus:text-fg-primary">
                        Mejor Valorados
                    </SelectItem>

                    {/* DESCUENTO */}
                    <SelectItem value="discount" className="rounded-lg text-[13px] cursor-pointer focus:bg-surface-secondary focus:text-fg-primary">
                        Mayor Descuento
                    </SelectItem>

                    {/* PRECIO */}
                    <SelectItem value="price-asc" className="rounded-lg text-[13px] cursor-pointer focus:bg-surface-secondary focus:text-fg-primary">
                        Menor Precio
                    </SelectItem>
                    <SelectItem value="price-desc" className="rounded-lg text-[13px] cursor-pointer focus:bg-surface-secondary focus:text-fg-primary">
                        Mayor Precio
                    </SelectItem>

                    {/* ALFABÉTICO */}
                    <SelectItem value="name-asc" className="rounded-lg text-[13px] cursor-pointer focus:bg-surface-secondary focus:text-fg-primary">
                        Nombre: A - Z
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}