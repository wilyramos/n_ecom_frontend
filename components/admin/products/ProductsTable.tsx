// File: frontend/components/admin/products/ProductsTable.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import ProductMenuAction from "./ProductMenuActionts";
import { useColumnFilter } from "@/hooks/useColumnFilter";
import type { ProductsAPIResponse, CategoryListResponse } from "@/src/schemas";

import {
    AdminTableHead,
    AdminTableHeaderCell,
    AdminTableCell,
    AdminTableEmpty,
} from "@/src/components/admin/layout/admin-table";
import { AdminTablePagination } from "@/src/components/admin/layout/admin-table-pagination";
import { AdminFilterBar } from "@/src/components/admin/layout/admin-filter-bar";
import { AdminSelect } from "@/src/components/admin/layout/admin-form-group";
import { AdminActiveFilters } from "@/src/components/admin/layout/admin-active-filters";
import StatusBadge from "@/components/ui/status-badge";

interface ProductsTableProps {
    products: ProductsAPIResponse | null;
    categories: CategoryListResponse;
    currentPage?: number;
    itemsPerPage?: number;
}

export default function ProductsTable({
    products,
    categories,
    currentPage = 1,
    itemsPerPage = 10,
}: ProductsTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(() => searchParams.get("query") || "");

    const nameFilter = useColumnFilter("nombre");
    const skuFilter = useColumnFilter("sku");
    const priceSort = useColumnFilter("precioSort");
    const stockSort = useColumnFilter("stockSort");
    const activeFilter = useColumnFilter("isActive");
    const destacadoFilter = useColumnFilter("esDestacado");
    const categoryFilter = useColumnFilter("category");

    const productList = products?.products ?? [];
    const totalProducts = Number(products?.totalProducts ?? 0);
    const totalPages = Math.max(1, Number(products?.totalPages ?? 1));
    const activePage = Number(products?.currentPage ?? currentPage);

    const updateUrlParams = (updater: (params: URLSearchParams) => void) => {
        const params = new URLSearchParams(searchParams.toString());
        updater(params);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        updateUrlParams((params) => {
            if (value.trim()) {
                params.set("query", value);
            } else {
                params.delete("query");
            }
            params.set("page", "1");
        });
    };

    const handlePageChange = (page: number) => {
        updateUrlParams((params) => {
            params.set("page", page.toString());
        });
    };

    const handlePageSizeChange = (size: number) => {
        updateUrlParams((params) => {
            params.set("limit", size.toString());
            params.set("page", "1");
        });
    };

    const activeFiltersList = [
        nameFilter.value && { id: "nombre", label: "Nombre", value: nameFilter.value },
        skuFilter.value && { id: "sku", label: "SKU", value: skuFilter.value },
        priceSort.value && {
            id: "precioSort",
            label: "Precio",
            value: priceSort.value === "asc" ? "Menor a Mayor" : "Mayor a Menor",
        },
        stockSort.value && {
            id: "stockSort",
            label: "Stock",
            value: stockSort.value === "asc" ? "Menor a Mayor" : "Mayor a Menor",
        },
        categoryFilter.value && {
            id: "category",
            label: "Categoría",
            value: categories.find((c) => c._id === categoryFilter.value)?.nombre || categoryFilter.value,
        },
        activeFilter.value && {
            id: "isActive",
            label: "Estado",
            value: activeFilter.value === "true" ? "Activos" : "Inactivos",
        },
        destacadoFilter.value && {
            id: "esDestacado",
            label: "Destacado",
            value: destacadoFilter.value === "true" ? "Destacados" : "No Destacados",
        },
    ].filter(Boolean) as { id: string; label: string; value: string }[];

    const handleRemoveFilter = (id: string) => {
        if (id === "nombre") nameFilter.reset();
        if (id === "sku") skuFilter.reset();
        if (id === "precioSort") priceSort.reset();
        if (id === "stockSort") stockSort.reset();
        if (id === "category") categoryFilter.reset();
        if (id === "isActive") activeFilter.reset();
        if (id === "esDestacado") destacadoFilter.reset();

        const params = new URLSearchParams(searchParams.toString());
        params.delete(id);
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
    };

    const clearAllFilters = () => {
        nameFilter.reset();
        skuFilter.reset();
        priceSort.reset();
        stockSort.reset();
        activeFilter.reset();
        destacadoFilter.reset();
        categoryFilter.reset();
        setSearchQuery("");
        router.replace(pathname);
    };

    return (
        <div className="w-full flex flex-col">
            {/* Filtros superiores */}
            <div className="p-3 border-b border-slate-200 bg-white space-y-2">
                <AdminFilterBar
                    searchPlaceholder="Buscar por nombre o descripción..."
                    searchValue={searchQuery}
                    onSearchChange={handleSearch}
                    activeCount={activeFiltersList.length}
                    onReset={clearAllFilters}
                    className="border-0 p-0 shadow-none bg-transparent"
                    filters={
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <AdminSelect
                                value={categoryFilter.value || ""}
                                onChange={(e) => {
                                    categoryFilter.setValue(e.target.value);
                                    handlePageChange(1);
                                }}
                                className="h-8 text-xs w-36 border-slate-200"
                            >
                                <option value="">Categoría: Todas</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </AdminSelect>

                            <AdminSelect
                                value={activeFilter.value || ""}
                                onChange={(e) => {
                                    activeFilter.setValue(e.target.value);
                                    handlePageChange(1);
                                }}
                                className="h-8 text-xs w-28 border-slate-200"
                            >
                                <option value="">Estado: Todos</option>
                                <option value="true">Activos</option>
                                <option value="false">Inactivos</option>
                            </AdminSelect>

                            <AdminSelect
                                value={destacadoFilter.value || ""}
                                onChange={(e) => {
                                    destacadoFilter.setValue(e.target.value);
                                    handlePageChange(1);
                                }}
                                className="h-8 text-xs w-32 border-slate-200"
                            >
                                <option value="">Destacado: Todos</option>
                                <option value="true">Destacados</option>
                                <option value="false">No Destacados</option>
                            </AdminSelect>
                        </div>
                    }
                />

                <AdminActiveFilters
                    items={activeFiltersList}
                    onRemove={handleRemoveFilter}
                    onClearAll={clearAllFilters}
                />
            </div>

            {/* Scroll horizontal único para la tabla */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-[13px] border-collapse min-w-[800px]">
                    <AdminTableHead>
                        <tr>
                            <AdminTableHeaderCell width="320px">Producto</AdminTableHeaderCell>
                            <AdminTableHeaderCell width="140px">SKU</AdminTableHeaderCell>
                            <AdminTableHeaderCell width="110px" align="right">Precio</AdminTableHeaderCell>
                            <AdminTableHeaderCell width="100px" align="center">Stock</AdminTableHeaderCell>
                            <AdminTableHeaderCell width="100px" align="center">Estado</AdminTableHeaderCell>
                            <AdminTableHeaderCell width="110px" align="center">Destacado</AdminTableHeaderCell>
                            <AdminTableHeaderCell width="70px" align="right">Acciones</AdminTableHeaderCell>
                        </tr>
                    </AdminTableHead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {productList.length === 0 ? (
                            <AdminTableEmpty
                                title="No se encontraron productos"
                                description="Intenta modificar los filtros o los términos de búsqueda."
                                colSpan={7}
                            />
                        ) : (
                            productList.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                                    <AdminTableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                                                {p.imagenes?.[0] ? (
                                                    <Image
                                                        src={p.imagenes[0]}
                                                        alt={p.nombre}
                                                        width={40}
                                                        height={40}
                                                        className="h-full w-full object-contain"
                                                        quality={60}
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 font-medium">S/I</span>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-0.5">
                                                <Link
                                                    href={`/admin/products/${p._id}`}
                                                    className="text-xs font-semibold text-slate-900 hover:underline block truncate"
                                                >
                                                    {p.nombre}
                                                </Link>
                                                {p.isFrontPage && (
                                                    <span className="inline-block text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                                        FrontPage
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </AdminTableCell>

                                    <AdminTableCell>
                                        <span className="text-xs text-slate-600 font-mono">
                                            {p.sku || "—"}
                                        </span>
                                    </AdminTableCell>

                                    <AdminTableCell align="right" bold>
                                        S/ {p.precio?.toFixed(2)}
                                    </AdminTableCell>

                                    <AdminTableCell align="center">
                                        <span className="text-xs font-medium text-slate-700">
                                            {p.stock ?? 0}
                                        </span>
                                    </AdminTableCell>

                                    <AdminTableCell align="center">
                                        <StatusBadge
                                            size="sm"
                                            status={p.isActive ? "active" : "draft"}
                                            label={p.isActive ? "Activo" : "Inactivo"}
                                        />
                                    </AdminTableCell>

                                    <AdminTableCell align="center">
                                        {p.esDestacado ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                                                Destacado
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">—</span>
                                        )}
                                    </AdminTableCell>

                                    <AdminTableCell align="right">
                                        <ProductMenuAction productId={p._id} slug={p.slug} />
                                    </AdminTableCell>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="w-full shrink-0 border-t border-slate-200">
                <AdminTablePagination
                    currentPage={activePage}
                    totalPages={totalPages}
                    pageSize={itemsPerPage}
                    totalItems={totalProducts}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </div>
    );
}