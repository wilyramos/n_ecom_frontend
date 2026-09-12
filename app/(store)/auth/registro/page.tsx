// File: frontend/app/auth/registro/page.tsx

import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
    title: "neoshop - Registro de cuenta",
    description: "Crea tu cuenta en neoshop para acceder a pedidos, favoritos y promociones.",
    keywords: "registro, neoshop, cuenta",
};

export default function PageRegistro() {
    return (
        <div className="w-full max-w-sm mx-auto p-6">
            <h1 className="text-2xl font-bold tracking-tight text-center text-slate-900">
                Crea tu cuenta
            </h1>
            <p className="mt-1 text-xs text-center text-slate-500">
                Ingresa tus datos para registrarte en la plataforma
            </p>

            <RegisterForm />
        </div>
    );
}