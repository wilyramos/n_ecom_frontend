// File: frontend/app/(store)/checkout-result/verifying/page.tsx
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
        const maxAttempts = 8; // 8 intentos * 2.5s = 20 segundos de gracia máxima para el Webhook

        const pollStatus = async () => {
            try {
                // Endpoint unificado de tu Express API
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/number/${orderNumber}`, {
                    cache: "no-store",
                });

                if (!res.ok) return;
                const data = await res.json();
                const order = data.order;

                if (!order) return;

                // 🚨 FLUJO DE REDIRECCIÓN BASADO EN EL ESTADO REAL EN MONGO
                if (order.status === "processing" || order.status === "paid_but_out_of_stock") {
                    clearInterval(interval);
                    setMessage("¡Pago confirmado con éxito!");
                    router.push(`/checkout-result/success?orderId=${order._id}`);
                    return;
                }

                if (order.status === "canceled") {
                    clearInterval(interval);
                    setMessage("La operación ha sido declinada o cancelada.");
                    router.push(`/checkout-result/error?orderId=${order._id}&error=Transaccion_Declinada`);
                    return;
                }

                // Si pasaron 5 segundos (2 intentos) y la orden de Culqi sigue pendiente,
                // significa que eligió PagoEfectivo / CIP y debe ir a la pantalla de Pendiente.
                if (order.status === "awaiting_payment" && attempts >= 2 && order.payment?.provider === "culqi") {
                    clearInterval(interval);
                    setMessage("Código de pago generado con éxito.");
                    router.push(`/checkout-result/pending?orderId=${order._id}`);
                    return;
                }

            } catch (err) {
                console.error("❌ [Verifying] Fallo de conexión en polling:", err);
            }

            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                // Fail-safe: si hay excesiva latencia en los servidores de Culqi, mandarlo a pendiente de forma segura
                router.push("/");
            }
        };

        const interval = setInterval(pollStatus, 2500);
        pollStatus(); // Ejecución inmediata inicial

        return () => clearInterval(interval);
    }, [orderNumber, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center space-y-6 p-8 border border-border rounded-3xl bg-card shadow-xs flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
                <div className="space-y-2">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Validando tu Transacción</h2>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        {message}
                    </p>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground/50">
                    Pedido ref: {orderNumber}
                </div>
            </div>
        </div>
    );
}