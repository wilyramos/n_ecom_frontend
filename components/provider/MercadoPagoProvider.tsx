// frontend/src/components/MercadoPagoProvider.tsx
"use client";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useEffect } from "react";
import { useRef } from "react";

/**
 * Inicializa el SDK de Mercado Pago una sola vez.
 * Se monta en el layout raíz: cualquier excepción aquí tumba TODA la app,
 * por eso no se inicializa sin clave y el fallo se registra sin propagarse.
 */
export default function MercadoPagoProvider() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY?.trim();
        if (!publicKey) {
            console.warn("Mercado Pago: falta NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY; SDK no inicializado.");
            return;
        }

        try {
            initMercadoPago(publicKey, { locale: "es-PE" });
        } catch (error) {
            console.error("Mercado Pago: no se pudo inicializar el SDK", error);
        }
    }, []);

    return null;
}
