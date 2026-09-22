"use client";

import { useCheckoutStore } from "@/src/store/useCheckoutStore";
import { CheckCircle2, Printer, ArrowRight } from "lucide-react";

export const SaleSuccessModal = () => {
    const { lastResult } = useCheckoutStore();

    const handleClose = () => {
        useCheckoutStore.setState({ lastResult: null });
    };

    const handlePrint = () => {
        if (!lastResult?._id) return;
        const printUrl = `/api/sales/${lastResult._id}/ticket`;
        window.open(printUrl, "_blank", "noopener,noreferrer");
    };

    if (!lastResult) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 p-4">
            <div className="relative w-full max-w-sm bg-card border border-border rounded-sm shadow-2xl p-6 text-center text-card-foreground">
                {/* Icono de Verificación */}
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 bg-brand-action/20 text-brand-charcoal dark:text-brand-action rounded-sm flex items-center justify-center border border-brand-action/40">
                        <CheckCircle2 size={36} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="space-y-1 mb-6">
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Venta Exitosa</h2>
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                        Transacción #{lastResult._id?.toString().slice(-6)}
                    </p>
                </div>

                {/* Resumen Total */}
                <div className="bg-muted p-5 mb-6 border border-border rounded-sm">
                    <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block mb-1">
                        Total Cobrado
                    </span>
                    <div className="text-3xl font-black tracking-tight text-foreground font-mono">
                        S/ {lastResult.totalPrice.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-card border border-border rounded-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand-action" />
                        <span className="text-[9px] font-black uppercase text-foreground">
                            {lastResult.paymentMethod}
                        </span>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center gap-2 w-full h-12 bg-brand-charcoal text-white hover:bg-brand-black rounded-sm font-black uppercase tracking-widest text-[10px] transition-all cursor-pointer"
                    >
                        <Printer size={15} />
                        Generar Ticket
                    </button>

                    <button
                        onClick={handleClose}
                        className="flex items-center justify-center gap-2 w-full h-12 bg-muted hover:bg-border text-foreground rounded-sm font-black uppercase tracking-widest text-[10px] transition-all cursor-pointer"
                    >
                        Continuar
                        <ArrowRight size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
};