// File: frontend/app/auth/reset-password/page.tsx

import PasswordResetHandler from '@/components/auth/PasswordResetHandler'
import { Suspense } from 'react'

export default function NewPasswordPage() {
    return (
        <div className="w-full max-w-sm mx-auto p-6">
            <h1 className="text-2xl font-bold tracking-tight text-center text-slate-900">
                Restablecer contraseña
            </h1>
            <p className="mt-1 text-xs text-center text-slate-500">
                Ingresa y confirma tu nueva contraseña de acceso
            </p>

            <Suspense fallback={<p className="text-center text-xs text-slate-400 mt-6 animate-pulse">Cargando...</p>}>
                <PasswordResetHandler />
            </Suspense>
        </div>
    )
}