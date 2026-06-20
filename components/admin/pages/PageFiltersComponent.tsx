// File: frontend/src/components/admin/page/PageFiltersComponent.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Filters {
    isActive?: string;
}

interface Props {
    filters: Filters;
}

export default function PageFiltersComponent({ filters }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        // El valor "ALL" limpia el parámetro de la URL
        if (value && value !== "ALL") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        
        params.set("page", "1");
        
        router.push(`/admin/pages?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap items-center gap-4 ">
            <div className="flex flex-col gap-1.5 w-full sm:w-48">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Estado
                </Label>
                <Select
                    value={filters.isActive || "ALL"}
                    onValueChange={(val) => handleFilterChange("isActive", val)}
                >
                    <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL" className="text-xs">
                            Todos los estados
                        </SelectItem>
                        <SelectItem value="true" className="text-xs">
                            Activas / Publicadas
                        </SelectItem>
                        <SelectItem value="false" className="text-xs">
                            Ocultas / Borradores
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}