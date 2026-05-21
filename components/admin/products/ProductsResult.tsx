import { getProductsByAdmin } from '@/src/services/products';
import ProductsTable from '@/components/admin/products/ProductsTable';
import Pagination from '@/components/ui/Pagination';
import { getCategories } from '@/src/services/categorys';
import { getBrands } from '@/src/services/brands';


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
    params
}: ProductsResultProps) {

    // Fetch products data using the provided parameters
    const productsData = await getProductsByAdmin({
        page: currentPage,
        limit: itemsPerPage,
        ...params
    });

    // traer todas las categorías para el filtro y las marcas
    const categories = await getCategories();
    const brands = await getBrands();

    // console.log("Products data:", productsData);
return (
    <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-hidden">
            <ProductsTable
                products={productsData}
                categories={categories}
                brands={brands}
            />
        </div>
        <div className="py-2 shrink-0">
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