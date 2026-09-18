// File: frontend/app/admin/products/[id]/page.tsx

import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";

import { getProduct } from "@/src/services/products";
import { getCategories } from "@/src/services/categorys";
import { getActiveBrands } from "@/src/services/brands";
import { linesService } from "@/src/services/lines.service";

import EditProductForm from "@/components/admin/products/EditProductForm";
import DeleteProductButton from "@/components/admin/products/DeleteProductButton";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminActionBar } from "@/src/components/admin/layout/admin-action-bar";
import { AdminStatusBadge } from "@/src/components/admin/layout/admin-status-badge";

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
            <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
                <div className="p-12 flex flex-col items-center justify-center gap-3 bg-white border border-zinc-200/80 rounded-xl text-center shadow-2xs">
                    <h1 className="text-sm font-semibold text-zinc-900">Producto no encontrado</h1>
                    <p className="text-xs text-zinc-500 max-w-sm">
                        El producto solicitado no existe o fue eliminado previamente del catálogo.
                    </p>
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Volver al catálogo</span>
                    </Link>
                </div>
            </AdminPageContainer>
        );
    }

    return (
        <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
            <AdminActionBar
                leftContent={
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <span className="text-xs font-semibold text-zinc-900 truncate max-w-[260px] sm:max-w-md">
                            {product.nombre}
                        </span>
<AdminStatusBadge status={product.isActive ? "active" : "inactive"} />                        {product.sku && (
                            <span className="text-[11px] text-zinc-400 truncate">
                                SKU: {product.sku}
                            </span>
                        )}
                    </div>
                }
            >
                <div className="flex items-center gap-1.5">
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
                        title="Volver a productos"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Volver</span>
                    </Link>

                    {product.slug && (
                        <Link
                            href={`/productos/${product.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
                            title="Ver en tienda"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Ver en tienda</span>
                        </Link>
                    )}

                    <Link
                        href={`/admin/products/new?duplicate=${product._id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
                        title="Duplicar producto"
                    >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Duplicar</span>
                    </Link>

                    <DeleteProductButton productId={product._id} />
                </div>
            </AdminActionBar>

            <EditProductForm
                product={product}
                categorias={categorias}
                brands={brands}
                lines={lines}
            />
        </AdminPageContainer>
    );
}