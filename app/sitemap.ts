// app/sitemap.ts
import { GetAllProductsSlug } from "@/src/services/products";
import { getAllSubcategories } from "@/src/services/categorys";
import { getActiveBrands } from "@/src/services/brands";
import type { MetadataRoute } from "next";

// Tipo auxiliar para asegurar que usamos strings válidos para Google
type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://www.neoshopimportaciones.com";

    // 1. Obtener Datos en Paralelo (Eficiencia máxima)
    const [products, categories, brands] = await Promise.all([
        GetAllProductsSlug(),
        getAllSubcategories(),
        getActiveBrands(),
    ]);

    // 2. URLs de Productos
    const productUrls = products.map((p) => ({
        url: `${baseUrl}/productos/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "daily" as ChangeFreq,
        priority: 0.8,
    }));

    // 3. URLs de Categorías (Landing Pages SEO)
    const categoryUrls = categories.map((c) => ({
        url: `${baseUrl}/catalogo/${c.slug}`,
        lastModified: c.updatedAt || new Date(),
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.9,
    }));

    // 4. URLs de Marcas (Landing Pages SEO)
    const brandUrls = brands.map((b) => ({
        url: `${baseUrl}/catalogo/${b.slug}`,
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.9,
    }));

    // 5. Páginas Estáticas del Sistema
    const staticPages = [
        { url: "", priority: 1.0, changefreq: "daily" as ChangeFreq },         // Home
        { url: "/catalogo", priority: 1.0, changefreq: "daily" as ChangeFreq }, // Root del catálogo
        { url: "/ofertas", priority: 0.9, changefreq: "daily" as ChangeFreq },  // Ofertas
        { url: "/novedades", priority: 0.9, changefreq: "daily" as ChangeFreq },
        { url: "/categorias", priority: 0.8, changefreq: "weekly" as ChangeFreq },

        // Páginas Legales y Soporte (Baja prioridad, cambio poco frecuente)
        { url: "/hc/contacto-y-soporte", priority: 0.6, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/preguntas-frecuentes", priority: 0.5, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/garantias-y-devoluciones", priority: 0.5, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/politicas-de-privacidad", priority: 0.3, changefreq: "yearly" as ChangeFreq },
        { url: "/terminos-y-condiciones", priority: 0.3, changefreq: "yearly" as ChangeFreq },
        { url: "/cookies", priority: 0.3, changefreq: "yearly" as ChangeFreq },

    ].map((page) => ({
        url: `${baseUrl}${page.url}`,
        lastModified: new Date(),
        changeFrequency: page.changefreq,
        priority: page.priority,
    }));

    // Retornamos todo combinado
    return [
        ...staticPages,
        ...categoryUrls,
        ...brandUrls,
        ...productUrls,
    ];
}