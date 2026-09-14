// File: frontend/components/home/sections/ProductGridSection.tsx

import { SectionResponse, SectionBlock, ProductRef } from "@/src/schemas/section.schema";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import ProductCard from "@/components/home/product/ProductCard";
import type { TApiProduct } from "@/src/schemas";

interface ProductGridSectionProps {
    section: SectionResponse;
    columns: number;
}

export default function ProductGridSection({ section, columns }: ProductGridSectionProps) {
    // 👈 Comprobamos el ajuste. Usamos !== false para compatibilidad hacia atrás
    const shouldShowTitle = section.settings?.showTitle !== false;

    return (
        <section className="space-y-6">
            {shouldShowTitle && section.title && (
                <SectionHeader title={section.title} />
            )}
            <div
                className="grid gap-4 sm:gap-5"
                style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${Math.floor(100 / columns) - 2}%), 1fr))`
                }}
            >
                {/* ... Resto del componente sin cambios ... */}
                {section.blocks.map((block: SectionBlock, idx) => {
                    const product = typeof block.productId === "object" && block.productId !== null
                        ? (block.productId as ProductRef)
                        : null;

                    if (!product) {
                        if (!block.imageUrl) return null;

                        return (
                            <Link
                                key={block._id || idx}
                                href={block.linkTo || "#"}
                                className="block w-full overflow-hidden relative aspect-[4/1] min-h-[200px] sm:min-h-[250px] md:min-h-[300px] rounded-2xl"
                            >
                                <Image
                                    src={block.imageUrl}
                                    alt={block.title || "Banner promocional"}
                                    fill
                                    sizes={`(max-width: 640px) 100vw, ${Math.floor(100 / columns)}vw`}
                                    className="object-contain w-full h-full"
                                    unoptimized
                                />
                                {(block.title || block.subtitle) && (
                                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                        {block.title && (
                                            <h3 className="text-white text-lg font-black uppercase tracking-wider drop-shadow-md">
                                                {block.title}
                                            </h3>
                                        )}
                                        {block.subtitle && (
                                            <p className="text-white/90 text-xs font-medium mt-1 drop-shadow-md">
                                                {block.subtitle}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    }

                    const castedProduct = product as unknown as TApiProduct;

                    return (
                        <div key={block._id || idx} className="h-full border border-border overflow-hidden rounded-2xl">
                            <ProductCard product={castedProduct} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}