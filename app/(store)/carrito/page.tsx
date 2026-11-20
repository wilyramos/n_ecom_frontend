// File: frontend/app/(store)/carrito/page.tsx
import { Suspense } from "react";
import ResumenCarrito from "@/components/cart/ResumenCarrito";
import { getDestacadosProducts } from "@/src/services/products";
import ProductGridMini from "@/components/product/ProductGridMini";
import { H3 } from "@/components/ui/Typography";
import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/site";

// SEO: página transaccional/privada, no debe aparecer en buscadores.
export const metadata: Metadata = {
    title: "Carrito de compras",
    robots: NOINDEX_ROBOTS,
};

export default async function CarritoPage() {
    // Fetch paralelo en el servidor para no bloquear el renderizado
    const [destacadosData] = await Promise.all([
        getDestacadosProducts()
    ]);

    const products = destacadosData?.products || [];


    return (
        <main className="mx-auto max-w-7xl px-4 md:px-8 md:py-6 bg-background text-foreground antialiased">
            {/* Sección principal: Detalle y totales del carrito */}
            <section className="w-full">
                <ResumenCarrito />
            </section>

            {/* Sección de sugerencias: Productos destacados */}
            {products.length > 0 && (
                <section className="mt-12">
                    <H3 className="mb-6 text-fg-muted">Te puede interesar</H3>
                    {/* ProductCard usa useSearchParams(): necesita su propio Suspense
                        desde que se eliminó el loading.tsx global de la tienda. */}
                    <Suspense fallback={null}>
                        <ProductGridMini products={products} />
                    </Suspense>
                </section>
            )}
        </main>
    );
}