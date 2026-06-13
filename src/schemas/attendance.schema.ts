// File: frontend/src/schemas/attendance.schema.ts

import { z } from "zod";
import { UserSchema } from "./user.schema";

// ─── SUB-SCHEMAS ──────────────────────────────────────────────────────────────

export const AttendanceCheckInSchema = z.object({
    timestamp: z.coerce.date(),
});

export const AttendanceCheckOutSchema = z.object({
    timestamp: z.coerce.date(),
});

// ─── BASE SCHEMA ──────────────────────────────────────────────────────────────

export const BaseAttendanceSchema = z.object({
    userId: z.string(),
    date: z.coerce.date(),
    checkIn: AttendanceCheckInSchema,
    checkOut: AttendanceCheckOutSchema.optional(),
    workHours: z.number().min(0).optional(),
});

// ─── RESPONSE SCHEMAS ─────────────────────────────────────────────────────────

// Respuesta para marcas individuales o el historial propio del colaborador
export const AttendanceResponseSchema = BaseAttendanceSchema.extend({
    _id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// Respuesta para el reporte de administración (Popula los datos esenciales del usuario)
export const AdminAttendanceResponseSchema = BaseAttendanceSchema.extend({
    _id: z.string(),
    userId: UserSchema.pick({
        nombre: true,
        apellidos: true,
        email: true,
        numeroDocumento: true,
        rol: true,
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// Esquema de paginación consistente con tu estructura modular
export const AttendancePaginationSchema = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
});

// Respuesta paginada para los listados del admin o historiales largos
export const PaginatedAttendanceResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(AdminAttendanceResponseSchema),
    meta: AttendancePaginationSchema,
});

// ─── PARAMS DE QUERY (FILTROS CMS) ───────────────────────────────────────────

export const AttendanceQuerySchema = z.object({
    page:      z.coerce.number().int().min(1).optional().default(1),
    limit:     z.coerce.number().int().min(1).max(100).optional().default(10),
    startDate: z.string().optional(),
    endDate:   z.string().optional(),
    userId:    z.string().optional(),
});

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type Attendance = z.infer<typeof AttendanceResponseSchema>;
export type AdminAttendance = z.infer<typeof AdminAttendanceResponseSchema>;
export type PaginatedAttendanceResponse = z.infer<typeof PaginatedAttendanceResponseSchema>;
export type AttendanceQuery = z.infer<typeof AttendanceQuerySchema>;