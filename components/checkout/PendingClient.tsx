// File: frontend/components/checkout/PendingClient.tsx
'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import type { TOrderPopulated } from '@/src/schemas';
import Link from 'next/link';

import { BsHourglassSplit, BsTruck, BsFileEarmarkText, BsCreditCard, BsClipboardCheck, BsQrCode } from 'react-icons/bs';
import { FiArrowLeftCircle } from 'react-icons/fi';

export default function PendingClient({ order }: { order: TOrderPopulated }) {
    const clearCart = useCartStore((state) => state.clearCart);
    const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

    useEffect(() => {
        if (order?.payment?.status === 'pending') {
            clearCart();
            clearCheckout();
        }
    }, [order, clearCart, clearCheckout]);

    return (
        <div className="flex items-center justify-center px-4 py-20 bg-[var(--color-background)]">
            <div className="w-full max-w-lg p-10 text-center bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <BsHourglassSplit className="text-amber-500 text-7xl mx-auto mb-6 animate-pulse" />
                
                <h1 className="text-3xl font-semibold text-[var(--color-foreground)] mb-2 flex items-center justify-center gap-2">
                    Pago pendiente
                </h1>
                
                <p className="text-[var(--color-muted-foreground)] text-sm mb-8 tracking-wide">
                    Tu código o instrucción de pago ha sido generado. Completa la acción en tu app bancaria o agente autorizado.
                </p>

                {/* Mostrar código CIP si existe (PagoEfectivo) */}
                {order.payment?.culqiPaymentCode && (
                    <div className="mb-8 p-6 bg-[var(--color-accent)] rounded-xl border border-[var(--color-border)] flex flex-col items-center gap-2">
                        <BsQrCode className="text-3xl text-[var(--color-primary)] mb-1" />
                        <span className="text-xs text-[var(--color-muted-foreground)] uppercase font-semibold tracking-wider">Código CIP de PagoEfectivo</span>
                        <span className="text-2xl font-mono font-bold tracking-widest text-[var(--color-foreground)] bg-[var(--color-card)] px-4 py-1.5 rounded-lg border border-[var(--color-border)]">
                            {order.payment.culqiPaymentCode}
                        </span>
                    </div>
                )}

                {/* Detalles con íconos */}
                <div className="text-left text-sm text-[var(--color-foreground)] space-y-4 border-t border-[var(--color-border)] pt-6">
                    <p className="flex items-center gap-2">
                        <BsClipboardCheck className="text-[var(--color-muted-foreground)]" />
                        <span className="text-[var(--color-muted-foreground)]">Número de orden:</span>
                        <span className="font-medium">{order.orderNumber}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsCreditCard className="text-[var(--color-muted-foreground)]" />
                        <span className="text-[var(--color-muted-foreground)]">Estado del pago:</span>
                        <span className="text-amber-500 font-medium">
                            {order.payment?.status || "Pendiente"}
                        </span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsFileEarmarkText className="text-[var(--color-muted-foreground)]" />
                        <span className="text-[var(--color-muted-foreground)]">Total a pagar:</span>
                        <span className="font-medium">{order.currency} {order.totalPrice.toFixed(2)}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsTruck className="text-[var(--color-muted-foreground)]" />
                        <span className="text-[var(--color-muted-foreground)]">Estado del envío:</span>
                        <span className="font-medium">{order.status}</span>
                    </p>
                </div>

                {/* Acciones */}
                <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href={`/productos`}
                        className="w-full sm:w-auto border border-[var(--color-border)] text-[var(--color-foreground)] py-2.5 px-6 rounded-full text-sm tracking-wide hover:bg-[var(--color-accent)] transition flex items-center justify-center gap-2"
                    >
                        <FiArrowLeftCircle className="text-lg" />
                        Ir al catálogo
                    </Link>
                    <Link
                        href="/profile/orders"
                        className="w-full sm:w-auto bg-[var(--color-primary)] text-[var(--color-primary-foreground)] py-2.5 px-6 rounded-full text-sm tracking-wide hover:bg-[var(--color-action-primary-hover)] transition flex items-center justify-center gap-2 shadow-sm"
                    >
                        <BsClipboardCheck className="text-lg" />
                        Ver mis pedidos
                    </Link>
                </div>
            </div>
        </div>
    );
}