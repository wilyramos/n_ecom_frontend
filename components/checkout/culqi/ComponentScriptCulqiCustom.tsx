// File: frontend/components/checkout/culqi/ComponentScriptCulqiCustom.tsx
"use client";

import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import { processPaymentCulqi } from "@/actions/checkout/process-culqi-payment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CulqiOrderProps } from "./CheckoutCulqi";

interface CulqiToken {
    id: string;
    email: string;
    last_four: string;
}

interface CulqiOrder {
    id: string;
}

interface CulqiError {
    user_message: string;
    merchant_message: string;
    code: string;
}

interface CulqiInstance {
    token?: CulqiToken | null;
    order?: CulqiOrder | null;
    error?: CulqiError | null;
    culqi: () => void;
    open: () => void;
    close: () => void;
}

interface CulqiCheckoutConfig {
    settings: {
        title: string;
        currency: string;
        amount: number;
        order?: string;
    };
    options: {
        lang: string;
        installments: boolean;
        modal: boolean;
        paymentMethods: {
            tarjeta: boolean;
            yape: boolean;
            billetera: boolean;
            bancaMovil: boolean;
            agente: boolean;
            cuotealo: boolean;
        };
        paymentMethodsSort: string[];
    };
}

declare global {
    interface Window {
        CulqiCheckout?: new (publicKey: string, config: CulqiCheckoutConfig) => CulqiInstance;
    }
}

