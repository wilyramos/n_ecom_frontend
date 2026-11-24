// File: frontend/src/schemas/slider.schema.ts
// Banner del carrusel principal: contenido simplificado (título, subtítulo, destino y
// UN medio: imagen o video). Espejo de backend/src/modules/sliderbanner/sliderbanner.model.ts.

import { z } from "zod";

// ─── ENUMS ────────────────────────────────────────────────────────────────────

export const SliderLayoutEnum = z.enum(["image-only", "background-media"]);
export const SliderThemeEnum = z.enum(["dark", "light"]);

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const optionalString = z.string().optional().or(z.literal(""));

// ─── SUB-SCHEMAS ──────────────────────────────────────────────────────────────

export const SliderMediaSchema = z.object({
    imageUrl: optionalString,
    videoUrl: optionalString,
});

export const SliderDesignSchema = z.object({
    layout: SliderLayoutEnum.default("image-only"),
    theme: SliderThemeEnum.default("dark"),
});

export const SliderScheduleSchema = z.object({
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
});

// ─── BASE SCHEMA ──────────────────────────────────────────────────────────────

export const BaseSliderBannerSchema = z.object({
    title: z.string().min(1, "El título es requerido").max(120).trim(),
    subtitle: z.string().max(200).optional().or(z.literal("")),
    destUrl: optionalString,
    openInNewTab: z.boolean().default(false),
    media: SliderMediaSchema.optional(),
    design: SliderDesignSchema,
    schedule: SliderScheduleSchema.optional(),
    isActive: z.boolean().default(true),
    order: z.number().int().min(0).optional(),
});

// ─── SCHEMA FORMULARIO (CREACIÓN / EDICIÓN) ───────────────────────────────────

export const SliderBannerSchema = BaseSliderBannerSchema.superRefine((data, ctx) => {
    const hasImage = !!data.media?.imageUrl?.trim();
    const hasVideo = !!data.media?.videoUrl?.trim();

    if (hasImage && hasVideo) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Sube una imagen o un video, no ambos",
            path: ["media"],
        });
    }
    if (!hasImage && !hasVideo) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El banner necesita una imagen o un video",
            path: ["media"],
        });
    }

    if (data.schedule?.startsAt && data.schedule?.endsAt && data.schedule.endsAt <= data.schedule.startsAt) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La fecha de fin debe ser posterior a la fecha de inicio",
            path: ["schedule", "endsAt"],
        });
    }
});

// ─── RESPONSE SCHEMA ──────────────────────────────────────────────────────────
// Tolerante con banners antiguos: los campos eliminados (precio, countdown, etc.)
// se ignoran porque Zod descarta las claves desconocidas.

export const SliderBannerResponseSchema = BaseSliderBannerSchema.extend({
    _id: z.string(),
    order: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    design: z.object({
        // Un layout antiguo ("default", "media-left") se trata como "background-media" en el cliente.
        layout: z.string().transform((v) => (v === "image-only" ? "image-only" : "background-media")),
        theme: z.string().transform((v) => (v === "light" ? "light" : "dark")),
    }),
});

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type SliderBannerFormValues = z.infer<typeof SliderBannerSchema>;
export type SliderBanner = z.infer<typeof SliderBannerResponseSchema>;
export type SliderMedia = z.infer<typeof SliderMediaSchema>;
export type SliderDesign = z.infer<typeof SliderDesignSchema>;
export type SliderSchedule = z.infer<typeof SliderScheduleSchema>;
