// ShopNowButton.tsx
'use client';

import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { IoBagCheckOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
    product: ProductWithCategoryResponse;
    variant?: VariantCart;
    disabled?: boolean;
    // Nueva prop para forzar la validación desde el padre si es necesario
    isSelectionIncomplete?: boolean; 
}

export default function ShopNowButton({ product, variant, disabled, isSelectionIncomplete }: Props) {
    const { addToCart } = useCartStore();
    const router = useRouter();
    const stock = variant?.stock ?? product.stock ?? 0;

    const handleClick = () => {
        // 1. Validar variantes
        if (isSelectionIncomplete) {
            toast.error("Por favor, selecciona las opciones (talla, color, etc.) antes de continuar.");
            return;
        }

        // 2. Validar stock
        if (stock <= 0) {
            toast.error("Lo sentimos, esta opción no tiene stock disponible.");
            return;
        }

        // 3. Acción
        addToCart(product, variant);
        toast.success("Producto añadido al carrito");
        router.push("/checkout");
    };

    return (
        <Button
            onClick={handleClick}
            // Mantenemos el botón habilitado para poder mostrar el toast de error al clickear
            disabled={disabled && stock <= 0} 
            variant={stock <= 0 ? "destructive" : "default"}
            className="w-full"
        >
            <IoBagCheckOutline className="mr-2" size={18} />
            {stock <= 0 ? "Agotado" : "Comprar ahora"}
        </Button>
    );
}