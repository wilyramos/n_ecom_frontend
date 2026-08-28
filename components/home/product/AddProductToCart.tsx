// File: frontend/components/home/product/AddProductToCart.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaPlus } from "react-icons/fa";

import { useCartStore } from "@/src/store/cartStore";
import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { Button } from "@/components/ui/button";

interface Props {
  product: ProductWithCategoryResponse;
  variant?: VariantCart;
}

export default function AddProductToCart({ product, variant }: Props) {
  const { addToCart, setCartOpen, cart } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState<VariantCart | null>(variant ?? null);

  useEffect(() => {
    setSelectedVariant(variant ?? null);
  }, [variant]);

  const stock = selectedVariant?.stock ?? product.stock ?? 0;
  const hasVariants = product.variants && product.variants.length > 0;
  const isSelectionIncomplete = hasVariants && !selectedVariant;
  const isOutOfStock = stock <= 0;

  const handleClick = () => {
    if (isSelectionIncomplete) {
      toast.error("Por favor, selecciona una variante antes de añadir al carrito.");
      return;
    }

    if (isOutOfStock) {
      toast.error("Lo sentimos, este producto no tiene stock disponible.");
      return;
    }

    const activeVariant = selectedVariant ?? undefined;
    const productInCart = cart.find((item) => {
      if (activeVariant) {
        return item._id === product._id && item.variant?._id === activeVariant._id;
      }
      return item._id === product._id && !item.variant;
    });

    if (productInCart && productInCart.cantidad >= stock) {
      toast.warning(`Solo hay ${stock} unidades disponibles.`);
      return;
    }

    addToCart(product, activeVariant);
    toast.success("Producto añadido al carrito");
    setCartOpen(true);
  };

  return (
    <div className="w-full">
      <Button
        onClick={handleClick}
        disabled={isOutOfStock}
        variant={isOutOfStock ? "default" : "secondary"}
        className="w-full"
      >
        <FaPlus size={14} className="mr-2" />
        {isOutOfStock ? "Sin stock" : "Añadir al carrito"}
      </Button>
    </div>
  );
}