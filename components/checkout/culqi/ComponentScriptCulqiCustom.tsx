"use client";

import Script from "next/script";
import { useState, useEffect } from "react";
import { processPaymentCulqi } from "@/actions/checkout/process-culqi-payment";

// Tipos basados en la API de Culqi v4
interface CulqiSettings {
    title: string;
    currency: "PEN" | "USD";
    amount: number;
    description: string;
}

interface CulqiOptions {
    lang?: "auto" | "es" | "en";
    installments?: boolean;
    modal?: boolean;
    paymentMethods?: {
        tarjeta?: boolean;
        yape?: boolean;
        billetera?: boolean;
        bancaMovil?: boolean;
        agente?: boolean;
        cuotealo?: boolean;
    };
    paymentMethodsSort?: string[];
}

interface CulqiObject {
    publicKey?: string;
    settings: (config: CulqiSettings) => void;
    options: (opts: CulqiOptions) => void;
    open: () => void;
    token?: { id: string };
    order?: unknown;
    error?: unknown;
}

declare global {
    interface Window {
        Culqi?: CulqiObject;
        culqi?: () => void | Promise<void>;
    }
}

export default function ComponentScriptCulqiCustom() {
    const [culqiReady, setCulqiReady] = useState(false);

    const handleScriptLoad = () => {
        if (typeof window !== "undefined" && window.Culqi) {
            window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ?? "";
            console.log("✅ Culqi inicializado");
            setCulqiReady(true);
        } else {
            console.error("❌ Culqi no se pudo inicializar");
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.culqi = async () => {
                const { token, order, error } = window.Culqi ?? {};

                if (error) {
                    console.error("Error en el pago:", error);
                    return;
                }

                try {
                    if (token) {
                        console.log("Token recibido:", token.id);
                        await processPaymentCulqi({
                            token: token.id,
                            amount: 1000,
                            description: "Pago con tarjeta",
                        });
                    }

                    if (order) {
                        console.log("Orden recibida:", order);
                        await processPaymentCulqi({
                            order,
                            amount: 1000,
                            description: "Pago con Yape o billetera",
                        });
                    }

                    console.log("✅ Pago procesado con éxito");
                } catch (err) {
                    console.error("❌ Error procesando pago:", err);
                }
            };
        }
    }, []);

    const openCheckout = () => {
        const Culqi = window.Culqi;

        if (!Culqi) {
            console.error("Culqi no está cargado");
            return;
        }

        Culqi.settings({
            title: "neoshop",
            currency: "PEN",
            amount: 1000,
            description: "Pago de prueba",
        });

        Culqi.options({
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
            paymentMethodsSort: [
                "tarjeta",
                "yape",
                "billetera",
                "bancaMovil",
                "agente",
                "cuotealo",
            ],
        });

        Culqi.open();
    };

    return (
        <>
            <Script
                src="https://checkout.culqi.com/js/v4"
                strategy="afterInteractive"
                onLoad={handleScriptLoad}
            />

            <button
                onClick={openCheckout}
                disabled={!culqiReady}
                className={`px-4 py-2 rounded-full border-2 border-orange-400 text-black font-extrabold ${culqiReady ? "" : "cursor-not-allowed"
                    }`}
            >
                {culqiReady ? "Pagar con Culqi" : "Cargando Culqi..."}
            </button>
        </>
    );
}
