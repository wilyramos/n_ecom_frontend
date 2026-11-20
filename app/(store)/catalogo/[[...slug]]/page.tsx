//File: frontend/app/%28store%29/catalogo/%5B%5B...slug%5D%5D/page.tsx
import { notFound } from "next/navigation";
import { getCatalogData } from "@/src/services/catalog";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import type { Metadata } from "next";
import type { CatalogResponse } from "@/src/schemas/catalog";
import { routes } from "@/lib/routes";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site";

// Definición de Props para Next.js 15
type Props = {
    params: Promise<{ slug?: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type SearchParams = Awaited<Props["searchParams"]>;

/**
 * Una URL de catálogo es válida solo si todos sus slugs se resolvieron a
 * una categoría, marca o línea. Si el backend aún no envía `unresolvedSlugs`
 * (despliegue antiguo), se exige al menos un contexto resuelto.
 */
function hasInvalidSlugs(slugs: string[], data: CatalogResponse): boolean {
    if (slugs.length === 0) return false;

    const { unresolvedSlugs, categoryName, brandName, lineName } = data.context;
    if (Array.isArray(unresolvedSlugs)) return unresolvedSlugs.length > 0;

    return !categoryName && !brandName && !lineName;
}

/** Ruta canónica en orden fijo categoría → marca → línea. */
function getCanonicalPath(slugs: string[], data: CatalogResponse): string {
    const { categorySlug, brandSlug, lineSlug } = data.context;

    if (categorySlug || brandSlug || lineSlug) {
        return routes.catalog({
            category: categorySlug ?? undefined,
            brand: brandSlug ?? undefined,
            line: lineSlug ?? undefined,
        });
    }

    return slugs.length > 0 ? `/catalogo/${slugs.join("/")}` : "/catalogo";
}

function getPageNumber(searchParams: SearchParams): number {
    const raw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
    const page = Number.parseInt(raw ?? "1", 10);
    return Number.isFinite(page) && page > 1 ? page : 1;
}

// =====================================================================
// METADATA - SEO
// =====================================================================
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;

    const slugs = slug || [];

    const data = await getCatalogData(slugs, resolvedSearchParams);

    if (!data || hasInvalidSlugs(slugs, data)) notFound();

    const { categoryName, brandName, lineName, searchQuery } = data.context;

    // 1. Construcción del título (la plantilla del layout añade "| Neoshop")
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

    const page = getPageNumber(resolvedSearchParams);
    const pageSuffix = page > 1 ? ` - Página ${page}` : "";

    const description = `Compra ${title} al mejor precio en Perú. Envíos a todo el país y garantía oficial. Descubre ofertas en ${brandName || 'tecnología'} y más.`;

    // 2. URL canónica: ruta normalizada; la paginación conserva ?page=N,
    //    el resto de filtros (orden, precio, atributos) apunta a la URL limpia.
    const canonicalPath = getCanonicalPath(slugs, data);
    const canonicalUrl = absoluteUrl(page > 1 ? `${canonicalPath}?page=${page}` : canonicalPath);

    return {
        title: `${title}${pageSuffix}`,
        description: description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${title} | Neoshop`,
            description: description,
            url: canonicalUrl,
            siteName: SITE_NAME,
            images: [
                {
                    url: DEFAULT_OG_IMAGE,
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
            title: `${title} | Neoshop`,
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

    if (!data || hasInvalidSlugs(slugs, data)) return notFound();

    const { categorySlug, brandSlug, lineSlug } = data.context;
    const canonicalPath = getCanonicalPath(slugs, data);

    // 1. Schema de Migas de Pan (Breadcrumbs) con URL progresiva por nivel
    const breadcrumbItems: Array<{ name: string; path: string }> = [
        { name: "Inicio", path: "/" },
        { name: "Catálogo", path: "/catalogo" },
    ];

    if (data.context.categoryName) {
        breadcrumbItems.push({
            name: data.context.categoryName,
            path: categorySlug ? routes.catalog({ category: categorySlug }) : canonicalPath,
        });
    }

    if (data.context.brandName) {
        breadcrumbItems.push({
            name: data.context.brandName,
            path: brandSlug
                ? routes.catalog({ category: categorySlug ?? undefined, brand: brandSlug })
                : canonicalPath,
        });
    }

    if (data.context.lineName) {
        breadcrumbItems.push({
            name: data.context.lineName,
            path: lineSlug
                ? routes.catalog({
                    category: categorySlug ?? undefined,
                    brand: brandSlug ?? undefined,
                    line: lineSlug,
                })
                : canonicalPath,
        });
    }

    const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": absoluteUrl(item.path),
        })),
    };

    // 2. Schema de Colección
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": data.context.searchQuery ? `Resultados para ${data.context.searchQuery}` : "Catálogo de Productos",
        "description": "Explora nuestra variada selección de tecnología.",
        "url": absoluteUrl(canonicalPath),
        "numberOfItems": data.pagination.totalItems,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": data.products.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": absoluteUrl(`/productos/${encodeURIComponent(product.slug)}`),
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
