// src/auth/dal.ts
import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { UserSchema } from "../schemas"
import { cache } from "react"

// Obtiene la sesión de forma segura sin disparar redirecciones automáticas
export const getSession = cache(async () => {
    const token = (await cookies()).get("ecommerce-token")?.value
    if (!token) return null

    try {
        const url = `${process.env.API_URL}/auth/user`;
        const req = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!req.ok) return null

        const responseData = await req.json()
        const ResponseValidation = UserSchema.safeParse(responseData);

        if (!ResponseValidation.success) return null

        return {
            user: ResponseValidation.data,
            token,
            isAuth: true
        }
    } catch (error) {
        console.error("Error fetching user session:", error);
        return null
    }
})

export const verifySession = cache(async () => {
    const session = await getSession()
    if (!session) redirect("/auth/login")
    return session
})

export const getTokenOptional = cache(async (): Promise<string | undefined> => {
    const token = (await cookies()).get("ecommerce-token")?.value
    return token
})