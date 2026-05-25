// File: src/components/admin/slider/SliderFilters.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition }    from "react";
import { useDebouncedCallback }                    from "use-debounce";
import { Search, X }                              from "lucide-react";
import { Input }                                  from "@/components/ui/input";
import {
    Select, SelectTrigger, SelectValue,
    SelectContent, SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Filters {
    search?:   string;
    isActive?: string;
}

interface SliderFiltersProps {
    filters: Filters;
}

export default function SliderFilters({ filters }: SliderFiltersProps) {
    const router       = useRouter();
    const pathname     = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchValue, setSearchValue] = useState(filters.search ?? "");

    const setParam = useCallback(
        (key: string, value: string | undefined) => {
            const params = new URLSearchParams(searchParams.toString());
            if (!value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
            params.set("page", "1");
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`);
            });
        },
        [pathname, router, searchParams],
    );

    const debouncedSearch = useDebouncedCallback(
        (value: string) => setParam("search", value.trim() || undefined),
        400,
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleSearchClear = () => {
        setSearchValue("");
        debouncedSearch.cancel();
        setParam("search", undefined);
    };

    return (
        <div className={`flex items-center gap-2 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>

            {/* Búsqueda */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                    type="text"
                    placeholder="Buscar banner..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="pl-9 pr-8"
                />
                {searchValue && (
                    <Button
                        onClick={handleSearchClear}
                        variant="ghost"
                        aria-label="Limpiar búsqueda"
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>

            {/* Estado */}
            <Select
                value={filters.isActive ?? "all"}
                onValueChange={(v) => setParam("isActive", v === "all" ? undefined : v)}
            >
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Activos</SelectItem>
                    <SelectItem value="false">Inactivos</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}