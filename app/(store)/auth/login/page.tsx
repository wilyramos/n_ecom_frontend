import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
    title: 'neoshop - Iniciar Sesión',
    description: 'Inicia sesión en tu cuenta de neoshop para acceder a tus pedidos, favoritos y más.',
    keywords: 'iniciar sesión, neoshop , cuenta',
}

export default function PageLogin() {
    return (
        <div className="w-full max-w-xs mx-auto">
            <h1 className="text-2xl text-center">Iniciar sesión</h1>
            <LoginForm />
        </div>
    )
}
