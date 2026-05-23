//File: frontend/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
// import { Poppins } from "next/font/google";
import { Montserrat } from "next/font/google";

import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MercadoPagoProvider from "@/components/provider/MercadoPagoProvider";

// const poppins = Poppins({
//     subsets: ["latin"],
//     weight: ["400", "500", "600", "700"],
// });

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://Neoshop.pe"),
    title: {
        default: "Neoshop",
        template: "%s | Neoshop"
    },
    description:
        "iPhones, accesorios, repuestos y tecnología con envío rápido en Perú. Neoshop: calidad, garantía y atención personalizada desde Cañete.",
    keywords: [
        "Neoshop",
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
    authors: [{ name: "Neoshop", url: "https://Neoshop.pe" }],
    creator: "Neoshop",
    openGraph: {
        title: "Neoshop | Calidad a tu alcance",
        description:
            "Compra iPhones, accesorios y repuestos con garantía y envío rápido. Neoshop: tecnología confiable desde Cañete para todo el Perú.",
        url: "https://Neoshop.pe",
        siteName: "Neoshop",
        locale: "es_PE",
        type: "website",
        images: [
            {
                url: "https://Neoshop.pe/favicon.ico",
                width: 1200,
                height: 630,
                alt: "Neoshop Perú - iPhones y Tecnología"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Neoshop | Calidad a tu alcance",
        description:
            "Tecnología con garantía, precios competitivos y atención personalizada. Compra iPhones y accesorios con envío rápido.",
        images: ["https://Neoshop.pe/favicon.ico"]
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/favicon.ico",
        shortcut: "/favicon.ico"
    },
    alternates: {
        canonical: "https://Neoshop.pe"
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
                className={`${montserrat.className} `}
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