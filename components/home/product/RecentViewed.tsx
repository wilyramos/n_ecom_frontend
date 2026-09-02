/* File: components/home/product/RecentViewed.tsx */
"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/src/store/useRecentlyViewedStore";
import ProductCard from "./ProductCard"; // Your existing component
import type { ProductWithCategoryResponse } from "@/src/schemas";

export default function RecentViewed({ currentProduct }: { currentProduct: ProductWithCategoryResponse }) {
    const { history, addProduct } = useRecentlyViewedStore();
    //
    useEffect(() => {
        if (currentProduct) {
            addProduct(currentProduct);
        }
    }, [currentProduct, addProduct]);

    // 2. Filter out the current product from the display list
    const displayProducts = history.filter((p) => p.slug !== currentProduct.slug);

    if (displayProducts.length === 0) return null;

    return (
        <section className=" bg-[var(--color-bg-primary)]">
            <header className="mb-8 px-2">

                <p className="text-lg  font-medium text-[var(--color-text-primary)] ">
                    Vistos recientemente
                </p>
                <div>
                </div>
            </header>

            {/* Premium Grid using ProductCard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {displayProducts.map((product) => (
                    <div key={product.slug} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}