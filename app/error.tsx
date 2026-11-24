"use client";

// Límite de error por ruta. Evita que una excepción en el cliente muestre la
// pantalla genérica "Application error" de Next.

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Error en la página:", error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-10 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Algo no salió bien</h1>
            <p className="max-w-md text-gray-500">
                Ocurrió un problema al cargar esta página. Puedes intentarlo de nuevo o volver al inicio.
            </p>
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => reset()}
                    className="rounded-md bg-gray-900 px-5 py-2 text-white transition-colors hover:bg-gray-700 cursor-pointer"
                >
                    Reintentar
                </button>
                <Link
                    href="/"
                    className="rounded-md border border-gray-300 px-5 py-2 text-gray-800 transition-colors hover:bg-gray-100"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}
