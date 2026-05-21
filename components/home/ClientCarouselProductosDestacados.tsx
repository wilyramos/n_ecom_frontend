"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ButtonGroupProps } from "react-multi-carousel";
import ProductCardHome from "./product/ProductCardHome";
import type { ProductResponse } from "@/src/schemas";
import HeaderConTituloConControles from "../ui/HeaderConTituloConControles";

interface Props {
    products: ProductResponse[];
}

const AbsoluteHeaderWrapper = (props: ButtonGroupProps) => {
    return (
        <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-8">
            <HeaderConTituloConControles
                {...props}
                title={<>Destacados del momento</>}
                viewAllHref="/productos"
            />
        </div>
    );
};

export default function ClientCarouselProductosDestacados({ products }: Props) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 4 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
    };

    return (
        <section className="w-full max-w-7xl mx-auto relative pt-16 md:pt-20 px-4 md:px-8">
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={5000}
                arrows={false}
                renderButtonGroupOutside
                customButtonGroup={<AbsoluteHeaderWrapper />}
                itemClass="px-2 md:px-3 py-4"
                partialVisible
            >
                {products.map((product) => (
                    <div key={product._id} >
                        <ProductCardHome product={product} />
                    </div>
                ))}
            </Carousel>
        </section>
    );
}