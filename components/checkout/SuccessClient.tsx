'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import type { TOrderPopulated } from '@/src/schemas';
import Link from 'next/link';

import { BsCheckCircle, BsTruck, BsFileEarmarkText, BsCreditCard, BsClipboardCheck, BsBagCheck } from 'react-icons/bs';
import { FiArrowLeftCircle } from 'react-icons/fi';

export default function SuccessClient({ order }: { order: TOrderPopulated }) {
    const clearCart = useCartStore((state) => state.clearCart);
    const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

    useEffect(() => {
        if (order?.payment?.status === 'approved') {
            clearCart();
            clearCheckout();
        }
    }, [order, clearCart, clearCheckout]);

    return (
        <div className="flex items-center justify-center px-4 py-20 bg-[var(--color-background)]">
            <div className="w-full max-w-lg p-10 text-center bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <BsCheckCircle className="text-[var(--color-action-destructive)] text-7xl mx-auto mb-6" />
                
                <h1 className="text-3xl font-semibold text-[var(--color-foreground)] mb-2 flex items-center justify-center gap-2">
                    <BsBagCheck className="text-[var(--color-primary)]" />
                    Pago aprobado
                </h1>
                
                <p className="text-[var(--color-muted-foreground)] text-sm mb-8 tracking-wide">
                    Tu orden está en proceso. Gracias por confiar en nosotros.
                </p>

                {/* Detalles con íconos */}
                <div className="text-left text-sm text-[var(--color-foreground)] space-y-4 border-t border-[var(--color-border)] pt-6">
                    <p className="flex items-center gap-2">
                        <BsClipboardCheck className="text-[var(--color-muted-foreground)]" />
                        <span className="text-[var(--color-muted-foreground)]">Número de orden:</span>
                        <span className="font-medium">{order._id}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsCreditCard className="text-[var(--color-muted-foreground)]" />
                        <span className="text-[var(--color-muted-foreground)]">Estado del pago:</span>
                        <span className="text-[var(--color-action-destructive)] font-medium">
                            {order.payment?.status || "Desconocido"}
                        </span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsFileEarmarkText className="text-[var(--color-muted-foreground)]" />
                        <span className="text-[var(--color-muted-foreground)]">Total:</span>
                        <span className="font-medium">S/ {order.totalPrice.toFixed(2)}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsTruck className="text-[var(--color-muted-foreground)]" />
                        <span className="text-[var(--color-muted-foreground)]">Envío:</span>
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
                        Seguir comprando
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