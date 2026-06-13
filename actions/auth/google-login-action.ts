"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function googleLoginAction({ credential, redirectTo }: { credential: string, redirectTo: string }) {
    if (!credential) {
        return {
            error: "No se recibió el token de Google"
        }
    }

    const res = await fetch(`${process.env.API_URL}/auth/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ credential })
    })

    const data = await res.json()

    if (!res.ok) {
        return {
            error: data.message || "Error al iniciar sesión con Google"
        }
    }

    const { token, role } = data;
    
    (await cookies()).set({
        name: "ecommerce-token",
        value: token,
        path: "/",
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30
    })

    // Redirección centralizada por rol
    if (role === "administrador") redirect("/admin");
    if (role === "vendedor") redirect("/pos");
    if (role === "colaborador") redirect("/staff/attendance");

    redirect(redirectTo);
}