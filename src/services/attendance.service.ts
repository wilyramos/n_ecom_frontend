// File: frontend/src/modules/attendance/attendance.service.ts

import "server-only";
import { getTokenOptional } from "@/src/auth/dal";
import {
    AttendanceResponseSchema,
    PaginatedAttendanceResponseSchema,
    type Attendance,
    type AdminAttendance,
    type AttendanceQuery,
} from "@/src/schemas/attendance.schema";
import type { AttendanceGlobalStats } from "@/src/schemas/attendance.schema";

const API_URL = process.env.API_URL;

export const AttendanceService = {

    checkIn: async (): Promise<Attendance> => {
        const token = await getTokenOptional();
        if (!token) throw new Error("No se localizó una sesión activa.");

        const res = await fetch(`${API_URL}/attendance/check-in`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message ?? "Error al registrar entrada.");
        }

        return parseOrThrow(AttendanceResponseSchema, json.data, "checkIn");
    },

    checkOut: async (): Promise<Attendance> => {
        const token = await getTokenOptional();
        if (!token) throw new Error("No se localizó una sesión activa.");

        const res = await fetch(`${API_URL}/attendance/check-out`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message ?? "Error al registrar salida.");
        }

        return parseOrThrow(AttendanceResponseSchema, json.data, "checkOut");
    },

    getMyHistory: async (limit = 30): Promise<Attendance[]> => {
        const token = await getTokenOptional();
        if (!token) throw new Error("No autorizado.");

        const res = await fetch(`${API_URL}/attendance/my-history?limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            next: { tags: ["my-attendance-history"] },
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message ?? "Error al recuperar historial.");
        }

        return parseOrThrow(AttendanceResponseSchema.array(), json.data, "getMyHistory");
    },

    getAdminReport: async (
        query: AttendanceQuery & { search?: string }
    ): Promise<{ data: AdminAttendance[]; meta: PaginatedMeta; stats: AttendanceGlobalStats }> => {
        const token = await getTokenOptional();
        if (!token) throw new Error("Acceso denegado. Token no suministrado.");

        const params = buildParams(query);

        const res = await fetch(`${API_URL}/attendance/admin/report?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message ?? "Error al consultar el reporte administrativo.");
        }

        const validated = parseOrThrow(PaginatedAttendanceResponseSchema, json, "getAdminReport");

        return { data: validated.data, meta: validated.meta, stats: validated.stats };
    },
};

// ─── HELPERS PRIVADOS ─────────────────────────────────────────────────────────

type ZodLike<T> = {
    safeParse: (data: unknown) =>
        | { success: true; data: T }
        | { success: false; error: { format: () => unknown } };
};

type PaginatedMeta = {
    total: number;
    page: number;
    limit: number;
    pages: number;
};

function parseOrThrow<T>(schema: ZodLike<T>, data: unknown, context: string): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        console.error(`❌ Schema error [${context}]:`, JSON.stringify(result.error.format(), null, 2));
        throw new Error("Respuesta del servidor con estructura inesperada.");
    }
    return result.data;
}

function buildParams(query: AttendanceQuery & { search?: string }): URLSearchParams {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.startDate) params.set("startDate", query.startDate);
    if (query.endDate) params.set("endDate", query.endDate);

    // Sincronización limpia hacia la cadena de consulta del backend
    if (query.search?.trim()) {
        params.set("search", query.search.trim());
    }

    return params;
}