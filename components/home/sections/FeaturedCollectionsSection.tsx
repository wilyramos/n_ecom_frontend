// File: frontend/components/home/sections/FeaturedCollectionsSection.tsx

import { SectionResponse, SectionBlock } from "@/src/schemas/section.schema";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";

interface FeaturedCollectionsSectionProps {
    section: SectionResponse;
    columns: number;
}

export default function FeaturedCollectionsSection({ section, columns }: FeaturedCollectionsSectionProps) {
    const imageFitClass = columns <= 2 ? "object-cover" : "object-contain";
    
    // Comprobamos el ajuste. Usamos !== false para compatibilidad hacia atrás
    const shouldShowTitle = section.settings?.showTitle !== false;

    return (
        <section className="space-y-4">
            {shouldShowTitle && section.title && (
                <SectionHeader title={section.title} />
            )}
            <div
                className="grid gap-2"
                style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${Math.floor(100 / columns) - 2}%), 1fr))`
                }}
            >
                {/* ... Resto del componente sin cambios ... */}
                {section.blocks.map((block: SectionBlock, idx) => {
                    const hasTextContent = block.title || block.subtitle;

                    const FeaturedBlockContent = (
                        <div 
                            // Cambiado aspect-[4/1] por aspect-[27/9] (o aspect-[3/1] que es la proporción simplificada)
                            className="relative block w-full overflow-hidden aspect-[27/9] min-h-[200px] sm:min-h-[250px] md:min-h-[300px] rounded-2xl bg-muted/20"
                        >
                            {block.imageUrl ? (
                                <Image
                                    src={block.imageUrl}
                                    alt={block.title || "Colección"}
                                    fill
                                    className={`${imageFitClass} w-full h-full`}
                                    priority={idx < 3}
                                    unoptimized={true}
                                />
                            ) : (
                                <div className="w-full h-full" />
                            )}

                            {hasTextContent && (
                                <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col items-start gap-1 bg-gradient-to-t from-black/60 to-transparent">
                                    {block.title && (
                                        <h3 className="text-white font-black text-base uppercase tracking-[0.1em] drop-shadow-md">
                                            {block.title}
                                        </h3>
                                    )}
                                    {block.subtitle && (
                                        <p className="text-white/90 text-[10px] font-medium uppercase tracking-widest line-clamp-1 drop-shadow-md">
                                            {block.subtitle}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );

                    return block.linkTo ? (
                        <Link
                            key={block._id || idx}
                            href={block.linkTo}
                            className="block outline-none focus-visible:ring-2 focus-visible:ring-action-cta rounded-2xl overflow-hidden group"
                        >
                            {FeaturedBlockContent}
                        </Link>
                    ) : (
                        <div key={block._id || idx} className="block overflow-hidden rounded-2xl">
                            {FeaturedBlockContent}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}