"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ProductMenuAction from "./ProductMenuActionts";
import { useColumnFilter } from "@/hooks/useColumnFilter";

import type { ProductsAPIResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas";

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function ProductsTable({ 
    products, 
    categories,
    itemsPerPage = 10 
}: {
    products: ProductsAPIResponse | null;
    categories: CategoryListResponse;
    itemsPerPage?: number;
}) {
    const router = useRouter();

    const nameFilter = useColumnFilter("nombre");
    const skuFilter = useColumnFilter("sku");
    const priceSort = useColumnFilter("precioSort");
    const stockSort = useColumnFilter("stockSort");
    const activeFilter = useColumnFilter("isActive");
    const destacadoFilter = useColumnFilter("esDestacado");
    const categoryFilter = useColumnFilter("category");

    // Lógica para limitar a 10 (o itemsPerPage)
    const displayProducts = products?.products.slice(0, itemsPerPage) ?? [];
    const noProducts = !products || displayProducts.length === 0;

    const clearFilters = () => {
        [
            nameFilter,
            skuFilter,
            priceSort,
            stockSort,
            activeFilter,
            destacadoFilter,
            categoryFilter,
        ].forEach((f) => f.reset());

        router.replace(window.location.pathname);
    };

    return (
        <div className="w-full h-full overflow-auto pb-2 text-xs text-zinc-600 bg-gray-50">
            <div className="flex justify-end my-1 pr-1">
                <button
                    onClick={clearFilters}
                    className="text-[11px] font-semibold text-zinc-600 hover:text-black"
                >
                    Limpiar filtros
                </button>
            </div>

            <Table className="min-w-full table-auto border-separate border-spacing-0 text-zinc-600">
                <TableHeader className="bg-gray-50 border-b sticky top-0 shadow-sm">
                    <TableRow>
                        {[
                            nameFilter,
                            skuFilter,
                            priceSort,
                            stockSort,
                            categoryFilter,
                            activeFilter,
                            destacadoFilter,
                        ].map((filter, i) => (
                            <TableHead
                                key={i}
                                className="p-1 text-center bg-gray-50 text-zinc-600"
                            >
                                {i === 0 && (
                                    <Input
                                        placeholder="Nombre"
                                        value={nameFilter.value}
                                        onChange={(e) => nameFilter.setValue(e.target.value)}
                                        className="h-8 text-xs focus:border-black bg-gray-50 text-black placeholder:text-zinc-400"
                                    />
                                )}
                                {i === 1 && (
                                    <Input
                                        placeholder="SKU"
                                        value={skuFilter.value}
                                        onChange={(e) => skuFilter.setValue(e.target.value)}
                                        className="h-8 text-xs focus:border-black bg-gray-50 text-black placeholder:text-zinc-400"
                                    />
                                )}
                                {i === 2 && (
                                    <Select
                                        value={priceSort.value || undefined}
                                        onValueChange={priceSort.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Precio" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50 text-black">
                                            <SelectItem value="asc">Asc</SelectItem>
                                            <SelectItem value="desc">Desc</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                {i === 3 && (
                                    <Select
                                        value={stockSort.value || undefined}
                                        onValueChange={stockSort.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Stock" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50 text-black">
                                            <SelectItem value="asc">Asc</SelectItem>
                                            <SelectItem value="desc">Desc</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                {i === 4 && (
                                    <Select
                                        value={categoryFilter.value || undefined}
                                        onValueChange={categoryFilter.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Categoría" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-auto bg-gray-50 text-black">
                                            {categories.map((c) => (
                                                <SelectItem key={c._id} value={c._id}>
                                                    {c.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {i === 5 && (
                                    <Select
                                        value={activeFilter.value || undefined}
                                        onValueChange={activeFilter.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Estado" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50 text-black">
                                            <SelectItem value="true">Activos</SelectItem>
                                            <SelectItem value="false">Inactivos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                {i === 6 && (
                                    <Select
                                        value={destacadoFilter.value || undefined}
                                        onValueChange={destacadoFilter.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Destacado" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50 text-black">
                                            <SelectItem value="true">Sí</SelectItem>
                                            <SelectItem value="false">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </TableHead>
                        ))}

                        <TableHead className="p-1 text-xs w-[80px] text-zinc-600 bg-gray-50">
                            Acciones
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {noProducts ? (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="text-center py-6 text-sm text-zinc-600"
                            >
                                No se encontraron productos.
                            </TableCell>
                        </TableRow>
                    ) : (
                        displayProducts.map((p) => (
                            <TableRow
                                key={p._id}
                                className="text-xs border-b hover:bg-gray-50"
                            >
                                <TableCell className="p-2 w-[230px] text-black">
                                    <Link
                                        href={`/admin/products/${p._id}`}
                                        className="flex flex-col md:flex-row gap-1"
                                    >
                                        {p.imagenes?.[0] ? (
                                            <div className="h-8 w-8">
                                                <Image
                                                    src={p.imagenes[0]}
                                                    alt={p.nombre}
                                                    width={30}
                                                    height={30}
                                                    className="rounded border bg-gray-50 object-cover"
                                                    quality={1}
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-8 w-8 flex items-center justify-center rounded border bg-gray-100 text-zinc-400 text-[10px]">
                                                no image
                                            </div>
                                        )}
                                        <span className="line-clamp-3 max-w-[180px] text-black">
                                            {p.isFrontPage && (<span className="italic mr-1 text-orange-400 font-bold">[FrontPage]</span>)}{p.nombre}
                                        </span>
                                    </Link>
                                </TableCell>

                                <TableCell className="p-2 text-center w-[120px] text-zinc-600">
                                    {p.sku}
                                </TableCell>

                                <TableCell className="p-2 text-center w-[90px] text-black">
                                    S/{p.precio?.toFixed(2)}
                                </TableCell>

                                <TableCell className="p-2 text-center w-[90px] text-black">
                                    {p.stock}
                                </TableCell>

                                <TableCell className="p-2 text-center w-[130px] text-zinc-600">
                                    -
                                </TableCell>

                                <TableCell className="p-2 text-center w-[60px]">
                                    {p.isActive ? (
                                        <div className="flex items-center justify-center gap-1 rounded bg-green-100 text-green-600 px-1 py-0.5 text-[10px] font-semibold">
                                            Activo
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-1 rounded bg-red-100 text-red-600 px-1 py-0.5 text-[10px] font-semibold">
                                            Inactivo
                                        </div>
                                    )}
                                </TableCell>

                                <TableCell className="p-2 text-center w-[60px]">
                                    {p.esDestacado ? (
                                        <div className="flex items-center justify-center gap-1 rounded bg-green-100 text-green-600 px-1 py-0.5 text-[10px] font-semibold">
                                            Destacado
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-1 rounded bg-gray-100 text-gray-600 px-1 py-0.5 text-[10px] font-semibold">
                                            No Destacado
                                        </div>
                                    )}
                                </TableCell>

                                <TableCell className="p-2 text-center w-[80px]">
                                    <ProductMenuAction productId={p._id} slug={p.slug} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}