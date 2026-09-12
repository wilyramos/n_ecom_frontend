// File: frontend/app/auth/forgot-password/page.tsx

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

export default function PageForgotPassword() {
    return (
        <div className="w-full max-w-sm mx-auto p-6">
            <h1 className="text-2xl font-bold tracking-tight text-center text-slate-900">
                Recuperar Contraseña
            </h1>
            <p className="mt-1 text-xs text-center text-slate-500">
                Ingresa tu correo electrónico para recibir el enlace
            </p>

            <ForgotPasswordForm />

            <nav className="text-xs text-slate-500 mt-6 text-center space-y-1.5">
                <p>
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        href="/auth/login"
                        className="font-semibold text-slate-900 hover:underline"
                    >
                        Inicia sesión
                    </Link>
                </p>
                <p>
                    ¿No tienes una cuenta?{" "}
                    <Link
                        href="/auth/registro"
                        className="font-semibold text-slate-900 hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>
            </nav>
        </div>
    );
}