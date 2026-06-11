// File: frontend/src/modules/section/section.schema.ts

import { z } from "zod";

// ============================================================================
// ── ENUMS DE CONTROL (Espejo del Backend)
// ============================================================================

export const SectionTypeEnum = z.enum([
    'featured_collections',
    'product_grid',
    'rich_text'
]);
export type SectionType = z.infer<typeof SectionTypeEnum>;

// ============================================================================
// ── SUB-SCHEMAS DE SOPORTE
// ============================================================================

export const SectionSettingsSchema = z.object({
    bodyText: z.string().optional(),
    gridColumns: z.coerce.number().int().min(1).max(8).default(4) // 💡 Corregido de max(6) a max(8)
});
export type SectionSettings = z.infer<typeof SectionSettingsSchema>;

/**
 * Referencia simplificada del producto devuelto por el populate del Backend.
 */
export const ProductRefSchema = z.object({
    _id:      z.string(),
    nombre:   z.string().trim().optional().or(z.null()),
    precio:   z.number().min(0).optional().or(z.null()),
    imagenes: z.array(z.string()).optional().default([]),
    slug:     z.string().trim().optional().or(z.null()),
    stock:    z.number().int().optional().or(z.null()),
});
export type ProductRef = z.infer<typeof ProductRefSchema>;

/**
 * Bloque de contenido flexible.
 */
export const SectionBlockSchema = z.object({
    _id:       z.string().optional(),
    title:     z.string().trim().optional().or(z.literal('')),
    subtitle:  z.string().trim().optional().or(z.literal('')),
    imageUrl:  z.string().optional().or(z.literal('')),
    linkTo:    z.string().trim().optional().or(z.literal('')),
    productId: z.union([
        z.string(),
        ProductRefSchema,
        z.literal(''),
        z.null()
    ]).optional().nullable()
});
export type SectionBlock = z.infer<typeof SectionBlockSchema>;

// ============================================================================
// ── FILTROS DE CONSULTA (Para el Panel Administrativo)
// ============================================================================

export const SectionFiltersSchema = z.object({
    type:     SectionTypeEnum.optional(),
    isActive: z.boolean().optional(),
    page:     z.coerce.number().int().positive().default(1),
    limit:    z.coerce.number().int().positive().default(10)
});
export type SectionFilters = z.infer<typeof SectionFiltersSchema>;

// ============================================================================
// ── 1. DTO PARA CREAR / ACTUALIZAR SECCIÓN (REQUEST → Backend)
// ============================================================================

export const CreateSectionDTOSchema = z.object({
    title:    z.string().trim().min(2, 'El título es obligatorio (mín. 2 caracteres)'),
    type:     SectionTypeEnum,
    order:    z.coerce.number().int().nonnegative('El orden debe ser 0 o mayor').default(0),
    isActive: z.boolean().default(true),
    settings: SectionSettingsSchema,
    blocks:   z.array(SectionBlockSchema)
        .default([])
        .refine((val) => val.length <= 8, {
            message: "La sección no puede contener más de 8 bloques de contenido."
        })
});
export type CreateSectionDTO = z.infer<typeof CreateSectionDTOSchema>;

// ============================================================================
// ── 2. SECCIÓN COMPLETA (Estructura de la Entidad Base)
// ============================================================================

export const SectionResponseSchema = z.object({
    _id:       z.string(),
    title:     z.string().trim(),
    slug:      z.string().trim(),
    type:      SectionTypeEnum,
    order:     z.number().int().default(0),
    isActive:  z.boolean().default(true),
    settings:  SectionSettingsSchema.default({}),
    blocks:    z.array(SectionBlockSchema).default([]),
    createdAt: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date()).optional(),
    updatedAt: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date()).optional()
});
export type SectionResponse = z.infer<typeof SectionResponseSchema>;

// ============================================================================
// ── 3. RESPUESTAS EXACTAS DE LA API (RESPONSE ← Backend)
// ============================================================================

export const SectionSingleResponseSchema = SectionResponseSchema;
export type SectionSingleResponse = z.infer<typeof SectionSingleResponseSchema>;

export const SectionListResponseSchema = z.array(SectionResponseSchema);
export type SectionListResponse = z.infer<typeof SectionListResponseSchema>;

export const SectionPaginatedApiResponseSchema = z.object({
    ok: z.boolean(),
    data: z.array(SectionResponseSchema),
    meta: z.object({
        total: z.number(),
        page:  z.number(),
        pages: z.number(),
        limit: z.number()
    })
});
export type SectionPaginatedApiResponse = z.infer<typeof SectionPaginatedApiResponseSchema>;

// ============================================================================
// ── 4. LABELS Y MAPEOS PARA MÓDULOS DE UI (Frontend Helpers)
// ============================================================================

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
    featured_collections: 'Grilla de Colecciones / Imágenes',
    product_grid:         'Cuadrícula de Productos',
    rich_text:            'Contenido de Texto Enriquecido',
};

export const SECTION_TYPE_COLORS: Record<SectionType, string> = {
    featured_collections: 'indigo',
    product_grid:         'emerald',
    rich_text:            'amber',
};