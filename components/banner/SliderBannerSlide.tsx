// File: src/components/banner/SliderBannerSlide.tsx
import type { SliderBanner } from "@/src/schemas/slider.schema";
import LayoutImageOnly from "./layouts/LayoutImageOnly";
import LayoutDefault from "./layouts/LayoutDefault";
import LayoutMediaLeft from "./layouts/LayoutMediaLeft";
import LayoutBackgroundMedia from "./layouts/LayoutBackgroundMedia";

interface Props {
    banner: SliderBanner;
    isPriority?: boolean; // Nuevo prop
}

export function SliderBannerSlide({ banner, isPriority = false }: Props) {
    switch (banner.design.layout) {
        case "image-only": return <LayoutImageOnly banner={banner} isPriority={isPriority} />;
        case "media-left": return <LayoutMediaLeft banner={banner} isPriority={isPriority} />;
        case "background-media": return <LayoutBackgroundMedia banner={banner} isPriority={isPriority} />;
        default: return <LayoutDefault banner={banner} isPriority={isPriority} />;
    }
}