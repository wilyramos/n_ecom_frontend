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
    gridColumns: z.coerce.number().int().min(1).max(6).default(4)
});
export type SectionSettings = z.infer<typeof SectionSettingsSchema>;

/**
 * Referencia simplificada del producto devuelto por el populate del Backend.
 * Propiedades en español alineadas con el servicio y modelo mapeado de MongoDB.
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
 * Remueve la obligatoriedad estricta de IDs, URLs o productos,
 * permitiendo almacenar colecciones genéricas o banners estáticos simples.
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
    blocks:   z.array(SectionBlockSchema).default([])
});
export type CreateSectionDTO = z.infer<typeof CreateSectionDTOSchema>;

// ============================================================================
// ── 2. SECCIÓN COMPLETA (RESPONSE ← Backend)
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
// ── 3. ENVOLTORIOS DE RESPUESTA DE LA API
// ============================================================================

/**
 * Valida de forma segura las respuestas de detalle administrativo o slugs.
 * Tolera tanto el formato estándar `{ ok: true, data: {} }` como el objeto crudo en raíz.
 */
export const SectionApiResponseSchema = z.preprocess((val) => {
    if (!val || typeof val !== "object") return {};
    if ("ok" in val && "data" in val) return val;
    return {
        ok: true,
        data: val
    };
}, z.object({
    ok: z.boolean(),
    data: SectionResponseSchema
}));
export type SectionApiResponse = z.infer<typeof SectionApiResponseSchema>;

/**
 * Usado para el listado plano del Storefront público.
 * Convierte un arreglo directo de la raíz a la firma esperada del cliente.
 */
export const SectionListApiResponseSchema = z.preprocess((val) => {
    if (!val) return {};
    if (Array.isArray(val)) return { ok: true, data: val };
    if (typeof val === "object" && "data" in val) return val;
    return {};
}, z.object({
    ok: z.boolean(),
    data: z.array(SectionResponseSchema)
}));
export type SectionListApiResponse = z.infer<typeof SectionListApiResponseSchema>;

/**
 * Mapea la respuesta estructurada de la paginación del endpoint administrativo.
 */
export const SectionPaginatedApiResponseSchema = z.object({
    ok:   z.boolean(),
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