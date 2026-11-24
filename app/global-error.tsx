"use client";

// Último recurso: captura errores del layout raíz. Debe definir <html> y <body>.

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Error global de la aplicación:", error);
    }, [error]);

    return (
        <html lang="es">
            <body>
                <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1f2937" }}>Algo no salió bien</h1>
                    <p style={{ color: "#6b7280", maxWidth: 420 }}>
                        Ocurrió un problema inesperado. Intenta recargar la página.
                    </p>
                    <button
                        type="button"
                        onClick={() => reset()}
                        style={{ background: "#111827", color: "#fff", padding: "8px 20px", borderRadius: 6, border: 0, cursor: "pointer" }}
                    >
                        Reintentar
                    </button>
                </div>
            </body>
        </html>
    );
}
