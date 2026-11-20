// File: src/schemas/catalog.ts
import { z } from "zod";
import { ApiProductSchema } from "./index";

const FilterItemSchema = z.object({
    id: z.string(),
    nombre: z.string(),
    slug: z.string(),
    count: z.number().optional().default(0),
});

export const CatalogFiltersSchema = z.object({
    brands: z.array(FilterItemSchema).default([]),
    lines: z.array(FilterItemSchema).default([]),
    categories: z.array(FilterItemSchema).default([]),
    
    // Transformamos dinámicamente: si llega un string, lo vuelve objeto
    atributos: z.array(
        z.object({
            name: z.string(),
            values: z.array(
                z.preprocess(
                    (val) => typeof val === "string" ? { value: val, count: 0 } : val,
                    z.object({
                        value: z.string(),
                        count: z.number()
                    })
                )
            )
        })
    ).default([]),
    
    price: z.array(
        z.object({
            min: z.number().nullable().optional(),
            max: z.number().nullable().optional()
        })
    ).default([]),
});

export const CatalogResponseSchema = z.object({
    products: z.array(ApiProductSchema),
    pagination: z.object({
        currentPage: z.number(),
        totalPages: z.number(),
        totalItems: z.number(),
    }),
    filters: CatalogFiltersSchema,
    context: z.object({
        categoryName: z.string().nullable(),
        brandName: z.string().nullable(),
        lineName: z.string().nullable(),
        // Campos SEO (solo los envía /catalog/resolve; opcionales para el resto de endpoints)
        categorySlug: z.string().nullable().optional(),
        brandSlug: z.string().nullable().optional(),
        lineSlug: z.string().nullable().optional(),
        unresolvedSlugs: z.array(z.string()).optional(),
        searchQuery: z.string().nullable(),
    }),
    isFallback: z.boolean(),
});

export type CatalogFilters = z.infer<typeof CatalogFiltersSchema>;
export type CatalogResponse = z.infer<typeof CatalogResponseSchema>;
export type FilterItem = z.infer<typeof FilterItemSchema>;

// Rutas de catálogo para el sitemap (GET /api/seo/catalog-paths)
export const CatalogSitemapPathSchema = z.object({
    path: z.string().startsWith("/catalogo/"),
    type: z.enum(["category", "brand", "category-brand", "category-line", "category-brand-line"]),
    productCount: z.number(),
    lastModified: z.string(),
});

export const CatalogSitemapPathsResponseSchema = z.object({
    success: z.boolean(),
    total: z.number(),
    paths: z.array(CatalogSitemapPathSchema),
});

export type CatalogSitemapPath = z.infer<typeof CatalogSitemapPathSchema>;
