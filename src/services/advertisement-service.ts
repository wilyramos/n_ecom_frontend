import { 
    AdListApiResponseSchema, 
    AdPaginatedApiResponseSchema, 
    AdApiResponseSchema,
    TAdvertisement,
    CreateAdDTO,
    UpdateAdDTO
} from "@/src/schemas/advertisement.schema";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const AdvertisementService = {
    /**
     * Recupera los avisos vigentes para el Storefront público.
     * Implementa tags de Next.js para permitir revalidación bajo demanda.
     */
    async getActiveAds(): Promise<TAdvertisement[]> {
        const res = await fetch(`${API_URL}/advertisements/active`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { 
                revalidate: 300, // Caché de 5 minutos por defecto
                tags: ["ads-public"] 
            }
        });

        if (!res.ok) throw new Error("Error al obtener los avisos activos");
        const json = await res.json();
        
        const parsed = AdListApiResponseSchema.safeParse(json);
        if (!parsed.success) {
            console.error("Zod Parsing Error (Active Ads):", parsed.error.format());
            return [];
        }
        return parsed.data.data;
    },

    /**
     * Recupera todos los avisos de manera paginada para el CMS administrativo.
     */
    async getAllPaginated(page: number = 1, limit: number = 10, token: string) {
        const res = await fetch(`${API_URL}/advertisements/admin?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        });

        if (!res.ok) throw new Error("Error al recuperar los avisos de administración");
        const json = await res.json();

        const parsed = AdPaginatedApiResponseSchema.safeParse(json);
        if (!parsed.success) {
            throw new Error(`Datos del servidor corruptos: ${parsed.error.message}`);
        }
        return parsed.data;
    },

    /**
     * Obtiene el detalle particular de un aviso por su ID.
     */
    async getById(id: string, token: string): Promise<TAdvertisement> {
        const res = await fetch(`${API_URL}/advertisements/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        });

        if (!res.ok) throw new Error("No se pudo encontrar el aviso solicitado");
        const json = await res.json();

        const parsed = AdApiResponseSchema.safeParse(json);
        if (!parsed.success) throw new Error("Estructura de aviso inválida");
        return parsed.data.data;
    },

    /**
     * Registra un nuevo aviso en el backend.
     */
    async create(data: CreateAdDTO, token: string): Promise<TAdvertisement> {
        const res = await fetch(`${API_URL}/advertisements`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({ message: "" })) as { message?: string };
            throw new Error(errBody.message || "Error al crear el aviso");
        }
        const json = await res.json();
        return AdApiResponseSchema.parse(json).data;
    },

    /**
     * Actualiza los datos de un aviso existente.
     * Tipado adecuado utilizando UpdateAdDTO en lugar de un Partial genérico del DTO de creación.
     */
    async update(id: string, data: UpdateAdDTO, token: string): Promise<TAdvertisement> {
        const res = await fetch(`${API_URL}/advertisements/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({ message: "" })) as { message?: string };
            throw new Error(errBody.message || "Error al actualizar el aviso");
        }
        const json = await res.json();
        return AdApiResponseSchema.parse(json).data;
    },

    /**
     * Remueve físicamente un aviso del sistema.
     */
    async delete(id: string, token: string): Promise<void> {
        const res = await fetch(`${API_URL}/advertisements/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({ message: "" })) as { message?: string };
            throw new Error(errBody.message || "Error al eliminar el aviso");
        }
    }
};