"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Params = { [key: string]: string | string[] | undefined };

export default function VerifyingPageCheckout({ searchParams }: { searchParams: Promise<Params> }) {
    const router = useRouter();
    const resolvedSearchParams = use(searchParams);
    const orderNumber = typeof resolvedSearchParams.orderNumber === "string" ? resolvedSearchParams.orderNumber : null;

    const [message, setMessage] = useState("Confirmando estado de la transacción de forma segura...");

    useEffect(() => {
        if (!orderNumber) {
            router.push("/");
            return;
        }

        let attempts = 0;
        const maxAttempts = 10; // 25 segundos de gracia para Webhooks / 3DS

        const pollStatus = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos/tracking/${orderNumber}`, {
                    cache: "no-store",
                });

                if (!res.ok) return;
                const data = await res.json();
                const order = data.data;

                if (!order) return;

                const status = order.status;
                const paymentStatus = order.payment?.status;

                // 1. PAGO APROBADO DEFINITIVO
                if (paymentStatus === "approved" || status === "processing" || status === "paid_but_out_of_stock") {
                    clearInterval(interval);
                    setMessage("¡Pago confirmado con éxito!");
                    router.push(`/checkout-result/success/${order.orderNumber}`);
                    return;
                }

                // 2. PAGO RECHAZADO / CANCELADO (Ej: 3DS fallido, o webhook de Culqi denegado)
                if (paymentStatus === "rejected" || paymentStatus === "refunded" || status === "canceled") {
                    clearInterval(interval);
                    setMessage("La operación ha sido declinada por el banco.");
                    router.push(`/checkout-result/failure?order=${order.orderNumber}`);
                    return;
                }

                // 3. PENDIENTE DE PAGO (PagoEfectivo, Cuotéalo, CIP generados)
                if (paymentStatus === "pending" && order.payment?.paymentCode) {
                    clearInterval(interval);
                    setMessage("Código de pago generado con éxito.");
                    router.push(`/checkout-result/pending?orderNumber=${order.orderNumber}`);
                    return;
                }

            } catch (err) {
                console.error("❌ [Verifying] Fallo de conexión en polling:", err);
            }

            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                // Si agota el tiempo (red muy lenta), enviamos a success para que su SSR valide y decida.
                router.push(`/checkout-result/success/${orderNumber}`); 
            }
        };

        const interval = setInterval(pollStatus, 2500);
        pollStatus();

        return () => clearInterval(interval);
    }, [orderNumber, router]);

    return (
        <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-[#FAFAFA] px-4">
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