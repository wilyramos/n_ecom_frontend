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

    const autoPlaySpeed = 5000;

    return (
        <div className="w-full mx-auto relative overflow-hidden">
            <div className="w-full">
                <Carousel
                    responsive={responsive}
                    infinite
                    autoPlay
                    autoPlaySpeed={autoPlaySpeed}
                    showDots={false}
                    containerClass="w-full"
                    customLeftArrow={<CarouselArrow direction="left" />}
                    customRightArrow={<CarouselArrow direction="right" />}
                    dotListClass="!bottom-4"
                >
                    {banners.map((banner) => (
                        <SliderBannerSlide key={banner._id} banner={banner} />
                    ))}
                </Carousel>
            </div>
        </div>
    );
}