import { z } from "zod";

// ============================================================================
// ── ENUMS DE CONTROL (Espejo del Backend)
// ============================================================================

export const AdLayoutEnum = z.enum(['top_bar', 'modal_popup']);
export type AdLayout = z.infer<typeof AdLayoutEnum>;

// ============================================================================
// ── OBJETO BASE COMPARTIDO (Evita la ruptura de .partial() en ZodEffects)
// ============================================================================

export const BaseAdSchema = z.object({
    title:     z.string().trim().min(2, "El título o nombre interno debe contener al menos 2 caracteres"),
    subtitle:  z.string().trim().optional().or(z.literal('')),
    imageUrl:  z.string().optional().or(z.literal('')),
    linkTo:    z.string().trim().optional().or(z.literal('')),
    layout:    AdLayoutEnum,
    isActive:  z.boolean().default(true),
    // Se admiten strings vacíos desde formularios y se transforman a null o se validan como fechas opcionales
    startDate: z.preprocess((val) => (val === "" ? null : val), z.coerce.date().nullable().optional()),
    endDate:   z.preprocess((val) => (val === "" ? null : val), z.coerce.date().nullable().optional())
});

// ============================================================================
// ── 1. SCHEMA PRINCIPAL / RESPUESTA COMPLETA (RESPONSE ← Backend)
// ============================================================================

export const AdvertisementSchema = z.object({
    _id:       z.string(),
    title:     z.string().trim().min(1, "El título es obligatorio"),
    subtitle:  z.string().trim().optional().nullable().transform(val => val || undefined),
    imageUrl:  z.string().optional().nullable().transform(val => val || undefined),
    linkTo:    z.string().trim().optional().nullable().transform(val => val || undefined),
    layout:    AdLayoutEnum,
    isActive:  z.boolean().default(true),
    // Preprocesamiento para transformar strings de fechas ISO provenientes del JSON en instancias Date legítimas
    startDate: z.preprocess((val) => (typeof val === "string" && val ? new Date(val) : val), z.date().optional().nullable()),
    endDate:   z.preprocess((val) => (typeof val === "string" && val ? new Date(val) : val), z.date().optional().nullable()),
    createdAt: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date()).optional(),
    updatedAt: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date()).optional()
});

export type TAdvertisement = z.infer<typeof AdvertisementSchema>;

// ============================================================================
// ── 2. DTOS PARA CREAR Y ACTUALIZAR AVISOS (REQUEST → Backend)
// ============================================================================

/**
 * Esquema robusto usado para la creación de anuncios.
 */
export const CreateAdDTOSchema = BaseAdSchema
    .refine((data) => {
        if (data.layout === "modal_popup" && !data.imageUrl) return false;
        return true;
    }, {
        message: "El formato de Modal Emergente requiere obligatoriamente cargar una imagen publicitaria",
        path: ["imageUrl"]
    })
    .refine((data) => {
        if (data.startDate && data.endDate) return new Date(data.endDate) > new Date(data.startDate);
        return true;
    }, {
        message: "La fecha de vencimiento debe ser estrictamente posterior a la fecha de inicio",
        path: ["endDate"]
    });

export type CreateAdDTO = z.infer<typeof CreateAdDTOSchema>;

/**
 * Esquema parcializado recomendado para la actualización de anuncios sin romper tipos.
 */
export const UpdateAdDTOSchema = BaseAdSchema.partial()
    .refine((data) => {
        if (data.layout === "modal_popup" && !data.imageUrl) return false;
        return true;
    }, {
        message: "El formato de Modal Emergente requiere obligatoriamente cargar una imagen publicitaria",
        path: ["imageUrl"]
    })
    .refine((data) => {
        if (data.startDate && data.endDate) return new Date(data.endDate) > new Date(data.startDate);
        return true;
    }, {
        message: "La fecha de vencimiento debe ser estrictamente posterior a la fecha de inicio",
        path: ["endDate"]
    });

export type UpdateAdDTO = z.infer<typeof UpdateAdDTOSchema>;

// ============================================================================
// ── 3. ENVOLTORIOS DE RESPUESTA DE LA API (Soporte de Firmas y Preprocess)
// ============================================================================

/**
 * Valida de forma segura el payload del detalle individual de un aviso.
 * Intercepta si viene empaquetado en `{ ok, data }` o plano desde la raíz.
 */
export const AdApiResponseSchema = z.preprocess((val) => {
    if (!val || typeof val !== "object") return {};
    if ("ok" in val && "data" in val) return val;
    return {
        ok: true,
        data: val
    };
}, z.object({
    ok: z.boolean(),
    data: AdvertisementSchema
}));

export type AdApiResponse = z.infer<typeof AdApiResponseSchema>;

/**
 * Valida las peticiones en arreglo optimizadas para el escaparate público.
 */
export const AdListApiResponseSchema = z.preprocess((val) => {
    if (!val) return {};
    if (Array.isArray(val)) return { ok: true, data: val };
    if (typeof val === "object" && "data" in val) return val;
    return {};
}, z.object({
    ok: z.boolean(),
    data: z.array(AdvertisementSchema)
}));

export type AdListApiResponse = z.infer<typeof AdListApiResponseSchema>;

/**
 * Mapea las estructuras paginadas de control total de avisos para el CMS administrativo.
 */
export const AdPaginatedApiResponseSchema = z.object({
    ok:   z.boolean(),
    data: z.array(AdvertisementSchema),
    meta: z.object({
        total: z.number(),
        page:  z.number(),
        pages: z.number(),
        limit: z.number()
    })
});

export type AdPaginatedApiResponse = z.infer<typeof AdPaginatedApiResponseSchema>;

// ============================================================================
// ── 4. MAPEOS Y HELPERS EXCLUSIVOS PARA COMPONENTES DE UI
// ============================================================================

export const AD_LAYOUT_LABELS: Record<AdLayout, string> = {
    top_bar:     "Barra Fija Superior (Top Bar)",
    modal_popup: "Modal Emergente de Entrada (Popup)"
};

export const AD_LAYOUT_COLORS: Record<AdLayout, string> = {
    top_bar:     "blue",
    modal_popup: "purple"
};