// File: frontend/src/schemas/page.schema.ts

import { z } from "zod";

const RESERVED_SLUGS = [
    "admin", "api", "pos", "staff", "auth", "carrito", "catalogo", 
    "categorias", "checkout", "checkout-result", "colecciones", 
    "libro-de-reclamaciones", "novedades", "ofertas", "productos", 
    "profile", "search", "track-order", "login", "registro", "perfil"
];

export const PageSeoSchema = z.object({
    metaTitle: z.string().optional().or(z.literal('')),
    metaDescription: z.string().optional().or(z.literal('')),
});

export type PageSeo = z.infer<typeof PageSeoSchema>;

export const PageSchema = z.object({
    _id: z.string(),
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    isActive: z.boolean(),
    seo: PageSeoSchema.optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Page = z.infer<typeof PageSchema>;

export const PageResponseSchema = z.object({
    ok: z.boolean(),
    data: PageSchema,
});

export type PageResponse = z.infer<typeof PageResponseSchema>;

export const PaginatedPagesResponseSchema = z.object({
    ok: z.boolean(),
    data: z.array(PageSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        pages: z.number(),
        limit: z.number(),
    }),
});

export type PaginatedPagesResponse = z.infer<typeof PaginatedPagesResponseSchema>;

export const DeletePageResponseSchema = z.object({
    ok: z.boolean(),
    message: z.string(),
    id: z.string(),
});

export type DeletePageResponse = z.infer<typeof DeletePageResponseSchema>;

export const PageFormSchema = z.object({
    title: z.string().min(1, 'El título de la página es requerido'),
    slug: z.string().optional().or(z.literal('')),
    content: z.string().min(1, 'El contenido de la página es requerido'),
    isActive: z.boolean().default(true),
    seo: PageSeoSchema.optional(),
}).refine(
    (data) => {
        if (!data.slug) return true;
        return !RESERVED_SLUGS.includes(data.slug.trim().toLowerCase());
    },
    {
        message: "Esta ruta está reservada por el sistema y no puede ser utilizada.",
        path: ["slug"]
    }
);

export type PageFormData = z.infer<typeof PageFormSchema>;

export const PagesQuerySchema = z.object({
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(10),
});

export type PagesQuery = z.infer<typeof PagesQuerySchema>;