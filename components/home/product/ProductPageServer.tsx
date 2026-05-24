// app/productos/[slug]/ProductPageServer.tsx
import ProductDetails from '@/components/home/product/ProductDetails';
import ProductosRelated from '@/components/home/product/ProductosRelated';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RecentViewed from '@/components/home/product/RecentViewed';
import type { ProductWithCategoryResponse } from '@/src/schemas';
import { routes } from "@/lib/routes";
import Link from 'next/link';
import Image from 'next/image';

type Props = {
    producto: ProductWithCategoryResponse;
};

export default async function ProductPageServer({ producto }: Props) {

    if (!producto) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center py-10 space-y-4">
                <h1 className="text-2xl font-bold text-[var(--store-text)]">Producto no encontrado</h1>
                <p className="text-[var(--store-text-muted)]">El producto que buscas no existe o ha sido retirado.</p>
            </div>
        );
    }

    const breadcrumbSegments = [
        { label: "Catálogo", href: routes.catalog() }
    ];

    // 1. Agregar Categoría
    if (producto.categoria && typeof producto.categoria === 'object') {
        breadcrumbSegments.push({
            label: producto.categoria.nombre,
            href: routes.catalog({ category: producto.categoria.slug })
        });
    }

    // 2. Agregar Marca (acumulando categoría si existe)
    if (producto.brand && typeof producto.brand === 'object') {
        breadcrumbSegments.push({
            label: producto.brand.nombre,
            href: routes.catalog({
                category: typeof producto.categoria === 'object' ? producto.categoria.slug : undefined,
                brand: producto.brand.slug
            })
        });
    }

    // 3. Agregar Línea (acumulando anteriores)
    if (producto.line && typeof producto.line === 'object') {
        breadcrumbSegments.push({
            label: producto.line.nombre,
            href: routes.catalog({
                category: typeof producto.categoria === 'object' ? producto.categoria.slug : undefined,
                brand: typeof producto.brand === 'object' ? producto.brand.slug : undefined,
                line: producto.line.slug
            })
        });
    }

    return (
        <>
            {/* Título oculto para SEO (H1 debe ser único y descriptivo) */}
            <h1 className="sr-only">
                {producto.nombre} - neoshop
            </h1>

            <section className="container mx-auto px-2 md:px-6 pt-4">
                {/* Navegación de migas de pan */}
                <Breadcrumbs
                    items={breadcrumbSegments}
                    current={producto.nombre}
                />

                <div className="flex flex-col lg:flex-row md:gap-10">
                    <div className="w-full">
                        <ProductDetails producto={producto} />
                    </div>
                </div>
            </section>

            <section>
                <section className="max-w-screen-2xl mx-auto mt-4 px-4">
                    {producto.complementarios && producto.complementarios.length > 0 && (
                        <div className="pt-8  space-y-4">
                            <h3 className="text-lg font-normal tracking-tight text-fg-primary">
                                Completa tu compra
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {producto.complementarios.map((comp) => {
                                    const isPopulated = typeof comp !== 'string';
                                    if (!isPopulated) return null;

                                    return (
                                        <Link
                                            key={comp._id}
                                            href={`/productos/${comp.slug}`}
                                            className="group flex flex-col justify-between p-3 transition-all border border-border-default rounded-md hover:border-fg-primary bg-surface-primary"
                                        >
                                            <div className="space-y-3">
                                                <div className="relative aspect-square overflow-hidden rounded bg-surface-primary w-full">
                                                    <Image
                                                        src={comp.imagenes?.[0] || "/logo.png"}
                                                        alt={comp.nombre}
                                                        fill
                                                        className="object-contain p-1 transition-transform duration-300 group-hover:scale-103"
                                                        unoptimized
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <h4 className="text-xs font-medium text-fg-primary leading-tight line-clamp-2 uppercase tracking-tight">
                                                        {comp.nombre}
                                                    </h4>
                                                </div>
                                            </div>

                                            <p className="text-sm font-semibold text-fg-primary pt-2">
                                                S/ {comp.precio.toFixed(2)}
                                            </p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>
            </section>

            {/* Productos Relacionados (Por Línea/Marca) */}
            <section className="container mx-auto px-4 md:px-6 py-4 ">
                <ProductosRelated slug={producto.slug} />
            </section>

            {/* Vistos Recientemente (Client Component) */}
            <section className="container mx-auto px-4 md:px-6 py-4">
                <RecentViewed currentProduct={producto} />
            </section>
        </>
    );
}