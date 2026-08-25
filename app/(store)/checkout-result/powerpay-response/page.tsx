// File: frontend/app/(shop)/checkout-result/powerpay-response/page.tsx
'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/src/store/cartStore';
import { Loader2 } from 'lucide-react';

function PowerpayResponseContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCartStore();

    useEffect(() => {
        const status = searchParams.get('status')?.toLowerCase();
        const externalId = searchParams.get('external_id');
        const transactionId = searchParams.get('transaction_id');

        if (status === 'processed') {
            clearCart();
            // external_id corresponde al orderNumber enviado a Powerpay
            router.replace(`/checkout-result/success/${externalId || transactionId}`);
        } else {
            router.replace(
                `/checkout-result/failure?order=${externalId || ''}&reason=${status || 'rejected'}`
            );
        }
    }, [searchParams, router, clearCart]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            <h2 className="text-xl font-semibold text-slate-800">Verificando tu compra con Powerpay...</h2>
            <p className="text-sm text-slate-500">Estamos validando tu transacción, por favor espera un momento.</p>
        </div>
    );
}

export default function PowerpayResponsePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                </div>
            }
        >
            <PowerpayResponseContent />
        </Suspense>
    );
}