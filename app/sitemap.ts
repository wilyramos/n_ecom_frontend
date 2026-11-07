import type { MetadataRoute } from "next";

import { GetAllProductsSlug } from "@/src/services/products";
import { getCategories } from "@/src/services/categorys";

const BASE_URL = "https://www.neoshopimportaciones.com";

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
            url: `${BASE_URL}/colecciones`,
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

    const [products, categories]: [Products, Categories] =
        await Promise.all([
            GetAllProductsSlug(),
            getCategories(),
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

    // Categorías: /catalogo/[slug]
    const categoryRoutes: MetadataRoute.Sitemap = categories
        .filter(isValidSlug)
        .map((category) => ({
            url: `${BASE_URL}/catalogo/${encodeURIComponent(category.slug)}`,
            lastModified: getValidDate(category.updatedAt),
            changeFrequency: "weekly",
            priority: 0.7,
        }));

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