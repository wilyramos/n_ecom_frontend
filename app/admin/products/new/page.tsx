import CreateProductForm from "@/components/admin/products/CreateProductForm";
import { getCategories } from "@/src/services/categorys";
import { getActiveBrands } from "@/src/services/brands";
import { linesService } from "@/src/services/lines.service"; // Importamos el servicio
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { getProduct } from "@/src/services/products";


type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function NewProductPage({ searchParams }: { searchParams: SearchParams }) {


    // 
    const params = await searchParams;
    const duplicateId = params.duplicate;


    // Parallel Data Fetching
    const [categorias, brands, lines, duplicateProduct] = await Promise.all([
        getCategories(),
        getActiveBrands(),
        linesService.getAllActive(), // Obtenemos líneas activas
        duplicateId ? getProduct(duplicateId as string) : Promise.resolve(null), // Si hay ID de duplicado, obtenemos ese producto
    ]);

    const initialData = duplicateProduct ? {
        ...duplicateProduct,
        _id: "", // Aseguramos que el ID no se duplique
        nombre: `${duplicateProduct.nombre} (Copia)`, // Modificamos el nombre para diferenciarlo
    } : undefined;

    return (
        <AdminPageWrapper
            title="Nuevo producto"
            actions={<>{/* Botones opcionales */}</>}
        >
            <CreateProductForm
                categorias={categorias}
                brands={brands}
                lines={lines} // Pasamos las líneas
                initialData={initialData} // Pasamos los datos iniciales para duplicar
            />
        </AdminPageWrapper>
    );
}