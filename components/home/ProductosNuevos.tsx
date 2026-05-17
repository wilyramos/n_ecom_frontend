import { getNewProducts } from '@/src/services/products';
import ClientCarouselProductosNuevos from './ClientCarouselProductosNuevos';

export default async function ProductosNuevos() {
    const newProducts = await getNewProducts();

    if (!newProducts || newProducts.products.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto py-5 ">
            <div className=" mx-auto space-y-2">
                <ClientCarouselProductosNuevos products={newProducts.products} />
            </div>
        </section>
    );
}