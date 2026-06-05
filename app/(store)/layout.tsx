// File: frontend/app/(store)/layout.tsx

import Footer from "@/components/home/Footer";
import NavBar from "@/components/navigation/NavBar";
import { metadata as globalMetadata } from "@/app/layout";
import type { Metadata } from "next";
import WhatsappButton from "@/components/home/WhatsappButton";
import ScrollToTop from "@/components/navigation/ScrollToTop";

// Extendemos metadata global para esta sección
export const metadata: Metadata = {
    ...globalMetadata,
    title: {
        default: "NeoShop",
        template: "%s",
    },
    description:
        "Sección principal de la tienda NeoShop: productos, compras, cuenta y soporte.",
    openGraph: {
        ...globalMetadata.openGraph,
        title: "NeoShop",
        description:
            "Productos, compras, cuenta y soporte dentro de la tienda NeoShop.",
        url: "https://neoshop.pe/productos",
        images: [
            {
                url: "https://neoshop.pe/favicon.ico",
                width: 1200,
                height: 630,
                alt: "NeoShop Tienda"
            }
        ]
    },
    twitter: {
        ...globalMetadata.twitter,
        title: "NeoShop | Tienda",
        description:
            "Explora productos, compras y soporte en la tienda NeoShop.",
        images: ["https://neoshop.pe/favicon.ico"]
    },
    alternates: {
        canonical: "https://neoshop.pe/catalogo"
    }
};


export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollToTop /> 
            <section className="flex flex-col min-h-screen">
                <header className="relative z-40">
                    <NavBar />
                </header>

                <main className="flex-1 pt-24 md:pt-28">
                    {children}
                </main>

                <Footer />
            </section>

            <WhatsappButton />
        </>
    );
}