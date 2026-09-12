// File: frontend/components/auth/ForgotPasswordForm.tsx

"use client"

import { forgotPassword } from '@/actions/forgot-password-action'
import { useActionState, useEffect, useRef } from 'react'
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordForm() {
    const emailRef = useRef<HTMLInputElement>(null)

    const [state, dispatch, isPending] = useActionState(forgotPassword, {
        errors: [],
        success: ""
    })

    useEffect(() => {
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach(error => toast.error(error))
        }
    }, [state])

    if (state.success && emailRef.current?.value) {
        return (
            <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2">
                <h2 className="text-sm font-semibold text-slate-900">¡Correo enviado!</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Te hemos enviado un enlace para restablecer tu contraseña a{" "}
                    <span className="font-semibold text-slate-900">{emailRef.current.value}</span>.
                    Revisa tu bandeja de entrada o carpeta de spam.
                </p>
            </div>
        )
    }

    return (
        <form
            className="mt-6 space-y-4 text-slate-700"
            noValidate
            action={dispatch}
        >
            <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                    Correo electrónico
                </Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="correo@ejemplo.com"
                    required
                    ref={emailRef}
                />
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-9 shadow-xs"
            >
                {isPending ? "Enviando..." : "Recuperar Contraseña"}
            </Button>
        </form>
    )
}