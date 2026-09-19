import { z } from "zod";

// ============================================================================
// ── ENUMS DE CONTROL (Espejo del Backend)
// ============================================================================

export const AdLayoutEnum = z.enum(["top_bar", "modal_popup"]);
export type AdLayout = z.infer<typeof AdLayoutEnum>;

// ============================================================================
// ── OBJETO BASE COMPARTIDO
// ============================================================================

export const BaseAdSchema = z.object({
    title: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),
    showTitle: z
        .boolean()
        .default(true),
    subtitle: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),
    imageUrl: z
        .string()
        .optional()
        .or(z.literal("")),
    linkTo: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),
    layout: AdLayoutEnum,
    isActive: z
        .boolean()
        .default(true),
    startDate: z.preprocess(
        (val) => (val === "" ? null : val),
        z.coerce.date().nullable().optional()
    ),
    endDate: z.preprocess(
        (val) => (val === "" ? null : val),
        z.coerce.date().nullable().optional()
    ),
});

// ============================================================================
// ── 1. SCHEMA PRINCIPAL (RESPONSE ← Backend)
// ============================================================================

export const AdvertisementSchema = z.object({
    _id: z.string(),
    title: z
        .string()
        .trim()
        .optional()
        .nullable()
        .transform((val) => val || undefined),
    showTitle: z
        .boolean()
        .default(true),
    subtitle: z
        .string()
        .trim()
        .optional()
        .nullable()
        .transform((val) => val || undefined),
    imageUrl: z
        .string()
        .optional()
        .nullable()
        .transform((val) => val || undefined),
    linkTo: z
        .string()
        .trim()
        .optional()
        .nullable()
        .transform((val) => val || undefined),
    layout: AdLayoutEnum,
    isActive: z
        .boolean()
        .default(true),
    startDate: z.preprocess(
        (val) => (typeof val === "string" && val ? new Date(val) : val),
        z.date().optional().nullable()
    ),
    endDate: z.preprocess(
        (val) => (typeof val === "string" && val ? new Date(val) : val),
        z.date().optional().nullable()
    ),
    createdAt: z.preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date()
    ).optional(),
    updatedAt: z.preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date()
    ).optional(),
});

export type TAdvertisement = z.infer<typeof AdvertisementSchema>;

// ============================================================================
// ── 2. DTOS PARA CREAR Y ACTUALIZAR AVISOS (REQUEST → Backend)
// ============================================================================

export const CreateAdDTOSchema = BaseAdSchema
    .refine((data) => {
        if (data.layout === "modal_popup" && !data.imageUrl) return false;
        return true;
    }, {
        message: "El formato de Modal Emergente requiere obligatoriamente cargar una imagen publicitaria",
        path: ["imageUrl"],
    })
    .refine((data) => {
        if (data.layout === "top_bar" && !data.title && !data.subtitle) return false;
        return true;
    }, {
        message: "La Barra Superior requiere al menos un título o subtítulo visible",
        path: ["title"],
    })
    .refine((data) => {
        if (data.startDate && data.endDate) return new Date(data.endDate) > new Date(data.startDate);
        return true;
    }, {
        message: "La fecha de vencimiento debe ser estrictamente posterior a la fecha de inicio",
        path: ["endDate"],
    });

export type CreateAdDTO = z.infer<typeof CreateAdDTOSchema>;

export const UpdateAdDTOSchema = BaseAdSchema.partial()
    .refine((data) => {
        if (data.layout === "modal_popup" && !data.imageUrl) return false;
        return true;
    }, {
        message: "El formato de Modal Emergente requiere obligatoriamente cargar una imagen publicitaria",
        path: ["imageUrl"],
    })
    .refine((data) => {
        if (data.layout === "top_bar" && data.title !== undefined && data.subtitle !== undefined) {
            if (!data.title && !data.subtitle) return false;
        }
        return true;
    }, {
        message: "La Barra Superior requiere al menos un título o subtítulo visible",
        path: ["title"],
    })
    .refine((data) => {
        if (data.startDate && data.endDate) return new Date(data.endDate) > new Date(data.startDate);
        return true;
    }, {
        message: "La fecha de vencimiento debe ser estrictamente posterior a la fecha de inicio",
        path: ["endDate"],
    });

export type UpdateAdDTO = z.infer<typeof UpdateAdDTOSchema>;

// ============================================================================
// ── 3. ENVOLTORIOS DE RESPUESTA DE LA API
// ============================================================================

export const AdApiResponseSchema = z.preprocess((val) => {
    if (!val || typeof val !== "object") return {};
    if ("ok" in val && "data" in val) return val;
    return { ok: true, data: val };
}, z.object({
    ok: z.boolean(),
    data: AdvertisementSchema,
}));

export type AdApiResponse = z.infer<typeof AdApiResponseSchema>;

export const AdListApiResponseSchema = z.preprocess((val) => {
    if (!val) return {};
    if (Array.isArray(val)) return { ok: true, data: val };
    if (typeof val === "object" && "data" in val) return val;
    return {};
}, z.object({
    ok: z.boolean(),
    data: z.array(AdvertisementSchema),
}));

export type AdListApiResponse = z.infer<typeof AdListApiResponseSchema>;

export const AdPaginatedApiResponseSchema = z.object({
    ok: z.boolean(),
    data: z.array(AdvertisementSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        pages: z.number(),
        limit: z.number(),
    }),
});

export type AdPaginatedApiResponse = z.infer<typeof AdPaginatedApiResponseSchema>;

// ============================================================================
// ── 4. MAPEOS Y HELPERS PARA LA UI
// ============================================================================

export const AD_LAYOUT_LABELS: Record<AdLayout, string> = {
    top_bar: "Barra Fija Superior (Top Bar)",
    modal_popup: "Modal Emergente de Entrada (Popup)",
};

export const AD_LAYOUT_COLORS: Record<AdLayout, string> = {
    top_bar: "blue",
    modal_popup: "purple",
};