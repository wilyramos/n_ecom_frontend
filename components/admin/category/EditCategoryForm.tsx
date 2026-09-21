// File: frontend/components/admin/category/EditCategoryForm.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

import CategoryForm from "./CategoryForm";
import { EditCategory } from "@/actions/category/edit-category-action";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";
import type { CategoryResponse } from "@/src/schemas";

interface EditCategoryFormProps {
    category: CategoryResponse;
    categories: CategoryResponse[];
}

export default function EditCategoryForm({
    category,
    categories,
}: EditCategoryFormProps) {
    const router = useRouter();
    const editCategoryWithId = EditCategory.bind(null, category._id);

    const [state, dispatch, isPending] = useActionState(editCategoryWithId, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (state.success) {
            toast.success(state.success);
            router.push("/admin/products/category");
        }
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error));
        }
    }, [state, router]);

    return (
        <form
            className="w-full space-y-4 pb-20"
            noValidate
            action={dispatch}
        >
            <AdminCardWrapper
                title={`Editando: ${category.nombre}`}
                padding="default"
            >
                <CategoryForm category={category} categories={categories} />
            </AdminCardWrapper>

            {/* Barra de Acciones Fija Inferior */}
            <div className="fixed bottom-0 inset-x-0 z-40 border-t border-indigo-100 bg-gradient-to-r from-white via-indigo-50/20 to-white backdrop-blur-md px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] transition-all">
                <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3">
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-100 animate-pulse" />
                        <span className="text-xs font-medium text-slate-600">
                            Editando registro existente ({category.nombre})
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 ml-auto">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/products/category")}
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
                                    <span>Actualizando...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span>Actualizar Categoría</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}