'use client';

import { useState } from 'react';
import { createMercadoPagoPreference } from '@/src/services/mercadopago';
import { Button } from "@/components/ui/button";
import type { TOrder } from '@/src/schemas';
import { toast } from "sonner";

type Props = {
    order: TOrder;
};

export default function CheckoutMercadoPago({ order }: Props) {
    const [loading, setLoading] = useState(false);

    const handlePagar = async () => {
        try {
            setLoading(true);

            // ── AUDITORÍA DE DATOS DE SALIDA HACIA MERCADO PAGO ──
            console.log('🚀 [MercadoPago Checkout] Iniciando creación de preferencia...');
            console.log('📦 [MercadoPago Payload de Orden]:', {
                orderId: order._id,
                orderNumber: order.orderNumber,
                totalPrice: order.totalPrice,
                currency: order.currency,
                customer: {
                    name: order.customerProfile?.nombre,
                    email: order.customerProfile?.email,
                    document: `${order.customerProfile?.tipoDocumento} - ${order.customerProfile?.numeroDocumento}`
                },
                itemsCount: order.items?.length
            });

            const response = await createMercadoPagoPreference(order._id);

            console.log('✅ [MercadoPago API Respuesta]:', response);

            if (!response?.initPoint) {
                throw new Error('La respuesta del servidor no contiene una URL de redirección válida (initPoint).');
            }

            toast.success("Preferencia creada. Redirigiendo a la pasarela...");
            window.location.href = response.initPoint;

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error inesperado';

            // ── MENSAJE DE IMPACTO MEDIANTE TOAST ──
            toast.error(message);
            console.error('❌ [CheckoutMP] Fallo al procesar preferencia:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center gap-3">
            <Button
                type="button"
                onClick={handlePagar}
                disabled={loading}
                className="w-full tracking-wide transition-all rounded-xl flex items-center justify-center gap-2 bg-[#009ee3] text-white hover:bg-[#008fcf] shadow-sm disabled:bg-surface-secondary disabled:text-fg-muted disabled:border disabled:border-border-default"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Redirigiendo a Mercado Pago...</span>
                    </>
                ) : (
                    <>
                        <span>Pagar con MercadoPago</span>
                    </>
                )}
            </Button>
        </div>
    );
}