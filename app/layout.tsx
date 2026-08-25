// File: frontend/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, Inter } from "next/font/google";
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MercadoPagoProvider from "@/components/provider/MercadoPagoProvider";
import Script from 'next/script';

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-montserrat",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://www.neoshopimportaciones.com"),
    title: {
        default: "Neoshop Importaciones",
        template: "%s | Neoshop Importaciones"
    },
    description: "iPhones, accesorios, repuestos y tecnología con envío rápido en Perú. Neoshop: calidad, garantía y atención personalizada desde Lima - Perú.",
    keywords: [
        "Neoshop", "iPhone Perú", "Apple", "Accesorios iPhone", "Tecnología",
        "Repuestos iPhone", "Tienda online", "Lima - Perú", "Electrónica"
    ],
    authors: [{ name: "Neoshop Importaciones", url: "https://www.neoshopimportaciones.com" }],
    creator: "Neoshop Importaciones",
    openGraph: {
        title: "Neoshop Importaciones | Tienda de Tecnología",
        description: "Compra iPhones, accesorios y repuestos con garantía y envío rápido.",
        url: "https://www.neoshopimportaciones.com",
        siteName: "Neoshop Importaciones",
        locale: "es_PE",
        type: "website",
        images: [{ url: "https://www.neoshopimportaciones.com/miniaturagris.png", width: 1200, height: 630, alt: "Neoshop Importaciones" }]
    },
    twitter: {
        card: "summary_large_image",
        title: "Neoshop Importaciones",
        description: "Tecnología con garantía, precios competitivos y atención personalizada.",
        images: ["https://www.neoshopimportaciones.com/miniaturagris.png"]
    },
    icons: { icon: "/favicon.ico", apple: "/favicon.ico", shortcut: "/favicon.ico" },
    alternates: { canonical: "https://www.neoshopimportaciones.com" },
    category: "technology"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const isProd = process.env.NEXT_PUBLIC_POWERPAY_ENV === 'production';
    const cdnBase = isProd
        ? 'https://components-bnpl-pe-bbva-production.moprestamo.com'
        : 'https://components-bnpl-pe-bbva-green.moprestamo.com';

    return (
        <html lang="es" className={`${montserrat.variable} ${inter.variable}`}>
            <head>
                {/* CSS Oficial de los Widgets Powerpay */}
                <link rel="stylesheet" href={`${cdnBase}/css/config.css`} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Neoshop Importaciones",
                            "url": "https://www.neoshopimportaciones.com",
                            "logo": "https://www.neoshopimportaciones.com/miniaturagris.png",
                            "description": "Tienda online de iPhone, accesorios y tecnología en Perú",
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+51-902-900-653",
                                "contactType": "Customer Service",
                                "availableLanguage": ["es"]
                            }
                        }),
                    }}
                />
            </head>
            <body className={`${montserrat.className}`}>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                    <MercadoPagoProvider />
                    {children}
                    <Toaster
                        theme="light"
                        expand
                        position="top-center"
                        duration={5000}
                        richColors={false}
                    />
                </GoogleOAuthProvider>

                {/* Script ESM de Powerpay Web Components */}
                <Script
                    type="module"
                    src={`${cdnBase}/cdn/dist/powerpay-components/powerpay-components.esm.js`}
                    strategy="lazyOnload"
                />
            </body>
        </html>
    );
}