// File: frontend/src/services/claim-service.ts
import { Claim, ClaimFormValues, ClaimTrackingValues } from "../schemas/claim.schema";
import { getTokenOptional, verifySession } from "../auth/dal";

const API_URL = process.env.API_URL;

export class ClaimService {
    /**
     * Envío público de un reclamo/queja
     */
    static async createPublicClaim(data: ClaimFormValues): Promise<{ success: boolean; data?: Claim; error?: string }> {
        try {
            const res = await fetch(`${API_URL}/claims`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();
            if (!res.ok) return { success: false, error: json.message || "Error al registrar el reclamo" };

            return { success: true, data: json.data };
        } catch (error) {
            console.error("Error en createPublicClaim:", error);
            return { success: false, error: "Error de red o servidor no disponible" };
        }
    }

    /**
     * Consulta pública del estado de un reclamo mediante credenciales
     */
    static async trackClaim(credentials: ClaimTrackingValues): Promise<{ success: boolean; data?: Partial<Claim>; error?: string }> {
        try {
            const params = new URLSearchParams({
                correlativo: credentials.correlativo,
                numeroDocumento: credentials.numeroDocumento
            });

            const res = await fetch(`${API_URL}/claims/track?${params.toString()}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                next: { revalidate: 0 } // No almacenar en caché consultas de tracking dinámicas
            });

            const json = await res.json();
            if (!res.ok) return { success: false, error: json.message || "No se encontró el reclamo" };

            return { success: true, data: json.data };
        } catch (error) {
            console.error("Error en trackClaim:", error);
            return { success: false, error: "Error de comunicación con el servidor" };
        }
    }

    /**
     * [ADMIN] Obtiene todos los reclamos con paginación y filtros
     */
    static async getAllAdminClaims(filters: { estado?: string; search?: string; page?: number; limit?: number } = {}) {
        const session = await verifySession(); // Protege a nivel de servicio de datos
        
        const params = new URLSearchParams();
        if (filters.estado) params.append("estado", filters.estado);
        if (filters.search) params.append("search", filters.search);
        if (filters.page) params.append("page", String(filters.page));
        if (filters.limit) params.append("limit", String(filters.limit));

        const res = await fetch(`${API_URL}/claims?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${session.token}` },
            next: { tags: ["admin-claims"] } // Tag para revalidación bajo demanda
        });

        if (!res.ok) throw new Error("Error al recuperar las reclamaciones del servidor");
        return res.json();
    }

    /**
     * [ADMIN] Obtiene el detalle exhaustivo por ID
     */
    static async getClaimById(id: string): Promise<Claim> {
        const session = await verifySession();
        
        const res = await fetch(`${API_URL}/claims/${id}`, {
            headers: { "Authorization": `Bearer ${session.token}` },
            next: { tags: [`claim-${id}`] }
        });

        if (!res.ok) throw new Error("No se pudo obtener el detalle del reclamo");
        const json = await res.json();
        return json.data;
    }

    /**
     * [ADMIN] Resuelve o cambia de estado una incidencia
     */
    static async resolveClaim(id: string, update: { respuestaProveedor: string; estado: "En Proceso" | "Resuelto" }) {
        const token = await getTokenOptional();
        if (!token) return { success: false, error: "Sesión administrativa inválida o expirada" };

        try {
            const res = await fetch(`${API_URL}/claims/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(update)
            });

            const json = await res.json();
            if (!res.ok) return { success: false, error: json.message || "Error al actualizar la resolución" };

            return { success: true, data: json.data };
        } catch (error) {
            console.error("Error en resolveClaim:", error);
            return { success: false, error: "Error de red crítico" };
        }
    }
}