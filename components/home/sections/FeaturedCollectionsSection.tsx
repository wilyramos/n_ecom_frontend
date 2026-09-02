// File: frontend/components/home/product/FeaturedCollectionsSection.tsx
import { SectionResponse, SectionBlock } from "@/src/schemas/section.schema";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";

interface FeaturedCollectionsSectionProps {
    section: SectionResponse;
    columns: number;
}

export default function FeaturedCollectionsSection({ section, columns }: FeaturedCollectionsSectionProps) {
    return (
        <section className="space-y-4">
            <SectionHeader title={section.title} />
            <div
                className="grid gap-2"
                style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${Math.floor(100 / columns) - 2}%), 1fr))`
                }}
            >
                {section.blocks.map((block: SectionBlock, idx) => {
                    const FeaturedBlockContent = (
                        <div
                            className="group relative block overflow-hidden"
                            style={{
                                // Ratios de aspecto ajustados para hacer las tarjetas menos altas
                                aspectRatio: columns <= 2 ? "21/9" : columns === 3 ? "16/9" : "4/3"
                            }}
                        >
                            {block.imageUrl ? (
                                <Image
                                    src={block.imageUrl}
                                    alt={block.title || "Colección"}
                                    fill
                                    sizes={`(max-width: 640px) 100vw, ${Math.floor(100 / columns)}vw`}
                                    // Añadido padding (p-4) para hacer la imagen más pequeña dentro de su contenedor
                                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                                    priority={idx < 3}
                                    unoptimized={true}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-background-secondary to-muted" />
                            )}

                            {/* Gradiente sutil para legibilidad del texto */}
                            <div className="absolute inset-0 bg-gradient-to-t" />

                            {/* Padding y tamaños de texto reducidos */}
                            <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col items-start gap-1">
                                {block.title && (
                                    <h3 className="text-white font-black text-base uppercase tracking-[0.1em]">
                                        {block.title}
                                    </h3>
                                )}
                                {block.subtitle && (
                                    <p className="text-white/80 text-[10px] font-medium uppercase tracking-widest mt-1 line-clamp-1">
                                        {block.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    );

                    return block.linkTo ? (
                        <Link key={block._id || idx} href={block.linkTo} className="block outline-none focus-visible:ring-2 focus-visible:ring-action-cta rounded-[var(--radius-lg)]">
                            {FeaturedBlockContent}
                        </Link>
                    ) : (
                        <div key={block._id || idx} className="block">
                            {FeaturedBlockContent}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}