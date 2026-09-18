// File: frontend/app/admin/products/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import SpinnerLoading from "@/components/ui/SpinnerLoading";
import ProductsResultsAdmin from "@/components/admin/products/ProductsResult";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminActionBar } from "@/src/components/admin/layout/admin-action-bar";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    query?: string;
    nombre?: string;
    sku?: string;
    category?: string;
    isActive?: string;
    esDestacado?: string;
    precioSort?: "asc" | "desc";
    stockSort?: "asc" | "desc";
}>;

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const itemsPerPage = Number(params.limit) || 10;

    return (
        <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
            {/* Barra de Acciones Globales del Módulo */}
            <AdminActionBar>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors shadow-2xs cursor-pointer"
                >
                    <Plus className="h-3.5 w-3.5 stroke-[2]" />
                    <span>Nuevo Producto</span>
                </Link>
            </AdminActionBar>

            {/* Resultados y Tabla */}
            <Suspense fallback={<SpinnerLoading />}>
                <ProductsResultsAdmin
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    params={params}
                />
            </Suspense>
        </AdminPageContainer>
    );
}