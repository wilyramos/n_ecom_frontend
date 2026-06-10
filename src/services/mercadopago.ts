// File: frontend/src/services/mercadopago.ts

/**
 * Llama al backend para crear una preferencia de MercadoPago.
 * Devuelve el preferenceId (para el SDK del botón) y el initPoint (para redirección).
 *
 * NOTA: Esta función se llama desde un Client Component porque necesita
 * el token del usuario (opcional) y no expone credenciales.
 */
export async function createMercadoPagoPreference(orderId: string): Promise<{
    preferenceId: string;
    initPoint: string;
}> {
    const res = await fetch(`${process.env.API_URL}/checkout/create-preference-mp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Error al crear preferencia de MercadoPago');
    }

    return res.json();
}