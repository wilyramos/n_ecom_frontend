"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import ProductMenuAction from "./ProductMenuActionts";
import { useColumnFilter } from "@/hooks/useColumnFilter";
import type { ProductsAPIResponse, CategoryListResponse } from "@/src/schemas";

import {
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableCell,
  AdminTableEmpty,
} from "@/src/components/admin/layout/admin-table";
import { AdminTablePagination } from "@/src/components/admin/layout/admin-table-pagination";
import { AdminFilterBar } from "@/src/components/admin/layout/admin-filter-bar";
import { AdminSelect } from "@/src/components/admin/layout/admin-form-group";
import { AdminActiveFilters } from "@/src/components/admin/layout/admin-active-filters";
import { Package } from "lucide-react";

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

  // Debounce para retrasar la actualización de la URL y la llamada a la API
  const debouncedUpdateQuery = useDebouncedCallback((value: string) => {
    updateUrlParams((params) => {
      if (value.trim()) {
        params.set("query", value.trim());
      } else {
        params.delete("query");
      }
      params.set("page", "1");
    });
  }, 400);

  const handleSearch = (value: string) => {
    setSearchQuery(value); // Actualización instantánea en el input
    debouncedUpdateQuery(value); // Envío retardado al servidor
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
    debouncedUpdateQuery.cancel();
    router.replace(pathname);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Barra de Filtros */}
      <div className="p-2.5 border-b border-zinc-200/80 bg-white space-y-2">
        <AdminFilterBar
          searchPlaceholder="Buscar por nombre, SKU o descripción..."
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
                className="h-7 text-[11px] w-36 border-zinc-200 text-zinc-700 font-medium"
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
                className="h-7 text-[11px] w-28 border-zinc-200 text-zinc-700 font-medium"
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
                className="h-7 text-[11px] w-32 border-zinc-200 text-zinc-700 font-medium"
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

      {/* Tabla con scroll horizontal garantizado */}
      <AdminTable className="min-w-[900px]">
        <AdminTableHead>
          <tr>
            <AdminTableHeaderCell width="340px">Producto</AdminTableHeaderCell>
            <AdminTableHeaderCell width="140px">SKU</AdminTableHeaderCell>
            <AdminTableHeaderCell width="110px" align="right">Precio</AdminTableHeaderCell>
            <AdminTableHeaderCell width="90px" align="center">Stock</AdminTableHeaderCell>
            <AdminTableHeaderCell width="100px" align="center">Estado</AdminTableHeaderCell>
            <AdminTableHeaderCell width="100px" align="center">Destacado</AdminTableHeaderCell>
            <AdminTableHeaderCell width="50px" align="right">Acciones</AdminTableHeaderCell>
          </tr>
        </AdminTableHead>

        <tbody className="divide-y divide-zinc-100 bg-white">
          {productList.length === 0 ? (
            <AdminTableEmpty
              title="No se encontraron productos"
              description="Intenta modificar los filtros o los términos de búsqueda aplicados."
              colSpan={7}
            />
          ) : (
            productList.map((p) => (
              <tr key={p._id} className="hover:bg-zinc-50/60 transition-colors text-xs">
                <AdminTableCell className="w-[340px]">
                  <div className="flex items-center gap-3 pr-2">
                    <div className="h-9 w-9 shrink-0 rounded-lg border border-zinc-200/80 bg-zinc-50 overflow-hidden flex items-center justify-center relative">
                      {p.imagenes?.[0] ? (
                        <Image
                          src={p.imagenes[0]}
                          alt={p.nombre}
                          fill
                          sizes="36px"
                          className="object-contain p-0.5"
                          quality={5}
                          unoptimized
                        />
                      ) : (
                        <Package className="h-4 w-4 text-zinc-300" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <Link
                        href={`/admin/products/${p._id}`}
                        className="text-xs font-medium text-zinc-900 hover:underline hover:text-blue-600 block truncate"
                        title={p.nombre}
                      >
                        {p.nombre}
                      </Link>
                      {p.isFrontPage && (
                        <span className="inline-block text-[9.5px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                          Portada
                        </span>
                      )}
                    </div>
                  </div>
                </AdminTableCell>

                <AdminTableCell className="text-zinc-600 w-[140px]">
                  <span className="truncate block" title={p.sku || ""}>
                    {p.sku || "—"}
                  </span>
                </AdminTableCell>

                <AdminTableCell align="right" bold className="text-zinc-950 font-semibold text-xs whitespace-nowrap w-[110px]">
                  S/ {p.precio?.toFixed(2)}
                </AdminTableCell>

                <AdminTableCell align="center" className="w-[90px]">
                  <span className="text-xs font-medium text-zinc-700">
                    {p.stock ?? 0}
                  </span>
                </AdminTableCell>

                <AdminTableCell align="center" className="w-[100px]">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium text-white select-none whitespace-nowrap ${
                      p.isActive ? "bg-emerald-600" : "bg-zinc-500"
                    }`}
                  >
                    {p.isActive ? "Activo" : "Inactivo"}
                  </span>
                </AdminTableCell>

                <AdminTableCell align="center" className="w-[100px]">
                  {p.esDestacado ? (
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium text-white bg-blue-600 select-none whitespace-nowrap">
                      Destacado
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400">—</span>
                  )}
                </AdminTableCell>

                <AdminTableCell align="right" className="w-[50px]">
                  <ProductMenuAction productId={p._id} slug={p.slug} />
                </AdminTableCell>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>

      {/* Paginación */}
        <AdminTablePagination
          currentPage={activePage}
          totalPages={totalPages}
          pageSize={itemsPerPage}
          totalItems={totalProducts}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
    </div>
  );
}