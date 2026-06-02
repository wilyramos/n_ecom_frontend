"use client";

import type { TOrderPopulated } from "@/src/schemas";
import CheckoutProMP from "./mercadopago/CheckoutProMP";

export default function PaymentMethodsAccordion({ order }: { order: TOrderPopulated }) {
    return (
        <section className="w-full">
            <p className="text-[11px] font-bold uppercase tracking-wider text-fg-muted mb-4">
                {/* Método de pago */}
            </p>

            {/* Contenedor simplificado sin acordeón */}
            <div className="border border-border-default rounded-xl bg-background p-6">
                <div className="flex flex-col gap-1 mb-6">
                    <span className="text-sm font-semibold text-fg-primary">Mercado Pago</span>
                    <span className="text-xs text-fg-muted font-medium">
                        Tarjeta, saldo en cuenta o efectivo. Procesado de forma segura.
                    </span>
                </div>

                <div className="text-center bg-surface-primary p-4 rounded-lg border border-border-default/50">
                    <p className="text-xs text-fg-muted mb-4 max-w-sm mx-auto">
                        Al continuar, serás redirigido a la plataforma segura de Mercado Pago para completar tu compra.
                    </p>
                    <CheckoutProMP orderId={order._id} />
                </div>
            </div>
        </section>
    );
}