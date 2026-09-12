// File: frontend/components/auth/ResetPasswordForm.tsx

'use client'

import { useActionState, useEffect } from "react"
import { resetPassword } from "@/actions/reset-password-action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ResetPasswordForm({ token }: { token: string }) {
    const router = useRouter()

    const resetPasswordWithToken = resetPassword.bind(null, token)
    const [state, dispatch, isPending] = useActionState(resetPasswordWithToken, {
        errors: [],
        success: ""
    })

    useEffect(() => {
        if (state.errors.length > 0) {
            state.errors.forEach(error => toast.error(error))
        }
        if (state.success) {
            toast.success(state.success)
            router.push('/auth/login')
        }
    }, [state, router])

    return (
        <form className="mt-6 space-y-4" noValidate action={dispatch}>
            <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                    Nueva contraseña
                </Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="password_confirmation" className="text-xs font-semibold text-slate-700">
                    Confirmar contraseña
                </Label>
                <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    placeholder="••••••••"
                    required
                />
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-9 shadow-xs"
            >
                {isPending ? "Guardando..." : "Guardar contraseña"}
            </Button>
        </form>
    )
}