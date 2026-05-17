// File: frontend/app/(store)/page.tsx

import { Metadata } from "next";
import { metadata as globalMetadata } from "@/app/layout";
import ProductosNuevos from "@/components/home/ProductosNuevos";
import ProductosDestacados from "@/components/home/ProductosDestacados";
import CategoriasDestacadasWrapper from "@/components/home/CategoriasDestacadasWrapper";
import FeatureCards from "@/components/home/FeatureCards";
import CarruselPrincipal from "@/components/home/CarruselPrincipal";

// Metadata for SEO and social sharing
export const metadata: Metadata = {
    ...globalMetadata,
    title: {
        default: "GoPhone - Calidad a tu alcance",
        template: "%s | GoPhone",
    },
    description:
        "GoPhone es tu tienda de confianza en Cañete para la compra de celulares, accesorios y más. Ofrecemos productos de calidad, envío rápido y atención personalizada.",
    keywords: [
        "GoPhone",
        "tienda iPhone Cañete",
        "venta de celulares Cañete",
        "accesorios para celulares",
        "tecnología en Cañete",
        "comprar iPhone Cañete",
        "gadgets Cañete",
        "tienda online Cañete",
        "GoPhone Perú",
        "cases y fundas Cañete",
        "cargadores y cables Cañete",
        "auriculares y audífonos Cañete",
        "repuestos y reparación de celulares",
        "ofertas de tecnología Cañete",
        "smartphones en Cañete",
        "tienda de tecnología en Cañete",
        "iPhone",
        "audífonos",
        "cases"
    ],
    openGraph: {
        ...globalMetadata.openGraph,
        title: "GoPhone - Calidad a tu alcance",
        description:
            "En GoPhone encontrarás una amplia variedad de accesorios y productos tecnológicos en Cañete. ¡Visítanos y descubre nuestras ofertas!",
        url: "https://gophone.pe",
        images: [
            {
                url: "https://gophone.pe/favicon.ico",
                width: 1200,
                height: 630,
                alt: "GoPhone Home - Accesorios y Tecnología",
            },
        ],
    },
    twitter: {
        ...globalMetadata.twitter,
        title: "GoPhone - Venta de accesorios y tecnología en Cañete",
        description:
            "Compra iPhones, accesorios y más en GoPhone, tu tienda online de confianza en Cañete.",
        images: ["https://gophone.pe/favicon.ico"],
    }
};

export default function HomePage() {
    return (
        <>

            <section>
                <CarruselPrincipal />
            </section>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden max-w-7xl mx-auto">
                <HeroFlashSale />
                <HeroNewArrivals />
            </div> */}

            <section>
                <FeatureCards />
            </section>

            <section className="my-10">
                <CategoriasDestacadasWrapper />
            </section>

            <section>
                <ProductosDestacados />
            </section>

            <section>
                <ProductosNuevos />
            </section>

            <section className="my-5">
                {/* <BrandsList /> */}
            </section>

            <section>
                {/* <FeaturesList /> */}
            </section>
        </>
    );
}
