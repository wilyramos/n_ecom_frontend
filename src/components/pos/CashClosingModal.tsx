"use client";

import React, { useActionState, useEffect, useState, startTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { closeCashAction, getCashSummaryAction } from "@/actions/cash-actions";
import { useCashStore } from "@/src/store/useCashStore";
import { Calculator, Loader2, Banknote, History, AlertCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { CashSummary } from "@/src/schemas/cash.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const CashClosingModal = ({
    userId,
    shiftId,
    onClose,
}: {
    userId: string;
    shiftId: string;
    onClose: () => void;
}) => {
    const resetCash = useCashStore((state) => state.reset);
    const [summary, setSummary] = useState<CashSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [state, formAction, isPending] = useActionState(closeCashAction, {
        success: false,
        message: "",
    });

    useEffect(() => {
        async function fetchSummary() {
            const res = await getCashSummaryAction(shiftId);
            if (res.success && res.data) {
                setSummary(res.data);
            } else {
                toast.error("No se pudo cargar el resumen de ventas");
            }
            setIsLoading(false);
        }
        fetchSummary();
    }, [shiftId]);

    useEffect(() => {
        if (state.success) {
            resetCash();
            toast.success(state.message);
            onClose();
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, resetCash, onClose]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
            shiftId,
            userId,
            realBalance: Number(formData.get("realBalance")),
            notes: formData.get("notes") as string,
        };
        startTransition(() => {
            formAction(payload);
        });
    };

    const netMovements =
        (summary?.shift.totalIncomes ?? 0) - (summary?.shift.totalExpenses ?? 0);

    return (
        <Dialog
            open={true}
            onOpenChange={(open) => {
                if (!open && !isPending) onClose();
            }}
        >
            <DialogContent className="sm:max-w-lg p-0 border border-border bg-card overflow-hidden shadow-none rounded-none text-card-foreground">
                {/* Cabecera de Turno */}
                <div className="bg-brand-charcoal p-8 text-brand-silver">
                    <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="h-12 w-12 bg-white/10 flex items-center justify-center rounded-sm">
                            <Calculator size={24} className="text-brand-silver" />
                        </div>
                        <div className="text-left">
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter text-white">
                                Arqueo de Turno
                            </DialogTitle>
                            <DialogDescription className="text-[9px] font-black text-brand-gris uppercase tracking-[0.2em]">
                                Turno Activo: {shiftId.slice(-8)}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    {/* KPI: Saldo Esperado */}
                    <div className="mt-8 border-t border-brand-silver-border/10 pt-6">
                        <div className="flex items-center gap-2 mb-2 opacity-75 text-brand-silver">
                            <Banknote size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                                Efectivo esperado en caja
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black tracking-tighter text-white">
                                S/ {summary?.shift.expectedBalance.toFixed(2) ?? "0.00"}
                            </span>
                            <span className="text-xs font-bold text-brand-gris uppercase">
                                Fondo + Ventas + Movs
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                    {/* Desglose de Caja */}
                    {isLoading ? (
                        <div className="h-20 flex items-center justify-center bg-muted border border-dashed border-border animate-pulse">
                            <Loader2 className="animate-spin text-muted-foreground" size={20} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-px border border-border bg-border">
                            <div className="bg-card p-4">
                                <span className="text-[8px] font-black text-muted-foreground uppercase block mb-1">
                                    Fondo Inicial
                                </span>
                                <span className="text-xs font-bold text-foreground">
                                    S/ {summary?.shift.initialBalance.toFixed(2)}
                                </span>
                            </div>
                            <div className="bg-card p-4">
                                <span className="text-[8px] font-black text-muted-foreground uppercase block mb-1">
                                    Ventas (Cash)
                                </span>
                                <span className="text-xs font-bold text-foreground">
                                    S/ {summary?.shift.totalSalesCash.toFixed(2)}
                                </span>
                            </div>
                            <div className="bg-card p-4">
                                <span className="text-[8px] font-black text-muted-foreground uppercase block mb-1">
                                    Movimientos
                                </span>
                                <span
                                    className={cn(
                                        "text-xs font-bold",
                                        netMovements >= 0 ? "text-foreground" : "text-destructive"
                                    )}
                                >
                                    {netMovements > 0 ? "+" : ""} S/ {netMovements.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Auditoría Documentos */}
                    <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 border border-border">
                        <div className="flex items-center gap-3">
                            <History size={16} className="text-muted-foreground" />
                            <div>
                                <p className="text-[8px] font-black text-muted-foreground uppercase">
                                    Docs Emitidos
                                </p>
                                <p className="text-xs font-bold text-foreground">
                                    {summary?.salesCount ?? 0} Operaciones
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <TrendingUp size={16} className="text-muted-foreground" />
                            <div>
                                <p className="text-[8px] font-black text-muted-foreground uppercase">
                                    Venta Total (Neto)
                                </p>
                                <p className="text-xs font-bold text-foreground">
                                    S/ {summary?.calculatedTotal.toFixed(2) ?? "0.00"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de Cierre */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-foreground tracking-widest">
                                Conteo Físico Real (Efectivo)
                            </Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xl">
                                    S/
                                </div>
                                <Input
                                    name="realBalance"
                                    type="number"
                                    step="0.10"
                                    required
                                    className="h-16 pl-12 text-3xl font-black bg-card border-2 border-foreground rounded-none focus-visible:ring-0 outline-none text-foreground"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                Observaciones
                            </Label>
                            <textarea
                                name="notes"
                                className="w-full h-20 p-3 bg-card border border-input text-xs font-medium outline-none focus:border-ring resize-none rounded-none text-foreground placeholder:text-muted-foreground"
                                placeholder="Indique si hay sobrantes o faltantes..."
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending || isLoading}
                            className="w-full h-14 bg-brand-charcoal text-white hover:bg-brand-black rounded-none transition-all gap-3 cursor-pointer"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <span className="font-black uppercase tracking-widest text-[10px]">
                                    Cerrar Turno y Bloquear Terminal
                                </span>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Advertencia */}
                <div className="bg-destructive/10 p-6 border-t border-destructive/20 flex gap-4">
                    <AlertCircle size={18} className="text-destructive shrink-0" />
                    <p className="text-[9px] font-bold text-destructive uppercase leading-relaxed tracking-tight">
                        Aviso: Al confirmar el arqueo, el turno se marcará como cerrado. No podrá realizar
                        más ventas ni modificar movimientos hasta una nueva apertura. La diferencia será
                        auditada por el sistema.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};