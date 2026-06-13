"use server"

import { redirect } from "next/navigation"
import { LoginSchema, ErrorResponseSchema, SuccessSchemaLogin } from "@/src/schemas"
import { cookies } from "next/headers"

type ActionStateType = {
    errors: string[],
    success: string
}

export async function authenticateUserAction(prevState: ActionStateType, formData: FormData) {
    const loginCredentials = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const redirectTo = formData.get('redirect')?.toString() || '/profile';

    const auth = LoginSchema.safeParse(loginCredentials);
    if (!auth.success) {
        return {
            errors: auth.error.errors.map(error => error.message),
            success: ""
        }
    }

    const url = `${process.env.API_URL}/auth/login`;
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: auth.data.email,
            password: auth.data.password,
        }),
    })

    const responseData = await req.json()

    if (!req.ok) {
        const errorResponse = ErrorResponseSchema.parse(responseData)
        return {
            errors: [errorResponse.message],
            success: ""
        }
    }

    const successResponse = SuccessSchemaLogin.parse(responseData)
    const { token, role } = successResponse;

    (await cookies()).set({
        name: 'ecommerce-token',
        value: token,
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30
    })

    // Redirección centralizada por rol
    if (role === 'administrador') redirect('/admin');
    if (role === 'vendedor') redirect('/pos');
    if (role === 'colaborador') redirect('/staff/attendance');

    redirect(redirectTo);
}