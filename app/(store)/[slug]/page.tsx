// File: frontend/app/(store)/[slug]/page.tsx

import { notFound } from "next/navigation";
import { PageService } from "@/src/services/page-service";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

/**
 * Generación dinámica de metadatos (SEO) controlada
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const page = await PageService.getPageBySlug(slug);
        
        return {
            title: page.seo?.metaTitle || `${page.title} | Neoshop`,
            description: page.seo?.metaDescription || `Información oficial y detalles sobre ${page.title}.`,
            openGraph: {
                title: page.seo?.metaTitle || page.title,
                description: page.seo?.metaDescription || `Información oficial y detalles sobre ${page.title}.`,
                type: "article",
            }
        };
    } catch (error) {
        console.error(`Error al generar metadata para la página con slug "${slug}":`, error);
        // Retornamos un objeto de metadata por defecto para evitar lanzar la excepción en el StreamingMetadataOutlet
        return {
            title: "Página no encontrada | Neoshop",
        };
    }
}

/**
 * Componente Servidor Asíncrono con control nativo de errores
 */
export default async function StoreDynamicPage({ params }: Props) {
    const { slug } = await params;
    let page = null;

    try {
        page = await PageService.getPageBySlug(slug);
    } catch (error) {
        if (error instanceof Error && error.message === "NOT_FOUND") {
            return notFound();
        }
        throw error;
    }

    if (!page) {
        return notFound();
    }

    return (
        <main className="w-full min-h-screen bg-white py-14 px-4 sm:px-6 lg:px-8">
            <article className="max-w-4xl mx-auto space-y-8">
                <header className="border-b border-zinc-100 pb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                        {page.title}
                    </h1>
                </header>

                <div 
                    className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed text-sm 
                               prose-headings:text-zinc-900 prose-headings:font-semibold 
                               prose-strong:text-zinc-900 prose-sm"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </article>
        </main>
    );
}