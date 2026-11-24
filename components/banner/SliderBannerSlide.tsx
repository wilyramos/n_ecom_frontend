// File: src/components/banner/SliderBannerSlide.tsx
import type { SliderBanner } from "@/src/schemas/slider.schema";
import LayoutImageOnly from "./layouts/LayoutImageOnly";
import LayoutBackgroundMedia from "./layouts/LayoutBackgroundMedia";

interface Props {
    banner: SliderBanner;
    isPriority?: boolean;
}

/** Solo dos estilos: medio a pantalla completa, o medio de fondo con texto. */
export function SliderBannerSlide({ banner, isPriority = false }: Props) {
    if (banner.design.layout === "background-media") {
        return <LayoutBackgroundMedia banner={banner} isPriority={isPriority} />;
    }
    return <LayoutImageOnly banner={banner} isPriority={isPriority} />;
}
