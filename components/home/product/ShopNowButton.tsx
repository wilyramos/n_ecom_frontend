// File: frontend/components/home/product/ShopNowButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoBagCheckOutline } from "react-icons/io5";

import { useCartStore } from "@/src/store/cartStore";
import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { Button } from "@/components/ui/button";

interface Props {
  product: ProductWithCategoryResponse;
  variant?: VariantCart;
  disabled?: boolean;
  isSelectionIncomplete?: boolean;
}

export default function ShopNowButton({ product, variant, disabled, isSelectionIncomplete }: Props) {
  const { addToCart } = useCartStore();
  const router = useRouter();
  const stock = variant?.stock ?? product.stock ?? 0;

  const handleClick = () => {
    if (isSelectionIncomplete) {
      toast.error("Por favor, selecciona las opciones (color, etc.) antes de continuar.");
      return;
    }

    if (stock <= 0) {
      toast.error("Lo sentimos, esta opción no tiene stock disponible.");
      return;
    }

    addToCart(product, variant);
    toast.success("Producto añadido al carrito");
    router.push("/checkout-v2");
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled && stock <= 0}
      variant="accent"
      className="w-full"
    >
      <IoBagCheckOutline className="mr-2" size={18} />
      {stock <= 0 ? "Agotado" : "Comprar ahora"}
    </Button>
  );
}