// File: frontend/app/(store)/page.tsx

import { Metadata } from "next";
import { metadata as globalMetadata } from "@/app/layout";
import ProductosDestacados from "@/components/home/ProductosDestacados";
import CategoriasDestacadasWrapper from "@/components/home/CategoriasDestacadasWrapper";
import FeatureCards from "@/components/home/FeatureCards";
import GoogleReviews from "@/components/home/GoogleReviews";

import CarruselPrincipal from "@/components/home/CarruselPrincipal";
import StoreLocation from "@/components/home/StoreLocation";
import StoreMaintenance from "@/components/home/StoreMaintenance";

// Metadata for SEO and social sharing
export const metadata: Metadata = {
    ...globalMetadata,
    title: {
        default: "Neoshop importaciones",
        template: "%s / home",
    },
    description:
        "Neoshop es tu tienda de confianza en  para la compra de celulares, accesorios y más. Ofrecemos productos de calidad, envío rápido y atención personalizada.",
    keywords: [
        "Neoshop",
        "tienda iPhone ",
        "venta de celulares ",
        "accesorios para celulares",
        "tecnología en ",
        "comprar iPhone ",
        "gadgets ",
        "tienda online ",
        "Neoshop Perú",
        "cases y fundas ",
        "cargadores y cables ",
        "auriculares y audífonos ",
        "repuestos y reparación de celulares",
        "ofertas de tecnología ",
        "smartphones en ",
        "tienda de tecnología en ",
        "iPhone",
        "audífonos",
        "cases"
    ],
    openGraph: {
        ...globalMetadata.openGraph,
        title: "Neoshop - ",
        description:
            "En Neoshop encontrarás una amplia variedad de accesorios y productos tecnológicos en . ¡Visítanos y descubre nuestras ofertas!",
        url: "https://Neoshop.pe",
        images: [
            {
                url: "https://Neoshop.pe/favicon.ico",
                width: 1200,
                height: 630,
                alt: "Neoshop Home - Accesorios y Tecnología",
            },
        ],
    },
    twitter: {
        ...globalMetadata.twitter,
        title: "Neoshop - Venta de accesorios y tecnología en ",
        description:
            "Compra iPhones, accesorios y más en Neoshop, tu tienda online de confianza en .",
        images: ["https://Neoshop.pe/favicon.ico"],
    }
};

export default function HomePage() {
    return (
        <>

            <div>
                <StoreMaintenance />
            </div>

            <section>
                <CarruselPrincipal />
            </section>

            <section>
                <FeatureCards />
            </section>

            <section className="">
                <CategoriasDestacadasWrapper />
            </section>

            <section>
                <ProductosDestacados />
            </section>

            <section>
                {/* <ProductosNuevos /> */}
            </section>


            <section className="my-5">
                {/* <BrandsList /> */}
            </section>

            <section>
                <GoogleReviews />
            </section>

            <section>
                <StoreLocation />
            </section>
        </>
    );
}