export default function ComponentScriptCulqiCustom({ order }: { order: CulqiOrderProps }) {
    const [culqiReady, setCulqiReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const checkoutRef = useRef<CulqiInstance | null>(null);

    const orderRef = useRef(order);
    useEffect(() => { orderRef.current = order; }, [order]);

    const paymentHandlerRef = useRef<() => Promise<void>>(async () => { });


    paymentHandlerRef.current = async () => {
        const Culqi = checkoutRef.current;
        if (!Culqi) return;

        if (Culqi.error) {
            toast.error(Culqi.error.user_message);
            return;
        }

        const currentOrder = orderRef.current;
        const amount = Math.round(currentOrder.totalPrice * 100);
        const orderId = String(currentOrder._id);
        const orderNumber = currentOrder.orderNumber;
        const userEmail = currentOrder.customerProfile?.email;

        if (!userEmail) {
            toast.error("El correo electrónico de la orden es requerido.");
            return;
        }

        setLoading(true);

        try {
            if (Culqi.token) {
                // ── Flujo Síncrono: Tarjetas / Yape Directo ──
                await processPaymentCulqi({
                    token: Culqi.token.id,
                    email: Culqi.token.email || userEmail,
                    amount,
                    orderId,
                });
                Culqi.close();
                router.push(`/checkout-result/verifying?orderNumber=${orderNumber}`);
            } else if (Culqi.order) {
                // ── Flujo Asíncrono: PagoEfectivo / QR / Banca Móvil ──
                console.log("📥 [Culqi] Registrando orden asíncrona en el backend...");

                await processPaymentCulqi({
                    order: Culqi.order.id,
                    email: userEmail,
                    amount,
                    orderId,
                });

                toast.success("Código de pago generado de manera exitosa.");

                // ── SOLUCIÓN DE IMPACTO: REDIRECCIÓN PROACTIVA ──
                // En lugar de esperar a que el usuario presione "De acuerdo", cambiamos la página de fondo ya mismo.
                // El modal de Culqi se mantendrá visible encima porque vive en el DOM global (Body),
                // pero el usuario ya estará posicionado en la ruta correcta (/pending).

                setTimeout(() => {
                    setLoading(false);
                    router.push(`/checkout-result/pending?orderId=${orderId}`);
                }, 800); // Pequeño delay imperceptible para dejar que los estados internos se asienten
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error procesando el pago con Culqi.");
            setLoading(false);
        }
    };

    // ── ESTRATEGIA ROBUSTA: EVENT LISTENER DE CIERRE PARA FLUJOS ASÍNCRONOS ──
    useEffect(() => {
        const handleCulqiMessageEvents = (event: MessageEvent) => {
            // Aseguramos capturar exclusivamente eventos nativos provenientes de Culqi
            if (event.origin !== "https://3ds.culqi.com" && !event.origin.includes("culqi.com")) {
                return;
            }

            try {
                // El iframe de Culqi emite strings JSON o estructuras de control al cerrarse
                const eventData = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

                // Evaluamos si el evento gatillado corresponde al cierre interactivo del Checkout
                if (eventData?.event === "checkout_closed" || eventData?.action === "close") {
                    const currentOrder = orderRef.current;

                    // Si ya se cargó o guardó una estructura de PagoEfectivo en el flujo del cliente
                    if (currentOrder?.payment?.status === "pending" || currentOrder?.culqiOrderId) {
                        // console.log("🔄 [Culqi Event] Redirigiendo a pantalla de orden pendiente tras clic en De Acuerdo/Cerrar.");

                        // Cerramos de forma imperativa cualquier nodo residual
                        if (checkoutRef.current) checkoutRef.current.close();

                        // Redirección directa y segura hacia la ruta correspondiente
                        router.push(`/checkout-result/pending?orderId=${currentOrder._id}`);
                    }
                }
            } catch (e) {
                console.warn("⚠️ [Culqi Event] No se pudo procesar el mensaje del iframe:", e);
            }
        };

        window.addEventListener("message", handleCulqiMessageEvents);
        return () => {
            window.removeEventListener("message", handleCulqiMessageEvents);
        };
    }, [router]);

    const initCheckout = () => {
        const pk = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
        const currentOrder = orderRef.current;
        if (!pk || !window.CulqiCheckout) return;

        const amount = Math.round(currentOrder.totalPrice * 100);

        const oldModal = document.getElementById("culqi_checkout_iframe");
        if (oldModal) oldModal.remove();
        const oldContainer = document.querySelector(".culqi-checkout-container");
        if (oldContainer) oldContainer.remove();

        const instance = new window.CulqiCheckout(pk, {
            settings: {
                title: "NEOSHOP",
                currency: currentOrder.currency || "PEN",
                amount: amount,
                order: currentOrder.culqiOrderId,
            },
            options: {
                lang: "auto",
                installments: true,
                modal: true,
                paymentMethods: {
                    tarjeta: true,
                    yape: true,
                    billetera: true,
                    bancaMovil: true,
                    agente: true,
                    cuotealo: true,
                },
                paymentMethodsSort: ["tarjeta", "yape", "billetera", "bancaMovil", "agente", "cuotealo"],
            },
        });

        instance.culqi = () => { paymentHandlerRef.current(); };
        checkoutRef.current = instance;
        setCulqiReady(true);
    };

    useEffect(() => {
        if (window.CulqiCheckout) initCheckout();
    }, [order._id]);

    return (
        <>
            <Script
                src="https://js.culqi.com/checkout-js"
                strategy="afterInteractive"
                onLoad={initCheckout}
            />

            <Button
                type="button"
                onClick={() => checkoutRef.current?.open()}
                disabled={!culqiReady || loading}
                className="w-full py-3 px-6 text-sm font-bold tracking-wide transition-all rounded-xl"
                style={{
                    backgroundColor: culqiReady && !loading ? 'var(--color-brand-action, #a7c7aa)' : 'var(--bg-background-secondary, #f4f4f5)',
                    color: culqiReady && !loading ? '#000000' : 'var(--muted-foreground, #71717a)',
                    border: culqiReady && !loading ? 'none' : '1px solid var(--border, #e4e4e7)',
                    cursor: culqiReady && !loading ? 'pointer' : 'not-allowed',
                    opacity: culqiReady && !loading ? 1 : 0.5
                }}
            >
                {loading
                    ? "Procesando pago..."
                    : culqiReady
                        ? `Pagar ${order.currency} ${order.totalPrice.toFixed(2)}`
                        : "Cargando pasarela..."}
            </Button>
        </>
    );
}