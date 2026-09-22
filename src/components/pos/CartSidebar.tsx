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
    const {
        cart,
        total,
        subtotal,
        itemsCount,
        paymentMethod,
        totalDiscountAmount,
        totalSurchargeAmount,
        updateQuantity,
        removeFromCart,
        clearCart,
        setPaymentMethod
    } = usePosStore();
    const { isOpen, currentShiftId } = useCashStore();
    const { executeCheckout, executeQuote, isPending } = useCheckoutStore();

    const handlePayment = async () => {
        if (cart.length === 0) return toast.error("El carrito está vacío");
        if (!isOpen || !currentShiftId) return toast.error("Debe abrir turno de caja primero");

        const result = await executeCheckout(
            cart,
            { subtotal, total, discount: totalDiscountAmount, surcharge: totalSurchargeAmount },
            paymentMethod as "CASH" | "CARD"
        );
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

        const result = await executeQuote(
            cart,
            { subtotal, total, discount: totalDiscountAmount, surcharge: totalSurchargeAmount }
        );
        if (result.success) {
            toast.success("Proforma guardada correctamente");
            clearCart();
            onClose?.();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="flex flex-col h-full bg-card text-card-foreground border-l border-border overflow-hidden">
            {/* --- HEADER --- */}
            <header className="p-4 border-b border-border bg-muted/40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-charcoal text-white p-2 rounded-sm">
                            <ShoppingBag size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-tight text-foreground">Orden Actual</h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                {itemsCount} productos en lista
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-muted rounded-sm transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </header>

            {/* --- LISTADO PRODUCTOS --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
                {cart.length > 0 ? (
                    cart.map((item) => (
                        <div
                            key={`${item.productId}-${item.variantId}`}
                            className="flex flex-col gap-2 p-3 bg-card border border-border rounded-sm animate-in fade-in duration-200"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold uppercase text-foreground truncate leading-snug">
                                        {item.nombre}
                                    </h4>
                                    {item.atributos && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {Object.entries(item.atributos).map(([key, value]) => (
                                                <span
                                                    key={key}
                                                    className="flex items-center gap-1 px-1.5 py-0.2 bg-muted text-[9px] font-medium text-muted-foreground rounded-sm border border-border uppercase"
                                                >
                                                    <Tag size={8} /> {key}: {value}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.productId, item.variantId)}
                                    className="p-1 text-muted-foreground hover:text-destructive rounded-sm transition-colors cursor-pointer"
                                    title="Quitar item"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-border">
                                <div className="flex items-center border border-border rounded-sm bg-muted/30">
                                    <button
                                        disabled={item.quantity <= 1}
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                                        className="h-7 w-7 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-25 transition-colors cursor-pointer"
                                    >
                                        <Minus size={11} strokeWidth={2.5} />
                                    </button>
                                    <span className="w-8 text-center text-xs font-black font-mono text-foreground">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                                        className="h-7 w-7 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    >
                                        <Plus size={11} strokeWidth={2.5} />
                                    </button>
                                </div>
                                <p className="text-xs font-black text-foreground font-mono">
                                    S/ {item.subtotal.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3 py-16">
                        <Calculator size={48} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-widest">Carrito vacío</p>
                    </div>
                )}
            </div>

            {/* --- FOOTER: FINANZAS --- */}
            <footer className="p-4 bg-brand-charcoal text-brand-silver border-t border-brand-silver-border/10 space-y-4">
                {/* Selector de Método de Pago */}
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { id: 'CASH', label: 'Efectivo', icon: Banknote },
                        { id: 'CARD', label: 'Tarjeta', icon: CreditCard },
                    ].map((method) => {
                        const isSelected = paymentMethod === method.id;
                        return (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-2.5 rounded-sm border transition-all cursor-pointer",
                                    isSelected
                                        ? "border-brand-action bg-brand-action text-brand-charcoal font-black"
                                        : "border-white/15 bg-white/5 text-brand-silver/70 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <method.icon size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Resumen Monetario */}
                <div className="space-y-1.5 border-t border-white/10 pt-3">
                    <div className="flex justify-between items-center text-brand-gris">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                        <span className="text-xs font-bold font-mono">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    {totalDiscountAmount > 0 && (
                        <div className="flex justify-between items-center text-brand-action">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Descuento</span>
                            <span className="text-xs font-bold font-mono">- S/ {totalDiscountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-baseline pt-1 border-t border-white/10">
                        <span className="text-xs font-black uppercase tracking-wider text-white">Total</span>
                        <span className="text-2xl font-black tracking-tight text-white font-mono">
                            S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                        onClick={handlePayment}
                        disabled={cart.length === 0 || isPending || !isOpen}
                        className="py-3.5 rounded-sm bg-brand-action text-brand-charcoal font-black uppercase text-[10px] tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Procesar Venta"}
                    </button>
                    <button
                        onClick={handleQuote}
                        disabled={cart.length === 0 || isPending || !isOpen}
                        className="py-3.5 rounded-sm border border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Proforma
                    </button>
                </div>
            </footer>
        </div>
    );
};