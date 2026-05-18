import { getDestacadosProducts } from '@/src/services/products';
import ClientCarouselProductosDestacados from './ClientCarouselProductosDestacados';

export default async function ProductosDestacados() {
    const destacados = await getDestacadosProducts();
    const productos = destacados?.products ?? [];

    if (!productos.length) return null;

    return (
        <section className="bg-fg-secondary py-5">
            <div className="mx-auto space-y-2">
                <ClientCarouselProductosDestacados products={productos} />
            </div>
        </section>
    );
}