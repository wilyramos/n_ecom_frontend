import { notFound } from "next/navigation";
import { getCatalogData } from "@/src/services/catalog";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import type { Metadata } from "next";

// Definición de Props para Next.js 15
type Props = {
    params: Promise<{ slug?: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// =====================================================================
// METADATA - SEO
// =====================================================================
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;

    const slugs = slug || [];

    // Obtenemos los datos (deduplicado automáticamente por Next.js)
    const data = await getCatalogData(slugs, resolvedSearchParams);

    if (!data) return { title: "Catálogo | GoPhone" };

    const { categoryName, brandName, lineName, searchQuery } = data.context;

    // 1. Construcción Inteligente del Título
    let title = "Catálogo de Tecnología";

    if (searchQuery) {
        title = `Resultados para "${searchQuery}"`;
    } else {
        const parts = [];

        // Prioridad de especificidad
        if (lineName) parts.push(lineName);
        if (brandName) parts.push(brandName);
        if (categoryName) parts.push(categoryName);

        if (parts.length > 0) {
            title = parts.join(" ");
        }
    }

    const fullTitle = `${title} | GoPhone`;
    const description = `Compra ${title} al mejor precio en Perú. Envíos a todo el país y garantía oficial. Descubre ofertas en ${brandName || 'tecnología'} y más.`;

    // 2. URL Canónica
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gophone.pe";
    const canonicalPath = slugs.length > 0 ? `/catalogo/${slugs.join("/")}` : "/catalogo";

    return {
        title: fullTitle,
        description: description,
        alternates: {
            canonical: `${baseUrl}${canonicalPath}`,
        },
        openGraph: {
            title: fullTitle,
            description: description,
            url: `${baseUrl}${canonicalPath}`,
            siteName: "GoPhone",
            images: [
                {
                    url: `${baseUrl}/images/og-catalog.jpg`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: "es_PE",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description: description,
        },
        robots: {
            // Evitar indexar búsquedas internas o páginas vacías
            index: !data.isFallback && !searchQuery,
            follow: true,
        },
    };
}

// =====================================================================
// COMPONENT - PÁGINA PRINCIPAL
// =====================================================================
export default async function Page({ params, searchParams }: Props) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;

    const slugs = slug || [];

    // Llamada al servicio
    const data = await getCatalogData(slugs, resolvedSearchParams);

    if (!data) return notFound();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gophone.pe";

    // 1. Schema de Migas de Pan (Breadcrumbs)
    const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Catálogo", "item": `${baseUrl}/catalogo` },
        ]
    };

    // Agregar slugs al breadcrumb si existen
    if (data.context.categoryName) {
        breadcrumbList.itemListElement.push({
            "@type": "ListItem",
            "position": 3,
            "name": data.context.categoryName,
            "item": `${baseUrl}/catalogo/${slugs.join('/')}`
        });
    }

    if (data.context.brandName) {
        breadcrumbList.itemListElement.push({
            "@type": "ListItem",
            "position": breadcrumbList.itemListElement.length + 1,
            "name": data.context.brandName,
            "item": `${baseUrl}/catalogo/${slugs.join('/')}`
        });
    }

    if (data.context.lineName) {
        breadcrumbList.itemListElement.push({
            "@type": "ListItem",
            "position": breadcrumbList.itemListElement.length + 1,
            "name": data.context.lineName,
            "item": `${baseUrl}/catalogo/${slugs.join('/')}`
        });
    }

    // 2. Schema de Colección
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": data.context.searchQuery ? `Resultados para ${data.context.searchQuery}` : "Catálogo de Productos",
        "description": "Explora nuestra variada selección de tecnología.",
        "url": `${baseUrl}/catalogo/${slugs.join('/')}`,
        "numberOfItems": data.pagination.totalItems,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": data.products.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${baseUrl}/producto/${product.slug}`,
                "name": product.nombre
            }))
        }
    };

    return (
        <>
            {/* Inyección de Datos Estructurados para SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />

            {/* Componente de Layout */}
            <CatalogLayout
                products={data.products}
                filters={data.filters}
                pagination={data.pagination}
                context={data.context}
                isFallback={data.isFallback}
            />
        </>
    );
}