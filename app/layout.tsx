//File: frontend/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MercadoPagoProvider from "@/components/provider/MercadoPagoProvider";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://gophone.pe"),
    title: {
        default: "GoPhone - Calidad a tu alcance",
        template: "%s | GoPhone"
    },
    description:
        "iPhones, accesorios, repuestos y tecnología con envío rápido en Perú. GoPhone: calidad, garantía y atención personalizada desde Cañete.",
    keywords: [
        "GoPhone",
        "iPhone Perú",
        "Apple",
        "Accesorios iPhone",
        "Tecnología",
        "Repuestos iPhone",
        "Tienda online",
        "Cañete",
        "San Vicente",
        "Imperial",
        "Asia",
        "Lunahuana",
        "Electrónica",
        "Smartphones",
        "Gadgets",
        "Ofertas",
        "Promociones",
        "Envío rápido",
        "Garantía"
    ],
    authors: [{ name: "GoPhone", url: "https://gophone.pe" }],
    creator: "GoPhone",
    openGraph: {
        title: "GoPhone | Calidad a tu alcance",
        description:
            "Compra iPhones, accesorios y repuestos con garantía y envío rápido. GoPhone: tecnología confiable desde Cañete para todo el Perú.",
        url: "https://gophone.pe",
        siteName: "GoPhone",
        locale: "es_PE",
        type: "website",
        images: [
            {
                url: "https://gophone.pe/logob.svg",
                width: 1200,
                height: 630,
                alt: "GoPhone Perú - iPhones y Tecnología"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "GoPhone | Calidad a tu alcance",
        description:
            "Tecnología con garantía, precios competitivos y atención personalizada. Compra iPhones y accesorios con envío rápido.",
        images: ["https://gophone.pe/logomini.svg"]
    },
    icons: {
        icon: "/logobw.jpg",
        apple: "/logobw.jpg",
        shortcut: "/logobw.jpg"
    },
    alternates: {
        canonical: "https://gophone.pe"
    },
    category: "technology"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <html lang="es">
            <body
                className={`${poppins.className} bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]`}
            >
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                    <MercadoPagoProvider />
                    {children}
                    <Toaster
                        theme="light"
                        expand
                        position="top-center"
                        duration={5000}
                        richColors={true}
                    />
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}