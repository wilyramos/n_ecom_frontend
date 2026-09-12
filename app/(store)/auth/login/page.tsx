// File: frontend/app/auth/login/page.tsx

import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
    title: 'neoshop - Iniciar Sesión',
    description: 'Inicia sesión en tu cuenta de neoshop para acceder a tus pedidos, favoritos y más.',
    keywords: 'iniciar sesión, neoshop, cuenta',
}

export default function PageLogin() {
    return (
        <div className="w-full max-w-sm mx-auto p-6">
            <h1 className="text-2xl font-bold tracking-tight text-center text-slate-900">
                Iniciar sesión
            </h1>
            <p className="mt-1 text-xs text-center text-slate-500">
                Accede a tu cuenta para continuar
            </p>
            <LoginForm />
        </div>
    )
}