// File: frontend/src/modules/page/page-service.ts

import "server-only";
import { getTokenOptional } from "@/src/auth/dal";
import {
    PageResponseSchema,
    PaginatedPagesResponseSchema,
    DeletePageResponseSchema,
    type Page,
    type PageFormData,
    type PagesQuery,
} from "@/src/schemas/page.schema";

const API_URL = process.env.API_URL;

type PaginatedMeta = {
    total: number;
    page: number;
    limit: number;
    pages: number;
};

interface ZodLike<T> {
    safeParse: (data: unknown) =>
        | { success: true; data: T }
        | { success: false; error: { format: () => unknown } };
}

function parseOrThrow<T>(schema: ZodLike<T>, data: unknown, context: string): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        console.error(`❌ Schema error [${context}]:`, JSON.stringify(result.error.format(), null, 2));
        throw new Error("Respuesta del servidor con estructura inesperada.");
    }
    return result.data;
}

export const PageService = {
    getPageBySlug: async (slug: string): Promise<Page> => {
        const res = await fetch(`${API_URL}/pages/slug/${slug}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { tags: [`page-slug-${slug}`] },
        });

        if (res.status === 404) {
            throw new Error("NOT_FOUND");
        }

        const json = await res.json();

        if (!res.ok) {
            throw new Error((json as { message?: string }).message ?? "Error al recuperar la página.");
        }

        const validated = parseOrThrow(PageResponseSchema, json, `getPageBySlug:${slug}`);
        return validated.data;
    },

    getAllPages: async (query: PagesQuery): Promise<{ data: Page[]; meta: PaginatedMeta }> => {
        const token = await getTokenOptional();
        if (!token) throw new Error("Acceso denegado. Token no suministrado.");

        const params = new URLSearchParams();
        if (query.page) params.set("page", String(query.page));
        if (query.limit) params.set("limit", String(query.limit));

        const res = await fetch(`${API_URL}/pages/admin?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            next: { tags: ["admin-pages-list"] },
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error((json as { message?: string }).message ?? "Error al consultar el listado de páginas.");
        }

        const validated = parseOrThrow(PaginatedPagesResponseSchema, json, "getAllPages");
        return { data: validated.data, meta: validated.meta };
    },

    getPageById: async (id: string): Promise<Page> => {
        const token = await getTokenOptional();
        if (!token) throw new Error("Acceso denegado. Token no suministrado.");

        const res = await fetch(`${API_URL}/pages/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error((json as { message?: string }).message ?? "Error al localizar la página solicitada.");
        }

        const validated = parseOrThrow(PageResponseSchema, json, `getPageById:${id}`);
        return validated.data;
    },

    createPage: async (pageData: PageFormData): Promise<Page> => {
        const token = await getTokenOptional();
        if (!token) throw new Error("Acceso denegado. Token no suministrado.");

        const res = await fetch(`${API_URL}/pages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(pageData),
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error((json as { message?: string }).message ?? "Error al registrar la página institucional.");
        }

        const validated = parseOrThrow(PageResponseSchema, json, "createPage");
        return validated.data;
    },

    updatePage: async (id: string, updateData: Partial<PageFormData>): Promise<Page> => {
        const token = await getTokenOptional();
        if (!token) throw new Error("Acceso denegado. Token no suministrado.");

        const res = await fetch(`${API_URL}/pages/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error((json as { message?: string }).message ?? "Error al actualizar los parámetros de la página.");
        }

        const validated = parseOrThrow(PageResponseSchema, json, `updatePage:${id}`);
        return validated.data;
    },

    deletePage: async (id: string): Promise<string> => {
        const token = await getTokenOptional();
        if (!token) throw new Error("Acceso denegado. Token no suministrado.");

        const res = await fetch(`${API_URL}/pages/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error((json as { message?: string }).message ?? "Error al procesar la eliminación de la página.");
        }

        const validated = parseOrThrow(DeletePageResponseSchema, json, `deletePage:${id}`);
        return validated.id;
    },
};