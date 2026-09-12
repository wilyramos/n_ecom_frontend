// File: frontend/components/admin/products/ProductsResult.tsx

import { getProductsByAdmin } from "@/src/services/products";
import ProductsTable from "@/components/admin/products/ProductsTable";
import { getCategories } from "@/src/services/categorys";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";

type ProductsResultProps = {
    currentPage: number;
    itemsPerPage: number;
    params: {
        query?: string;
        nombre?: string;
        sku?: string;
        category?: string;
        isActive?: string;
        esDestacado?: string;
        precioSort?: "asc" | "desc";
        stockSort?: "asc" | "desc";
    };
};

export default async function ProductsResultsAdmin({
    currentPage,
    itemsPerPage,
    params,
}: ProductsResultProps) {
    const productsData = await getProductsByAdmin({
        page: currentPage,
        limit: itemsPerPage,
        ...params,
    });

    const categories = await getCategories();

    return (
        <AdminCardWrapper padding="none" className="border-slate-200 bg-white shadow-xs">
            <ProductsTable
                products={productsData}
                categories={categories}
                currentPage={productsData?.currentPage ?? currentPage}
                itemsPerPage={itemsPerPage}
            />
        </AdminCardWrapper>
    );
}