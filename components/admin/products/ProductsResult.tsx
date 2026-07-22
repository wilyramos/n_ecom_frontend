import { getProductsByAdmin } from "@/src/services/products";
import ProductsTable from "@/components/admin/products/ProductsTable";
import DataTablePagination from "@/components/ui/DataTablePagination";
import { getCategories } from "@/src/services/categorys";

type ProductsResultProps = {
    currentPage: number;
    itemsPerPage: number;
    params: {
        query?: string;
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

    const totalProducts = productsData?.totalProducts ?? 0;
    const totalPages = productsData?.totalPages ?? 1;

    return (
        <div className="flex flex-col flex-1 min-h-0 space-y-4">
            <div className="flex-1 min-h-0 overflow-hidden">
                <ProductsTable
                    products={productsData}
                    categories={categories}
                    itemsPerPage={itemsPerPage}
                />
            </div>

            <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalProducts}
                limit={itemsPerPage}
                pathname="/admin/products"
                itemLabel="productos"
            />
        </div>
    );
}