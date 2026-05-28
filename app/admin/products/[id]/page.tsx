import { getProduct } from "@/src/services/products";
import { getCategories } from "@/src/services/categorys";
import { getActiveBrands } from "@/src/services/brands";
import { linesService } from "@/src/services/lines.service"; // <--- 1. Importar servicio

import EditProductForm from "@/components/admin/products/EditProductForm";
import DeleteProductButton from "@/components/admin/products/DeleteProductButton";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import Link from "next/link";
import { IoDuplicate } from "react-icons/io5";


type Params = Promise<{
    id: string;
}>;

export default async function ProductDetailsPage({ params }: { params: Params }) {
    const { id } = await params;

    const [product, categorias, brands, lines] = await Promise.all([
        getProduct(id),
        getCategories(),
        getActiveBrands(),
        linesService.getAllActive(),
    ]);

    if (!product) {
        return (
            <div className="p-6 flex flex-col items-center gap-4">
                <h1 className="text-xl text-gray-600">Producto no encontrado</h1>
                <Link
                    href="/admin/products"
                    className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded"
                >
                    Volver a productos
                </Link>
            </div>
        );
    }

    return (
        <AdminPageWrapper
            title={`Editar: ${product.nombre}`}
            actions={
                <div className="flex gap-2">
                    <Link
                        href={`/admin/products/new?duplicate=${product._id}`}
                        className="hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-1"
                    >
                        <IoDuplicate />
                        Duplicar
                    </Link>
                    <DeleteProductButton productId={product._id} />
                </div>
            }
        >
            <EditProductForm
                product={product}
                categorias={categorias}
                brands={brands}
                lines={lines}
            />
        </AdminPageWrapper>
    );
}