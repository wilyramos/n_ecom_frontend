/* File: frontend/app/(pos-v3)/cash-shift/CashOpeningModal.tsx */
"use client";

import React, { useState, useActionState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { openCashAction } from "@/actions/cash-actions";
import { useCashStore } from "@/src/store/useCashStore";
import { Banknote, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface Props {
    userId?: string;
    onClose?: () => void;
}

export const CashOpeningModal = ({ userId, onClose }: Props) => {
    const [balance, setBalance] = useState<string>("0");
    const { setOpen, toggleModal, isModalOpen } = useCashStore();
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(openCashAction, {
        success: false,
        message: "",
    });

    // Sincronizar el modal con el store al montar si la terminal está bloqueada
    useEffect(() => {
        if (userId) {
            toggleModal(true);
        }
    }, [userId, toggleModal]);

    useEffect(() => {
        if (state.success && state.data) {
            setOpen(true, state.data._id);
            toggleModal(false);
            toast.success("Caja abierta correctamente");
            router.refresh();
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, setOpen, toggleModal, router]);

    if (!userId) return null;

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            toggleModal(false);
            onClose?.();
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-[var(--color-surface-primary)] border-[var(--color-border-default)] shadow-xl">
                <DialogHeader className="text-left mb-4">
                    <DialogTitle className="text-xl font-black uppercase tracking-tighter text-[var(--color-fg-primary)]">
                        Apertura de Caja
                    </DialogTitle>
                </DialogHeader>

                <form action={formAction} className="space-y-6">
                    <input type="hidden" name="userId" value={userId} />

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-[var(--color-fg-muted)] ml-1">
                            Efectivo Inicial (S/)
                        </Label>

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)] group-focus-within:text-[var(--color-accent-vivid)] transition-colors z-10">
                                <Banknote size={20} />
                            </div>

                            <Input
                                name="initialBalance"
                                type="number"
                                step="0.10"
                                min="0"
                                required
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                placeholder="0.00"
                                className="h-14 pl-12 pr-4 bg-zinc-50 border-2 border-[var(--color-border-default)] text-3xl font-black text-[var(--color-fg-primary)] focus-visible:ring-[var(--color-accent-vivid)] focus-visible:border-[var(--color-accent-vivid)] transition-all outline-none"
                                autoFocus
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[var(--color-accent-vivid)] text-white hover:bg-[var(--color-accent-vivid)]/90 h-12 transition-all active:scale-[0.98] gap-3"
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span className="font-black uppercase tracking-widest text-xs">
                                    Iniciar Turno Ahora
                                </span>
                                <ArrowRight size={18} strokeWidth={3} />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-2 text-center">
                    <p className="text-[9px] font-bold text-[var(--color-fg-muted)] uppercase tracking-tighter">
                        Asegúrese de contar el efectivo físico antes de confirmar
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};