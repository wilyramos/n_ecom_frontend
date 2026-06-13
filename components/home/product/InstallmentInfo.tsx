"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import PaymentMethods from "../PaymentMethods";

type Props = {
    price: number;
};

const TRANSACTION_FEE = 0.0399;
const TRANSACTION_FIXED = 1.00;

const PLANS = [
    { cuotas: 3, label: "3 cuotas", installmentFee: 0.0549 },
    { cuotas: 6, label: "6 cuotas", installmentFee: 0.0549 },
    { cuotas: 12, label: "12 cuotas", installmentFee: 0.1049 },
] as const;

export default function InstallmentInfo({ price }: Props) {
    const [selected, setSelected] = useState<number>(12);

    const plan = PLANS.find(p => p.cuotas === selected)!;
    const totalAmount = (price * (1 + TRANSACTION_FEE + plan.installmentFee)) + TRANSACTION_FIXED;
    const cuotaAmount = totalAmount / selected;

    return (
        <div className="w-full space-y-2">
            {/* Métodos de pago aceptados */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                <span className="text-[10px] text-fg-muted uppercase tracking-wide font-semibold shrink-0">
                    Métodos aceptados:
                </span>
                <PaymentMethods />
            </div>

            {/* Simulador de cuotas MercadoPago */}
            <Accordion type="single" collapsible className="w-full border border-border-default rounded-2xl overflow-hidden">
                <AccordionItem value="cuotas" className="border-none">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-surface-secondary/30 transition-colors [&>svg]:text-fg-muted">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-fg-primary">
                                Hasta 12 cuotas
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                Sin intereses
                            </span>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-4 pt-1 border-t border-border-default/50 space-y-4">
                        {/* Selector de cuotas */}
                        <div className="grid grid-cols-3 gap-1.5 pt-2">
                            {PLANS.map((p) => (
                                <button
                                    key={p.cuotas}
                                    type="button"
                                    onClick={() => setSelected(p.cuotas)}
                                    className={cn(
                                        "py-2 text-xs font-medium rounded-2xl border transition-all truncate px-1",
                                        selected === p.cuotas
                                            ? "border-fg-secondary bg-fg-secondary text-fg-inverse"
                                            : "border-border-default text-fg-muted hover:border-fg-secondary hover:text-fg-secondary"
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        {/* Resultado */}
                        <div className="flex flex-wrap items-baseline gap-2 px-1">
                            <span className="text-xl sm:text-2xl font-bold text-blue-700 whitespace-nowrap">
                                S/ {cuotaAmount.toFixed(2)}
                            </span>
                            <span className="text-xs sm:text-sm text-fg-muted whitespace-nowrap">
                                × {selected} {selected === 1 ? "pago" : "cuotas"}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 px-1">
                            <span className="text-xs sm:text-sm text-fg-muted">
                                Válido para pagos con tarjetas de crédito a través de
                            </span>
                            <div className="relative w-24 h-5 shrink-0 mt-1 sm:mt-0">
                                <Image
                                    src="/payments/mercadopago.png"
                                    alt="MercadoPago"
                                    fill
                                    className="object-contain object-left"
                                    sizes="96px"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}