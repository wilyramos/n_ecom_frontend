//File: frontend/components/checkout/PaymentMethodsAccordion.tsx

"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { TOrderPopulated } from "@/src/schemas";
import Image from "next/image";
import CheckoutProMP from "./mercadopago/CheckoutProMP";
import CheckoutYape from "./mercadopago/CheckoutYape";

export default function PaymentMethodsAccordion({ order }: { order: TOrderPopulated }) {

    const itemBaseClass = "group border border-border-default rounded-xl bg-background overflow-hidden transition-all duration-300";
    const triggerClass = "px-5 py-4 hover:no-underline hover:bg-surface-secondary/40 transition-colors data-[state=open]:bg-surface-secondary/20";
    const contentClass = "border-t border-border-default bg-background";
    const textTitleClass = "text-sm font-semibold text-fg-primary";
    const textSubtitleClass = "text-xs text-fg-muted font-medium mt-0.5";

    return (
        <section className="w-full">
            <p className="text-[11px] font-bold uppercase tracking-wider text-fg-muted mb-4">
                Selecciona tu método de pago
            </p>

            <Accordion type="single" collapsible className="flex flex-col gap-3">

                {/* YAPE */}
                <AccordionItem
                    value="yape"
                    className={`${itemBaseClass}  data-[state=open]:ring-1 `}
                >
                    <AccordionTrigger className={triggerClass}>
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border border-border-default rounded-full transition-colors group-">
                                    <div className="w-2.5 h-2.5 rounded-full  scale-0 transition-transform duration-200 group-data-[state=open]:scale-100" />
                                </div>

                                <div className="flex flex-col text-left">
                                    <span className={textTitleClass}>Yape</span>
                                    <span className={textSubtitleClass}>Aprobación inmediata</span>
                                </div>
                            </div>

                            <Image
                                src="/payments/yape.svg"
                                alt="Yape"
                                width={32}
                                height={32}
                                className="object-contain rounded-md"
                            />
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className={contentClass}>
                        <div className="p-6 flex justify-center bg-surface-primary">
                            <CheckoutYape order={order} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* MERCADO PAGO */}
                <AccordionItem
                    value="mercadopago"
                    className={`${itemBaseClass} data-[state=open]:border-ring data-[state=open]:ring-1 data-[state=open]:ring-ring`}
                >
                    <AccordionTrigger className={triggerClass}>
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border border-border-default rounded-full transition-colors group-data-[state=open]:border-ring">
                                    <div className="w-2.5 h-2.5 rounded-full bg-ring scale-0 transition-transform duration-200 group-data-[state=open]:scale-100" />
                                </div>

                                <div className="flex flex-col text-left">
                                    <span className={textTitleClass}>Mercado Pago</span>
                                    <span className={textSubtitleClass}>Saldo, Tarjetas bancarias</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 opacity-80 group-data-[state=open]:opacity-100 transition-opacity">
                                <Image src="/payments/visa.png" alt="Visa" width={28} height={16} className="object-contain w-auto h-3.5" />
                                <Image src="/payments/mastercard.png" alt="Mastercard" width={28} height={16} className="object-contain w-auto h-3.5" />
                                <Image src="/payments/amex.png" alt="American Express" width={28} height={16} className="object-contain w-auto h-3.5" />
                                <Image src="/payments/diners.png" alt="Diners Club" width={28} height={16} className="object-contain w-auto h-3.5" />
                                <div className="w-px h-3.5 bg-border-default mx-0.5 hidden sm:block"></div>
                                <Image src="/payments/yape.svg" alt="Yape" width={24} height={16} className="object-contain w-auto h-3.5 hidden sm:block" />
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className={contentClass}>
                        <div className="p-6 text-center bg-surface-primary">
                            <div className="mb-4 text-xs text-fg-muted max-w-sm mx-auto">
                                Serás redirigido a la plataforma segura de Mercado Pago para completar tu compra.
                            </div>
                            <CheckoutProMP orderId={order._id} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </section>
    );
}