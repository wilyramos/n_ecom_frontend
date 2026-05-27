// File: frontend/src/schemas/claim.schema.ts
import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// HELPERS & VALIDACIONES ESPECÍFICAS
// ─────────────────────────────────────────────────────────────

const optionalString = z.string().optional().or(z.literal(""));

// Validaciones para documentos de identidad peruanos (INDECOPI)
const dniRegex = /^\d{8}$/;
const ceRegex = /^[a-zA-Z0-9]{9,12}$/;
const rucRegex = /^(10|15|17|20)\d{9}$/;
const phoneRegex = /^9\d{8}$/;

// ─────────────────────────────────────────────────────────────
// SUB-SCHEMAS — Sincronizados con backend/src/modules/claim/claim.model.ts
// ─────────────────────────────────────────────────────────────

export const ClaimConsumerSchema = z.object({
    nombres: z.string()
        .trim()
        .min(3, "El nombre completo o razón social debe tener al menos 3 caracteres")
        .max(150, "El nombre no debe superar los 150 caracteres"),
    tipoDocumento: z.enum(["DNI", "CE", "RUC"], {
        errorMap: () => ({ message: "Seleccione un tipo de documento válido (DNI, CE o RUC)" }),
    }),
    numeroDocumento: z.string().trim().min(1, "El número de documento es requerido"),
    celular: z.string()
        .trim()
        .regex(phoneRegex, "El número de celular debe ser un formato peruano válido (9 dígitos y empezar con 9)"),
    email: z.string()
        .trim()
        .min(1, "El correo electrónico es requerido")
        .email("Ingrese un formato de correo electrónico válido")
        .toLowerCase(),
    direccion: z.string().trim().min(5, "La dirección residencial debe ser detallada y clara"),
    ciudad: z.string().trim().min(2, "La provincia o ciudad es requerida"),
    region: z.string().trim().min(2, "El departamento o región es requerido"),
});

export const ClaimDetailSchema = z.object({
    tipoReclamo: z.enum(["Queja", "Reclamo"], {
        errorMap: () => ({ message: "Debe especificar si corresponde a una Queja o un Reclamo" }),
    }),
    fechaIncidencia: z.union([z.string(), z.date()], {
        errorMap: () => ({ message: "La fecha del suceso es requerida" }),
    }).transform((val) => new Date(val)),
    detalle: z.string()
        .trim()
        .min(20, "El detalle del suceso debe ser claro y descriptivo (mínimo 20 caracteres)")
        .max(2000, "El detalle no debe exceder los 2000 caracteres"),
    pedido: z.string()
        .trim()
        .min(10, "Debe especificar concretamente cuál es su solicitud o petición")
        .max(1000, "La petición no debe exceder los 1000 caracteres"),
});

export const ClaimAdminResolutionSchema = z.object({
    estado: z.enum(["Pendiente", "En Proceso", "Resuelto"]).default("Pendiente"),
    respuestaProveedor: optionalString,
    fechaRespuesta: z.string().datetime().nullable().optional().or(z.date()),
});

// ─────────────────────────────────────────────────────────────
// BASE SCHEMA (Formularios de Registro Público)
// ─────────────────────────────────────────────────────────────

export const BaseClaimSchema = z.object({
    consumer: ClaimConsumerSchema,
    detail: ClaimDetailSchema,
});

// ─────────────────────────────────────────────────────────────
// SCHEMA FINAL CON REFINAMIENTOS DE INTEGRIDAD (Formularios)
// ─────────────────────────────────────────────────────────────

export const ClaimSchema = BaseClaimSchema.superRefine((data, ctx) => {
    const { tipoDocumento, numeroDocumento } = data.consumer;

    // 1. Validar la estructura del documento de identidad según su tipo
    if (tipoDocumento === "DNI" && !dniRegex.test(numeroDocumento)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El DNI debe constar exactamente de 8 dígitos numéricos",
            path: ["consumer", "numeroDocumento"],
        });
    }

    if (tipoDocumento === "RUC" && !rucRegex.test(numeroDocumento)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El RUC ingresado no es válido (Debe tener 11 dígitos y comenzar con 10, 15, 17 o 20)",
            path: ["consumer", "numeroDocumento"],
        });
    }

    if (tipoDocumento === "CE" && !ceRegex.test(numeroDocumento)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El Carné de Extranjería debe tener entre 9 y 12 caracteres alfanuméricos",
            path: ["consumer", "numeroDocumento"],
        });
    }

    // 2. Validar que la fecha de incidencia no pertenezca al futuro
    if (data.detail.fechaIncidencia > new Date()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La fecha del suceso no puede ser posterior a la fecha actual",
            path: ["detail", "fechaIncidencia"],
        });
    }
});

// ─────────────────────────────────────────────────────────────
// RESPONSE SCHEMA — Para datos provenientes de la API o Backoffice
// ─────────────────────────────────────────────────────────────

export const ClaimResponseSchema = BaseClaimSchema.extend({
    _id: z.string(),
    correlativo: z.string(),
    resolution: ClaimAdminResolutionSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

// SCHEMA COMPACTO — Para formularios de consulta/seguimiento de tickets de reclamo
export const ClaimTrackingSchema = z.object({
    correlativo: z.string().trim().min(1, "El código correlativo es obligatorio (Ej: REC-2026-00001)"),
    numeroDocumento: z.string().trim().min(1, "El número de identidad del titular es obligatorio"),
});

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type ClaimFormValues = z.infer<typeof ClaimSchema>;
export type Claim = z.infer<typeof ClaimResponseSchema>;
export type ClaimTrackingValues = z.infer<typeof ClaimTrackingSchema>;

export type ClaimConsumer = z.infer<typeof ClaimConsumerSchema>;
export type ClaimDetail = z.infer<typeof ClaimDetailSchema>;
export type ClaimAdminResolution = z.infer<typeof ClaimAdminResolutionSchema>;