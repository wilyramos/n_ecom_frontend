"use client";

import Carousel from "react-multi-carousel";
import Image from "next/image";
import Link from "next/link";
import { ImageOff, ArrowRight } from "lucide-react";
import type { CategoryListResponse } from "@/src/schemas";
import { routes } from "@/lib/routes";

// const AbsoluteHeaderWrapper = (p: ButtonGroupProps) => (
//     <div className="absolute inset-x-0 top-0 z-20 px-4 md:px-8">
//         <HeaderConTituloConControles
//             {...p}
//             viewAllHref="/categorias"
//         />
//     </div>
// );

export default function ClientCarouselCategorias({ categorias }: { categorias: CategoryListResponse }) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 4 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 4 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 3, partialVisibilityGutter: 20 }
    };

    return (
        <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-4">
            <Carousel
                responsive={responsive}
                infinite
                autoPlaySpeed={6000}
                arrows={false}
                renderButtonGroupOutside
                // customButtonGroup={<AbsoluteHeaderWrapper />}
                itemClass="px-2 md:px-3 py-4"
                partialVisible
            >
                {categorias.map(c => (
                    <Link
                        key={c._id}
                        href={routes.catalog({ category: c.slug })}
                        className="group flex flex-col transition-all duration-500"
                    >
                        {/* Contenedor de Imagen: Sin bordes pesados, fondo muy suave */}
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--color-bg-tertiary)] transition-all duration-500 ">
                            {c.image ? (
                                <Image
                                    src={c.image}
                                    alt={c.nombre}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-102"

                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-[var(--color-text-tertiary)] opacity-20">
                                    <ImageOff size={40} strokeWidth={1} />
                                </div>
                            )}
                        </div>

                        {/* Textos: Jerarquía Pequeño/Normal */}
                        <div className="mt-4 px-1 space-y-0.5">

                            <div className="flex items-center justify-between">
                                <h3 className="text-xs md:text-base text-[var(--color-text-primary)]">
                                    {c.nombre}
                                </h3>
                                <ArrowRight
                                    size={14}
                                    className="text-[var(--color-action-primary)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                                />
                            </div>
                        </div>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}