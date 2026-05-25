// File: src/components/banner/SliderBannerSlide.tsx
import type { SliderBanner } from "@/src/schemas/slider.schema";
import LayoutImageOnly from "./layouts/LayoutImageOnly";
import LayoutDefault from "./layouts/LayoutDefault";
import LayoutMediaLeft from "./layouts/LayoutMediaLeft";
import LayoutBackgroundMedia from "./layouts/LayoutBackgroundMedia";

interface Props {
    banner: SliderBanner;
}

export function SliderBannerSlide({ banner }: Props) {
    switch (banner.design.layout) {
        case "image-only": return <LayoutImageOnly banner={banner} />;
        case "media-left": return <LayoutMediaLeft banner={banner} />;
        case "background-media": return <LayoutBackgroundMedia banner={banner} />;
        default: return <LayoutDefault banner={banner} />;
    }
}