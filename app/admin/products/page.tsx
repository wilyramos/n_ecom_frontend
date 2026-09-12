// File: frontend/app/admin/products/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import SpinnerLoading from "@/components/ui/SpinnerLoading";
import ProductsResultsAdmin from "@/components/admin/products/ProductsResult";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/src/components/admin/layout/admin-page-header";
import { AdminButton } from "@/src/components/admin/layout/admin-button";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    query?: string;
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
        <AdminPageContainer maxWidth="default" padding="default" spacing="default">
            <AdminPageHeader
                title="Productos"
                actions={
                    <AdminButton variant="primary" size="default" icon={Plus}>
                        <Link href="/admin/products/new">
                            <span>Nuevo Producto</span>
                        </Link>
                    </AdminButton>
                }
            />

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