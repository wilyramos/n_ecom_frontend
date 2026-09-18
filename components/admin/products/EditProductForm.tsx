// File: frontend/components/admin/products/EditProductForm.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

import { EditProduct } from "@/actions/product/edit-product-action";
import ProductForm from "./ProductForm";

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
            className="w-full space-y-4 pb-20"
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

            <div className="fixed bottom-0 inset-x-0 z-40 border-t border-indigo-100 bg-gradient-to-r from-white via-indigo-50/20 to-white backdrop-blur-md px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] transition-all">
                <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3">
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
                        <span className="text-xs font-medium text-slate-600">
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 ml-auto">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/products")}
                            disabled={isPending}
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer disabled:opacity-50"
                        >
                            Volver
                        </button>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Guardar Cambios</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}