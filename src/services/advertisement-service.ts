import "server-only";
import {
    AdListApiResponseSchema,
    AdPaginatedApiResponseSchema,
    AdApiResponseSchema,
    TAdvertisement,
    CreateAdDTO,
    UpdateAdDTO,
} from "@/src/schemas/advertisement.schema";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const AdvertisementService = {
    /**
     * Recupera los avisos vigentes para el Storefront público con revalidación y tags.
     */
    async getActiveAds(): Promise<TAdvertisement[]> {
        try {
            const res = await fetch(`${API_URL}/advertisements/active`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                next: {
                    revalidate: 300,
                    tags: ["ads-public"],
                },
            });

            if (!res.ok) return [];
            const json = await res.json();

            const parsed = AdListApiResponseSchema.safeParse(json);
            if (!parsed.success) {
                console.error("[AdvertisementService.getActiveAds Error]:", parsed.error.format());
                return [];
            }
            return parsed.data.data;
        } catch (error) {
            console.error("[AdvertisementService.getActiveAds Catch]:", error);
            return [];
        }
    },

    /**
     * Recupera todos los avisos paginados para el CMS administrativo.
     */
    async getAllPaginated(page: number = 1, limit: number = 10, token: string) {
        const res = await fetch(`${API_URL}/advertisements/admin?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Error HTTP ${res.status} al recuperar avisos del CMS.`);
        }

        const json = await res.json();
        const parsed = AdPaginatedApiResponseSchema.safeParse(json);

        if (!parsed.success) {
            throw new Error(`Respuesta inválida del servidor: ${parsed.error.message}`);
        }

        return parsed.data;
    },

    /**
     * Obtiene un aviso específico mediante su ID.
     */
    async getById(id: string, token: string): Promise<TAdvertisement> {
        const res = await fetch(`${API_URL}/advertisements/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`No se encontró el aviso solicitado (ID: ${id})`);
        }

        const json = await res.json();
        const parsed = AdApiResponseSchema.safeParse(json);

        if (!parsed.success) {
            throw new Error("La estructura del aviso recuperado es incompatible.");
        }

        return parsed.data.data;
    },

    /**
     * Crea un nuevo anuncio en la API principal.
     */
    async create(data: CreateAdDTO, token: string): Promise<TAdvertisement> {
        const res = await fetch(`${API_URL}/advertisements`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errBody = (await res.json().catch(() => ({ message: "" }))) as { message?: string };
            throw new Error(errBody.message || "Error del servidor al registrar el anuncio.");
        }

        const json = await res.json();
        return AdApiResponseSchema.parse(json).data;
    },

    /**
     * Actualiza los datos de un anuncio existente.
     */
    async update(id: string, data: UpdateAdDTO, token: string): Promise<TAdvertisement> {
        const res = await fetch(`${API_URL}/advertisements/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errBody = (await res.json().catch(() => ({ message: "" }))) as { message?: string };
            throw new Error(errBody.message || "Error del servidor al actualizar el anuncio.");
        }

        const json = await res.json();
        return AdApiResponseSchema.parse(json).data;
    },

    /**
     * Elimina un anuncio de la base de datos.
     */
    async delete(id: string, token: string): Promise<void> {
        const res = await fetch(`${API_URL}/advertisements/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errBody = (await res.json().catch(() => ({ message: "" }))) as { message?: string };
            throw new Error(errBody.message || "Error al intentar eliminar el anuncio.");
        }
    },
};