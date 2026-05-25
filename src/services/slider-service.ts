// File: frontend/src/services/slider-service.ts
import "server-only";

import getToken from "../auth/token";
import {
    SliderBanner,
    SliderBannerResponseSchema,
} from "@/src/schemas/slider.schema";

export interface AdminFilters {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
}

export interface PaginatedResult {
    data: SliderBanner[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

const BASE_URL = `${process.env.API_URL}/slider-banners`;

async function authHeaders(): Promise<HeadersInit> {
    const token = await getToken();
    if (!token) throw new Error("Sesión expirada o inválida.");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

function parseList(data: unknown[]): SliderBanner[] {
    return data
        .map((item) => {
            const parsed = SliderBannerResponseSchema.safeParse(item);
            if (!parsed.success) {
                console.warn(
                    "[SliderService] item descartado — schema inválido:",
                    parsed.error.format(),
                );
            }
            return parsed.success ? parsed.data : null;
        })
        .filter((b): b is SliderBanner => b !== null);
}

export const SliderService = {
    getActive: async (): Promise<SliderBanner[]> => {
        try {
            const res = await fetch(`${BASE_URL}/active`, {
                next: { tags: ["banners-active"] },
            });

            if (!res.ok) return [];

            const body = await res.json() as { data: unknown[] };
            return Array.isArray(body.data) ? parseList(body.data) : [];
        } catch (error) {
            console.error("[SliderService] getActive error:", error);
            return [];
        }
    },

    getAllAdmin: async (filters: AdminFilters = {}): Promise<PaginatedResult> => {
        const params = new URLSearchParams();
        if (filters.page)                params.append("page",     filters.page.toString());
        if (filters.limit)               params.append("limit",    filters.limit.toString());
        if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString());
        if (filters.search)              params.append("search",   filters.search);

        const res = await fetch(`${BASE_URL}?${params.toString()}`, {
            headers: await authHeaders(),
            cache: "no-store",
        });

        const body = await res.json() as {
            data?: unknown[];
            meta?: { total: number; page: number; limit: number; pages: number };
            message?: string;
        };

        if (!res.ok) throw new Error(body.message ?? "Error al obtener banners.");

        return {
            data:  parseList(body.data ?? []),
            total: body.meta?.total ?? 0,
            page:  body.meta?.page  ?? 1,
            limit: body.meta?.limit ?? 10,
            pages: body.meta?.pages ?? 1,
        };
    },

    getById: async (id: string): Promise<SliderBanner | null> => {
        const res = await fetch(`${BASE_URL}/${id}`, {
            headers: await authHeaders(),
            next: { tags: [`banner-${id}`] },
        });

        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Error al obtener banner: ${res.status}`);

        const body = await res.json() as { data: unknown };
        const parsed = SliderBannerResponseSchema.safeParse(body.data);

        return parsed.success ? parsed.data : null;
    },
};