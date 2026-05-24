import { notFound } from "next/navigation";
import { getCatalogDataOffers } from "@/src/services/catalog";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import type { Metadata } from "next";
import CatalogPageWrapper from "@/components/catalog/CatalogPageWrapper";


// Props para Next.js 15
type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// --- SEO Dinámico para Ofertas ---
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {

    const resolvedSearchParams = await searchParams;
    console.log("Search params en metadata de ofertas: ", resolvedSearchParams);

    return {
        title: "Ofertas y Liquidación | neoshop",
        description: "Aprovecha descuentos exclusivos en celulares, audio y accesorios. Precios rebajados por tiempo limitado en neoshop Perú.",
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/ofertas`,
        },
        openGraph: {
            title: "Ofertas Exclusivas | neoshop",
            description: "Tecnología premium a precios de oportunidad.",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ofertas`,
            type: "website",
        }
    };
}


export default async function OffersPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;
    const data = await getCatalogDataOffers(resolvedSearchParams);

    if (!data) return notFound();

    const offersContext = {
        ...data.context,
        categoryName: "Ofertas",
        searchQuery: null 
    };

    return (
        <CatalogPageWrapper
            badge="Liquidación"
            title={
                <>Oportunidades <span className="text-[var(--color-accent-warm)] font-light italic">únicas.</span></>
            }
            description="Aprovecha descuentos exclusivos y stock limitado en productos seleccionados."
        >
            <CatalogLayout
                products={data.products}
                filters={data.filters}
                pagination={data.pagination}
                context={offersContext}
                isFallback={data.isFallback}
            />
        </CatalogPageWrapper>
    );
}