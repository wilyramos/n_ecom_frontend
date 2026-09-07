// File: frontend/app/(store)/layout.tsx

import Footer from "@/components/home/Footer";
import NavBar from "@/components/navigation/NavBar";
import { metadata as globalMetadata } from "@/app/layout";
import type { Metadata } from "next";
import WhatsappButton from "@/components/home/WhatsappButton";
import ScrollToTop from "@/components/navigation/ScrollToTop";
import PowerpayHeader from "@/src/components/powerpay/PowerpayHeader";

export const metadata: Metadata = {
    ...globalMetadata,
    title: {
        default: "Neoshop",
        template: "%s",
    },
    description: "Sección principal de la tienda Neoshop: productos, compras, cuenta y soporte.",
    openGraph: {
        ...globalMetadata.openGraph,
        title: "Neoshop",
        description: "Productos, compras, cuenta y soporte dentro de la tienda Neoshop.",
        url: "https://neoshop.pe/productos",
        images: [
            {
                url: "https://neoshop.pe/favicon.ico",
                width: 1200,
                height: 630,
                alt: "Neoshop Tienda"
            }
        ]
    },
    twitter: {
        ...globalMetadata.twitter,
        title: "Neoshop | Tienda",
        description: "Explora productos, compras y soporte en la tienda Neoshop.",
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

            <PowerpayHeader />

            <section className="flex flex-col min-h-screen">
                <header className="w-full z-50 sticky top-0">
                    <NavBar />
                </header>

                <main className="flex-1">
                    {children}
                </main>

                <Footer />
            </section>

            <WhatsappButton />
        </>
    );
}