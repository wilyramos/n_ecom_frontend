// File: frontend/app/admin/products/new/page.tsx

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CreateProductForm from "@/components/admin/products/CreateProductForm";
import { getCategories } from "@/src/services/categorys";
import { getActiveBrands } from "@/src/services/brands";
import { linesService } from "@/src/services/lines.service";
import { getProduct } from "@/src/services/products";

import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/src/components/admin/layout/admin-page-header";
import { AdminButton } from "@/src/components/admin/layout/admin-button";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function NewProductPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;
    const duplicateId = params.duplicate;

    // Parallel Data Fetching
    const [categorias, brands, lines, duplicateProduct] = await Promise.all([
        getCategories(),
        getActiveBrands(),
        linesService.getAllActive(),
        duplicateId ? getProduct(duplicateId as string) : Promise.resolve(null),
    ]);

    const initialData = duplicateProduct
        ? {
              ...duplicateProduct,
              _id: "",
              nombre: `${duplicateProduct.nombre} (Copia)`,
          }
        : undefined;

    return (
        <AdminPageContainer maxWidth="default" padding="default" spacing="default">
            <AdminPageHeader
                title={duplicateProduct ? "Duplicar Producto" : "Nuevo Producto"}
                actions={
                    <AdminButton variant="outline" size="sm" icon={ArrowLeft}>
                        <Link href="/admin/products">
                            <span>Volver a Productos</span>
                        </Link>
                    </AdminButton>
                }
            />

            <CreateProductForm
                categorias={categorias}
                brands={brands}
                lines={lines}
                initialData={initialData}
            />
        </AdminPageContainer>
    );
}