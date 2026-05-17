"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { SliderBannerSlide } from "./SliderBannerSlide";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { CarouselDot } from "./CarouselDot";
// import { CarouselArrow } from "./CarouselArrow";

interface Props {
    banners: SliderBanner[];
    /** Alto del banner. Default: "420px" mobile / "460px" desktop */
    height?: {
        mobile?: string;
        desktop?: string;
    };
}

const responsive = {
    all: { breakpoint: { max: 4000, min: 0 }, items: 1 },
};

export default function SliderBannerCarousel({
    banners,
    height = { mobile: "600px", desktop: "640px" },
}: Props) {
    if (!banners.length) return null;

    const autoPlaySpeed = 5000;

    return (
        <div
            className="relative w-full max-w-7xl mx-auto"
             style={{
                "--banner-h-mobile": height.mobile,
                "--banner-h": height.desktop,
            } as React.CSSProperties}
        >
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={autoPlaySpeed}
                arrows={false}
                showDots={banners.length > 1}
                containerClass="w-full"
                dotListClass="!bottom-4 md:!bottom-6"
                customDot={<CarouselDot autoPlaySpeed={autoPlaySpeed} />}
                // customLeftArrow={<CarouselArrow direction="left" />}
                // customRightArrow={<CarouselArrow direction="right" />}
            >
                {banners.map((banner) => (
                    <SliderBannerSlide key={banner._id} banner={banner} />
                ))}
            </Carousel>
        </div>
    );
}