"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VscSettings } from "react-icons/vsc";
import { MdClear } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CategoryListResponse } from "@/src/schemas";
import { Range } from "react-range";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

type Props = {
    categorias: CategoryListResponse;
};

const MIN = 0;
const MAX = 3000;

export default function DrawerFiltersGeneral({ categorias }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [ open, setOpen ] = useState(false);

    const [filters, setFilters] = useState({
        category: "",
        priceRange: "",
    });

    const [priceValues, setPriceValues] = useState([MIN, MAX]);

    // Sincronizar con la URL cuando cambian los params
    useEffect(() => {
        const range = searchParams.get("priceRange");
        const [min, max] = range?.split("-").map(Number) || [MIN, MAX];

        setPriceValues([min, max]);

        setFilters({
            category: searchParams.get("category") || "",
            priceRange: range || "",
        });
    }, [searchParams]);

    // 🔄 Actualiza los filtros y navega
    const updateFilters = (newFilters: Partial<typeof filters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);

        const params = new URLSearchParams();
        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });

        router.push(`/productos?${params.toString()}`);
    };

    // ❌ Limpiar filtros
    const clearFilters = () => {
        setFilters({ category: "", priceRange: "" });
        setPriceValues([MIN, MAX]);
        router.push("/catalogo");
        setOpen(false);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer font-semibold bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition">
                    <VscSettings size={18} />
                    <span className="text-sm">Filtros</span>
                </button>
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader className="flex items-center justify-between border-b pb-2">
                    <DrawerTitle className="text-lg font-semibold text-gray-800">
                        Filtros
                    </DrawerTitle>
                    <button
                        onClick={clearFilters}
                        className="flex items-center text-sm text-red-500 hover:text-red-600 transition"
                    >
                        <MdClear className="mr-1" size={16} /> Limpiar filtros
                    </button>
                </DrawerHeader>

                <ScrollArea className="h-auto overflow-auto">
                    <div className="p-5 space-y-8">
                        {/* Filtro por categoría */}
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">
                                Categorías
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categorias.map((cat) => (
                                    <button
                                        key={cat.slug}
                                        onClick={() =>
                                            updateFilters({ category: cat.slug })
                                        }
                                        className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                                            filters.category === cat.slug
                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                    >
                                        {cat.nombre}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filtro por rango de precios */}
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">
                                Precio
                            </h3>
                            <div className="px-2">
                                <Range
                                    step={50}
                                    min={MIN}
                                    max={MAX}
                                    values={priceValues}
                                    onChange={(values) => {
                                        setPriceValues(values);
                                    }}
                                    onFinalChange={(values) => {
                                        updateFilters({
                                            priceRange: `${values[0]}-${values[1]}`,
                                        });
                                    }}
                                    renderTrack={({ props, children }) => (
                                        <div
                                            {...props}
                                            className="h-2 bg-gray-200 rounded-full cursor-pointer"
                                        >
                                            {children}
                                        </div>
                                    )}

                                    

                                    renderThumb={({ props }) => {

                                        const { key, ...rest } = props;

                                        return (
                                            <div
                                                key={key}
                                                {...rest}
                                                className="h-5 w-5 bg-blue-600 rounded-full shadow-md"
                                            />
                                        );
                                    }}
                                />
                                <div className="flex justify-between mt-3">
                                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                                        S/ {priceValues[0]}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                                        S/ {priceValues[1]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
