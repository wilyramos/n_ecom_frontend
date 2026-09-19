// File: src/components/banner/SliderBannerCarousel.tsx
"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { SliderBannerSlide } from "./SliderBannerSlide";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { CarouselArrow } from "@/components/ui/CarouselArrow";

interface Props {
    banners: SliderBanner[];
}

const responsive = {
    all: { breakpoint: { max: 4000, min: 0 }, items: 1 },
};

export default function SliderBannerCarousel({ banners }: Props) {
    if (!banners.length) return null;

    return (
        <div className="w-full mx-auto relative">
            <div className="w-full">
                <Carousel
                    responsive={responsive}
                    infinite
                    autoPlay
                    autoPlaySpeed={9000}
                    showDots={false}
                    containerClass="w-full"
                    customLeftArrow={<CarouselArrow direction="left" />}
                    customRightArrow={<CarouselArrow direction="right" />}
                    dotListClass="!bottom-4"
                >
                    {banners.map((banner, index) => (
                        <SliderBannerSlide 
                            key={banner._id} 
                            banner={banner} 
                            // Solo el primer elemento es prioridad para la carga inicial
                            isPriority={index === 0} 
                        />
                    ))}
                </Carousel>
            </div>
        </div>
    );
}