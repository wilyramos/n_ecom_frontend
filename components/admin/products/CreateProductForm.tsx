// File: frontend/components/admin/products/CreateProductForm.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

import ProductForm from "./ProductForm";
import { createProduct } from "@/actions/product/add-product-action";
import type { CategoryListResponse, ProductWithCategoryResponse } from "@/src/schemas";
import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema";
import { AdminButton } from "@/src/components/admin/layout/admin-button";

interface CreateProductFormProps {
    categorias: CategoryListResponse;
    brands: TBrand[];
    lines: ProductLine[];
    initialData?: ProductWithCategoryResponse;
}

export default function CreateProductForm({
    categorias,
    brands,
    lines,
    initialData,
}: CreateProductFormProps) {
    const router = useRouter();

    const [state, dispatch, isPending] = useActionState(createProduct, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (state.success) {
            toast.success(state.success);
            router.push("/admin/products");
        }
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach((error) => {
                toast.error(error);
            });
        }
    }, [state, router]);

    const categoriasOrdenadas = [...categorias].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
    );

    return (
        <form
            className="w-full space-y-6 pb-20"
            noValidate
            action={dispatch}
        >
            <ProductForm
                product={initialData}
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
                        Cancelar
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
                                <span>Creando...</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Guardar Producto</span>
                            </>
                        )}
                    </AdminButton>
                </div>
            </div>
        </form>
    );
}