"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { TBrand } from "@/src/schemas/brands";
import HeaderConTituloConControles from "../ui/HeaderConTituloConControles";
import { routes } from "@/lib/routes";

const AbsoluteHeaderWrapper = (p: ButtonGroupProps) => (
    <div className="absolute inset-x-0 top-0 z-20 px-4 md:px-8">
        <HeaderConTituloConControles 
            {...p} 
            title={<>Marcas <span className="text-[var(--color-accent-warm)] font-light italic">oficiales.</span></>} 
            viewAllHref="/catalogo"
        />
    </div>
);

export default function BrandsCarousel({ brands }: { brands: TBrand[] }) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 6 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 4 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 3, partialVisibilityGutter: 20 }
    };

    return (
        <section className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-20 pb-12">
            <Carousel 
                responsive={responsive} 
                infinite 
                autoPlay 
                autoPlaySpeed={4800}
                arrows={false} 
                renderButtonGroupOutside 
                customButtonGroup={<AbsoluteHeaderWrapper />}
                itemClass="px-2 md:px-3"
            >
                {brands.map(b => (
                    <Link 
                        key={b._id} 
                        href={routes.catalog({ brand: b.slug })}
                        className="group relative flex items-center justify-center aspect-square bg-[var(--color-bg-primary)] transition-all duration-300 hover:border-[var(--color-accent-warm)] hover:shadow-lg hover:shadow-[var(--color-accent-warm)]/5"
                    >
                        {/* Contenedor del Logo */}
                        <div className="relative w-full h-full p-6 md:p-8 flex items-center justify-center">
                            {b.logo ? (
                                <Image 
                                    src={b.logo} 
                                    alt={b.nombre} 
                                    fill 
                                    className="object-contain p-4 filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" 
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-[var(--color-text-tertiary)] opacity-30">
                                    <ImageOff size={20} />
                                    <span className="text-[9px] font-bold uppercase">{b.nombre}</span>
                                </div>
                            )}
                        </div>

                        {/* Indicador de nombre sutil en hover */}
                        <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                                Ver catálogo
                            </span>
                        </div>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}