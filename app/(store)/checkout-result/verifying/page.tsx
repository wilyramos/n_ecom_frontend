// File: frontend/app/(shop)/checkout-result/verifying/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Params = { [key: string]: string | string[] | undefined };

export default function VerifyingPageCheckout({ searchParams }: { searchParams: Promise<Params> }) {
    const router = useRouter();
    const resolvedSearchParams = use(searchParams);
    const orderNumber = typeof resolvedSearchParams.orderNumber === "string" ? resolvedSearchParams.orderNumber : null;

    const [message, setMessage] = useState("Sincronizando transacciones de compra de forma segura...");

    useEffect(() => {
        if (!orderNumber) {
            router.push("/");
            return;
        }

        let attempts = 0;
        const maxAttempts = 8; // 20 segundos de gracia para Webhooks

        const pollStatus = async () => {
            try {
                // 🔴 Endpoint corregido apuntando a /pedidos/tracking/
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos/tracking/${orderNumber}`, {
                    cache: "no-store",
                });

                if (!res.ok) return;
                const data = await res.json();
                const order = data.data; // El nuevo backend envuelve en "data"

                if (!order) return;

                const status = order.status;
                const paymentStatus = order.payment?.status;

                if (paymentStatus === "approved" || status === "processing" || status === "paid_but_out_of_stock") {
                    clearInterval(interval);
                    setMessage("¡Pago confirmado con éxito!");
                    router.push(`/checkout-result/success/${order.orderNumber}`);
                    return;
                }

                if (paymentStatus === "rejected" || status === "canceled") {
                    clearInterval(interval);
                    setMessage("La operación ha sido declinada o cancelada.");
                    router.push(`/checkout-result/failure?order=${order.orderNumber}&reason=rejected`);
                    return;
                }

                if (status === "awaiting_payment" && attempts >= 2 && order.payment?.provider === "culqi") {
                    clearInterval(interval);
                    setMessage("Código de pago generado con éxito.");
                    router.push(`/checkout-result/success/${order.orderNumber}`);
                    return;
                }

            } catch (err) {
                console.error("❌ [Verifying] Fallo de conexión en polling:", err);
            }

            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                router.push(`/checkout-result/success/${orderNumber}`); // Se enviará al success donde validará
            }
        };

        const interval = setInterval(pollStatus, 2500);
        pollStatus();

        return () => clearInterval(interval);
    }, [orderNumber, router]);

    return (
        <div className="h-[80vh] w-full flex flex-col items-center justify-center bg-[#FAFAFA] px-4">
            <div className="max-w-md w-full text-center space-y-6 p-8 border border-neutral-200 rounded-3xl bg-white shadow-sm flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-neutral-900 animate-spin" />
                <div className="space-y-2">
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900">Validando tu Transacción</h2>
                    <p className="text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">
                        {message}
                    </p>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                    Pedido ref: {orderNumber}
                </div>
            </div>
        </div>
    );
}