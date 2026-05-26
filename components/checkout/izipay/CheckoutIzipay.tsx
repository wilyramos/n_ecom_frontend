"use client";

import { useEffect, useRef, useState } from "react";
import KRGlue from "@lyracom/embedded-form-glue";
import { createPaymentIzipay, type IzipayPaymentPayload } from "@/actions/checkout/create-payment-izipay";
import { toast } from "sonner";
import type { TOrderPopulated } from "@/src/schemas";
import SpinnerLoading from "@/components/ui/SpinnerLoading";

export default function CheckoutIzipay({ order }: { order: TOrderPopulated }) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const initialized = useRef(false);

    useEffect(() => {
        async function setupPaymentForm() {
            if (initialized.current) return;
            initialized.current = true;

            setLoading(true);

            const endpoint = "https://api.micuentaweb.pe";
            const publicKey = process.env.NEXT_PUBLIC_IZIPAY_PUBLIC_KEY!;

            try {
                // Cargar CSS si no existe
                if (!document.querySelector(`link[href*="neon-reset.min.css"]`)) {
                    await new Promise<void>((resolve) => {
                        const link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.href = "https://static.payzen.eu/static/js/krypton-client/V4.0/ext/neon-reset.min.css";
                        link.onload = () => resolve();
                        document.head.appendChild(link);
                    });
                }

                const payload: IzipayPaymentPayload = {
                    amount: order.totalPrice,
                    currency: order.currency || "PEN",
                    orderId: order._id,
                    customer: {
                        email: order.customerProfile.email || "",
                        reference: order.customerProfile.numeroDocumento || "",
                        billingDetails: {
                            address: order.shippingAddress.direccion || "",
                            city: order.shippingAddress.distrito || "",
                            country: order.shippingAddress.departamento || "",
                            district: order.shippingAddress.distrito || "",
                            phoneNumber: order.customerProfile.telefono || "",
                        },
                        shippingDetails: {
                            address: order.shippingAddress.direccion || "",
                            city: order.shippingAddress.distrito || "",
                            country: order.shippingAddress.departamento || "",
                            district: order.shippingAddress.distrito || "",
                            phoneNumber: order.customerProfile.telefono || "",
                        },
                        shoppingCart: order.items.map((item) => ({
                            productId: item.productId || "",
                            quantity: item.quantity,
                        })),
                    },
                };

                const { formToken } = await createPaymentIzipay(payload);

                const { KR } = await KRGlue.loadLibrary(endpoint, publicKey, formToken);

                await KR.setFormConfig({
                    formToken,
                    "kr-language": "es-ES",
                });

                await KR.removeForms();
                await KR.renderElements("#myPaymentForm");

                await KR.onSubmit(async (paymentData) => {
                    console.log("Datos de pago:", paymentData._type);
                    setMessage("Pago procesado correctamente");
                    toast.success("Pago procesado correctamente");
                    window.location.href = `/checkout-result/success?orderId=${order._id}`;
                    return false;
                });

            } catch (error) {
                console.error("Error al configurar Izipay:", error);
                toast.error(`Error al iniciar pago Izipay`);
                setMessage("Error al iniciar pago");
            } finally {
                setLoading(false); 
            }
        }

        setupPaymentForm();
    }, [order]);

    return (
        <div className="relative">
            {loading && (
                <SpinnerLoading />
            )}
            <div id="myPaymentForm">
                <div className="kr-smart-form" kr-card-form-expanded="true" />
            </div>

            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
}
