// File: frontend/app/(store)/page.tsx

import { Metadata } from "next";
import { metadata as globalMetadata } from "@/app/layout";
import ProductosDestacados from "@/components/home/ProductosDestacados";
import CategoriasDestacadasWrapper from "@/components/home/CategoriasDestacadasWrapper";
import FeatureCards from "@/components/home/FeatureCards";
import GoogleReviews from "@/components/home/GoogleReviews";
import CarruselPrincipal from "@/components/home/CarruselPrincipal";
import StoreLocation from "@/components/home/StoreLocation";
import BrandsList from "@/components/home/BrandsList";
import HomepageSectionsWrapper from "@/components/home/sections/HomepageSectionsWrapper";
import GlobalAdContainer from "@/components/home/GlobalAdContainer";
import PowerpayBanner from "@/src/components/powerpay/PowerpayBanner";

export const metadata: Metadata = {
    ...globalMetadata,
    title: {
        default: "Neoshop importaciones",
        template: "%s / Neoshop importaciones",
    },
    description: "Neoshop es tu tienda de productos apple en Perú. Encuentra iPhones, accesorios y tecnología de calidad a precios competitivos. ¡Visítanos y descubre lo mejor!",
    keywords: [
        "Neoshop", "tienda iPhone ", "venta de celulares ", "accesorios para celulares",
        "tecnología en ", "comprar iPhone ", "gadgets ", "tienda online ", "Neoshop Perú",
        "cases y fundas ", "cargadores y cables ", "auriculares y audífonos ",
        "repuestos y reparación de celulares", "ofertas de tecnología ", "smartphones en ",
        "tienda de tecnología en ", "iPhone", "audífonos", "cases"
    ],
    openGraph: {
        ...globalMetadata.openGraph,
        title: "Neoshop - ",
        description: "Compra los productos Apple a un precio increíble en Neoshop, tu tienda de tecnología de confianza en . Encuentra iPhones, accesorios y más.",
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
        description: "Compra iPhones, accesorios y más en Neoshop, tu tienda online de confianza en .",
        images: ["https://Neoshop.pe/favicon.ico"],
    }
};

export default function HomePage() {
    return (
        <div className="w-full">
            <GlobalAdContainer />

            <section>
                <CarruselPrincipal />
            </section>

            <section>
                <FeatureCards />
            </section>



            <section>
                <CategoriasDestacadasWrapper />
            </section>

                        <section className="max-w-7xl container mx-auto px-4 md:px-6 my-4">
                <PowerpayBanner />
            </section>

            <section>
                <ProductosDestacados />
            </section>

            <section className="my-5">
                <BrandsList />
            </section>

            <section>
                <HomepageSectionsWrapper />
            </section>

            <section className="py-5">
                <GoogleReviews />
            </section>

            <section>
                <StoreLocation />
            </section>
        </div>
    );
}