import React from "react";
import Sidebarcs from "@/components/home/clientservice/Sidebarcs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Centro de Ayuda | neoshop",
    description:
        "Encuentra soporte, políticas de compra, garantías, devoluciones y ayuda en neoshop. Atención personalizada y respuestas rápidas a tus consultas.",
    keywords: [
        "neoshop",
        "centro de ayuda",
        "soporte",
        "garantías",
        "devoluciones",
        "preguntas frecuentes",
        "contacto",
        "proceso de compra",
        "tienda online Perú",
        "atención al cliente"
    ],
    openGraph: {
        title: "Centro de Ayuda | neoshop Perú",
        description:
            "Soporte y soluciones rápidas para tus compras en neoshop. Revisa garantías, devoluciones, políticas, contacto y más.",
        url: "https://neoshopimportaciones.com/hc",
        siteName: "neoshop Perú",
        type: "website",
        images: [
            {
                url: "https://neoshopimportaciones.com/og-image.jpg", // *Si no tienes imagen aún, puedo generarte una*
                width: 1200,
                height: 630,
                alt: "Centro de Ayuda neoshop Perú"
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
    },
    authors: [{ name: "neoshop Perú" }],
    creator: "neoshop Perú",
    publisher: "neoshop Perú",
};

/* Layout optimizado para eliminar espacios muertos */
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-white text-black">
            {/* Eliminado pt-6 y pb-20 excesivos, reducido a espacios funcionales */}
            <div className="flex flex-1 w-full max-w-6xl mx-auto px-4 py-8">
                <aside className="w-64 flex-shrink-0">
                    <Sidebarcs />
                </aside>
                <main className="flex-1 pl-8">
                    {children}
                </main>
            </div>
        </div>
    );
}