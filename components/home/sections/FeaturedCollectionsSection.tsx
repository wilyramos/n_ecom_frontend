// File: frontend/components/home/sections/FeaturedCollectionsSection.tsx

import { SectionResponse, SectionBlock } from "@/src/schemas/section.schema";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";

interface FeaturedCollectionsSectionProps {
    section: SectionResponse;
    columns: number;
}

const columnClasses: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

export default function FeaturedCollectionsSection({ section, columns }: FeaturedCollectionsSectionProps) {
    const imageFitClass = columns <= 2 ? "object-cover" : "object-contain";
    const shouldShowTitle = section.settings?.showTitle !== false;
    const gridCols = columnClasses[columns] || "grid-cols-2 md:grid-cols-4";

    return (
        <section className="space-y-4">
            {shouldShowTitle && section.title && (
                <SectionHeader title={section.title} />
            )}
            <div className={`grid ${gridCols} gap-2 sm:gap-3 md:gap-4`}>
                {section.blocks.map((block: SectionBlock, idx) => {
                    const hasTextContent = block.title || block.subtitle;

                    const FeaturedBlockContent = (
                        <div className="relative block w-full overflow-hidden aspect-[27/9] rounded-xl sm:rounded-2xl bg-muted/20">
                            {block.imageUrl ? (
                                <Image
                                    src={block.imageUrl}
                                    alt={block.title || "Colección"}
                                    fill
                                    className={`${imageFitClass} w-full h-full`}
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    priority={false}
                                    loading="lazy"
                                    quality={100}
                                    unoptimized={true}
                                />
                            ) : (
                                <div className="w-full h-full" />
                            )}

                            {hasTextContent && (
                                <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4 flex flex-col items-start gap-0.5 sm:gap-1 bg-gradient-to-t from-black/60 to-transparent">
                                    {block.title && (
                                        <h3 className="text-white font-black text-xs sm:text-base uppercase tracking-[0.05em] sm:tracking-[0.1em] drop-shadow-md truncate max-w-full">
                                            {block.title}
                                        </h3>
                                    )}
                                    {block.subtitle && (
                                        <p className="text-white/90 text-[8px] sm:text-[10px] font-medium uppercase tracking-wider line-clamp-1 drop-shadow-md">
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
                            className="block outline-none focus-visible:ring-2 focus-visible:ring-action-cta rounded-xl sm:rounded-2xl overflow-hidden group"
                        >
                            {FeaturedBlockContent}
                        </Link>
                    ) : (
                        <div key={block._id || idx} className="block overflow-hidden rounded-xl sm:rounded-2xl">
                            {FeaturedBlockContent}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}