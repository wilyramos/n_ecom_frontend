import { Metadata } from "next";
import { getProductsMainPage } from "@/src/services/products";
// import FilterSidebar from "@/components/filters/filter-sidebar";
import ProductGrid from "@/components/product/product-grid";
import Pagination from "@/components/ui/Pagination";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

// 1. Tipado de Props (Next.js 15 utiliza Promesas para params)
interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

// 2. GENERATE METADATA: SEO Dinámico para Google
// Permite que cada combinación de búsqueda/categoría tenga su propio título e indexación
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const params = await searchParams;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const query = params.q ? `Resultados para "${params.q}"` : "Catálogo de Productos";
    const category = params.category ? ` en ${params.category}` : "";
    const page = params.page ? ` - Página ${params.page}` : "";

    return {
        title: `${query}${category}${page} | neoshop`,
        description: `Encuentra los mejores productos de ${query}${category}. Calidad, garantía oficial y envíos a todo el país.`,
        alternates: {
            canonical: `${baseUrl}/search`, // Agrupa la autoridad de todas las páginas de búsqueda en la principal
        },
        robots: {
            // Evitamos indexar búsquedas internas muy profundas o vacías para ahorrar "Crawl Budget"
            index: true,
            follow: true,
        },
        openGraph: {
            title: `${query} | neoshop`,
            description: `Explora nuestra selección de productos.`,
            url: `${baseUrl}/search`,
            type: "website",
        },
    };
}

// 3. SERVER COMPONENT PRINCIPAL
export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;

    // Ejecución del Fetch Único (Single Fetch)
    const data = await getProductsMainPage({
        page: Number(params.page) || 1,
        limit: 24,
        query: params.q,
        category: params.category,
        priceRange: params.priceRange,
        sort: params.sort,
        ...params, // Atributos dinámicos
    });

    if (!data) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-xl font-bold text-[var(--store-text)]">
                    Error al cargar los productos
                </h2>
                <p className="text-[var(--store-text-muted)]">Por favor, intenta de nuevo más tarde.</p>
            </div>
        );
    }
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": params.q ? `Búsqueda: ${params.q}` : "Catálogo de Productos",
        "numberOfItems": data.totalProducts,
        "itemListElement": data.products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${process.env.NEXT_PUBLIC_BASE_URL}/productos/${product.slug}`,
        })),
    };

    // 5. DEFINICIÓN DE BREADCRUMBS
    const breadcrumbSegments = [{ label: "Catálogo", href: "/productos" }];
    if (params.category) {
        breadcrumbSegments.push({ label: params.category, href: `/search?category=${params.category}` });
    }

    return (
        <div className="bg-[var(--store-bg)] min-h-screen">
            {/* Inyección de Schema.org en el <head> a través del body */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />

            <div className="container mx-auto px-4 py-8">
                {/* Navegación y Título */}
                <header className="mb-8">
                    <Breadcrumbs 
                        items={[
                            { label: "Inicio", href: "/" },
                            ...breadcrumbSegments
                        ]}
                    />
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--store-text)] mt-4 tracking-tight">
                        {params.q ? `Resultados para "${params.q}"` : "Explorar Catálogo"}
                    </h1>
                    {data.totalProducts > 0 && (
                        <p className="text-sm text-[var(--store-text-muted)] mt-2 font-medium">
                            {data.totalProducts} productos encontrados
                        </p>
                    )}
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* COLUMNA IZQUIERDA: Filtros (Client Component) */}
                    {/* <aside className="w-full lg:w-64 shrink-0">
                        <div className="sticky top-24">
                            {data.filters && data.filters.length > 0 ? (
                                <FilterSidebar filters={data.filters[0]} />
                            ) : (
                                <div className="p-4 border border-[var(--store-border)] rounded-xl bg-[var(--store-surface)]">
                                    <p className="text-xs text-[var(--store-text-muted)] text-center">
                                        No hay filtros disponibles para esta búsqueda.
                                    </p>
                                </div>
                            )}
                        </div>
                    </aside> */}

                    {/* COLUMNA DERECHA: Resultados */}
                    <main className="flex-1">
                        {data.products.length > 0 ? (
                            <div className="space-y-12">
                                <ProductGrid products={data.products} />

                                {/* Paginación con soporte para SEO (links reales) */}
                                <div className="flex justify-center border-t border-[var(--store-border)] pt-8">
                                    <Pagination
                                        pathname="/search"
                                        currentPage={data.currentPage}
                                        totalPages={data.totalPages}
                                        limit={24}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 px-4 border border-[var(--store-border)] border-dashed rounded-3xl bg-[var(--store-surface)] text-center">
                                
                                <h3 className="text-xl font-semibold text-[var(--store-text)]">
                                    No encontramos lo que buscas
                                </h3>
                                <p className="text-[var(--store-text-muted)] max-w-xs mt-2">
                                    Prueba ajustando los filtros o revisando la ortografía de tu búsqueda.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}