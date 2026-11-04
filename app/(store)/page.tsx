
// File: frontend/app/(store)/page.tsx

import { Metadata } from "next";
import ProductosDestacados from "@/components/home/ProductosDestacados";
import CategoriasDestacadasWrapper from "@/components/home/CategoriasDestacadasWrapper";
import FeatureCards from "@/components/home/FeatureCards";
import GoogleReviews from "@/components/home/GoogleReviews";
import CarruselPrincipal from "@/components/home/CarruselPrincipal";
import StoreLocation from "@/components/home/StoreLocation";
import HomepageSectionsWrapper from "@/components/home/sections/HomepageSectionsWrapper";
import GlobalAdContainer from "@/components/home/GlobalAdContainer";
import PowerpayBanner from "@/src/components/powerpay/PowerpayBanner";

export const metadata: Metadata = {
    title: "Neoshop Importaciones | Tienda de tecnología en Perú",
    description: "Encuentra iPhones, iPads, MacBooks, Apple Watch, AirPods y accesorios en Neoshop Importaciones. Envíos a todo el Perú y garantía oficial.",
    keywords: [
        "Neoshop", "tienda iPhone Perú", "venta de celulares", "accesorios Apple",
        "comprar iPhone Lima", "gadgets Perú", "tienda online Apple"
    ],
    alternates: {
        canonical: "https://www.neoshopimportaciones.com",
    },
    openGraph: {
        title: "Neoshop Importaciones | Tienda de tecnología en Perú",
        description: "Compra productos Apple y tecnología al mejor precio en Perú. Envíos a todo el país y garantía oficial.",
        url: "https://www.neoshopimportaciones.com",
        siteName: "Neoshop Importaciones",
        locale: "es_PE",
        type: "website",
        images: [
            {
                url: "https://www.neoshopimportaciones.com/miniaturagris.png",
                width: 1200,
                height: 630,
                alt: "Neoshop Importaciones - Productos Apple y Tecnología",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Neoshop Importaciones | Tienda de tecnología en Perú",
        description: "Compra productos Apple y tecnología al mejor precio en Perú.",
        images: ["https://www.neoshopimportaciones.com/miniaturagris.png"],
    },
};

export default function HomePage() {
    return (
        <div className="w-full">
            <GlobalAdContainer />

            {/* Envolvemos en un flex column para controlar el flujo natural en móviles */}
            <section className="relative w-full flex flex-col">
                <CarruselPrincipal />

            </section>

            <div className="">
                <FeatureCards />
            </div>

            {/* Ajustamos el margen superior para que no choque en móviles */}
            <section>
                <CategoriasDestacadasWrapper />
            </section>

            <section className="max-w-7xl container mx-auto px-4 md:px-6 my-4">
                <PowerpayBanner />
            </section>

            <section>
                <ProductosDestacados />
            </section>
            {/* 
            <section className="my-5">
                <BrandsList />
            </section> */}

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