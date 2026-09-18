// File: frontend/app/admin/products/new/page.tsx

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CreateProductForm from "@/components/admin/products/CreateProductForm";
import { getCategories } from "@/src/services/categorys";
import { getActiveBrands } from "@/src/services/brands";
import { linesService } from "@/src/services/lines.service";
import { getProduct } from "@/src/services/products";

import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminActionBar } from "@/src/components/admin/layout/admin-action-bar";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const duplicateId = params.duplicate;

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
    <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
      <AdminActionBar
        leftContent={
          <span className="text-xs font-semibold text-zinc-800">
            {duplicateProduct ? "Duplicar Producto" : "Nuevo Producto"}
          </span>
        }
      >
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Volver a Productos</span>
        </Link>
      </AdminActionBar>

      <CreateProductForm
        categorias={categorias}
        brands={brands}
        lines={lines}
        initialData={initialData}
      />
    </AdminPageContainer>
  );
}