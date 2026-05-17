import ProductCard from "./ProductCard";
import { getProductsRelated } from "@/src/services/products";

export default async function ProductosRelated({ slug }: { slug: string }) {
    const productsRelated = await getProductsRelated(slug);

    // console.log(productsRelate);
    if (!productsRelated || productsRelated.length === 0) {
        return null;
    }

    return (
        <section className=" flex flex-col  mx-auto ">
            <h2 className="text-md  tracking-tighter text-[var(--color-text-primary)] ">
                Tambien te puede interesar
            </h2>
            <div>
                <div className="border-b border-2 border-black w-14 md:w-20 mb-4"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-start">
                {productsRelated.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                ))}
            </div>
        </section>
    );
}
