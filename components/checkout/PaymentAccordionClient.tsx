// File: frontend/app/(shop)/checkout/payment/PaymentAccordionClient.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type PaymentAccordionClientProps = {
    orderId: string;
    orderTotalPrice: number;
    culqiTotal: number;
    mercadopagoTotal: number;
    waMessage: string;
    currentMethod: string;
    checkoutCulqiComponent: React.ReactNode;
    checkoutMercadoPagoComponent: React.ReactNode;
};

const CULQI_TRANSACTION_FEE = 0.037;

export default function PaymentAccordionClient({
    orderId,
    orderTotalPrice,
    culqiTotal,
    mercadopagoTotal,
    waMessage,
    currentMethod,
    checkoutCulqiComponent,
    checkoutMercadoPagoComponent,
}: PaymentAccordionClientProps) {
    const router = useRouter();

    const handleMethodChange = (value: string) => {
        if (!value) return;
        router.replace(`/checkout/payment?orderId=${orderId}&method=${value}`, { scroll: false });
    };

    // Desglose proporcional de los recargos internos de Mercado Pago con IGV (18%) incluido
    const mpCobroPasarela = (mercadopagoTotal * 0.0349 + 1) * 1.18;
    const mpFinanciacionCuotas = mercadopagoTotal * 0.1049 * 1.18;

    const PaymentIcons = ({ items }: { items: { src: string; alt: string }[] }) => (
        <div className="flex items-center gap-1.5 flex-wrap">
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="relative w-9 h-5 sm:w-11 sm:h-6"
                >
                    <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 36px, 44px"
                        unoptimized
                    />
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <Accordion
                type="single"
                collapsible={false}
                value={currentMethod}
                onValueChange={handleMethodChange}
                className="space-y-3"
            >
                {/* ── Opción 1: Transferencia / Efectivo ── */}
                <AccordionItem value="transferencia" className="border rounded-xl overflow-hidden bg-surface-primary">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-surface-secondary/10 transition-colors [&>svg]:text-fg-muted">
                        <div className="flex items-center justify-between w-full gap-4 pr-3">
                            <div className="text-left">
                                <span className="block text-sm font-semibold text-fg-primary">
                                    Transferencia
                                </span>
                            </div>
                            <span className="text-sm sm:text-base font-bold text-fg-primary whitespace-nowrap">
                                S/ {orderTotalPrice.toFixed(2)}
                            </span>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-5 pb-5 pt-4 border-t border-border-default/50 space-y-4">
                        <p className="text-xs text-fg-muted leading-relaxed">
                            Coordina directamente con nuestro equipo de soporte para recibir los datos de depósito actuales o efectuar tu pago en efectivo.
                        </p>
                        <a
                            href={`https://wa.me/51902900653?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#25D366] text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/10 transition-colors"
                        >
                            Coordinar Pago por WhatsApp
                        </a>
                    </AccordionContent>
                </AccordionItem>

                {/* ── Opción 2: Culqi ── */}
                <AccordionItem value="culqi" className="border rounded-xl overflow-hidden bg-surface-primary">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-surface-secondary/10 transition-colors [&>svg]:text-fg-muted">
                        <div className="flex items-center justify-between w-full gap-4 pr-3 text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                                <span className="text-sm font-semibold text-fg-primary">
                                    Pago con tarjeta
                                </span>
                                <PaymentIcons items={[
                                    { src: "/payments/visa.png", alt: "Visa" },
                                    { src: "/payments/mastercard.png", alt: "Mastercard" },
                                    { src: "/payments/cuotealo.webp", alt: "Cuotéalo" }
                                ]} />
                            </div>
                            <span className="text-sm sm:text-base font-bold text-fg-primary whitespace-nowrap">
                                S/ {culqiTotal.toFixed(2)}
                            </span>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-5 pb-5 pt-4 border-t border-border-default/50 space-y-4">
                        <div className="space-y-1.5 text-[12px]">
                            <div className="flex justify-between text-fg-muted">
                                <span>Subtotal orden</span>
                                <span>S/ {orderTotalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-fg-muted">
                                <span>Comisión de pasarela (3.7%)</span>
                                <span>S/ {(orderTotalPrice * CULQI_TRANSACTION_FEE).toFixed(2)}</span>
                            </div>
                          
                        </div>
                        <div className="w-full pt-2">
                            {checkoutCulqiComponent}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ── Opción 3: MercadoPago cuotas ── */}
                <AccordionItem value="mercadopago" className="border rounded-xl overflow-hidden bg-surface-primary">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-surface-secondary/10 transition-colors [&>svg]:text-fg-muted">
                        <div className="flex items-center justify-between w-full gap-4 pr-3 text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                                <span className="text-sm font-semibold text-fg-primary">
                                    Pago en hasta 12 cuotas
                                </span>
                                <PaymentIcons items={[
                                    { src: "/payments/bcp.png", alt: "BCP" },
                                    { src: "/payments/interbank.png", alt: "Interbank" },
                                    { src: "/payments/bbva-continental-37013.png", alt: "BBVA" },
                                    { src: "/payments/scotiabank.png", alt: "Scotiabank" }
                                ]} />
                            </div>
                            <span className="text-sm sm:text-base font-bold text-fg-primary whitespace-nowrap">
                                S/ {mercadopagoTotal.toFixed(2)}
                            </span>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-5 pb-5 pt-4 border-t border-border-default/50 space-y-4">
                        <div className="space-y-1.5 text-[12px]">
                            <div className="flex justify-between text-fg-muted">
                                <span>Subtotal orden</span>
                                <span>S/ {orderTotalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-fg-muted">
                                <span>Comisión de pasarela </span>
                                <span>S/ {mpCobroPasarela.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-fg-muted">
                                <span>Costo de financiación</span>
                                <span>S/ {mpFinanciacionCuotas.toFixed(2)}</span>
                            </div>
                           
                        </div>
                        <div className="w-full pt-2">
                            {checkoutMercadoPagoComponent}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}