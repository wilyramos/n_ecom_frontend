import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import { MdOutlineImageNotSupported } from "react-icons/md";

export default function ItemCarrito({ item }: { item: CartItem }) {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    const productId = item._id;
    const variantId = item.variant?._id;
    const imageSrc = item.variant?.imagenes?.[0] ?? item.imagenes?.[0];
    const price = item.variant?.precio ?? item.precio ?? 0;
    const subtotal = price * item.cantidad;
    const stockMax = item.variant?.stock ?? item.stock ?? 0;
    const productHref = `/productos/${item.slug}`;

    const atributos = item.variant?.atributos
        ? Object.values(item.variant.atributos).join(" · ")
        : null;

    return (
        <div className="flex flex-col py-2 gap-2">
            <Link
                href={productHref}
                className="text-[13px] font-medium leading-tight text-fg-muted hover:underline w-fit"
            >
                {item.nombre}
            </Link>

            <div className="flex gap-3 items-center">
                <Link href={productHref} className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-secondary rounded-sm block">
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={item.variant?.nombre ?? item.nombre}
                            fill
                            className="object-contain"
                            quality={60}
                            unoptimized
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                            <MdOutlineImageNotSupported size={16} />
                        </div>
                    )}
                </Link>

                <div className="flex flex-col flex-1 min-w-0 gap-2">
                    {atributos && (
                        <p className="text-[11px] text-muted-foreground -mt-1">
                            {atributos}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(productId, item.cantidad - 1, variantId)}
                                    disabled={item.cantidad <= 1}
                                    className="w-5 h-5 flex items-center justify-center border border-border bg-background text-fg-muted disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary transition-colors cursor-pointer rounded-2xl"
                                >
                                    <Minus size={8} strokeWidth={2.5} />
                                </button>
                                <span className="text-[12px] font-medium text-fg-muted tabular-nums min-w-[12px] text-center">
                                    {item.cantidad}
                                </span>
                                <button
                                    onClick={() => updateQuantity(productId, item.cantidad + 1, variantId)}
                                    disabled={item.cantidad >= stockMax}
                                    className="w-5 h-5 flex items-center justify-center border border-border bg-background text-fg-muted disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary transition-colors cursor-pointer rounded-2xl"
                                >
                                    <Plus size={8} strokeWidth={2.5} />
                                </button>
                            </div>

                            <span className="text-[12px] font-semibold text-fg-muted">
                                S/ {subtotal.toFixed(2)}
                            </span>
                        </div>

                        <button
                            onClick={() => removeFromCart(productId, variantId)}
                            aria-label={`Eliminar ${item.nombre}`}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        >
                            <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}