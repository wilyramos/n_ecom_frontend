// File: frontend/src/schemas/slider.schema.ts

import { z } from "zod";

// ─── ENUMS ────────────────────────────────────────────────────────────────────

export const SliderLayoutEnum = z.enum([
    "image-only",
    "default",
    "media-left",
    "background-media",
]);

export const SliderThemeEnum = z.enum(["dark", "light", "custom"]);
export const SliderObjectFitEnum = z.enum(["contain", "cover", "fill"]);

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const optionalString = z.string().optional().or(z.literal(""));

// ─── SUB-SCHEMAS ──────────────────────────────────────────────────────────────

export const SliderMediaSchema = z.object({
    imageUrl: optionalString,
    videoUrl: optionalString,
    objectFit: SliderObjectFitEnum.default("cover"),
});

export const SliderPriceSchema = z.object({
    current: z.number().min(0, "Precio inválido").optional(),
    compare: z.number().min(0).optional(),
    label: optionalString,
    suffix: optionalString,
});

export const SliderDesignSchema = z.object({
    layout: SliderLayoutEnum.default("default"),
    theme: SliderThemeEnum.default("dark"),
    bgColor: optionalString,
    accentColor: optionalString,
    textColor: optionalString,
});

export const SliderCountdownSchema = z.object({
    endsAt: z.coerce.date().optional(),
    label: optionalString,
    showDays: z.boolean().default(true),
});

export const SliderScheduleSchema = z.object({
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
});

// ─── BASE SCHEMA ──────────────────────────────────────────────────────────────

export const BaseSliderBannerSchema = z.object({
    // ── Contenido ──────────────────────────
    title: z.string().min(1, "El título es requerido").trim(),
    subtitle: optionalString,
    description: optionalString,
    terms: optionalString,

    // ── Precio ─────────────────────────────
    price: SliderPriceSchema.optional(),

    // ── Destino ────────────────────────────
    destUrl: optionalString,
    openInNewTab: z.boolean().default(false),

    // ── Media ──────────────────────────────
    media: SliderMediaSchema.optional(),

    // ── Diseño ─────────────────────────────
    design: SliderDesignSchema,

    // ── Extras ─────────────────────────────
    countdown: SliderCountdownSchema.optional(),
    schedule: SliderScheduleSchema.optional(),

    // ── Control ────────────────────────────
    isActive: z.boolean().default(true),
    order: z.number().int().min(0).optional(),
});

// ─── SCHEMA FORMULARIO (CREACIÓN / EDICIÓN) ───────────────────────────────────

export const SliderBannerSchema = BaseSliderBannerSchema.superRefine((data, ctx) => {
    if (
        data.price?.current !== undefined &&
        data.price?.compare !== undefined &&
        data.price.compare <= data.price.current
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El precio de comparación debe ser mayor al precio actual",
            path: ["price", "compare"],
        });
    }

    if (data.schedule?.startsAt && data.schedule?.endsAt) {
        if (data.schedule.endsAt <= data.schedule.startsAt) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La fecha de fin debe ser posterior a la fecha de inicio",
                path: ["schedule", "endsAt"],
            });
        }
    }
});

// ─── RESPONSE SCHEMA ──────────────────────────────────────────────────────────

export const SliderBannerResponseSchema = BaseSliderBannerSchema.extend({
    _id: z.string(),
    order: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type SliderBannerFormValues = z.infer<typeof SliderBannerSchema>;
export type SliderBanner = z.infer<typeof SliderBannerResponseSchema>;

export type SliderMedia = z.infer<typeof SliderMediaSchema>;
export type SliderPrice = z.infer<typeof SliderPriceSchema>;
export type SliderDesign = z.infer<typeof SliderDesignSchema>;
export type SliderCountdown = z.infer<typeof SliderCountdownSchema>;
export type SliderSchedule = z.infer<typeof SliderScheduleSchema>;