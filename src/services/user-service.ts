//File: frontend/src/services/user-service.ts

import { verifySession } from "@/src/auth/dal";
import {
    UserSchema, User,
    CreateClientFormData,
    UpdateProfileFormData,
    UserRole,
    UsersQuery,
    PaginatedUsersResponse,
    PaginatedUsersResponseSchema
} from "@/src/schemas/user.schema";

const API_URL = process.env.API_URL;

export class UsersApiService {

    /**
     * Obtener el listado paginado y filtrado de usuarios activos desde la V2 modular
     */
    static async getAll(queryParams: UsersQuery): Promise<PaginatedUsersResponse> {
        const { token } = await verifySession();

        const searchParams = new URLSearchParams();
        if (queryParams.page) searchParams.append("page", queryParams.page.toString());
        if (queryParams.limit) searchParams.append("limit", queryParams.limit.toString());
        if (queryParams.nombre) searchParams.append("nombre", queryParams.nombre);
        if (queryParams.email) searchParams.append("email", queryParams.email);
        if (queryParams.telefono) searchParams.append("telefono", queryParams.telefono);
        if (queryParams.numeroDocumento) searchParams.append("numeroDocumento", queryParams.numeroDocumento);

        // Apunta directamente a la V2 modular mapeada en tu servidor Express
        const response = await fetch(`${API_URL}/users/v2?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener el listado de usuarios');
        }

        const validation = PaginatedUsersResponseSchema.safeParse(data);
        if (!validation.success) {
            console.error("Error de validación en estructura de usuarios:", validation.error.format());
            throw new Error('La respuesta de la lista de usuarios no coincide con el esquema del sistema');
        }

        return validation.data;
    }

    /**
     * Obtener un usuario activo por su ID (Requiere autenticación de Staff)
     */
    static async getActiveUserById(id: string): Promise<User> {
        const { token } = await verifySession();

        const response = await fetch(`${API_URL}/users/v2/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener los detalles del usuario');
        }

        const validation = UserSchema.safeParse(data);
        if (!validation.success) {
            throw new Error('La respuesta de la API no coincide con el esquema del sistema');
        }

        return validation.data;
    }

    /**
     * Crear un nuevo cliente desde el panel administrativo (Requiere Auth de Staff)
     */
    static async createClient(clientData: CreateClientFormData): Promise<{ message: string; userId: string }> {
        const { token } = await verifySession();

        const response = await fetch(`${API_URL}/users/v2/clients`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al procesar el registro del cliente');
        }

        return data;
    }

    /**
     * Actualizar el perfil del usuario actualmente autenticado en la sesión
     */
    static async updateOwnProfile(profileData: UpdateProfileFormData): Promise<User> {
        const { token } = await verifySession();

        const response = await fetch(`${API_URL}/users/v2/profile/update`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al intentar actualizar la información de tu perfil');
        }

        const validation = UserSchema.safeParse(data.user);
        if (!validation.success) {
            throw new Error('Estructura de perfil devuelta no válida');
        }

        return validation.data;
    }

    /**
     * Cambiar el rol de un usuario del sistema (Acceso exclusivo a Administradores)
     */
    static async updateUserRole(id: string, newRole: UserRole): Promise<{ message: string; user: User }> {
        const { token } = await verifySession();

        const response = await fetch(`${API_URL}/users/v2/${id}/role`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rol: newRole })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al modificar los privilegios del usuario');
        }

        const validation = UserSchema.safeParse(data.user);
        if (!validation.success) {
            throw new Error('Estructura del usuario modificado no válida');
        }

        return {
            message: data.message,
            user: validation.data
        };
    }

    /**
     * Realizar la baja lógica (Soft Delete) de un usuario
     */
    static async softDeleteUser(id: string): Promise<{ message: string }> {
        const { token } = await verifySession();

        const response = await fetch(`${API_URL}/users/v2/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'No se pudo completar la desactivación del usuario');
        }

        return data;
    }

    static async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
        const { token } = await verifySession();

        const response = await fetch(`${API_URL}/users/v2/profile/change-password`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passwordData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar la contraseña');
        }

        return data;
    }

    // frontend/src/services/user-service.ts

static async updateUserById(id: string, profileData: UpdateProfileFormData): Promise<User> {
    const { token } = await verifySession();

    const response = await fetch(`${API_URL}/users/v2/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al intentar actualizar la información del usuario');
    }

    const validation = UserSchema.safeParse(data.user);
    if (!validation.success) {
        throw new Error('Estructura de usuario devuelta no válida');
    }

    return validation.data;
}
}