"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner"; // Asegúrate de usar sonner si es tu estándar, o mantén react-toastify
import { EditCategory } from "@/actions/category/edit-category-action";
import CategoryForm from "./CategoryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CategoryResponse } from "@/src/schemas";

export default function EditCategoryForm({ 
    category, 
    categories 
}: { 
    category: CategoryResponse; 
    categories: CategoryResponse[] 
}) {
    const editCategoryWithId = EditCategory.bind(null, category._id);
    
    const [state, dispatch, isPending] = useActionState(editCategoryWithId, {
        errors: [],
        success: ""
    });

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach((error) => toast.error(error));
        }
        if (state.success) {
            toast.success(state.success);
        }
    }, [state]);

    return (
        <form
            className="w-full max-w-7xl mx-auto"
            noValidate
            action={dispatch}
        >
            <Card className="border-border">
                <CardContent className="pt-6">
                    <CategoryForm
                        category={category}
                        categories={categories}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end mt-6">
                <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full sm:w-auto"
                >
                    {isPending ? "Actualizando..." : "Actualizar Categoría"}
                </Button>
            </div>
        </form>
    );
}