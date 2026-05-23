"use client";

import { useCartStore } from "@/src/store/cartStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import type { TApiProduct } from "@/src/schemas";

interface Props {
    product: TApiProduct;
}

export default function AddToCartButton({ product }: Props) {
    const addToCart = useCartStore((state) => state.addToCart);
    const setCartOpen = useCartStore((state) => state.setCartOpen);

    const stock = product.stock ?? 0;
    const isOutOfStock = stock <= 0;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isOutOfStock) {
            toast.error("Producto sin stock disponible");
            return;
        }

        addToCart(product as TApiProduct);
        toast.success("Producto añadido al carrito");
        setCartOpen(true);
    };

    return (
        <Button
            onClick={handleClick}
            disabled={isOutOfStock}
            variant={isOutOfStock ? "outline" : "secondary"}
            size="sm"
            className="w-full gap-2 text-xs md:text-sm rounded-2xl hover:text-fg-muted hover:bg-surface-secondary"
        >
            <ShoppingCart size={14} />
            {isOutOfStock ? "Agotado" : "Comprar"}
        </Button>
    );
}