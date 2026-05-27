// File: components/admin/claims/ClaimsFilter.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebouncedCallback } from "use-debounce";

export default function ClaimsFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleSearchDebounce = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");

        if (value.trim()) {
            params.set("search", value.trim());
        } else {
            params.delete("search");
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }, 400);

    const handleSelectChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 bg-background-secondary p-4 rounded-lg border border-border">
            <div className="sm:col-span-2">
                <Input
                    placeholder="Buscar por correlativo, nombre, DNI/RUC o email..."
                    defaultValue={searchParams.get("search") || ""}
                    onChange={(e) => handleSearchDebounce(e.target.value)}
                    disabled={isPending}
                />
            </div>
            <div>
                <Select
                    defaultValue={searchParams.get("estado") || "ALL"}
                    onValueChange={(val) => handleSelectChange("estado", val === "ALL" ? "" : val)}
                    disabled={isPending}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filtrar por Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos los Estados</SelectItem>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En Proceso">En Proceso</SelectItem>
                        <SelectItem value="Resuelto">Resuelto</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}