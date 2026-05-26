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
        searchQuery: z.string().nullable(),
    }),
    isFallback: z.boolean(),
});

export type CatalogFilters = z.infer<typeof CatalogFiltersSchema>;
export type CatalogResponse = z.infer<typeof CatalogResponseSchema>;
export type FilterItem = z.infer<typeof FilterItemSchema>;