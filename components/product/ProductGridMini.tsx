// File: frontend/components/product/ProductGridMini.tsx
"use client";

import type { TApiProduct } from "@/src/schemas";
//File: frontend/components/home/product/ProductCard.tsx
import ProductCard from "@/components/home/product/ProductCard";


interface ProductGridMiniProps {
    products: TApiProduct[];
}

export default function ProductGridMini({ products }: ProductGridMiniProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
            {products.map((product) => (
                <div
                    key={product.slug}
                    className="border border-border/40 rounded-sm hover:border-border transition-colors duration-300 bg-background"
                >
                    {/* Reutilización directa del componente existente adaptando el tipo */}
                    {/* <ProductCardHome product={product} /> */}
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}