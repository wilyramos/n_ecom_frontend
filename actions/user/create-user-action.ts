// File: src/actions/user-action.ts (o el nombre de tu archivo de acciones)
"use server"

import { CheckoutRegisterSchema } from '@/src/schemas'
import { getTokenOptional } from '@/src/auth/dal'

type SuccessResponse = {
    message: string;
    userId: string;
}

export type ActionStateType = {
    errors: string[];
    success: SuccessResponse | null;
}

export async function createUserAction(prevState: ActionStateType, formData: FormData): Promise<ActionStateType> {
    const registerData = {
        nombre: formData.get('nombre'),
        apellidos: formData.get('apellidos'),
        tipoDocumento: formData.get('tipoDocumento'),
        numeroDocumento: formData.get('numeroDocumento'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
    }

    console.log("rregg", registerData)

    // Validar los datos usando Zod
    const validationResult = CheckoutRegisterSchema.safeParse(registerData);
    
    if (!validationResult.success) {
        const errors = validationResult.error.errors.map(error => error.message);
        return {
            errors,
            success: null,
        }
    }

    // Recuperamos el token opcional utilizando el DAL seguro del servidor
    const token = await getTokenOptional();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Si existe una sesión activa, adjuntamos el token Bearer para las validaciones del backend
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const url = `${process.env.API_URL}/auth/create-user-if-not-exists`;
        const req = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                nombre: validationResult.data.nombre,
                apellidos: validationResult.data.apellidos,
                tipoDocumento: validationResult.data.tipoDocumento,
                numeroDocumento: validationResult.data.numeroDocumento,
                email: validationResult.data.email,
                telefono: validationResult.data.telefono,
            }),
        });

        if (!req.ok) {
            const errorData = await req.json();
            return {
                errors: [errorData.message || "Error al procesar la solicitud en el servidor"],
                success: null,
            }
        }

        const data = await req.json();
        console.log('data:', data);

        return {
            errors: [],
            success: {
                message: data.message,
                userId: data.userId,
            }
        }
    } catch (error) {
        console.error("Error en createUserAction:", error);
        return {
            errors: ["Error de red o el servidor no se encuentra disponible."],
            success: null
        }
    }
}