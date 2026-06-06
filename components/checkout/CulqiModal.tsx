// frontend/components/checkout/CulqiModal.tsx
"use client";

import Script from "next/script";
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import type { TOrder } from "@/src/schemas";

interface CulqiToken { id: string; email: string; last_four: string; }
interface CulqiOrder { id: string; }
interface CulqiError { user_message: string; merchant_message: string; code: string; }

export interface CulqiInstance {
    token?: CulqiToken | null;
    order?: CulqiOrder | null;
    error?: CulqiError | null;
    culqi: () => void;
    open: () => void;
    close: () => void;
}

interface CulqiCheckoutConfig {
    settings: { title: string; currency: string; amount: number; order?: string; };
    options: {
        lang: string; installments: boolean; modal: boolean;
        paymentMethods: { tarjeta: boolean; yape: boolean; billetera: boolean; bancaMovil: boolean; agente: boolean; cuotealo: boolean; };
        paymentMethodsSort: string[];
    };
}

declare global {
    interface Window {
        CulqiCheckout?: new (publicKey: string, config: CulqiCheckoutConfig) => CulqiInstance;
    }
}

interface CulqiModalProps {
    order: TOrder & { culqiOrderId?: string };
    onPaymentCaptured: (instance: CulqiInstance) => Promise<void>;
    onError: (errorMessage: string) => void;
}

export interface CulqiModalRef {
    open: () => void;
}

export const CulqiModal = forwardRef<CulqiModalRef, CulqiModalProps>(
    ({ order, onPaymentCaptured, onError }, ref) => {
        const checkoutRef = useRef<CulqiInstance | null>(null);

        const orderRef = useRef(order);
        const captureRef = useRef(onPaymentCaptured);

        useEffect(() => { orderRef.current = order; }, [order]);
        useEffect(() => { captureRef.current = onPaymentCaptured; }, [onPaymentCaptured]);

        const cleanupCulqiDOM = () => {
            // console.log("🧹 [CulqiModal] Destruyendo iframes anteriores para evitar colisión de estados...");
            const oldModal = document.getElementById("culqi_checkout_iframe");
            if (oldModal) oldModal.remove();
            const oldContainer = document.querySelector(".culqi-checkout-container");
            if (oldContainer) oldContainer.remove();
        };

        const initCheckoutInstance = () => {
            const pk = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
            const culqiOrderId = orderRef.current.payment?.culqiOrderId || orderRef.current.culqiOrderId;

            if (!culqiOrderId) {
                console.log("🛑 [CulqiModal] Inicialización cancelada: Esperando acción del formulario.");
                return null;
            }

            if (!pk || !window.CulqiCheckout) {
                // console.warn("⚠️ [CulqiModal] SDK global no está mapeado en window todavía.");
                return null;
            }

            cleanupCulqiDOM();

            const amount = Math.round(orderRef.current.totalPrice * 100);

            // console.log("📦 [CulqiModal] Instanciando un objeto CulqiCheckout limpio con ID único:", culqiOrderId);

            try {
                const instance = new window.CulqiCheckout(pk, {
                    settings: {
                        title: "NEOSHOP",
                        currency: orderRef.current.currency || "PEN",
                        amount: amount,
                        order: culqiOrderId,
                    },
                    options: {
                        lang: "auto",
                        installments: true,
                        modal: true,
                        paymentMethods: {
                            tarjeta: true, yape: true, billetera: true, bancaMovil: true, agente: true, cuotealo: true,
                        },
                        paymentMethodsSort: ["tarjeta", "yape", "billetera", "bancaMovil", "agente", "cuotealo"],
                    },
                });

                instance.culqi = () => {
                    // console.log("🔔 [CulqiModal] Callback 'culqi' ejecutado por la pasarela.");
                    captureRef.current(instance);
                };

                checkoutRef.current = instance;
                return instance;
            } catch (error) {
                console.error("❌ [CulqiModal] Error crítico al instanciar SDK:", error);
                onError("No se pudo iniciar la pasarela de pagos.");
                return null;
            }
        };

        const openWithRetry = (retriesLeft: number) => {
            const instance = initCheckoutInstance();

            if (instance) {
                setTimeout(() => {
                    // console.log("🔓 [CulqiModal] Abriendo modal oficial de Culqi.");
                    instance.open();
                }, 50);
                return;
            }

            if (retriesLeft > 0) {
                // console.log(`⏳ [CulqiModal] El SDK no está listo. Reintentando en 200ms... (Intentos restantes: ${retriesLeft})`);
                setTimeout(() => openWithRetry(retriesLeft - 1), 200);
            } else {
                onError("El sistema de pagos tardó demasiado en responder. Por favor, intente dar clic nuevamente.");
            }
        };

        useImperativeHandle(ref, () => ({
            open: () => {
                // console.log("🚀 [CulqiModal] Solicitando apertura de pasarela...");
                openWithRetry(5);
            }
        }));

        useEffect(() => {
            return () => cleanupCulqiDOM();
        }, []);

        return (
            <Script
                src="https://js.culqi.com/checkout-js"
                strategy="afterInteractive"
                onReady={() => {
                    // console.log("📜 [CulqiModal] Script cargado en memoria listo para ser instanciado.");
                }}
            />
        );
    }
);

CulqiModal.displayName = "CulqiModal";