//File: frontend/actions/checkout/process-culqi-payment.ts

"use server";

// para procesar pagos con o sin token
import { getTokenOptional } from "@/src/auth/dal"; 

export interface CulqiPaymentPayload {
    token?: string;   
    order?: string;   
    amount: number;   
    email: string;
    orderId: string;  
}

export async function processPaymentCulqi(paymentData: CulqiPaymentPayload) {
    console.log("📤 [SA] processPaymentCulqi iniciado:", {
        hasToken: !!paymentData.token,
        hasOrder: !!paymentData.order,
        amount: paymentData.amount,
        email: paymentData.email,
        orderId: paymentData.orderId,
    });

    // CAMBIO: Usar el validador opcional en lugar del estricto
    const authToken = await getTokenOptional();

    const url = process.env.API_URL;
    if (!url) {
        console.error("❌ [SA] API_URL no definida en variables de entorno");
        throw new Error("API_URL no configurada.");
    }

    const endpoint = `${url}/checkout/process-payment-culqi`;
    console.log("🌐 [SA] Enviando a:", endpoint);

    // Configurar cabeceras dinámicas
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Inyectar el token de autorización únicamente si el usuario está autenticado
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
        console.error("❌ [SA] Error del backend:", { status: res.status, data });
        throw new Error(data.message || "Error procesando el pago.");
    }

    console.log("✅ [SA] Respuesta exitosa del backend:", data);
    return data;
}