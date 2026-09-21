// File: components/admin/claims/ClaimsFilter.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { AdminFilterBar } from "@/src/components/admin/layout/admin-filter-bar";
import { AdminSelect } from "@/src/components/admin/layout/admin-form-group";

export default function ClaimsFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const currentSearch = searchParams.get("search") || "";
    const currentEstado = searchParams.get("estado") || "";

    const handleSearch = useDebouncedCallback((value: string) => {
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
    }, 350);

    const handleEstadoChange = (estado: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");

        if (estado && estado !== "ALL") {
            params.set("estado", estado);
        } else {
            params.delete("estado");
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const handleReset = () => {
        startTransition(() => {
            router.push(pathname);
        });
    };

    const activeCount = (currentSearch ? 1 : 0) + (currentEstado ? 1 : 0);

    return (
        <AdminFilterBar
            searchPlaceholder="Buscar por correlativo, consumidor, DNI/RUC..."
            searchValue={currentSearch}
            onSearchChange={handleSearch}
            activeCount={activeCount}
            onReset={activeCount > 0 ? handleReset : undefined}
            filters={
                <div className="flex items-center gap-2">
                    <AdminSelect
                        value={currentEstado || "ALL"}
                        onChange={(e) => handleEstadoChange(e.target.value)}
                        className="w-36 h-7 text-[11px]"
                    >
                        <option value="ALL">Todos los Estados</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Resuelto">Resuelto</option>
                    </AdminSelect>
                </div>
            }
        />
    );
}