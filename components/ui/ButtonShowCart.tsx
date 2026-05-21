// frontend/components/ui/ButtonShowCart.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/src/store/cartStore";
import ItemCarrito from "../cart/ItemCarrito";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { HiOutlineShoppingBag } from "react-icons/hi2";

export default function ButtonShowCart() {
    const carrito = useCartStore((state) => state.cart);
    const isCartOpen = useCartStore((state) => state.isCartOpen);
    const setCartOpen = useCartStore((state) => state.setCartOpen);
    const router = useRouter();

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

    const handleCheckout = () => {
        if (carrito.length === 0) {
            toast.error("Tu carrito está vacío.");
            return;
        }
        setCartOpen(false);
        router.push("/carrito");
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
                <button className="relative p-2.5 rounded-full transition-all duration-200 hover:bg-surface-secondary text-fg-muted group cursor-pointer active:scale-90">
                    <HiOutlineShoppingBag className="h-6 w-6" />
                    {carrito.length > 0 && (
                        <span className="absolute top-1 right-1 bg-action-primary text-fg-inverse text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                            {carrito.length}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent side="right" className="flex flex-col h-full p-0  border-border-default bg-surface-primary overflow-hidden">
                <SheetHeader className="p-4 border-b border-border-default">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-lg font-semibold text-fg-primary">Carrito</SheetTitle>
                        <span className="bg-surface-secondary text-fg-primary px-2 py-0.5 rounded text-[10px] font-bold">
                            {carrito.length} {carrito.length === 1 ? 'Ítem' : 'Ítems'}
                        </span>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 py-2">
                    {carrito.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="p-6 rounded-full text-fg-secondary">
                                <ShoppingBag size={40} strokeWidth={1.5} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-sm font-bold text-fg-primary">Tu carrito está vacío</h3>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-border-default">
                            {carrito.map((item) => (
                                <div key={`${item._id}-${item.variant?._id ?? "no-variant"}`} className="py-2">
                                    <ItemCarrito item={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {carrito.length > 0 && (
                    <div className="p-4 bg-surface-primary border-t border-border-default">
                        <div className="flex justify-between items-baseline mb-4">
                            <span className="text-sm font-bold text-fg-primary">Total</span>
                            <span className="text-lg font-bold text-fg-primary">S/ {total}</span>
                        </div>

                        <div className="grid gap-2">
                            <Button
                                onClick={handleCheckout}
                                className="w-full bg-action-primary hover:bg-action-primary-hover text-fg-inverse font-bold py-2 rounded flex items-center justify-center gap-2"
                            >
                                Finalizar Pedido <ArrowRight size={16} />
                            </Button>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="w-full py-2 text-[10px] font-bold uppercase tracking-wider text-fg-secondary hover:text-fg-primary transition-colors"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}