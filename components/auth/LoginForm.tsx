// File: frontend/components/auth/LoginForm.tsx

'use client'

import { useState, useEffect, useTransition } from "react"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"

import { authenticateUserAction } from "@/actions/authenticate-user-action"
import { googleLoginAction } from "@/actions/auth/google-login-action"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface AuthState {
    errors: string[]
    success: string
}

export default function LoginForm() {
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/profile"

    const [state, dispatch] = useActionState<AuthState, FormData>(
        authenticateUserAction,
        { errors: [], success: "" }
    )

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        state.errors?.forEach(error => toast.error(error))
        if (state.success) toast.success(state.success)
    }, [state])

    const handleGoogleLoginSuccess = ({ credential }: CredentialResponse) => {
        if (!credential) return toast.error("Token de Google no recibido")

        startTransition(async () => {
            const result = await googleLoginAction({ credential, redirectTo })
            if (result?.error) toast.error(result.error)
        })
    }

    return (
        <div className="mt-6 space-y-5 text-slate-700">
            {/* Google Login */}
            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => toast.error("Error al iniciar sesión con Google")}
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
            <form noValidate action={dispatch} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                        Correo electrónico
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                            Contraseña
                        </Label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <input type="hidden" name="redirect" value={redirectTo} />

                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-9 shadow-xs"
                >
                    {isPending ? "Ingresando..." : "Iniciar Sesión"}
                </Button>
            </form>

            {/* Link registro */}
            <p className="text-center text-xs text-slate-500 pt-2">
                ¿No tienes cuenta?{" "}
                <Link
                    href={
                        searchParams.get("redirect")
                            ? `/auth/registro?redirect=${searchParams.get("redirect")}`
                            : "/auth/registro"
                    }
                    className="font-semibold text-slate-900 hover:underline"
                >
                    Regístrate
                </Link>
            </p>
        </div>
    )
}