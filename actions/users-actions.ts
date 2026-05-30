//File: frontend/actions/users-actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { UsersApiService } from "@/src/services/user-service";
import {
    CreateClientFormSchema,
    UpdateProfileFormSchema,
    UpdateRoleFormSchema,
    UserRole,
    UpdatePasswordFormSchema
} from "@/src/schemas/user.schema";

export interface ActionState {
    success: boolean;
    error?: string;
    data?: unknown;
}

/**
 * Action para crear un cliente desde los formularios del dashboard administrativo
 */
export async function createClientAction(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const rawFields = Object.fromEntries(formData.entries());
    const validatedFields = CreateClientFormSchema.safeParse(rawFields);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors.nombre?.[0] || "Datos de cliente inválidos"
        };
    }

    try {
        const result = await UsersApiService.createClient(validatedFields.data);
        revalidatePath("/dashboard/users");
        return { success: true, data: result };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Error inesperado al crear el cliente"
        };
    }
}

/**
 * Action para actualizar el perfil propio del usuario autenticado
 */
export async function updateOwnProfileAction(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const rawFields = Object.fromEntries(formData.entries());
    const validatedFields = UpdateProfileFormSchema.safeParse(rawFields);

    console.log("Datos recibidos para actualización de perfil:", rawFields);
    console.log("Resultado de validación del perfil:", validatedFields);

    if (!validatedFields.success) {
        return {
            success: false,
            error: "Asegúrate de rellenar adecuadamente los campos obligatorios del perfil"
        };
    }

    try {
        const updatedUser = await UsersApiService.updateOwnProfile(validatedFields.data);
        revalidatePath("/profile");
        return { success: true, data: updatedUser };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Ocurrió un error al procesar la actualización del perfil"
        };
    }
}

/**
 * Action para que un administrador cambie el rol de un usuario
 */
export async function updateUserRoleAction(
    userId: string,
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const rawFields = Object.fromEntries(formData.entries());
    const validatedFields = UpdateRoleFormSchema.safeParse(rawFields);

    if (!validatedFields.success || !userId) {
        return {
            success: false,
            error: "El rol seleccionado no pertenece a los privilegios válidos"
        };
    }

    try {
        const result = await UsersApiService.updateUserRole(userId, validatedFields.data.rol as UserRole);
        revalidatePath("/dashboard/users");
        return { success: true, data: result };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "No se pudo actualizar el rol debido a un error de red"
        };
    }
}

/**
 * Action para dar de baja lógica a un usuario (Soft Delete) desde el listado
 */
export async function softDeleteUserAction(
    userId: string,
    _prevState: ActionState
): Promise<ActionState> {
    if (!userId) {
        return { success: false, error: "Identificador de usuario inválido o inexistente" };
    }

    try {
        const result = await UsersApiService.softDeleteUser(userId);
        revalidatePath("/dashboard/users");
        return { success: true, data: result };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Error interno al ejecutar la baja en el servidor"
        };
    }
}
export async function changeOwnPasswordAction(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const rawFields: Record<string, string> = {};
    formData.forEach((value, key) => {
        if (typeof value === "string") rawFields[key] = value;
    });

    const validatedFields = UpdatePasswordFormSchema.safeParse(rawFields);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors.currentPassword?.[0] ||
                   validatedFields.error.flatten().fieldErrors.password?.[0] || 
                   validatedFields.error.flatten().fieldErrors.confirmPassword?.[0] || 
                   "Las contraseñas provistas son inválidas."
        };
    }

    try {
        const result = await UsersApiService.changePassword({
            currentPassword: validatedFields.data.currentPassword,
            newPassword: validatedFields.data.password
        });
        return { success: true, data: result };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Error al intentar cambiar la contraseña"
        };
    }
}


// frontend/actions/users-actions.ts

export async function adminUpdateUserAction(
    userId: string,
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const rawFields = Object.fromEntries(formData.entries());
    const validatedFields = UpdateProfileFormSchema.safeParse(rawFields);

    if (!validatedFields.success || !userId) {
        return {
            success: false,
            error: "Asegúrate de rellenar adecuadamente los campos obligatorios"
        };
    }

    try {
        const updatedUser = await UsersApiService.updateUserById(userId, validatedFields.data);
        revalidatePath("/dashboard/users");
        return { success: true, data: updatedUser };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Ocurrió un error al procesar la actualización"
        };
    }
}