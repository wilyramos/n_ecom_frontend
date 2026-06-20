// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MercadoPagoProvider from "@/components/provider/MercadoPagoProvider";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://www.neoshopimportaciones.com"),
    title: {
        default: "Neoshop Importaciones",
        template: "%s | Neoshop Importaciones"
    },
    description:
        "iPhones, accesorios, repuestos y tecnología con envío rápido en Perú. Neoshop: calidad, garantía y atención personalizada desde Lima - Perú.",
    keywords: [
        "Neoshop",
        "iPhone Perú",
        "Apple",
        "Accesorios iPhone",
        "Tecnología",
        "Repuestos iPhone",
        "Tienda online",
        "Lima - Perú",
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
    authors: [{ name: "Neoshop Importaciones", url: "https://www.neoshopimportaciones.com" }],
    creator: "Neoshop Importaciones",
    openGraph: {
        title: "Neoshop Importaciones | Tienda de Tecnología",
        description:
            "Compra iPhones, accesorios y repuestos con garantía y envío rápido. Neoshop: tecnología confiable desde Lima - Perú para todo el Perú.",
        url: "https://www.neoshopimportaciones.com",
        siteName: "Neoshop Importaciones",
        locale: "es_PE",
        type: "website",
        images: [
            {
                url: "https://www.neoshopimportaciones.com/miniaturagris.png",
                width: 1200,
                height: 630,
                alt: "Neoshop Importaciones - iPhones y Tecnología"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Neoshop Importaciones",
        description:
            "Tecnología con garantía, precios competitivos y atención personalizada. Compra iPhones y accesorios con envío rápido.",
        images: ["https://www.neoshopimportaciones.com/miniaturagris.png"]
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/favicon.ico",
        shortcut: "/favicon.ico"
    },
    alternates: {
        canonical: "https://www.neoshopimportaciones.com"
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
            <head>
                {/* JSON-LD Schema Organization - Para que Google muestre tu logo */}
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
                            "sameAs": [
                                "https://www.facebook.com/people/Neoshop-Importaciones/61574230740862/",
                                "https://www.instagram.com/neoshopimportaciones"
                            ],
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Lima",
                                "addressLocality": "Lima",
                                "addressRegion": "Lima",
                                "postalCode": "15001",
                                "addressCountry": "PE"
                            },
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "contactType": "Customer Service",
                                "telephone": "+51-902-900-653",
                                "availableLanguage": ["es"]
                            }
                        }),
                    }}
                />

                {/* JSON-LD Schema WebSite - Para búsqueda mejorada */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "Neoshop Importaciones",
                            "url": "https://www.neoshopimportaciones.com",
                            "potentialAction": {
                                "@type": "SearchAction",
                               
                                "query-input": "required name=search_term_string"
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
            </body>
        </html>
    );
}