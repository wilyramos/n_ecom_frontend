// File: frontend/components/admin/products/EditProductForm.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

import { EditProduct } from "@/actions/product/edit-product-action";
import ProductForm from "./ProductForm";
import { AdminButton } from "@/src/components/admin/layout/admin-button";

import type { ProductWithCategoryResponse, CategoryListResponse } from "@/src/schemas";
import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema";

interface EditProductFormProps {
    product: ProductWithCategoryResponse;
    categorias: CategoryListResponse;
    brands: TBrand[];
    lines: ProductLine[];
}

export default function EditProductForm({
    product,
    categorias,
    brands,
    lines,
}: EditProductFormProps) {
    const router = useRouter();
    const editProductWithId = EditProduct.bind(null, product._id);

    const [state, dispatch, isPending] = useActionState(editProductWithId, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error));
        }
        if (state.success) {
            toast.success(state.success);
            router.refresh();
        }
    }, [state, router]);

    const categoriasOrdenadas = [...categorias].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const variantsError = formData.get("variants_error");

        if (variantsError === "true") {
            e.preventDefault();
            toast.error("Corrige las advertencias en la configuración de variantes antes de guardar.");
            return;
        }
    };

    return (
        <form
            className="w-full space-y-6 pb-20"
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

            {/* Barra flotante inferior estandarizada */}
            <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
                <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 shadow-xl">
                    <AdminButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/admin/products")}
                        disabled={isPending}
                        className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
                    >
                        Descartar
                    </AdminButton>

                    <div className="h-4 w-px bg-slate-700" />

                    <AdminButton
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={isPending}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Guardando cambios...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Guardar Cambios</span>
                            </>
                        )}
                    </AdminButton>
                </div>
            </div>
        </form>
    );
}