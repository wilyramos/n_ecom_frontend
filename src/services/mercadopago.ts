// File: frontend/src/services/mercadopago.ts

export async function createMercadoPagoPreference(orderId: string): Promise<{
    preferenceId: string;
    initPoint: string;
}> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/checkout/create-preference-mp`;
    
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
    });

    if (!res.ok) {
        // Esto ayudará a ver si el servidor devuelve HTML (error) o JSON
        const text = await res.text();
        console.error("Respuesta del servidor al fallar:", text);
        throw new Error('Error al crear preferencia de MercadoPago');
    }

    return res.json();
}