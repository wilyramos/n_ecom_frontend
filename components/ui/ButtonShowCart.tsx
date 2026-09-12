"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/src/store/cartStore";
import ItemCarrito from "../cart/ItemCarrito";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HiOutlineShoppingBag } from "react-icons/hi2";

export default function ButtonShowCart() {
    const carrito = useCartStore((state) => state.cart);
    const isCartOpen = useCartStore((state) => state.isCartOpen);
    const setCartOpen = useCartStore((state) => state.setCartOpen);
    const router = useRouter();

    const total = carrito
        .reduce((acc, item) => acc + item.precio * item.cantidad, 0)
        .toLocaleString("es-PE", { minimumFractionDigits: 2 });

    const handleCheckout = () => {
        if (carrito.length === 0) {
            toast.error("Tu carrito está vacío.");
            return;
        }
        setCartOpen(false);
        router.push("/checkout-v2");
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
                <button className="relative p-2 rounded-full transition-all duration-200 hover:bg-brand-action-muted text-brand-gris hover:text-brand-charcoal group cursor-pointer active:scale-90">
                    <HiOutlineShoppingBag className="h-6 w-6" />
                    {carrito.length > 0 && (
                        <span className="absolute top-1 right-1 bg-brand-action text-brand-charcoal text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                            {carrito.length}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent side="right" className="flex flex-col h-full p-0 border-brand-silver-border bg-background overflow-hidden">
                <SheetHeader className="p-4 border-b border-brand-silver-border">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-lg font-semibold text-brand-charcoal">Carrito</SheetTitle>
                        <span className="text-brand-gris px-2 py-0.5 rounded-2xl text-[10px] font-bold">
                            {carrito.length} {carrito.length === 1 ? "Ítem" : "Ítems"}
                        </span>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 py-2">
                    {carrito.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="p-6 rounded-full text-brand-silver">
                                <ShoppingBag size={40} strokeWidth={1.5} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-sm font-bold text-brand-charcoal">Tu carrito está vacío</h3>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-brand-silver-border">
                            {carrito.map((item) => (
                                <div key={`${item._id}-${item.variant?._id ?? "no-variant"}`} className="py-2">
                                    <ItemCarrito item={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {carrito.length > 0 && (
                    <div className="p-4 bg-background border-t border-brand-silver-border">
                        <div className="flex justify-between items-baseline mb-4">
                            <span className="text-sm font-bold text-brand-charcoal">Total</span>
                            <span className="text-lg font-bold text-brand-charcoal">S/ {total}</span>
                        </div>

                        <div className="grid gap-2">
                            <Button
                                onClick={handleCheckout}
                                className="w-full"
                                variant="accent"
                            >
                                Finalizar Pedido <ArrowRight size={16} />
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => setCartOpen(false)}
                                className="w-full py-2 text-[10px] font-bold uppercase tracking-wider text-brand-gris hover:text-brand-charcoal transition-colors"
                            >
                                Continuar Comprando
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}