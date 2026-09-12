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
import { AdminPageHeader } from "@/src/components/admin/layout/admin-page-header";
import { AdminButton } from "@/src/components/admin/layout/admin-button";
import { StatusBadge } from "@/components/ui/status-badge";

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
            <AdminPageContainer maxWidth="default" padding="default" spacing="default">
                <div className="p-12 flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl text-center shadow-xs">
                    <h1 className="text-sm font-semibold text-slate-900">Producto no encontrado</h1>
                    <p className="text-xs text-slate-500 max-w-sm">
                        El producto solicitado no existe o fue eliminado previamente del catálogo.
                    </p>
                    <AdminButton  variant="outline" size="sm">
                        <Link href="/admin/products">
                            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                            <span>Volver al catálogo</span>
                        </Link>
                    </AdminButton>
                </div>
            </AdminPageContainer>
        );
    }

    return (
        <AdminPageContainer maxWidth="default" padding="default" spacing="default">
            <AdminPageHeader
                title={product.nombre}
                description={
                    <div className="flex items-center gap-2 mt-1">
                        <StatusBadge
                            size="sm"
                            status={product.isActive ? "active" : "draft"}
                            label={product.isActive ? "Activo" : "Inactivo"}
                        />
                        {product.sku && (
                            <span className="text-xs text-slate-500 font-mono">
                                SKU: {product.sku}
                            </span>
                        )}
                    </div>
                }
                actions={
                    <div className="flex items-center gap-2">
                        <AdminButton  variant="outline" size="sm">
                            <Link href="/admin/products" className="flex items-center gap-1">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Volver</span>
                            </Link>
                        </AdminButton>

                        {product.slug && (
                            <AdminButton  variant="outline" size="sm" >
                                <Link href={`/productos/${product.slug}`} target="_blank" className="flex items-center gap-1">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Ver en tienda</span>
                                </Link>
                            </AdminButton>
                        )}

                        <AdminButton  variant="outline" size="sm">
                            <Link href={`/admin/products/new?duplicate=${product._id}`} className="flex items-center gap-1">
                                <Copy className="w-3.5 h-3.5" />
                                <span>Duplicar</span>
                            </Link>
                        </AdminButton>

                        <DeleteProductButton productId={product._id} />
                    </div>
                }
            />

            <EditProductForm
                product={product}
                categorias={categorias}
                brands={brands}
                lines={lines}
            />
        </AdminPageContainer>
    );
}