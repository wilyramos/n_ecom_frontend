import { notFound } from "next/navigation";
import { getCatalogDataNewArrivals } from "@/src/services/catalog";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import type { Metadata } from "next";
import CatalogPageWrapper from "@/components/catalog/CatalogPageWrapper";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {

    console.log("Generando metadata para Novedades con searchParams:", await searchParams);
    return {
        title: "Novedades | neoshop",
        description: "Lo último en tecnología premium.",
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
            />
        </CatalogPageWrapper>
    );
}