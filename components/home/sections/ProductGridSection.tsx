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
    return (
        <section className="space-y-6">
            <SectionHeader title={section.title} />
            <div
                className="grid gap-4 sm:gap-5"
                style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${Math.floor(100 / columns) - 2}%), 1fr))`
                }}
            >
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
                                className="group block w-full aspect-[4/1] overflow-hidden relative "
                            >
                                <Image
                                    src={block.imageUrl}
                                    alt={block.title || "Banner promocional"}
                                    fill
                                    sizes={`(max-width: 640px) 100vw, ${Math.floor(100 / columns)}vw`}
                                    className="object-contain w-full h-full transition-transform"
                                    unoptimized
                                />
                                {(block.title || block.subtitle) && (
                                    <div className="absolute inset-0 p-4 flex flex-col justify-end bg-black/30">
                                        {block.title && (
                                            <h3 className="text-white text-lg font-black uppercase tracking-wider">
                                                {block.title}
                                            </h3>
                                        )}
                                        {block.subtitle && (
                                            <p className="text-white/90 text-xs font-medium mt-1">
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
                        <div key={block._id || idx} className="h-full border border-border overflow-hidden">
                            <ProductCard product={castedProduct} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}