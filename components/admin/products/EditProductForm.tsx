"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { EditProduct } from "@/actions/product/edit-product-action";
import ProductForm from "./ProductForm";
import { Button } from "@/components/ui/button";

import type { ProductWithCategoryResponse, CategoryListResponse } from "@/src/schemas";
import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema"; 

interface EditProductFormProps {
    product: ProductWithCategoryResponse;
    categorias: CategoryListResponse;
    brands: TBrand[];
    lines: ProductLine[];
}

export default function EditProductForm({ product, categorias, brands, lines }: EditProductFormProps) {
    const editProductWithId = EditProduct.bind(null, product._id);

    const [state, dispatch, isPending] = useActionState(editProductWithId, {
        errors: [],
        success: ""
    });

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => toast.error(error));
        }
        if (state.success) {
            toast.success(state.success);
        }
    }, [state]);

    const categoriasOrdenadas = [...categorias].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const variantsError = formData.get("variants_error");

        if (variantsError === "true") {
            e.preventDefault();
            toast.error("Por favor, corrige los errores en las variantes antes de actualizar.");
            return;
        }
    };

    return (
        <form
            className="flex flex-col gap-6 w-full pb-24" // pb-24 evita que el botón tape el último campo
            noValidate
            action={dispatch}
            onSubmit={handleSubmit}
        >
            <ProductForm
                key={product._id}
                product={product}
                categorias={categoriasOrdenadas}
                brands={brands}
                lines={lines}
            />
            
            {/* Botón flotante/sticker en la parte inferior */}
            <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <Button 
                    type="submit" 
                    disabled={isPending}
                    className="pointer-events-auto min-w-[200px]"
                >
                    {isPending ? "Actualizando..." : "Actualizar Producto"}
                </Button>
            </div>
        </form>
    );
}