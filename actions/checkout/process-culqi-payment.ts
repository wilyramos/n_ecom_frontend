// File: frontend/actions/checkout/process-culqi-payment.ts
"use server";

import { getTokenOptional } from "@/src/auth/dal";

export interface CulqiPaymentPayload {
    token?: string;  // Flujo síncrono: ID del token de la tarjeta (tkn_live_...)
    order?: string;  // Flujo asíncrono: ID de la orden de Culqi (ord_live_...)
    amount: number;  // Monto entero en céntimos
    email: string;   // Correo dinámico del cliente en la orden
    orderId: string; // ID interno de la orden en tu base de datos de MongoDB
}

export async function processPaymentCulqi(paymentData: CulqiPaymentPayload) {
    console.log("📤 [Server Action] processPaymentCulqi iniciado:", {
        hasToken: !!paymentData.token,
        hasOrder: !!paymentData.order,
        amount: paymentData.amount,
        email: paymentData.email,
        orderId: paymentData.orderId,
    });

    // Permite que usuarios no autenticados (invitados) completen el pago sin lanzar excepciones
    const authToken = await getTokenOptional();

    const url = process.env.API_URL;
    if (!url) {
        console.error("❌ [Server Action] API_URL no se encuentra definida en las variables de entorno");
        throw new Error("Error de configuración del sistema.");
    }

    const endpoint = `${url}/checkout/process-payment-culqi`;

    // Configuración estructural de cabeceras
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Si el usuario está registrado e inició sesión, adjuntamos su token JWT de portador
    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(paymentData),
        cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        console.error("❌ [Server Action] Error devuelto por la API del Backend:", {
            status: res.status,
            data,
        });
        throw new Error(data.message || "Ocurrió un error inesperado al procesar la transacción con Culqi.");
    }

    console.log("✅ [Server Action] Pago procesado exitosamente por el Backend:", data);
    return data;
}