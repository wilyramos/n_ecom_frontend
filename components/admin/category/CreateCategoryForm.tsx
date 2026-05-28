"use client";

import { useRouter } from "next/navigation";
import CategoryForm from "./CategoryForm";
import { createCategoryAction } from "@/actions/category/create-category-action";
import { useActionState, useEffect } from "react";
import { toast } from 'react-toastify';
import type { CategoryResponse } from "@/src/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateCategoryForm({ categories }: { categories: CategoryResponse[] }) {
    const router = useRouter();
    const [state, dispatch, isPending] = useActionState(createCategoryAction, {
        errors: [],
        success: ""
    });

    useEffect(() => {
        if (state.errors) state.errors.forEach((error) => toast.error(error));
        if (state.success) {
            toast.success(state.success);
            router.push('/admin/products/category');
        }
    }, [state, router]);

    return (
        <form className="w-full max-w-7xl mx-auto" noValidate action={dispatch}>
            <Card>
                <CardContent className="pt-6">
                    <CategoryForm categories={categories} />
                </CardContent>
            </Card>

            <div className="flex justify-end mt-6">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Creando..." : "Crear Categoría"}
                </Button>
            </div>
        </form>
    );
}