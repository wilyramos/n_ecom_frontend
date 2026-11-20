import type { MetadataRoute } from "next";

import { GetAllProductsSlug } from "@/src/services/products";
import { getCategories } from "@/src/services/categorys";
import { getCatalogSitemapPaths } from "@/src/services/catalog";
import type { CatalogSitemapPath } from "@/src/schemas/catalog";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

// Regenerar el sitemap cada hora (antes quedaba fijo desde el último deploy).
export const revalidate = 3600;

type Products = Awaited<ReturnType<typeof GetAllProductsSlug>>;
type Categories = Awaited<ReturnType<typeof getCategories>>;

function getValidDate(value?: string | Date | null): Date {
    if (!value) return new Date();

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? new Date() : date;
}

// Corrección: Guard de tipo genérico para preservar las propiedades de item (como updatedAt)
function isValidSlug<T extends { slug?: string | null }>(
    item: T
): item is T & { slug: string } {
    return (
        typeof item.slug === "string" &&
        item.slug.trim().length > 0
    );
}

// Prioridad relativa: páginas amplias (categoría, marca) por encima de las combinaciones.
const CATALOG_PRIORITY: Record<CatalogSitemapPath["type"], number> = {
    category: 0.7,
    brand: 0.7,
    "category-brand": 0.6,
    "category-line": 0.6,
    "category-brand-line": 0.6,
};

async function getCategoryFallbackRoutes(): Promise<MetadataRoute.Sitemap> {
    const categories: Categories = await getCategories().catch((error) => {
        console.error("Sitemap: error obteniendo categorías", error);
        return [] as Categories;
    });

    return categories
        .filter(isValidSlug)
        .map((category) => ({
            url: `${BASE_URL}/catalogo/${encodeURIComponent(category.slug)}`,
            lastModified: getValidDate(category.updatedAt),
            changeFrequency: "weekly",
            priority: 0.7,
        }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/catalogo`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/categorias`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/ofertas`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/novedades`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/hc/contacto-y-soporte`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/hc/preguntas-frecuentes`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/hc/proceso-de-compra`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/hc/politicas-de-privacidad`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/cookies`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.2,
        },
        {
            url: `${BASE_URL}/libro-de-reclamaciones`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    // Si la API falla, se publican igualmente las rutas estáticas en lugar de
    // devolver error (getCategories llama a notFound() ante una respuesta no OK).
    const [products, catalogPaths]: [Products, CatalogSitemapPath[] | null] =
        await Promise.all([
            GetAllProductsSlug().catch((error) => {
                console.error("Sitemap: error obteniendo productos", error);
                return [] as Products;
            }),
            getCatalogSitemapPaths(),
        ]);

    // Productos: /productos/[slug]
    const productRoutes: MetadataRoute.Sitemap = products
        .filter(isValidSlug)
        .map((product) => ({
            url: `${BASE_URL}/productos/${encodeURIComponent(product.slug)}`,
            lastModified: getValidDate(product.updatedAt),
            changeFrequency: "weekly",
            priority: 0.8,
        }));

    // Catálogo: combinaciones categoría / marca / línea con productos activos
    // (calculadas en el backend, sin duplicados). Si la API falla, se usan
    // las categorías como antes.
    const categoryRoutes: MetadataRoute.Sitemap = catalogPaths
        ? catalogPaths.map((entry) => ({
            url: `${BASE_URL}${entry.path
                .split("/")
                .map((segment) => encodeURIComponent(segment))
                .join("/")}`,
            lastModified: getValidDate(entry.lastModified),
            changeFrequency: "weekly",
            priority: CATALOG_PRIORITY[entry.type],
        }))
        : await getCategoryFallbackRoutes();

    // Eliminar URLs duplicadas.
    const uniqueRoutes = new Map<
        string,
        MetadataRoute.Sitemap[number]
    >();

    for (const route of [
        ...staticRoutes,
        ...categoryRoutes,
        ...productRoutes,
    ]) {
        uniqueRoutes.set(route.url, route);
    }

    return Array.from(uniqueRoutes.values());
}