import type { Metadata } from "next";
import type { ReactNode } from "react";
import { metadata as globalMetadata } from "@/app/layout";
import Footer from "@/components/home/Footer";
import WhatsappButton from "@/components/home/WhatsappButton";
import NavBar from "@/components/navigation/NavBar";
import ScrollToTop from "@/components/navigation/ScrollToTop";
import PowerpayHeader from "@/src/components/powerpay/PowerpayHeader";

const BASE_URL = "https://www.neoshopimportaciones.com";
const DEFAULT_IMAGE = `${BASE_URL}/miniaturagris.png`;

export const metadata: Metadata = {
    ...globalMetadata,
    title: {
        default: "Neoshop | Tienda online",
        template: "%s | Neoshop",
    },
    description:
        "Explora el catálogo de Neoshop Importaciones y descubre productos tecnológicos, accesorios y novedades. Encuentra información sobre compras, pagos y soporte.",
    openGraph: {
        ...globalMetadata.openGraph,
        type: "website",
        siteName: "Neoshop Importaciones",
        title: "Neoshop | Tienda online",
        description:
            "Explora el catálogo de Neoshop Importaciones y descubre productos tecnológicos, accesorios y novedades.",
        images: [
            {
                url: DEFAULT_IMAGE,
                width: 1200,
                height: 630,
                alt: "Neoshop Importaciones",
            },
        ],
    },
    twitter: {
        ...globalMetadata.twitter,
        card: "summary_large_image",
        title: "Neoshop | Tienda online",
        description:
            "Explora el catálogo de Neoshop Importaciones y descubre productos tecnológicos, accesorios y novedades.",
        images: [DEFAULT_IMAGE],
    },
};

export default function StoreLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <>
            <ScrollToTop />
            <PowerpayHeader />
            <section className="flex min-h-screen flex-col">
                <header className="sticky top-0 z-50 w-full">
                    <NavBar />
                </header>
                <main className="flex-1">{children}</main>
                <Footer />
            </section>
            <WhatsappButton />
        </>
    );
}