// File: src/components/catalog/CatalogGrid-NEW.tsx
"use client";

import type { TApiProduct } from "@/src/schemas/index";
import ProductCard from "../home/product/ProductCard";
import { LuSearchX, LuShoppingBag } from "react-icons/lu";
import Link from "next/link";

interface Props {
    products: TApiProduct[];
    isFallback: boolean;
}

export default function CatalogGrid({ products, isFallback }: Props) {
    // CASO A: NO HAY RESULTADOS EXACTOS (FALLBACK)
    if (isFallback) {
        return (
            <div className="py-8 md:py-12 space-y-8 animate-in fade-in duration-700">
                {/* Mensaje de "No encontrado" */}
                <div className="bg-[var(--color-surface-secondary)] rounded-xl p-8 md:p-12 text-center max-w-2xl mx-auto border border-[var(--color-border-default)]">
                    <div className="w-16 h-16 bg-[var(--color-surface-primary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[var(--color-border-default)]">
                        <LuSearchX className="w-8 h-8 text-[var(--color-fg-secondary)]" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[var(--color-fg-primary)] mb-3">
                        No encontramos coincidencias exactas
                    </h2>
                    <p className="text-[var(--color-fg-secondary)] mb-8 max-w-md mx-auto text-sm">
                        Intenta ajustar tus filtros, eliminar la selección de línea o buscar términos más generales.
                    </p>
                    <Link
                        href="/catalogo"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-bold rounded-lg text-[var(--color-fg-inverse)] bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] transition-colors duration-200"
                    >
                        Ver todo el catálogo
                    </Link>
                </div>

                {/* Separador de Sugerencias */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-[var(--color-border-default)]"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-[var(--color-surface-primary)] px-4 text-xs font-bold uppercase tracking-widest text-[var(--color-fg-secondary)]">
                            Podría interesarte
                        </span>
                    </div>
                </div>

                {/* Grid de Sugerencias */}
                {products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // CASO B: GRID VACÍO (NI SIQUIERA FALLBACK)
    if (!products || products.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-[var(--color-fg-secondary)] border border-dashed border-[var(--color-border-default)] rounded-xl bg-[var(--color-surface-secondary)] bg-opacity-30">
                <LuShoppingBag className="w-12 h-12 mb-4 opacity-30" />
                <p className="font-medium text-sm">No hay productos disponibles.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  animate-in fade-in slide-in-from-bottom-4 duration-500">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}