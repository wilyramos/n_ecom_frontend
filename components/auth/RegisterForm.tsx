// File: frontend/components/auth/RegisterForm.tsx

'use client'

import { useEffect, useTransition } from "react"
import { useActionState } from "react"
import { toast } from "sonner"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { createAccountAction } from "@/actions/create-account-action"
import { googleLoginAction as googleRegisterAction } from "@/actions/auth/google-login-action"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface SuccessResponse {
    message: string
    userId: string
    token: string
}

export default function RegisterForm() {
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/profile"

    const [state, dispatch] = useActionState(createAccountAction, {
        errors: [],
        success: {} as SuccessResponse,
    })

    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        if (state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error))
        }
        if (state.success?.message) {
            toast.success(state.success.message)
        }
    }, [state])

    const handleGoogleLoginSuccess = ({ credential }: CredentialResponse) => {
        if (!credential) return toast.error("Token de Google no recibido")

        startTransition(async () => {
            const result = await googleRegisterAction({ credential, redirectTo })
            if (result?.error) toast.error(result.error)
        })
    }

    return (
        <div className="mt-6 space-y-5 text-slate-700">
            {/* Google Login */}
            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => toast.error("Error al registrarte con Google")}
                    size="large"
                    shape="circle"
                />
            </div>

            {/* Separador */}
            <div className="relative text-center text-xs my-5">
                <hr className="border-slate-200" />
                <span className="bg-white px-3 text-slate-400 font-medium absolute -top-2 left-1/2 -translate-x-1/2">
                    O continúa con correo
                </span>
            </div>

            {/* Formulario */}
            <form action={dispatch} noValidate className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                        Correo electrónico
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="tu@email.com"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="nombre" className="text-xs font-semibold text-slate-700">
                        Nombre completo
                    </Label>
                    <Input
                        id="nombre"
                        type="text"
                        name="nombre"
                        required
                        placeholder="Tu nombre"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                        Contraseña
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        required
                        placeholder="••••••••"
                    />
                </div>

                <input type="hidden" name="redirect" value={redirectTo} />

                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-9 shadow-xs"
                >
                    {isPending ? "Creando cuenta..." : "Crear cuenta"}
                </Button>
            </form>

            {/* Link a login */}
            <p className="text-center text-xs text-slate-500 pt-2">
                ¿Ya tienes una cuenta?{" "}
                <Link
                    href={
                        searchParams.get("redirect")
                            ? `/auth/login?redirect=${searchParams.get("redirect")}`
                            : "/auth/login"
                    }
                    className="font-semibold text-slate-900 hover:underline"
                >
                    Inicia sesión
                </Link>
            </p>
        </div>
    )
}