// File: frontend/components/auth/PasswordResetHandler.tsx

'use client'

import { useEffect, useState } from 'react'
import ResetPasswordForm from './ResetPasswordForm'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function PasswordResetHandler() {
    const searchParams = useSearchParams()
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const tokenFromURL = searchParams.get('token')
        setToken(tokenFromURL)
        setIsLoading(false)
    }, [searchParams])

    if (isLoading) {
        return (
            <div className="text-center mt-6">
                <p className="text-xs text-slate-400 animate-pulse">Verificando enlace...</p>
            </div>
        )
    }

    if (!token) {
        return (
            <div className="text-center mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <p className="text-xs text-slate-600">No se proporcionó un token válido en la URL o ha expirado.</p>
                <Button asChild variant="outline" size="sm" className="text-xs">
                    <Link href="/auth/forgot-password">Solicitar nuevo enlace</Link>
                </Button>
            </div>
        )
    }

    return <ResetPasswordForm token={token} />
}