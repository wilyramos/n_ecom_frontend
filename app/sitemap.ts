import type { MetadataRoute } from "next";
import { GetAllProductsSlug } from "@/src/services/products";
import { getCategories } from "@/src/services/categorys";

const BASE_URL = "https://www.neoshopimportaciones.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [products, categories] = await Promise.all([
        GetAllProductsSlug(),
        getCategories(),
    ]);

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/`,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${BASE_URL}/catalogo`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/categorias`,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/ofertas`,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/novedades`,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/hc/contacto-y-soporte`,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/hc/preguntas-frecuentes`,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/hc/proceso-de-compra`,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/hc/politicas-de-privacidad`,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terminos-y-condiciones`,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/cookies`,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/libro-de-reclamaciones`,
            changeFrequency: "yearly",
            priority: 0.4,
        },
    ];

    const categoryUrls: MetadataRoute.Sitemap = categories
        .filter((category) => Boolean(category.slug))
        .map((category) => ({
            url: `${BASE_URL}/catalogo/${category.slug}`,
            ...(category.updatedAt
                ? { lastModified: new Date(category.updatedAt) }
                : {}),
            changeFrequency: "weekly",
            priority: 0.8,
        }));

    const productUrls: MetadataRoute.Sitemap = products
        .filter((product) => Boolean(product.slug))
        .map((product) => ({
            url: `${BASE_URL}/productos/${product.slug}`,
            ...(product.updatedAt
                ? { lastModified: new Date(product.updatedAt) }
                : {}),
            changeFrequency: "weekly",
            priority: 0.7,
        }));

    const uniqueUrls = new Map<string, MetadataRoute.Sitemap[number]>();

    for (const entry of [
        ...staticPages,
        ...categoryUrls,
        ...productUrls,
    ]) {
        uniqueUrls.set(entry.url, entry);
    }

    return Array.from(uniqueUrls.values());
}