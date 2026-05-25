"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { SliderBannerSlide } from "./SliderBannerSlide";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { CarouselDot } from "./CarouselDot";
import Link from "next/link";

interface Props {
    banners: SliderBanner[];
    height?: { mobile?: string; desktop?: string };
}

const responsive = {
    all: { breakpoint: { max: 4000, min: 0 }, items: 1 },
};

export default function SliderBannerCarousel({ banners }: Props) {
    if (!banners.length) return null;

    const autoPlaySpeed = 5000;

    return (
        // flex-col-reverse pone el carrusel (el segundo elemento) arriba en móvil
        // md:flex-row restaura el orden a la izquierda (texto) y derecha (carrusel)
        <div className="w-full max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 py-8 px-4">

            {/* Lado izquierdo: Contenido Fijo */}
            {/* Lado izquierdo: Contenido Fijo */}
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-fg-muted">
                    Tecnología que evoluciona contigo
                </h1>
                <p className="text-xs md:text-lg text-fg-muted">
                    Descubre lo mejor de Apple. Rendimiento, diseño y calidad en cada detalle.
                </p>

                {/* Contenedor del botón con centrado */}
                <div className="flex justify-center md:justify-start">
                    <Link
                        href="/catalogo"
                        className="inline-block bg-fg-muted text-white text-xs md:text-base px-4 py-2 font-semibold hover:opacity-90 transition rounded-lg"
                    >
                        Ver catálogo
                    </Link>
                </div>
            </div>

            {/* Lado derecho: Carrusel */}
            <div className="w-full md:w-1/2">
                <Carousel
                    responsive={responsive}
                    infinite
                    autoPlay
                    autoPlaySpeed={autoPlaySpeed}
                    arrows={false}
                    showDots={banners.length > 1}
                    containerClass="w-full"
                    dotListClass="!bottom-4"
                    customDot={<CarouselDot autoPlaySpeed={autoPlaySpeed} />}
                >
                    {banners.map((banner) => (
                        <SliderBannerSlide key={banner._id} banner={banner} />
                    ))}
                </Carousel>
            </div>
        </div>
    );
}