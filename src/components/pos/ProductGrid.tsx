"use client";

import React from 'react';
import { Product } from "@/src/schemas/product.schema";
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 animate-in fade-in duration-300">
            {products.map((product) => (
                <ProductCard 
                    key={product._id} 
                    product={product} 
                />
            ))}
        </div>
    );
};