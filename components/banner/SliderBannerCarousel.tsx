"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { SliderBannerSlide } from "./SliderBannerSlide";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { CarouselDot } from "./CarouselDot";
import {CarouselArrow} from "@/components/ui/CarouselArrow";

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
        <div className="w-full  mx-auto flex flex-col-reverse md:flex-row items-center gap-8 py-8 px-4">

            {/* Lado izquierdo: Contenido Fijo */}
      
            {/* Lado derecho: Carrusel */}
            <div className="w-full ">
                <Carousel
                    responsive={responsive}
                    infinite
                    autoPlay
                    autoPlaySpeed={autoPlaySpeed}
                    showDots={banners.length > 1}
                    containerClass="w-full"
                    customLeftArrow={<CarouselArrow direction="left" />}
                    customRightArrow={<CarouselArrow direction="right" />}
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