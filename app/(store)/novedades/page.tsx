import { notFound } from "next/navigation";
import { getCatalogDataNewArrivals } from "@/src/services/catalog";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import type { Metadata } from "next";
import CatalogPageWrapper from "@/components/catalog/CatalogPageWrapper";
import { absoluteUrl } from "@/lib/site";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {

    console.log("Generando metadata para Novedades con searchParams:", await searchParams);
    return {
        title: "Novedades",
        description: "Descubre lo último en tecnología en Neoshop Importaciones: nuevos iPhone, iPad, MacBook, accesorios y más, con envíos a todo el Perú.",
        alternates: {
            canonical: absoluteUrl("/novedades"),
        },
        openGraph: {
            title: "Novedades | Neoshop",
            description: "Lo último en tecnología premium.",
            url: absoluteUrl("/novedades"),
            type: "website",
        },
    };
}

export default async function NewsPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;
    const data = await getCatalogDataNewArrivals(resolvedSearchParams);

    if (!data) return notFound();

    return (
        <CatalogPageWrapper
            badge="Novedades"
            title={
                <>Descubre lo <span className="text-[var(--color-accent-warm)] font-light italic">nuevo.</span></>
            }
            description="Explora la última generación de dispositivos y accesorios cuidadosamente seleccionados."
        >
            <CatalogLayout
                products={data.products}
                filters={data.filters}
                pagination={data.pagination}
                context={{ ...data.context, categoryName: "Novedades" }}
                isFallback={data.isFallback}
                titleAs="h2" // el h1 lo pone CatalogPageWrapper
            />
        </CatalogPageWrapper>
    );
}