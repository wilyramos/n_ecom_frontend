// 

import { getProductsByAdmin } from '@/src/services/products';
import ProductsTable from '@/components/admin/products/ProductsTable';
import Pagination from '@/components/ui/Pagination';
import PageSizeSelector from '@/components/admin/products/PageSizeSelector';
import { getCategories } from '@/src/services/categorys';


type ProductsResultProps = {
    currentPage: number;
    itemsPerPage: number;
    params: {
        query?: string;
    };
};


// frontend/app/admin/products/ProductsResultsAdmin.tsx
export default async function ProductsResultsAdmin({
    currentPage,
    itemsPerPage, // Este valor vendrá del URL (ej. ?limit=20)
    params
}: ProductsResultProps) {

    const productsData = await getProductsByAdmin({
        page: currentPage,
        limit: itemsPerPage,
        ...params
    });

    const categories = await getCategories();

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-hidden">
                <ProductsTable
                    products={productsData}
                    categories={categories}
                    itemsPerPage={itemsPerPage}
                />
            </div>

            <div className="flex items-center justify-between py-2 shrink-0 border-t border-border mt-2">
                <PageSizeSelector currentLimit={itemsPerPage} />

                <Pagination
                    currentPage={currentPage}
                    totalPages={productsData?.totalPages ?? 1}
                    limit={itemsPerPage}
                    pathname="/admin/products"
                />
            </div>
        </div>
    );
}