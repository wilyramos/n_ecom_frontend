"use client";

import { useState, useActionState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { openCashAction } from "@/actions/cash-actions";
import { useCashStore } from "@/src/store/useCashStore";
import { Loader2, ArrowRight } from "lucide-react";
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
            <DialogContent className="bg-card border border-border rounded-sm shadow-xl p-0 overflow-hidden text-card-foreground sm:max-w-md">
                {/* Header de Apertura */}
                <div className="bg-brand-charcoal p-6 text-white">
                    <DialogHeader className="text-left space-y-1">
                        <DialogTitle className="text-xl font-black uppercase tracking-tighter text-white">
                            Apertura de Caja
                        </DialogTitle>
                        <p className="text-[10px] font-black text-brand-gris uppercase tracking-widest">
                            Registro de turno operativo
                        </p>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-6">
                    <form action={formAction} className="space-y-6">
                        <input type="hidden" name="userId" value={userId} />

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                Efectivo Inicial (S/)
                            </Label>

                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xl">
                                    S/
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
                                    className="h-16 pl-12 pr-4 bg-background border-2 border-foreground text-3xl font-black text-foreground rounded-none focus-visible:ring-0 outline-none"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-brand-action text-brand-charcoal hover:opacity-90 h-14 rounded-none transition-all active:scale-[0.99] gap-2 font-black uppercase tracking-widest text-[10px] cursor-pointer"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin size-4" />
                            ) : (
                                <>
                                    <span>Iniciar Turno Ahora</span>
                                    <ArrowRight size={16} strokeWidth={3} />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-2 border-t border-border">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">
                            Asegúrese de contar el efectivo físico en caja antes de confirmar
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};