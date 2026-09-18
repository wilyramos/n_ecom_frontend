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
            className="w-full space-y-4 pb-20"
            noValidate
            action={dispatch}
        >
            <ProductForm
                product={initialData}
                categorias={categoriasOrdenadas}
                brands={brands}
                lines={lines}
            />

            {/* Barra inferior fija a ancho completo (Bottom Action Bar) */}
            {/* Barra inferior fija a ancho completo con acentos de color */}
            <div className="fixed bottom-0 inset-x-0 z-40 border-t border-indigo-100 bg-gradient-to-r from-white via-indigo-50/20 to-white backdrop-blur-md px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] transition-all">
                <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3">
                    {/* Indicador de estado/ayuda con color */}
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
                        <span className="text-xs font-medium text-slate-600">
¿                        </span>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2.5 ml-auto">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/products")}
                            disabled={isPending}
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer disabled:opacity-50"
                        >
                            Cancelar
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
                                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span>Guardar Producto</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}