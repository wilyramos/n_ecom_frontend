// File: src/lib/schemas/claim.schema.ts

import { z } from "zod";

// ── Enums ──────────────────────────────────────────────────────────────────────

export const ClaimDocumentTypeSchema = z.enum(["DNI", "CE", "RUC"]);
export const ClaimTypeSchema         = z.enum(["Queja", "Reclamo"]);
export const ClaimStatusSchema       = z.enum(["Pendiente", "En Proceso", "Resuelto"]);

export type ClaimDocumentType = z.infer<typeof ClaimDocumentTypeSchema>;
export type ClaimType         = z.infer<typeof ClaimTypeSchema>;
export type ClaimStatus       = z.infer<typeof ClaimStatusSchema>;

// ── Formulario público: Crear Reclamo ─────────────────────────────────────────

export const CreateClaimSchema = z.object({
    // Datos del consumidor
    nombres: z
        .string({ required_error: "El nombre completo es obligatorio." })
        .trim()
        .min(1, "El nombre completo es obligatorio.")
        .max(150, "El nombre no puede superar 150 caracteres."),

    tipoDocumento: ClaimDocumentTypeSchema,

    numeroDocumento: z
        .string({ required_error: "El número de documento es obligatorio." })
        .trim()
        .min(8, "Debe tener entre 8 y 15 caracteres.")
        .max(15, "Debe tener entre 8 y 15 caracteres.")
        .regex(/^[a-zA-Z0-9]+$/, "Solo se permiten letras y números."),

    celular: z
        .string({ required_error: "El celular es obligatorio." })
        .trim()
        .min(7, "Formato de celular no válido.")
        .max(15, "Formato de celular no válido."),

    email: z
        .string({ required_error: "El correo es obligatorio." })
        .trim()
        .email("Formato de correo no válido.")
        .toLowerCase(),

    direccion: z
        .string({ required_error: "La dirección es obligatoria." })
        .trim()
        .min(1, "La dirección es obligatoria.")
        .max(250, "Máximo 250 caracteres."),

    ciudad: z
        .string({ required_error: "La ciudad es obligatoria." })
        .trim()
        .min(1, "La ciudad es obligatoria.")
        .max(100, "Máximo 100 caracteres."),

    region: z
        .string({ required_error: "La región es obligatoria." })
        .trim()
        .min(1, "La región es obligatoria.")
        .max(100, "Máximo 100 caracteres."),

    // Detalle del reclamo
    tipoReclamo: ClaimTypeSchema,

    fechaIncidencia: z
        .string({ required_error: "La fecha de incidencia es obligatoria." })
        .date("Formato de fecha inválido (YYYY-MM-DD)."),

    detalle: z
        .string({ required_error: "El detalle del reclamo es obligatorio." })
        .trim()
        .min(20, "El detalle debe tener al menos 20 caracteres.")
        .max(2000, "El detalle no puede superar 2000 caracteres."),

    pedido: z
        .string({ required_error: "El pedido es obligatorio." })
        .trim()
        .min(1, "El pedido es obligatorio.")
        .max(200, "Máximo 200 caracteres."),
});

export type CreateClaimInput = z.infer<typeof CreateClaimSchema>;

// ── Formulario admin: Actualizar resolución ───────────────────────────────────

export const UpdateResolutionSchema = z.object({
    estado: ClaimStatusSchema,

    respuestaProveedor: z
        .string()
        .trim()
        .max(2000, "Máximo 2000 caracteres.")
        .optional(),
});

export type UpdateResolutionInput = z.infer<typeof UpdateResolutionSchema>;

// ── Respuestas de la API ───────────────────────────────────────────────────────

export const ClaimConsumerSchema = z.object({
    nombres:         z.string(),
    tipoDocumento:   ClaimDocumentTypeSchema,
    numeroDocumento: z.string(),
    celular:         z.string(),
    email:           z.string(),
    direccion:       z.string(),
    ciudad:          z.string(),
    region:          z.string(),
});

export const ClaimDetailSchema = z.object({
    tipoReclamo:     ClaimTypeSchema,
    fechaIncidencia: z.string(),
    detalle:         z.string(),
    pedido:          z.string(),
});

export const ClaimResolutionSchema = z.object({
    estado:              ClaimStatusSchema,
    respuestaProveedor:  z.string().optional(),
    fechaRespuesta:      z.string().optional(),
});

export const ClaimSchema = z.object({
    _id:        z.string(),
    correlativo: z.string(),
    consumer:   ClaimConsumerSchema,
    detail:     ClaimDetailSchema,
    resolution: ClaimResolutionSchema,
    createdAt:  z.string(),
    updatedAt:  z.string(),
});

export type Claim = z.infer<typeof ClaimSchema>;

// Respuesta POST /claims
export const CreateClaimResponseSchema = z.object({
    success:    z.boolean(),
    message:    z.string(),
    data: z.object({
        id:          z.string(),
        correlativo: z.string(),
        createdAt:   z.string(),
    }),
});

// Respuesta GET /claims
export const GetAllClaimsResponseSchema = z.object({
    success: z.boolean(),
    results: z.number(),
    data:    z.array(ClaimSchema),
});

// Respuesta GET /claims/track/:correlativo
export const GetClaimByCorrelativoResponseSchema = z.object({
    success: z.boolean(),
    data:    ClaimSchema,
});

// Respuesta PATCH /claims/:correlativo/resolution
export const UpdateResolutionResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        correlativo:    z.string(),
        estado:         ClaimStatusSchema,
        fechaRespuesta: z.string().optional(),
    }),
});