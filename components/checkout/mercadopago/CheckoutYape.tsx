//File: frontend/components/checkout/mercadopago/CheckoutYape.tsx

"use client";

import { useEffect, useState } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { createMPYapePayment } from "@/actions/checkout/create-mp-yape-payment";
import { toast } from "sonner";
import type { TOrderPopulated } from "@/src/schemas";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Smartphone } from "lucide-react";

export { };

declare global {
    interface Window {
        MercadoPago: new (
            publicKey: string,
            options?: { locale?: string }
        ) => MercadoPagoInstance;
    }

    interface MercadoPagoInstance {
        yape: (params: { phoneNumber: string; otp: string }) => {
            create: () => Promise<{ id: string }>;
        };
    }
}

export default function CheckoutYape({ order }: { order: TOrderPopulated }) {
    const [mpInstance, setMpInstance] = useState<MercadoPagoInstance | null>(null);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const orderId = order._id;
    const totalAmount = order.totalPrice;
    const payerEmail = order.customerProfile.email;

    const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;

    useEffect(() => {
        const initMP = async () => {
            await loadMercadoPago();
            const mp = new window.MercadoPago(publicKey || "", { locale: "es-PE" });
            setMpInstance(mp);
        };

        initMP();
    }, [publicKey]);

    const handleYapePayment = async () => {
        if (!mpInstance) return;

        if (phone.length !== 9) {
            toast.error("Número de celular inválido (9 dígitos).");
            return;
        }

        if (otp.length !== 6) {
            toast.error("El código OTP debe tener 6 dígitos.");
            return;
        }

        try {
            setLoading(true);

            const tokenResp = await mpInstance
                .yape({ phoneNumber: phone, otp })
                .create();

            if (!tokenResp?.id) {
                toast.error("No se pudo generar el token Yape.");
                return;
            }

            const backendRes = await createMPYapePayment({
                orderId,
                token: tokenResp.id,
                amount: totalAmount,
                payerEmail: payerEmail || "",
            });

            if (backendRes.status === "approved") {
                window.location.href = `/checkout-result/success?orderId=${orderId}`;
                return;
            }

            toast.error(`Pago rechazado: ${backendRes.status_detail}`);
        } catch (err) {
            console.error(err);
            toast.error("Error procesando Yape.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="space-y-6">
            {/* Input Celular - Estilo Yape */}
            <div className="flex flex-col gap-2">
                <label className="text-xs md:text-sm font-semibold text-gray-700 ml-1">
                    Número de celular
                </label>
                <div className="relative">
                    <input
                        type="tel"
                        className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#742284] focus:border-transparent text-gray-900 placeholder-gray-400"
                        placeholder="Ej: 987 654 321"
                        maxLength={9}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D+/g, ""))}
                    />
                    {/* Icono de celular */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <Smartphone className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Input OTP (Shadcn UI) */}
            <div className="flex flex-col gap-3 items-center">
                <div className="flex w-full justify-between items-center px-1">
                    <label className="text-xs md:text-sm font-semibold text-gray-700">
                        Código de aprobación
                    </label>
                    <span className="text-[10px] font-bold text-[#742284] bg-purple-100 px-2 py-1 rounded-full uppercase tracking-wider">
                        Ver en App
                    </span>
                </div>

                <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    pattern={REGEXP_ONLY_DIGITS}
                >
                    <InputOTPGroup className="gap-2 space-x-2"> {/* gap-2 separa cada cajita individualmente */}
                        <InputOTPSlot
                            index={0}
                            className="h-10 w-8 sm:h-12 sm:w-10 text-lg border-gray-300 border-2 rounded-md data-[active=true]:border-[#742284] data-[active=true]:ring-2 data-[active=true]:ring-[#742284]/20"
                        />
                        <InputOTPSlot
                            index={1}
                            className="h-10 w-8 sm:h-12 sm:w-10 text-lg border-gray-300 border-2 rounded-md data-[active=true]:border-[#742284] data-[active=true]:ring-2 data-[active=true]:ring-[#742284]/20"
                        />
                        <InputOTPSlot
                            index={2}
                            className="h-10 w-8 sm:h-12 sm:w-10 text-lg border-gray-300 border-2 rounded-md data-[active=true]:border-[#742284] data-[active=true]:ring-2 data-[active=true]:ring-[#742284]/20"
                        />
                    </InputOTPGroup>

                    {/* Separador visual opcional (guión) */}
                    <InputOTPSeparator />

                    <InputOTPGroup className="gap-2">
                        <InputOTPSlot
                            index={3}
                            className="h-10 w-8 sm:h-12 sm:w-10 text-lg border-gray-300 border-2 rounded-md data-[active=true]:border-[#742284] data-[active=true]:ring-2 data-[active=true]:ring-[#742284]/20"
                        />
                        <InputOTPSlot
                            index={4}
                            className="h-10 w-8 sm:h-12 sm:w-10 text-lg border-gray-300 border-2 rounded-md data-[active=true]:border-[#742284] data-[active=true]:ring-2 data-[active=true]:ring-[#742284]/20"
                        />
                        <InputOTPSlot
                            index={5}
                            className="h-10 w-8 sm:h-12 sm:w-10 text-lg border-gray-300 border-2 rounded-md data-[active=true]:border-[#742284] data-[active=true]:ring-2 data-[active=true]:ring-[#742284]/20"
                        />
                    </InputOTPGroup>
                </InputOTP>

                <p className="text-xs text-gray-500 text-center">
                    Ingresa el código de 6 dígitos
                </p>
            </div>

            {/* Botón de Pago */}
            <button
                onClick={handleYapePayment}
                disabled={loading || otp.length < 6 || phone.length < 9}
                className={`w-full bg-[#742284] text-white font-semibold py-3 rounded-lg hover:bg-[#5a1866] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer
        `}
            >
                {loading ? (
                    <>
                        Procesando...
                    </>
                ) : (
                    `Yapear S/ ${Number(totalAmount).toFixed(2)}`
                )}
            </button>
        </div>
    );
}