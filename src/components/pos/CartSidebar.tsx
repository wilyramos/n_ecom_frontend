"use client";

import {
    Trash2, Plus, Minus, CreditCard, Banknote, ShoppingBag, X, Calculator, Loader2, Tag
} from "lucide-react";

import { usePosStore } from "@/src/store/usePosStore";
import { useCheckoutStore } from "@/src/store/useCheckoutStore";
import { useCashStore } from "@/src/store/useCashStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CartSidebarProps {
    onClose?: () => void;
    userId: string;
}

export const CartSidebar = ({ onClose }: CartSidebarProps) => {
    const { cart, total, subtotal, itemsCount, paymentMethod, totalDiscountAmount, totalSurchargeAmount, updateQuantity, removeFromCart, clearCart, setPaymentMethod } = usePosStore();
    const { isOpen, currentShiftId } = useCashStore();
    const { executeCheckout, executeQuote, isPending } = useCheckoutStore();

    const handlePayment = async () => {
        if (cart.length === 0) return toast.error("El carrito está vacío");
        if (!isOpen || !currentShiftId) return toast.error("Debe abrir turno de caja primero");

        const result = await executeCheckout(cart, { subtotal, total, discount: totalDiscountAmount, surcharge: totalSurchargeAmount }, paymentMethod as "CASH" | "CARD");
        if (result.success) {
            toast.success("Venta procesada con éxito");
            clearCart();
            onClose?.();
        } else {
            toast.error(result.message);
        }
    };

    const handleQuote = async () => {
        if (cart.length === 0) return toast.error("Agregue productos para proformar");
        if (!isOpen || !currentShiftId) return toast.error("Caja requerida para proformas");

        const result = await executeQuote(cart, { subtotal, total, discount: totalDiscountAmount, surcharge: totalSurchargeAmount });
        if (result.success) {
            toast.success("Proforma guardada correctamente");
            clearCart();
            onClose?.();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--color-background)] shadow-2xl border-l border-[var(--color-border-default)] overflow-hidden">
            {/* --- HEADER --- */}
            <header className="p-6 border-b border-[var(--color-border-default)] bg-[var(--color-muted)]/30">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--color-foreground)] text-white p-2.5 rounded-2xl shadow-lg">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-tight text-[var(--color-foreground)]">Orden Actual</h2>
                            <p className="text-[10px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-widest mt-0.5">
                                {itemsCount} productos en lista
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-[var(--color-accent-vivid)]/10 rounded-full transition-colors text-[var(--color-muted-foreground)] cursor-pointer">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </header>

            {/* --- LISTADO PRODUCTOS --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--color-background)]">
                {cart.length > 0 ? cart.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex flex-col gap-3 group animate-in slide-in-from-right-4 duration-300">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[11px] font-black uppercase text-[var(--color-foreground)] truncate leading-tight">{item.nombre}</h4>
                                {item.atributos && (
                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                        {Object.entries(item.atributos).map(([key, value]) => (
                                            <span key={key} className="flex items-center gap-1 px-2 py-0.5 bg-[var(--color-muted)] text-[8px] font-bold text-[var(--color-foreground)] rounded-md border border-[var(--color-border-default)] uppercase">
                                                <Tag size={8} /> {key}: {value}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button onClick={() => removeFromCart(item.productId, item.variantId)} className="p-1.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-destructive)] rounded-lg transition-all cursor-pointer">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between bg-[var(--color-muted)]/30 p-2 rounded-2xl border border-dashed border-[var(--color-border-default)]">
                            <div className="flex items-center gap-1 bg-[var(--color-background)] rounded-xl p-1 border border-[var(--color-border-default)] shadow-sm">
                                <button disabled={item.quantity <= 1} onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)} className="p-1.5 hover:bg-[var(--color-muted)] rounded-lg text-[var(--color-muted-foreground)] transition-all disabled:opacity-20 cursor-pointer">
                                    <Minus size={12} strokeWidth={3} />
                                </button>
                                <span className="w-8 text-center text-[11px] font-black font-mono text-[var(--color-foreground)]">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)} className="p-1.5 hover:bg-[var(--color-muted)] rounded-lg text-[var(--color-muted-foreground)] transition-all cursor-pointer">
                                    <Plus size={12} strokeWidth={3} />
                                </button>
                            </div>
                            <p className="text-[11px] font-black text-[var(--color-foreground)] tracking-tighter">S/ {item.subtotal.toFixed(2)}</p>
                        </div>
                    </div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center text-[var(--color-muted-foreground)] space-y-4">
                        <Calculator size={64} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Carrito vacío</p>
                    </div>
                )}
            </div>

            {/* --- FOOTER: FINANZAS --- */}
            <footer className="p-6 bg-[var(--color-surface-inverse)] text-white rounded-t-[2.5rem] shadow-2xl space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { id: 'CASH', label: 'Efectivo', icon: Banknote },
                        { id: 'CARD', label: 'Tarjeta', icon: CreditCard },
                    ].map((method) => (
                        <button key={method.id} onClick={() => setPaymentMethod(method.id)} className={cn("flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 transition-all duration-300", paymentMethod === method.id ? "border-[var(--color-accent-vivid)] bg-[var(--color-accent-vivid)] text-white" : "border-white/20 bg-transparent text-white/50")}>
                            <method.icon size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{method.label}</span>
                        </button>
                    ))}
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center text-white/60">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                        <span className="text-xs font-bold font-mono">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    {totalDiscountAmount > 0 && (
                        <div className="flex justify-between items-center text-[var(--color-accent-vivid)]">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Descuento</span>
                            <span className="text-xs font-bold font-mono">- S/ {totalDiscountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-black uppercase tracking-tighter">Monto Total</span>
                        <span className="text-2xl font-black tracking-tighter">S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                    <button onClick={handlePayment} disabled={cart.length === 0 || isPending || !isOpen} className="py-4 rounded-2xl bg-[var(--color-accent-vivid)] text-white font-black uppercase text-[10px] hover:bg-[var(--color-accent-vivid)]/90 transition-all shadow-xl">
                        {isPending ? <Loader2 className="animate-spin" /> : "Venta"}
                    </button>
                    <button onClick={handleQuote} className="py-4 rounded-2xl border border-white/20 text-white font-bold uppercase text-[10px] hover:bg-white/10 transition-all">
                        Proforma
                    </button>
                </div>
            </footer>
        </div>
    );
};