"use client";

import { CreditCard } from "lucide-react";
import PaymentMethods from "../PaymentMethods";

type Props = {
    price: number;
    installments?: number;
};

export default function InstallmentInfo({ price, installments = 12 }: Props) {
    const installmentAmount = price / installments;

    return (
        <div className="flex flex-col gap-2 p-3 border border-border-default bg-surface-secondary/50 rounded-2xl">
            {/* Información de Pago */}
            <div className="flex items-center gap-3">
                <CreditCard className="text-blue-600 shrink-0" size={18} />
                <div className="flex items-center gap-1.5 text-sm flex-wrap">
                    <span className="font-semibold text-fg-primary">
                        Págalo en {installments} cuotas de
                    </span>
                    <span className="font-extrabold text-blue-700">
                        S/ {installmentAmount.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded uppercase">
                        Sin intereses
                    </span>
                </div>
            </div>

            {/* Métodos aceptados */}
            <div className="flex items-center justify-between border-t border-border-default/50 pt-2">
                <span className="text-[9px] uppercase tracking-wider text-fg-muted font-bold">
                    Válido con:
                </span>
                <PaymentMethods />
            </div>
        </div>
    );
}