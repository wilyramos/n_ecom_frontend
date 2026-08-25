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
        <div className="relative flex items-center bg-surface-primary text-fg-primary select-none rounded-full">
            <div className="absolute left-3 z-10 pointer-events-none">
                <ArrowUpDown className="w-3.5 h-3.5 text-fg-muted" />
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
                        hover:bg-brand-action-muted hover:border-brand-action/40
                        focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none
                        transition-colors duration-150
                        w-auto
                        cursor-pointer rounded-full
                    "
                >
                    <SelectValue placeholder="Ordenar" />
                </SelectTrigger>

                <SelectContent
                    align="end"
                    className="bg-surface-primary border border-border-default rounded-xl p-1 text-fg-primary shadow-md"
                >
                    <SelectItem 
                        value="relevancia" 
                        className="rounded-lg text-[13px] cursor-pointer text-fg-primary hover:bg-brand-action-muted focus:bg-brand-action-muted focus:text-fg-primary data-[state=checked]:bg-brand-action-muted data-[state=checked]:font-semibold"
                    >
                        Relevancia
                    </SelectItem>

                    <SelectItem 
                        value="recientes" 
                        className="rounded-lg text-[13px] cursor-pointer text-fg-primary hover:bg-brand-action-muted focus:bg-brand-action-muted focus:text-fg-primary data-[state=checked]:bg-brand-action-muted data-[state=checked]:font-semibold"
                    >
                        Más Recientes
                    </SelectItem>

                    <SelectItem 
                        value="discount" 
                        className="rounded-lg text-[13px] cursor-pointer text-fg-primary hover:bg-brand-action-muted focus:bg-brand-action-muted focus:text-fg-primary data-[state=checked]:bg-brand-action-muted data-[state=checked]:font-semibold"
                    >
                        Mayor Descuento
                    </SelectItem>

                    <SelectItem 
                        value="price-asc" 
                        className="rounded-lg text-[13px] cursor-pointer text-fg-primary hover:bg-brand-action-muted focus:bg-brand-action-muted focus:text-fg-primary data-[state=checked]:bg-brand-action-muted data-[state=checked]:font-semibold"
                    >
                        Menor Precio
                    </SelectItem>

                    <SelectItem 
                        value="price-desc" 
                        className="rounded-lg text-[13px] cursor-pointer text-fg-primary hover:bg-brand-action-muted focus:bg-brand-action-muted focus:text-fg-primary data-[state=checked]:bg-brand-action-muted data-[state=checked]:font-semibold"
                    >
                        Mayor Precio
                    </SelectItem>

                    <SelectItem 
                        value="name-asc" 
                        className="rounded-lg text-[13px] cursor-pointer text-fg-primary hover:bg-brand-action-muted focus:bg-brand-action-muted focus:text-fg-primary data-[state=checked]:bg-brand-action-muted data-[state=checked]:font-semibold"
                    >
                        Nombre: A - Z
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}