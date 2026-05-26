//File: frontend/components/auth/LoginForm.tsx

'use client'

import { useState, useEffect, useTransition } from "react"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "react-toastify"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"

import { authenticateUserAction } from "@/actions/authenticate-user-action"
import { googleLoginAction } from "@/actions/auth/google-login-action"
import { Input } from "../ui/input"

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
        state.errors.forEach(error => toast.error(error))
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
        <div className="mt-4 space-y-5 text-gray-700">
            
            {/* Google Login */}
            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => toast.error("Error al iniciar sesión con Google")}
                    size="large"
                    shape="circle"
                />
            </div>

            {/* Divider */}
            <div className="relative text-center text-sm text-black my-6">
                <hr className="border-gray-300 mb-2" />
                <span className="bg-gray-100 px-2 absolute -top-3 left-1/2 -translate-x-1/2">
                    O bien
                </span>
            </div>

            {/* Formulario */}
            <form noValidate action={dispatch}>
                
                {/* Email */}
                <label className="text-sm">
                    Email
                    <Input
                        type="email"
                        name="email"
                        placeholder="tu@email.com"
                        className="mt-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                {/* Password */}
                <label className="text-sm block mt-4">
                    Contraseña
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="********"
                            className="mt-1 w-full px-4 py-3 font-medium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-all"
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </label>

                <input type="hidden" name="redirect" value={redirectTo} />

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-black hover:bg-gray-700 text-white py-2 rounded mt-4 transition-colors"
                >
                    Iniciar Sesión
                </button>
            </form>

            {/* Links */}
            <nav className="flex justify-between text-xs text-gray-600 my-4">
                
                {/* Register */}
                <p>
                    ¿No tienes cuenta?{" "}
                    <Link
                        href={
                            searchParams.get("redirect")
                                ? `/auth/registro?redirect=${searchParams.get("redirect")}`
                                : "/auth/registro"
                        }
                        className="text-black font-semibold hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>

                {/* Reset password */}
                <p>
                    ¿Olvidaste tu contraseña?{" "}
                    <Link
                        href="/auth/forgot-password"
                        className="text-black font-semibold hover:underline"
                    >
                        Recuperar acceso
                    </Link>
                </p>
            </nav>
        </div>
    )
}
