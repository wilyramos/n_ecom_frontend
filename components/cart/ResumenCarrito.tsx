// File: components/cart/ResumenCarrito.tsx
"use client";

import { useCartStore } from "@/src/store/cartStore";
import ItemCarrito from "./ItemCarrito";
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
import { HeadingH1 } from "../ui/Heading";
import { Button } from "../ui/button";

export default function ResumenCarrito() {
    const { cart } = useCartStore();
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const totalUnidades = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const router = useRouter();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <FaShoppingCart size={50} className="text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground mb-6 text-sm">Tu carrito está vacío.</p>
                <Button
                    onClick={() => router.push("/productos")}
                    variant="primary"
                    className="px-6 rounded-full"
                >
                    Seguir comprando
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-1 md:py-8">
            <HeadingH1 className="text-lg md:text-2xl text-fg-muted">
                Resumen del carrito
            </HeadingH1>

            <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-8">
                {totalUnidades} {totalUnidades === 1 ? "producto" : "productos"} en tu carrito.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-3">

                {/* LISTA DE PRODUCTOS */}
                <div className="md:col-span-2 bg-background p-2 md:p-4 border border-border rounded-2xl">
                    <ul className="divide-y divide-border">
                        {cart.map((item) => (
                            <ItemCarrito
                                key={`${item._id}-${item.variant?._id ?? "base"}`}
                                item={item}
                            />
                        ))}
                    </ul>
                </div>

                {/* RESUMEN DE ORDEN */}
                <div className="bg-background px-4 py-2 md:p-6 flex flex-col gap-4 md:gap-5 border border-border sticky top-4 h-fit rounded-2xl">
                    <ul className="text-xs md:text-sm| text-muted-foreground space-y-2 md:space-y-3">
                        <li className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-foreground">
                                S/ {total.toFixed(2)}
                            </span>
                        </li>
                        {/* <li>
                            <div className="flex justify-between items-center">
                                <span>Tarifa de envío</span>
                                <span className="text-[10px] md:text-xs font-bold uppercase text-accent-vivid bg-accent-vivid-muted rounded-2xl px-2 py-1">
                                    Gratis
                                </span>
                            </div>
                        </li> */}
                        <li className="flex justify-between border-t border-border pt-2 md:pt-3 text-base md:text-lg font-semibold">
                            <span className="text-foreground">Total</span>
                            <span className="text-foreground">S/ {total.toFixed(2)}</span>
                        </li>
                    </ul>

                    {/* CUPÓN */}
                    <div className="pt-1 md:pt-2">
                        {/* <label className="text-xs md:text-sm text-muted-foreground mb-1 block">
                            ¿Tienes un cupón?
                        </label> */}
                        {/* <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Ingresa tu cupón"
                                disabled
                                className="flex-1 border border-border bg-secondary/50 rounded-lg px-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none opacity-70"
                            />
                            <button className="text-xs text-muted-foreground border border-border px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors cursor-pointer">
                                Aplicar
                            </button>
                        </div> */}
                    </div>

                    <p className="text-[10px] md:text-xs text-muted-foreground/80">
                        Verifica tus productos antes de continuar.
                    </p>

                    <Button onClick={() => router.push("/checkout/profile")} variant="accent" className="w-full">
                        Finalizar Compra
                    </Button>
                </div>
            </div>
        </div>
    );
}