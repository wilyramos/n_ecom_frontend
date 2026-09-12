//File: frontend/components/checkout/PendingClient.tsx

'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import { IPedido } from '@/src/modules/checkout/types/pedido.types';
import Link from 'next/link';

import { BsHourglassSplit, BsTruck, BsFileEarmarkText, BsCreditCard, BsClipboardCheck, BsQrCode } from 'react-icons/bs';
import { FiArrowLeftCircle } from 'react-icons/fi';

interface PendingClientProps {
    order: IPedido;
}

export default function PendingClient({ order }: PendingClientProps) {
    const clearCart = useCartStore((state) => state.clearCart);

    useEffect(() => {
        if (order?.payment?.status === 'pending') {
            clearCart();
        }
    }, [order, clearCart]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAFAFA]">
            <div className="w-full max-w-xl p-8 sm:p-10 text-center bg-white rounded-3xl border border-neutral-200 shadow-sm">
                
                <BsHourglassSplit className="text-orange-500 text-6xl mx-auto mb-6 animate-pulse" />
                
                <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-2 flex items-center justify-center gap-2 tracking-tight">
                    Pago en proceso
                </h1>
                
                <p className="text-neutral-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                    Tu código de pago ha sido generado. Completa la acción en tu app bancaria o agente autorizado para confirmar tu compra.
                </p>

                {/* Mostrar código CIP si existe (PagoEfectivo / Cuotéalo) */}
                {order.payment?.paymentCode && (
                    <div className="mb-8 p-6 bg-orange-50/50 rounded-2xl border border-orange-100 flex flex-col items-center gap-2">
                        <BsQrCode className="text-3xl text-orange-500 mb-1" />
                        <span className="text-[10px] text-orange-600/80 uppercase font-bold tracking-widest">Código de Pago (CIP)</span>
                        <span className="text-2xl sm:text-3xl font-mono font-bold tracking-widest text-neutral-900 bg-white px-6 py-2.5 rounded-xl border border-orange-200 select-all">
                            {order.payment.paymentCode}
                        </span>
                    </div>
                )}

                {/* Detalles con íconos */}
                <div className="text-left text-sm text-neutral-700 space-y-4 border-t border-neutral-100 pt-6">
                    <p className="flex items-center gap-3">
                        <BsClipboardCheck className="text-neutral-400 text-lg" />
                        <span className="text-neutral-500 w-32">Número de orden:</span>
                        <span className="font-mono font-semibold text-neutral-900">#{order.orderNumber}</span>
                    </p>
                    <p className="flex items-center gap-3">
                        <BsCreditCard className="text-neutral-400 text-lg" />
                        <span className="text-neutral-500 w-32">Estado del pago:</span>
                        <span className="text-orange-600 font-semibold uppercase text-xs">
                            {order.payment?.status || "Pendiente"}
                        </span>
                    </p>
                    <p className="flex items-center gap-3">
                        <BsFileEarmarkText className="text-neutral-400 text-lg" />
                        <span className="text-neutral-500 w-32">Total a pagar:</span>
                        <span className="font-medium text-neutral-900">S/ {order.totalPrice.toFixed(2)}</span>
                    </p>
                    <p className="flex items-center gap-3">
                        <BsTruck className="text-neutral-400 text-lg" />
                        <span className="text-neutral-500 w-32">Método de entrega:</span>
                        <span className="font-medium text-neutral-900">
                            {order.deliveryMethod === 'pickup' ? 'Recojo en tienda' : 'Envío a domicilio'}
                        </span>
                    </p>
                </div>

                {/* Acciones */}
                <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center gap-3">
                    <Link
                        href="/"
                        className="w-full sm:flex-1 bg-white border border-neutral-200 text-neutral-700 h-12 rounded-full text-xs font-medium hover:bg-neutral-50 transition flex items-center justify-center gap-2"
                    >
                        <FiArrowLeftCircle size={16} />
                        Volver a la tienda
                    </Link>
                    <Link
                        href="/profile/pedidos"
                        className="w-full sm:flex-1 bg-neutral-900 text-white h-12 rounded-full text-xs font-medium hover:bg-black transition flex items-center justify-center gap-2"
                    >
                        <BsClipboardCheck size={16} />
                        Ver mis compras
                    </Link>
                </div>
            </div>
        </div>
    );
}